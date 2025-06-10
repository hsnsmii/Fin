import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

const TermItem = ({ title, definition, simple, where }) => (
  <View style={styles.termContainer}>
    <Text style={styles.termTitle}>{title}</Text>
    <Text style={styles.termContent}><Text style={styles.bold}>Tanımı:</Text> {definition}</Text>
    <Text style={styles.termContent}><Text style={styles.bold}>Basitçe:</Text> {simple}</Text>
    {where && <Text style={styles.termInfo}>{where}</Text>}
  </View>
);

const GlossaryScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.mainTitle}>Finover Yatırımcı Sözlüğü</Text>
        <Text style={styles.introText}>
          Yatırım dünyasına ilk adımını atarken bazı terimler karmaşık gelebilir. Bu sözlük, Finover'ı kullanırken karşına çıkacak temel kavramları en basit dille anlaman için hazırlandı.
        </Text>
    
        <Text style={styles.sectionTitle}>Bölüm 1: Hisse Değerlendirme Terimleri</Text>

        <TermItem
            title="F/K Oranı (Fiyat/Kazanç Oranı)"
            definition="Hisse senedi fiyatının, şirketin hisse başına düşen yıllık kârına bölünmesiyle bulunur."
            simple="Bir hissenin, elde ettiği kâra göre 'pahalı' mı yoksa 'ucuz' mu olduğunu anlamaya yarayan bir göstergedir. Düşük F/K oranı, hissenin kârına göre ucuz olabileceğini düşündürebilir."
            where="*Finover'da Nerede Karşılaşacaksın?* Piyasa sekmesinde hisse detaylarında bu oranı görebilirsin."
        />
        <TermItem
            title="Beta Değeri (β)"
            definition="Bir hissenin, genel piyasa (BİST 100 Endeksi gibi) hareketlerine karşı ne kadar hassas olduğunu gösterir."
            simple="Beta = 1 ise: Hisse, piyasa ile aynı oranda hareket eder. Beta > 1 ise: Hisse, piyasadan daha fazla hareket eder (daha riskli ama potansiyel getirisi de yüksek olabilir). Beta < 1 ise: Hisse, piyasadan daha az hareket eder (daha az riskli ve daha istikrarlı)."
            where="*Finover'da Nerede Karşılaşacaksın?* Piyasa ve Risk sekmelerinde hisse detaylarında bu değeri bulabilirsin."
        />

        <Text style={styles.sectionTitle}>Bölüm 2: Risk ve Analiz Göstergeleri</Text>
        <TermItem
            title="Risk Puanı / Risk Durumu"
            definition="Finover'ın yapay zeka algoritmasının; bir hissenin fiyat hareketleri, finansal durumu ve piyasa koşullarını analiz ederek oluşturduğu bir değerlendirmedir."
            simple="O hisseye yatırım yapmanın ne kadar 'güvenli' veya 'dalgalı' olabileceği hakkında sana hızlı bir fikir verir (Düşük, Orta, Yüksek Risk gibi)."
            where="*Finover'da Nerede Karşılaşacaksın?* Piyasa sekmesinde hisse detaylarında ve Risk sekmesinde portföyün için bu değerlendirmeyi göreceksin."
        />
        <TermItem
            title="Volatilite"
            definition="Bir hisse senedi fiyatının belirli bir zaman dilimindeki dalgalanma (oynaklık) derecesidir."
            simple="Fiyatların ne kadar hızlı ve ne kadar sert bir şekilde inip çıktığını gösterir. Yüksek volatilite, yüksek risk ama aynı zamanda yüksek kazanç fırsatı anlamına gelebilir. Sakin bir göl (düşük volatilite) ile dalgalı bir denizi (yüksek volatilite) karşılaştırabilirsin."
            where="*Finover'da Nerede Karşılaşacaksın?* Risk sekmesinde hisse bazında detaylı oranlar arasında yer alır."
        />
        <TermItem
            title="RSI (Relative Strength Index - Göreceli Güç Endeksi)"
            definition="Bir hissenin son dönemdeki fiyat hareketlerinin hızını ve değişimini ölçen bir teknik göstergedir."
            simple="Hissenin 'aşırı alınmış' mı (fiyatı çok şişmiş olabilir) yoksa 'aşırı satılmış' mı (fiyatı çok düşmüş olabilir) olduğunu anlamaya yarar. Genellikle 70'in üzeri 'aşırı alım', 30'un altı 'aşırı satım' olarak yorumlanır."
            where="*Finover'da Nerede Karşılaşacaksın?* Risk sekmesinde hisse detaylarında bu göstergeyi bulabilirsin."
        />
        <TermItem
            title="SMA (Simple Moving Average - Basit Hareketli Ortalama)"
            definition="Bir hissenin belirli bir dönemdeki (örneğin son 20 gün) ortalama kapanış fiyatını gösterir."
            simple="Fiyat grafiğindeki anlık iniş çıkışları yumuşatarak hissenin genel gidişatını (trendini) daha net görmeni sağlar."
            where="*Finover'da Nerede Karşılaşacaksın?* Risk sekmesinde hisse detaylarında bu göstergeyi görebilirsin."
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1A237E', 
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
    color: '#333',
  },
  termContainer: {
    marginBottom: 25,
  },
  termTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#004D40', 
  },
  termContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 5,
    color: '#424242',
  },
  termInfo: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#757575',
    marginTop: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default GlossaryScreen;
