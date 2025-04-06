import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Dimensions, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart } from 'react-native-chart-kit';
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
    amount: '',
  });
  const [showBuyDate, setShowBuyDate] = useState(false);
  const [showSellDate, setShowSellDate] = useState(false);
  const [results, setResults] = useState(null);

  const validateForm = () => {
    const { name, type, buyPrice, sellPrice, amount } = newAsset;
    
    if (!name.trim() || !type.trim() || !buyPrice || !sellPrice || !amount) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return false;
    }
    
    if (isNaN(parseFloat(buyPrice)) || isNaN(parseFloat(sellPrice)) || isNaN(parseFloat(amount))) {
      Alert.alert('Hata', 'Fiyat ve miktar alanları sayı olmalıdır.');
      return false;
    }
    
    if (newAsset.sellDate < newAsset.buyDate) {
      Alert.alert('Hata', 'Satış tarihi alım tarihinden önce olamaz.');
      return false;
    }
    
    return true;
  };

  const addAsset = () => {
    if (!validateForm()) return;
    
    setAssets([...assets, newAsset]);
    setNewAsset({
      name: '',
      type: '',
      buyDate: new Date(),
      buyPrice: '',
      sellDate: new Date(),
      sellPrice: '',
      amount: '',
    });
    
    Alert.alert('Başarılı', 'Yatırım başarıyla eklendi.');
  };
  
  const calculateRealProfits = () => {
    if (assets.length === 0) {
      Alert.alert('Uyarı', 'Hesaplama için en az bir varlık eklemelisiniz.');
      return;
    }
    
    const inflationRatePerYear = 0.30;  // Yıllık enflasyon oranı
    
    let totalNominal = 0;
    let totalReel = 0;
    let totalInitialInvestment = 0;
  
    const detailedResults = assets.map(item => {
      const buy = parseFloat(item.buyPrice);
      const sell = parseFloat(item.sellPrice);
      const amount = parseFloat(item.amount);
      
      const initialInvestment = buy * amount;
      const nominalValue = sell * amount;
      const nominalProfit = nominalValue - initialInvestment;
      const nominalRate = ((sell - buy) / buy) * 100;
  
      // Alım tarihi ve satım tarihi arasındaki zaman farkı
      const buyDate = new Date(item.buyDate);
      const sellDate = new Date(item.sellDate);
      
      const timeDiffInDays = (sellDate - buyDate) / (1000 * 60 * 60 * 24);
      const timeDiffInYears = timeDiffInDays / 365;
  
      // Toplam enflasyon etkisi
      const cumulativeInflation = Math.pow(1 + inflationRatePerYear, timeDiffInYears) - 1;
      
      // Reel değer hesaplama
      const realValue = nominalValue / (1 + cumulativeInflation);
      const realProfit = realValue - initialInvestment;
      const realRate = ((realValue - initialInvestment) / initialInvestment) * 100;
  
      totalInitialInvestment += initialInvestment;
      totalNominal += nominalValue;
      totalReel += realValue;
  
      return {
        ...item,
        initialInvestment,
        nominalValue,
        nominalProfit,
        nominalRate,
        cumulativeInflation: cumulativeInflation * 100, // Yüzde olarak
        realValue,
        realProfit,
        realRate,
        holdingPeriod: timeDiffInDays.toFixed(0)
      };
    });
    
    const totalNominalProfit = totalNominal - totalInitialInvestment;
    const totalRealProfit = totalReel - totalInitialInvestment;
  
    setResults({ 
      totalInitialInvestment, 
      totalNominal, 
      totalNominalProfit,
      totalReel, 
      totalRealProfit,
      detailedResults 
    });
  };
  
  const resetAll = () => {
    Alert.alert(
      'Tümünü Sıfırla',
      'Tüm varlıklar ve hesaplamalar silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sıfırla', style: 'destructive', onPress: () => {
          setAssets([]);
          setResults(null);
        }}
      ]
    );
  };

  const AssetForm = () => (
    <View style={styles.formContainer}>
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

      <TouchableOpacity 
        style={styles.dateInput}
        onPress={() => setShowBuyDate(true)}
      >
        <Text style={styles.datePickerLabel}>Alım Tarihi:</Text>
        <Text style={styles.datePickerValue}>{newAsset.buyDate.toLocaleDateString('tr-TR')}</Text>
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
        placeholder="Alım Fiyatı (₺)"
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

      <TouchableOpacity 
        style={styles.dateInput}
        onPress={() => setShowSellDate(true)}
      >
        <Text style={styles.datePickerLabel}>Satış Tarihi:</Text>
        <Text style={styles.datePickerValue}>{newAsset.sellDate.toLocaleDateString('tr-TR')}</Text>
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
        placeholder="Satış Fiyatı (₺)"
        style={styles.input}
        keyboardType="numeric"
        value={newAsset.sellPrice}
        onChangeText={text => setNewAsset({ ...newAsset, sellPrice: text })}
      />

      <TouchableOpacity style={styles.addButton} onPress={addAsset}>
        <Text style={styles.buttonText}>Varlığı Ekle</Text>
      </TouchableOpacity>
    </View>
  );

  const AssetList = () => (
    <View style={styles.assetListContainer}>
      <Text style={styles.sectionTitle}>Eklenen Varlıklar</Text>
      
      {assets.length === 0 ? (
        <Text style={styles.emptyListText}>Henüz varlık eklenmedi.</Text>
      ) : (
        assets.map((item, index) => (
          <View key={index} style={styles.assetItem}>
            <View style={styles.assetHeader}>
              <Text style={styles.assetName}>{item.name}</Text>
              <Text style={styles.assetType}>{item.type}</Text>
            </View>
            <View style={styles.assetDetails}>
              <Text style={styles.assetDetail}>
                <Text style={styles.detailLabel}>Alım: </Text>
                <Text>{parseFloat(item.buyPrice).toLocaleString('tr-TR')} ₺ x {item.amount}</Text>
              </Text>
              <Text style={styles.assetDetail}>
                <Text style={styles.detailLabel}>Satış: </Text>
                <Text>{parseFloat(item.sellPrice).toLocaleString('tr-TR')} ₺</Text>
              </Text>
              <Text style={styles.assetDetail}>
                <Text style={styles.detailLabel}>Tarih: </Text>
                <Text>{new Date(item.buyDate).toLocaleDateString('tr-TR')} - {new Date(item.sellDate).toLocaleDateString('tr-TR')}</Text>
              </Text>
            </View>
          </View>
        ))
      )}
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={[styles.calculateButton, assets.length === 0 && styles.disabledButton]} 
          onPress={calculateRealProfits}
          disabled={assets.length === 0}
        >
          <Text style={styles.buttonText}>Hesapla</Text>
        </TouchableOpacity>
        
        {assets.length > 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
            <Text style={styles.buttonText}>Tümünü Sıfırla</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const ResultsSection = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.sectionTitle}>Sonuçlar</Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Toplam Yatırım:</Text>
          <Text style={styles.summaryValue}>{results.totalInitialInvestment.toLocaleString('tr-TR')} ₺</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nominal Değer:</Text>
            <Text style={styles.summaryValue}>{results.totalNominal.toLocaleString('tr-TR')} ₺</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nominal Kâr:</Text>
            <Text style={[
              styles.summaryValue, 
              results.totalNominalProfit > 0 ? styles.profitText : styles.lossText
            ]}>
              {results.totalNominalProfit.toLocaleString('tr-TR')} ₺
            </Text>
          </View>
        </View>
        
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Reel Değer:</Text>
            <Text style={styles.summaryValue}>{results.totalReel.toLocaleString('tr-TR')} ₺</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Reel Kâr:</Text>
            <Text style={[
              styles.summaryValue,
              results.totalRealProfit > 0 ? styles.profitText : styles.lossText
            ]}>
              {results.totalRealProfit.toLocaleString('tr-TR')} ₺
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Nominal vs Reel Değer Karşılaştırması</Text>
        <LineChart
          data={{
            labels: results.detailedResults.map(item => 
              item.name.length > 5 ? `${item.name.substring(0, 5)}...` : item.name
            ),
            datasets: [
              {
                data: results.detailedResults.map(item => parseFloat(item.nominalValue.toFixed(2))),
                color: () => '#4C9EEB',
                strokeWidth: 2
              },
              {
                data: results.detailedResults.map(item => parseFloat(item.realValue.toFixed(2))),
                color: () => '#28a745',
                strokeWidth: 2
              }
            ],
            legend: ['Nominal Değer', 'Reel Değer']
          }}
          width={screenWidth - 40}
          height={220}
          yAxisSuffix=" ₺"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '6',
              strokeWidth: '2',
            },
            propsForLabels: {
              fontSize: 12,
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.detailedResultsContainer}>
        <Text style={styles.detailedResultsTitle}>Varlık Bazlı Analiz</Text>
        
        {results.detailedResults.map((item, index) => (
          <View key={index} style={styles.detailedResultItem}>
            <Text style={styles.detailedItemHeader}>{item.name} ({item.type})</Text>
            
            <View style={styles.detailedItemRow}>
              <Text style={styles.detailedItemLabel}>Elde Tutma Süresi:</Text>
              <Text style={styles.detailedItemValue}>{item.holdingPeriod} gün</Text>
            </View>
            
            <View style={styles.detailedItemRow}>
              <Text style={styles.detailedItemLabel}>Toplam Enflasyon:</Text>
              <Text style={styles.detailedItemValue}>%{item.cumulativeInflation.toFixed(2)}</Text>
            </View>
            
            <View style={styles.detailedItemRow}>
              <Text style={styles.detailedItemLabel}>Nominal Getiri:</Text>
              <Text style={[
                styles.detailedItemValue,
                item.nominalRate > 0 ? styles.profitText : styles.lossText
              ]}>
                %{item.nominalRate.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.detailedItemRow}>
              <Text style={styles.detailedItemLabel}>Reel Getiri:</Text>
              <Text style={[
                styles.detailedItemValue,
                item.realRate > 0 ? styles.profitText : styles.lossText
              ]}>
                %{item.realRate.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // Main render
  return (
    <ScrollView style={styles.container}>
      <AssetForm />
      <AssetList />
      {results && <ResultsSection />}
    </ScrollView>
  );
};

export default ProfileScreen;