import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';

// Her bir sözlük terimini göstermek için küçük bir bileşen
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

        {/* Bölüm 1: Temel Kavramlar */}
        <Text style={styles.sectionTitle}>Bölüm 1: Temel Kavramlar</Text>
        <TermItem
          title="Hisse Senedi (Hisse)"
          definition="Bir şirketin ortaklık paylarından bir parçasıdır. Bir hisse senedi aldığında, aslında o şirketin çok küçük bir sahibi olursun."
          simple="Büyük bir pizzayı düşün. Hisse senedi, o pizzanın bir dilimidir. Şirket kâr ettikçe veya değeri arttıkça senin diliminin de değeri artar."
          where="*Finover'da Nerede Karşılaşacaksın?* Ana Sayfa, Piyasa, Risk ve Varlıklarım sekmelerinin tamamında hisselerle işlem yapacaksın."
        />
        <TermItem
          title="Portföy"
          definition="Sahip olduğun tüm yatırım araçlarının (hisse senetleri, fonlar vb.) toplamıdır."
          simple="Yatırımlarının hepsini topladığın bir sepet gibidir. Finover'daki 'Varlıklarım' sekmesi, senin yatırım sepetindir."
          where="*Finover'da Nerede Karşılaşacaksın?* Varlıklarım ve Risk sekmelerinde portföyünün genel durumunu görebilirsin."
        />
        <TermItem
          title="Piyasa"
          definition="Hisse senetlerinin ve diğer yatırım araçlarının alınıp satıldığı yerdir. Türkiye'de bu piyasanın adı Borsa İstanbul'dur (BİST)."
          simple="Ürünlerin alınıp satıldığı büyük bir pazar yeri gibi düşün. Fiyatlar, alıcıların ve satıcıların taleplerine göre sürekli değişir."
          where="*Finover'da Nerede Karşılaşacaksın?* Piyasa sekmesinde tüm hisselerin anlık durumunu takip edebilirsin."
        />

        {/* Bölüm 2: Hisse Değerlendirme Terimleri */}
        <Text style={styles.sectionTitle}>Bölüm 2: Hisse Değerlendirme Terimleri</Text>
        <TermItem
            title="Piyasa Değeri"
            definition="Bir şirketin borsadaki toplam değeridir. Hisse senedi fiyatı ile toplam hisse senedi sayısının çarpılmasıyla bulunur."
            simple="Şirketin tamamını bugün satın almak istesen, ödemen gereken toplam para miktarıdır. Şirketin büyüklüğü hakkında fikir verir."
            where="*Finover'da Nerede Karşılaşacaksın?* Piyasa sekmesinde bir hisseye tıkladığında Şirket Bilgileri altında görürsün."
        />
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

        {/* Bölüm 3: Risk ve Analiz Göstergeleri */}
        <Text style={styles.sectionTitle}>Bölüm 3: Risk ve Analiz Göstergeleri</Text>
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

        {/* Bölüm 4: Portföy Yönetimi Terimleri */}
        <Text style={styles.sectionTitle}>Bölüm 4: Portföy Yönetimi Terimleri</Text>
        <TermItem
            title="Varlıklarım"
            definition="Finover'da sahip olduğun hisse senetlerinin listelendiği bölümdür."
            simple="Senin yatırım cüzdanın."
            where="*Finover'da Nerede Karşılaşacaksın?* Uygulamanın ana sekmelerinden biridir."
        />
        <TermItem
            title="Maliyet (Alış Maliyeti)"
            definition="Bir hisse senedini alırken ödediğin toplam tutardır. Birden fazla alım yaptıysan, ortalama maliyetin hesaplanır."
            simple="Bir hissenin sana 'kaça geldiği'dir. Kâr/zarar hesabın bu maliyet üzerinden yapılır."
            where="*Finover'da Nerede Karşılaşacaksın?* Varlıklarım sekmesinde her bir hissenin pozisyon bilgilerinde yer alır."
        />
        <TermItem
            title="Kar / Zarar"
            definition="Bir hissenin mevcut piyasa değeri ile senin alış maliyetin arasındaki farktır."
            simple="Yatırımından para kazanıyor musun yoksa kaybediyor musun, bunu gösterir."
            where="*Finover'da Nerede Karşılaşacaksın?* Varlıklarım sekmesinde hem her hisse için ayrı ayrı hem de toplam portföyün için özet olarak gösterilir."
        />
        <TermItem
            title="Varlık Dağılımı"
            definition="Portföyündeki paranın hangi hisselere veya sektörlere ne oranda yatırıldığını gösteren bir grafiktir."
            simple="'Bütün yumurtaları aynı sepete koyma' prensibidir. Paran ne kadar farklı alana yayılmış, bunu görmeni sağlar."
            where="*Finover'da Nerede Karşılaşacaksın?* Varlıklarım sekmesinde portföy detaylarında bulunur."
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
    color: '#1A237E', // Ana Başlık Rengi
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
    color: '#004D40', // Terim Başlık Rengi
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
