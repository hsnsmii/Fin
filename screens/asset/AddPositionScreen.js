// screens/AddPositionScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getSelectedStocks, getPriceOnDate } from '../../services/fmpApi';

const AddPositionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { listId, symbol: editSymbol, isEdit } = route.params || {};

  const [symbol, setSymbol] = useState(editSymbol || '');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showStocks, setShowStocks] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchStocks = async () => {
      const data = await getSelectedStocks();
      setStocks(data);
      setFilteredStocks(data);
    };
    fetchStocks();
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!symbol) return;
      try {
        const p = await getPriceOnDate(symbol, date);
        if (p !== null) {
          setPrice(String(p));
        }
      } catch (err) {
        console.error('Fiyat otomatik getirilemedi:', err);
      }
    };
    fetchPrice();
  }, [symbol, date]);

  useEffect(() => {
    const fetchExisting = async () => {
      if (isEdit && listId && editSymbol) {
        try {
          const res = await axios.get(`http://192.168.1.27:3000/api/watchlists/${listId}/stocks`);
          const match = res.data.find((s) => s.symbol === editSymbol);
          if (match) {
            setSymbol(match.symbol);
            setQuantity(String(match.quantity));
            setPrice(String(match.price));
            setNote(match.note || '');
            setDate(match.date ? new Date(match.date) : new Date());
          }
        } catch (err) {
          console.error('Düzenleme verisi alınamadı:', err);
        }
      }
    };
    fetchExisting();
  }, [isEdit, listId, editSymbol]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = stocks.filter((s) =>
      s.symbol.toLowerCase().includes(text.toLowerCase()) ||
      s.companyName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  const handleAdd = async () => {
    if (!symbol || !quantity || !price) {
      Alert.alert('Eksik bilgi', 'Lütfen sembol, miktar ve fiyat giriniz.');
      return;
    }

    try {
      await axios.post(`http://192.168.1.27:3000/api/watchlists/${listId}/stocks`, {
        symbol: symbol.toUpperCase(),
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        note,
        date: date.toISOString().split('T')[0],
      });
      Alert.alert('Başarılı', isEdit ? 'Pozisyon güncellendi.' : 'Pozisyon kaydedildi.');
      navigation.goBack();
    } catch (err) {
      console.error('Pozisyon eklenemedi:', err);
      Alert.alert('Hata', 'Pozisyon eklenemedi.');
    }
  };

  const renderStockItem = ({ item }) => (
    <TouchableOpacity
      style={styles.stockItem}
      onPress={() => {
        setSymbol(item.symbol);
        setSearchText(item.symbol);
        setShowStocks(false);
        searchInputRef.current?.blur();
      }}
    >
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text>{item.companyName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <TextInput
        placeholder="Hisse ara"
        style={styles.input}
        ref={searchInputRef}
        value={searchText}
        onChangeText={handleSearch}
        onFocus={() => setShowStocks(true)}
        onBlur={() => setShowStocks(false)}
      />
      {showStocks && (
        <FlatList
          data={filteredStocks}
          keyExtractor={(item) => item.symbol}
          renderItem={renderStockItem}
          style={{ maxHeight: 200, marginBottom: 12 }}
        />
      )}

      {symbol !== '' && (
        <>
          <Text style={styles.selected}>Seçilen: {symbol}</Text>
          <TextInput
            placeholder="Miktar"
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <TextInput
            placeholder="Alış Fiyatı"
            style={styles.input}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            placeholder="Not (opsiyonel)"
            style={styles.input}
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={styles.dateText}>Tarih: {date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.buttonText}>{isEdit ? 'Kaydet' : 'Pozisyonu Ekle'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#555',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  stockItem: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  symbol: { fontWeight: 'bold' },
  selected: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
});

export default AddPositionScreen;
