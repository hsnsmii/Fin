module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();

  // GET /api/watchlists/:userId
 router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const type = req.query.type; // Önemli: type opsiyonel

  try {
    // 1. Watchlist'leri al (type varsa ona göre filtrele)
    const query = type
      ? 'SELECT * FROM watchlists WHERE user_id = $1 AND type = $2'
      : 'SELECT * FROM watchlists WHERE user_id = $1';

    const values = type ? [userId, type] : [userId];
    const watchlistsResult = await pool.query(query, values);
    const watchlists = watchlistsResult.rows;

    // 2. Her watchlist için ilgili hisseleri çek
    const finalData = await Promise.all(watchlists.map(async (list) => {
      const stocksResult = await pool.query(
        'SELECT symbol FROM watchlist_stocks WHERE watchlist_id = $1',
        [list.id]
      );
      return {
        ...list,
        stocks: stocksResult.rows,
      };
    }));

    res.json(finalData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  // POST /api/watchlists
  router.post('/', async (req, res) => {
    const { name, user_id, type } = req.body;
    if (!name || !user_id) {
      return res.status(400).json({ error: 'Eksik parametre' });
    }
    try {
      const result = await pool.query(
        'INSERT INTO watchlists (name, user_id, type) VALUES ($1, $2, $3) RETURNING *',
        [name, user_id, type || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



  // POST /api/watchlists/:listId/stocks
router.post('/:listId/stocks', async (req, res) => {
  const { symbol, quantity, price, note, date } = req.body;
  const { listId } = req.params;

  if (!symbol || !quantity || !price) {
    return res.status(400).json({ error: 'Eksik pozisyon bilgisi' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO watchlist_stocks (watchlist_id, symbol, quantity, price, note, date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [listId, symbol, quantity, price, note || '', date || new Date()]
    );
    res.status(201).json(result.rows[0]);
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
