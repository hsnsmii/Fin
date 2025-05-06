import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from "../styles/faqscreenstyle";

const FAQScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBox, setSelectedBox] = useState(null);
  // showAllQuestions state'i kaldırıldı
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      id: '1',
      category: 'account',
      question: 'Hesap nasıl oluşturulur?',
      answer:
        'Başlamak için Tradebase uygulamasını açın ve adımları izleyin. Tradebase herhangi bir ücret talep etmez...',
    },
    {
      id: '2',
      category: 'account',
      question: 'Şifremi nasıl sıfırlarım?',
      answer:
        'Şifrenizi sıfırlamak için, giriş ekranındaki "Şifremi Unuttum" bağlantısına tıklayın ve e-posta adresinizi girin. Size bir sıfırlama bağlantısı göndereceğiz.',
    },
    {
      id: '3',
      category: 'payment',
      question: 'Para yatırma nasıl yapılır?',
      answer:
        'Para yatırmak için, uygulama içindeki "Para Yatır" bölümüne gidin ve talimatları izleyin. Banka havalesi, kredi kartı ve diğer yöntemlerle para yatırabilirsiniz.',
    },
    {
      id: '4',
      category: 'payment',
      question: 'Para çekme nasıl yapılır?',
      answer: 'Para çekmek için, uygulama içindeki "Para Çek" bölümüne gidin. Çekmek istediğiniz miktarı girin ve para çekme yöntemini seçin.',
    },
    {
      id: '5',
      category: 'crypto',
      question: 'Hangi kripto para birimlerini destekliyorsunuz?',
      answer: 'Şu anda Bitcoin, Ethereum, Ripple ve Litecoin gibi başlıca kripto para birimlerini destekliyoruz. Daha fazlası yakında eklenecek.',
    },
    {
      id: '6',
      category: 'fees',
      question: 'İşlem ücretleri ne kadar?',
      answer: 'İşlem ücretleri, işlem türüne ve miktarına göre değişir. Ücretler hakkında detaylı bilgiyi uygulama içindeki "Ücretler" bölümünde bulabilirsiniz.',
    },
    {
      id: '7',
      category: 'support',
      question: 'Müşteri hizmetlerine nasıl ulaşabilirim?',
      answer: 'Müşteri hizmetlerine uygulama içindeki "Destek" bölümünden veya web sitemizdeki iletişim formunu kullanarak ulaşabilirsiniz.',
    },
    {
      id: '8',
      category: 'account',
      question: 'Hesabımı nasıl kapatabilirim?',
      answer: 'Hesabınızı kapatmak için, müşteri hizmetleri ile iletişime geçmeniz gerekmektedir. Size gerekli adımları sağlayacaklardır.',
    },
    {
      id: '9',
      category: 'general',
      question: 'Uygulamayı hangi cihazlarda kullanabilirim?',
      answer: 'Uygulamayı iOS ve Android işletim sistemine sahip mobil cihazlarda kullanabilirsiniz.',
    },
    {
      id: '10',
      category: 'security',
      question: 'Güvenlik önlemleriniz nelerdir?',
      answer: 'Kullanıcılarımızın güvenliği bizim için çok önemlidir. İki faktörlü kimlik doğrulama, şifreleme ve soğuk cüzdan gibi çeşitli güvenlik önlemleri alıyoruz.',
    }
  ];

  const categories = [
    { id: 'all', title: 'Tümü' },
    { id: 'account', title: 'Hesap' },
    { id: 'payment', title: 'Ödemeler' },
    { id: 'crypto', title: 'Kripto' },
    { id: 'security', title: 'Güvenlik' },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleBoxClick = (id) => {
    setSelectedBox(prevState => prevState === id ? null : id);
  };

  const getFilteredQuestions = () => {
    let filtered = questions;
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(q => q.category === activeCategory);
    }
    
    // Artık showAllQuestions filtresi yok, tüm sorular gösteriliyor
    return filtered;
  };

  const handleCategoryChange = (categoryId) => {
    setIsLoading(true);
    setActiveCategory(categoryId);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sık Sorulan Sorular</Text>
        <Text style={styles.subtitle}>Yardım merkezimizde sık sorulan sorular</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={22} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Soru ara..."
          placeholderTextColor="#95a5a6"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
        style={{ marginBottom: 20, flexGrow: 0 }}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              activeCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => handleCategoryChange(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.categoryTextActive
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : filteredQuestions.length > 0 ? (
        <ScrollView 
          style={styles.questionsContainer}
          showsVerticalScrollIndicator={false}
        >
          {filteredQuestions.map((item) => (
            <View key={item.id} style={styles.questionContainer}>
              <TouchableOpacity
                style={styles.questionHeader}
                onPress={() => handleBoxClick(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <View style={styles.questionIcon}>
                  <FontAwesome
                    name={selectedBox === item.id ? "chevron-up" : "chevron-down"}
                    size={14}
                    color="#3498db"
                  />
                </View>
              </TouchableOpacity>
              
              {selectedBox === item.id && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
          
        {/* "Tüm Soruları Göster" butonu kaldırıldı */}
        </ScrollView>
      ) : (
        <View style={styles.noResultsContainer}>
          <FontAwesome name="search" size={50} style={styles.noResultsIcon} />
          <Text style={styles.noResultsText}>Aradığınız kriterlere uygun soru bulunamadı.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default FAQScreen;