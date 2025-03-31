import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from "../styles/faqscreenstyle";

class FAQScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      expandedQuestions: [],
      showAllQuestions: false,
      selectedBox: null,
      questions: [
        {
          id: '1',
          question: 'Hesap nasıl oluşturulur?',
          answer:
            'Başlamak için Tradebase uygulamasını açın ve adımları izleyin. Tradebase herhangi bir ücret talep etmez...',
        },
        {
          id: '2',
          question: 'Şifremi nasıl sıfırlarım?',
          answer:
            'Şifrenizi sıfırlamak için, giriş ekranındaki "Şifremi Unuttum" bağlantısına tıklayın ve e-posta adresinizi girin. Size bir sıfırlama bağlantısı göndereceğiz.',
        },
        {
          id: '3',
          question: 'Para yatırma nasıl yapılır?',
          answer:
            'Para yatırmak için, uygulama içindeki "Para Yatır" bölümüne gidin ve talimatları izleyin. Banka havalesi, kredi kartı ve diğer yöntemlerle para yatırabilirsiniz.',
        },
        {
            id: '4',
            question: 'Para çekme nasıl yapılır?',
            answer: 'Para çekmek için, uygulama içindeki "Para Çek" bölümüne gidin. Çekmek istediğiniz miktarı girin ve para çekme yöntemini seçin.',
        },
        {
            id: '5',
            question: 'Hangi kripto para birimlerini destekliyorsunuz?',
            answer: 'Şu anda Bitcoin, Ethereum, Ripple ve Litecoin gibi başlıca kripto para birimlerini destekliyoruz. Daha fazlası yakında eklenecek.',
        },
        {
            id: '6',
            question: 'İşlem ücretleri ne kadar?',
            answer: 'İşlem ücretleri, işlem türüne ve miktarına göre değişir. Ücretler hakkında detaylı bilgiyi uygulama içindeki "Ücretler" bölümünde bulabilirsiniz.',
        },
        {
            id: '7',
            question: 'Müşteri hizmetlerine nasıl ulaşabilirim?',
            answer: 'Müşteri hizmetlerine uygulama içindeki "Destek" bölümünden veya web sitemizdeki iletişim formunu kullanarak ulaşabilirsiniz.',
        },
        {
            id: '8',
            question: 'Hesabımı nasıl kapatabilirim?',
            answer: 'Hesabınızı kapatmak için, müşteri hizmetleri ile iletişime geçmeniz gerekmektedir. Size gerekli adımları sağlayacaklardır.',
        },
        {
            id: '9',
            question: 'Uygulamayı hangi cihazlarda kullanabilirim?',
            answer: 'Uygulamayı iOS ve Android işletim sistemine sahip mobil cihazlarda kullanabilirsiniz.',
        },
        {
            id: '10',
            question: 'Güvenlik önlemleriniz nelerdir?',
            answer: 'Kullanıcılarımızın güvenliği bizim için çok önemlidir. İki faktörlü kimlik doğrulama, şifreleme ve soğuk cüzdan gibi çeşitli güvenlik önlemleri alıyoruz.',
        }
      ],
    };
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  toggleQuestion = (id) => {
    const { expandedQuestions } = this.state;
    const isExpanded = expandedQuestions.includes(id);
    const updatedQuestions = isExpanded
      ? expandedQuestions.filter((qId) => qId !== id)
      : [...expandedQuestions, id];
    this.setState({ expandedQuestions: updatedQuestions });
  };

    handleBoxClick = (id) => {
        this.setState(prevState => ({
            selectedBox: prevState.selectedBox === id ? null : id
        }));
    };

  getFilteredQuestions = () => {
    const { searchQuery, questions, showAllQuestions } = this.state;
    const filtered = questions.filter((q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return showAllQuestions ? questions : filtered; // Show all if showAllQuestions is true
  };

  render() {
    const { searchQuery, expandedQuestions, showAllQuestions, selectedBox } = this.state;
    const filteredQuestions = this.getFilteredQuestions();

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for questions..."
            value={searchQuery}
            onChangeText={this.handleSearch}
          />
          <FontAwesome name="search" size={20} style={styles.searchIcon} />
        </View>

        <ScrollView style={styles.questionsContainer}>
          {filteredQuestions.map((item) => (
             <View key={item.id} style={styles.questionContainer}>
                <TouchableOpacity
                  style={styles.questionHeader}
                  onPress={() => this.handleBoxClick(item.id)} // Use handleBoxClick here
                >
                  <Text style={styles.questionText}>{item.question}</Text>
                  {selectedBox === item.id ? (  // Check selectedBox here
                    <FontAwesome name="chevron-up" size={20} color="#888" />
                  ) : (
                    <FontAwesome name="chevron-down" size={20} color="#888" />
                  )}
                </TouchableOpacity>
                {selectedBox === item.id && (  // and here
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                )}
              </View>
          ))}
           <TouchableOpacity
            style={styles.showAllButton}
            onPress={() => this.setState({ showAllQuestions: true })} // Set showAllQuestions to true
            disabled={showAllQuestions} // Disable if already showing all
          >
            <Text style={styles.showAllButtonText}>
              {showAllQuestions ? 'All Questions Displayed' : 'Show All Questions'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
export default FAQScreen;