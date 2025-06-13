import unittest
from portfolio_risk import calculate_portfolio_risk_advanced

class PortfolioRiskTest(unittest.TestCase):
    def test_risk_increases_with_volatility(self):
        base_positions = [
            {'symbol': 'A', 'quantity': 1, 'price': 100, 'volatility': 0.1, 'beta': 1},
            {'symbol': 'B', 'quantity': 1, 'price': 100, 'volatility': 0.1, 'beta': 1},
        ]
        low = calculate_portfolio_risk_advanced(base_positions)['portfolio_risk']
        high_positions = [
            {'symbol': 'A', 'quantity': 1, 'price': 100, 'volatility': 0.3, 'beta': 1},
            {'symbol': 'B', 'quantity': 1, 'price': 100, 'volatility': 0.3, 'beta': 1},
        ]
        high = calculate_portfolio_risk_advanced(high_positions)['portfolio_risk']
        self.assertGreater(high, low)

if __name__ == '__main__':
    unittest.main()
