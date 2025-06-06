"""Utility functions for calculating portfolio risk."""

from typing import Any, Dict, List


def calculate_weighted_portfolio_risk(positions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calculate weighted risk score for a portfolio.

    Parameters
    ----------
    positions : list of dict
        Each dict must contain 'symbol', 'quantity', 'price', and 'risk_score'.

    Returns
    -------
    dict
        Dictionary with total portfolio risk and per-stock details.
    """
    values = [pos.get("quantity", 0) * pos.get("price", 0.0) for pos in positions]
    total_value = sum(values)

    if total_value == 0:
        return {"portfolio_risk": 0.0, "details": []}

    details: List[Dict[str, Any]] = []
    portfolio_risk = 0.0

    for pos, value in zip(positions, values):
        weight = value / total_value
        risk_score = pos.get("risk_score", 0.0)
        weighted_risk = risk_score * weight
        portfolio_risk += weighted_risk
        details.append({
            "symbol": pos.get("symbol"),
            "weight": weight,
            "weighted_risk": weighted_risk,
        })

    return {"portfolio_risk": portfolio_risk, "details": details}


if __name__ == "__main__":
    example = [
        {"symbol": "AAPL", "quantity": 3, "price": 100.0, "risk_score": 0.8},
        {"symbol": "MSFT", "quantity": 2, "price": 250.0, "risk_score": 0.3},
    ]
    from pprint import pprint

    pprint(calculate_weighted_portfolio_risk(example))
