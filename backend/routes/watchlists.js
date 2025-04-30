module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();

  // GET /api/watchlists/:userId
  router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await pool.query('SELECT * FROM watchlists WHERE user_id = $1', [userId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/watchlists
  router.post('/', async (req, res) => {
    const { name, user_id } = req.body;
  
    if (!user_id || !name) {
      return res.status(400).json({ error: 'Liste adı veya kullanıcı ID eksik' });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO watchlists (name, user_id) VALUES ($1, $2) RETURNING *',
        [name, user_id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  // POST /api/watchlists/:listId/stocks
  router.post('/:listId/stocks', async (req, res) => {
    const { symbol } = req.body;
    const { listId } = req.params;
    try {
      const result = await pool.query(
        'INSERT INTO watchlist_stocks (watchlist_id, symbol) VALUES ($1, $2) RETURNING *',
        [listId, symbol]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /api/watchlists/:listId/stocks/:symbol
  router.delete('/:listId/stocks/:symbol', async (req, res) => {
    const { listId, symbol } = req.params;
    try {
      await pool.query(
        'DELETE FROM watchlist_stocks WHERE watchlist_id = $1 AND symbol = $2',
        [listId, symbol]
      );
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:listId/stocks', async (req, res) => {
    const { listId } = req.params;
    try {
      const result = await pool.query(
        'SELECT * FROM watchlist_stocks WHERE watchlist_id = $1',
        [listId]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  return router;
};
