import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Switch, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit'; // LineChart kullandık
import styles from '../styles/ProfileScreenStyle';

const screenWidth = Dimensions.get('window').width;

const ProfileScreen = () => {
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: '',
    type: '',
    buyDate: new Date(),
    buyPrice: '',
    sellDate: new Date(),
    sellPrice: '',
    amount: '', // Miktar alanı eklendi
  });
  const [showBuyDate, setShowBuyDate] = useState(false);
  const [showSellDate, setShowSellDate] = useState(false);
  const [results, setResults] = useState(null);

  const addAsset = () => {
    setAssets([...assets, newAsset]);
    setNewAsset({
      name: '',
      type: '',
      buyDate: new Date(),
      buyPrice: '',
      sellDate: new Date(),
      sellPrice: '',
      amount: '', // Miktar sıfırlanacak
    });
  };
  const calculateRealProfits = () => {
    const inflationRatePerYear = 0.30;  // Yıllık enflasyon oranı
    const today = new Date();
  
    let totalNominal = 0;
    let totalReel = 0;
  
    const detailedResults = assets.map(item => {
      const buy = parseFloat(item.buyPrice);
      const sell = parseFloat(item.sellPrice);
      const amount = parseFloat(item.amount); // Yatırım miktarı
      const nominalValue = sell * amount;
      const nominalRate = (sell - buy) / buy;
  
      // Alım tarihi ve satım tarihi arasındaki gün farkı
      const buyDate = new Date(item.buyDate);
      const sellDate = new Date(item.sellDate);
      
      const timeDiffInDays = (sellDate - buyDate) / (1000 * 60 * 60 * 24); // Gün cinsinden fark
      const timeDiffInYears = timeDiffInDays / 365; // Yıl cinsine çevir
  
      // Enflasyon oranları: Alım ve satım tarihleri için enflasyon farkı
      const inflationRateAtBuy = inflationRatePerYear * timeDiffInYears;
      const inflationRateAtSell = inflationRatePerYear * timeDiffInYears;
  
      // Alım ve satım tarihleri arasındaki enflasyon farkı
      const inflationRateDifference = inflationRateAtSell - inflationRateAtBuy;
  
      // Reel değer hesaplama
      const realValue = nominalValue / (1 + inflationRateDifference);
  
      totalNominal += nominalValue;
      totalReel += realValue;
  
      return {
        ...item,
        nominalValue,
        nominalRate,
        inflationRateAtBuy,
        inflationRateAtSell,
        inflationRateDifference,
        realValue,
      };
    });
  
    setResults({ totalNominal, totalReel, detailedResults });
  };
  

  return (
    <FlatList
      style={styles.container}
      data={assets}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.assetItem}>
          <Text style={styles.assetName}>{item.name} ({item.type})</Text>
          <Text style={styles.assetDetail}>Alım: {item.buyPrice} ₺ - Satış: {item.sellPrice} ₺ - Miktar: {item.amount}</Text>
        </View>
      )}
      ListHeaderComponent={
        <>
          <Text style={styles.headerTitle}>Yatırım Bilgileri Girişi</Text>

          <TextInput
            placeholder="Varlık Adı"
            style={styles.input}
            value={newAsset.name}
            onChangeText={text => setNewAsset({ ...newAsset, name: text })}
          />

          <TextInput
            placeholder="Varlık Türü (Hisse, Fon vb.)"
            style={styles.input}
            value={newAsset.type}
            onChangeText={text => setNewAsset({ ...newAsset, type: text })}
          />

          <TouchableOpacity onPress={() => setShowBuyDate(true)}>
            <Text style={styles.datePickerText}>Alım Tarihi: {newAsset.buyDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showBuyDate && (
            <DateTimePicker
              value={newAsset.buyDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowBuyDate(false);
                if (selectedDate) setNewAsset({ ...newAsset, buyDate: selectedDate });
              }}
            />
          )}

          <TextInput
            placeholder="Alım Fiyatı"
            style={styles.input}
            keyboardType="numeric"
            value={newAsset.buyPrice}
            onChangeText={text => setNewAsset({ ...newAsset, buyPrice: text })}
          />

          <TextInput
            placeholder="Miktar"
            style={styles.input}
            keyboardType="numeric"
            value={newAsset.amount}
            onChangeText={text => setNewAsset({ ...newAsset, amount: text })}
          />

          <TouchableOpacity onPress={() => setShowSellDate(true)}>
            <Text style={styles.datePickerText}>Satış Tarihi: {newAsset.sellDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showSellDate && (
            <DateTimePicker
              value={newAsset.sellDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowSellDate(false);
                if (selectedDate) setNewAsset({ ...newAsset, sellDate: selectedDate });
              }}
            />
          )}

          <TextInput
            placeholder="Satış Fiyatı"
            style={styles.input}
            keyboardType="numeric"
            value={newAsset.sellPrice}
            onChangeText={text => setNewAsset({ ...newAsset, sellPrice: text })}
          />

          <TouchableOpacity style={styles.calculateButton} onPress={addAsset}>
            <Text style={styles.calculateButtonText}>Varlığı Ekle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.calculateButton} onPress={calculateRealProfits}>
            <Text style={styles.calculateButtonText}>Hesapla</Text>
          </TouchableOpacity>
        </>
      }
      ListFooterComponent={
        results && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>Toplam Nominal: {results.totalNominal.toFixed(2)} ₺</Text>
            <Text style={styles.resultText}>Toplam Reel Değer: {results.totalReel.toFixed(2)} ₺</Text>

            <LineChart
              data={{
                labels: results.detailedResults.map(item => item.name),
                datasets: [
                  {
                    data: results.detailedResults.map(item => parseFloat(item.nominalValue.toFixed(2))),
                  },
                  {
                    data: results.detailedResults.map(item => parseFloat(item.realValue.toFixed(2))),
                  }
                ],
                legend: ['Nominal Değer', 'Reel Değer']
              }}
              width={screenWidth - 40}
              height={220}
              yAxisSuffix="₺"
              chartConfig={{
                backgroundGradientFrom: '#f4f6f8',
                backgroundGradientTo: '#f4f6f8',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.5,
              }}
              verticalLabelRotation={0}
            />
          </View>
        )
      }
    />
  );
};

export default ProfileScreen;
