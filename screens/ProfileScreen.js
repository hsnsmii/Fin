// calculate.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from "../styles/ProfileScreenStyle"; // İçe aktarma

const ProfileScreen = () => {
  const [stocks, setStocks] = useState([
    { name: 'Abc', share: 10, profit: 10 },
    { name: 'Def', share: 15, profit: 5 },
    { name: 'Ghi', share: 5, profit: 15 },
    { name: 'Jkl', share: 20, profit: 8 },
  ]);
  const [actualProfit, setActualProfit] = useState(0);
  const [inflationAdjustedProfit, setInflationAdjustedProfit] = useState(0);
  const [dollarEquivalent, setDollarEquivalent] = useState(0);

  const calculateProfits = () => {
    let totalActualProfit = 0;
    stocks.forEach((stock) => {
      totalActualProfit += stock.share * stock.profit;
    });

    const inflationRate = 0.2; // Example inflation rate
    const dollarRate = 0.05; // Example dollar conversion rate

    setActualProfit(totalActualProfit);
    setInflationAdjustedProfit(totalActualProfit * (1 - inflationRate));
    setDollarEquivalent(totalActualProfit * dollarRate);
  };

  return (
    <View style={styles.container1}>
      <View style={styles.header1}>
        <TouchableOpacity style={styles.menuButton1}>
          {/* Menü İkonu (Placeholder) */}
          <Text>Menu</Text>
        </TouchableOpacity>
        <Text style={styles.title1}>Real Profit</Text>
        <TouchableOpacity style={styles.notificationButton1}>
          {/* Bildirim İkonu (Placeholder) */}
          <Text>Notify</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer1}>
        <TouchableOpacity style={styles.button1}>
          <Text style={styles.buttonText1}>Add Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button1}>
          <Text style={styles.buttonText1}>Remove Stock</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stockList1}>
        {stocks.map((stock, index) => (
          <View key={index} style={styles.stockItem1}>
            <Text style={styles.stockItemText1}>{stock.name}</Text>
            <Text style={styles.stockItemText1}>{stock.share}</Text>
            <Text style={styles.stockItemText1}>{stock.profit}%</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.calculateButton1} onPress={calculateProfits}>
        <Text style={styles.calculateButtonText1}>Calculate</Text>
      </TouchableOpacity>

      <View style={styles.profitInfo1}>
        <Text style={styles.profitInfoText1}>Actual Profit: {actualProfit} TI</Text>
        <Text style={styles.profitInfoText1}>Real Profit(Inflation): {inflationAdjustedProfit} TI</Text>
        <Text style={styles.profitInfoText1}>In Dollar: ${dollarEquivalent}</Text>
        <Text style={styles.profitInfoText1}>In Gold: -%30</Text>
      </View>
      <TouchableOpacity style={styles.infoButton1}>
        {/* Bilgi İkonu (Placeholder) */}
        <Text>Info</Text>
      </TouchableOpacity>
    </View>
  );
};


export default ProfileScreen;