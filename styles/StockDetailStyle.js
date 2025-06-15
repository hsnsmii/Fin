import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    card: '#F7F7F7',
    text: '#111111',
    textSecondary: '#687684',
    primary: '#007AFF',
    accent: '#FFD60A',
    positive: '#34C759',
    negative: '#FF3B30',
    warning: '#FF9500',
    border: '#EFEFEF',
    inputBackground: '#F0F0F0',

    positiveBg: 'rgba(52, 199, 89, 0.15)', 
    negativeBg: 'rgba(255, 59, 48, 0.15)', 
  },
  chartConfig: {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(104, 118, 132, ${opacity})`,
    propsForDots: { r: '0' },
    fillShadowGradientOpacity: 0.1,
  },
};

export const darkTheme = {
  colors: {
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    primary: '#0A84FF',
    accent: '#FFD60A',
    positive: '#30D158',
    negative: '#FF453A',
    warning: '#FF9F0A',
    border: '#2C2C2E',
    inputBackground: '#1C1C1E',

    positiveBg: 'rgba(48, 209, 88, 0.2)', 
    negativeBg: 'rgba(255, 69, 58, 0.2)', 
  },
  chartConfig: {
    backgroundGradientFrom: '#000000',
    backgroundGradientTo: '#000000',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
    propsForDots: { r: '0' },
    fillShadowGradientOpacity: 0.15,
  },
};

export const getStyles = (theme) => StyleSheet.create({

  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },

  headerContainer: { paddingHorizontal: 16, paddingTop: 16 },
  symbol: { color: theme.colors.text, fontSize: 24, fontWeight: '500' },
  companyName: { color: theme.colors.textSecondary, fontSize: 16, marginTop: 2 }, 
  priceContainer: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },
  currentPrice: { color: theme.colors.text, fontSize: 44, fontWeight: 'bold' },

  priceChangeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  priceChangeText: { fontWeight: '600', marginLeft: 6, fontSize: 16 },

  positiveBg: { backgroundColor: theme.colors.positiveBg }, 
  negativeBg: { backgroundColor: theme.colors.negativeBg }, 

  chart: { margin: 0, padding: 0, marginBottom: -10 },
  timeRangeSelector: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 16, backgroundColor: theme.colors.inputBackground, borderRadius: 10, padding: 4, marginTop: 24, marginBottom: 16 },
  rangeButton: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  activeRange: { backgroundColor: theme.colors.background, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: theme.colors.background === '#000000' ? 0.3 : 0.08, shadowRadius: 5, elevation: 3 },
  rangeText: { color: theme.colors.textSecondary, fontWeight: '600', fontSize: 15 },
  activeRangeText: { color: theme.colors.text, fontWeight: 'bold' },

  decoratorLine: { position: 'absolute', top: 0, width: 1, backgroundColor: theme.colors.textSecondary },
  decoratorDot: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: theme.colors.primary, borderColor: theme.colors.background, borderWidth: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 2 },
  tooltipContainer: { position: 'absolute', backgroundColor: theme.colors.text, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 10, alignItems: 'center' },
  tooltipPrice: { color: theme.colors.background, fontWeight: 'bold', fontSize: 18 },
  tooltipDate: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 },

  card: { 
    backgroundColor: theme.colors.card, 
    borderRadius: 12, 
    marginHorizontal: 16, 
    marginBottom: 16, 
    padding: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.colors.background === '#000000' ? 0.15 : 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: { color: theme.colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 },

  statsListContainer: {}, 
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  statRowLast: { borderBottomWidth: 0 },
  statLabel: { color: theme.colors.textSecondary, fontSize: 15 },
  statValue: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },

  riskContent: { flexDirection: 'row', alignItems: 'center' },
  riskScore: { color: theme.colors.text, fontSize: 36, fontWeight: 'bold' },
  riskLabel: { color: theme.colors.text, fontSize: 16, fontWeight: '600', marginBottom: 8 },
  riskBarContainer: { height: 12, backgroundColor: theme.colors.border, borderRadius: 6, overflow: 'hidden' },
  riskBar: { height: '100%', borderRadius: 6 },

  descriptionText: { color: theme.colors.textSecondary, fontSize: 15, lineHeight: 24 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: theme.colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 16, paddingBottom: 40, paddingTop: 12 },
  modalHandle: { width: 40, height: 5, backgroundColor: theme.colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { color: theme.colors.text, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  modalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  modalItemText: { color: theme.colors.text, fontSize: 18, marginLeft: 16 },
});
