import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const theme = {
  colors: {
    background: '#f7f9fc',      
    card: '#FFFFFF',            
    text: '#1D232C',            
    textSecondary: '#6A717D',    
    primary: '#007AFF',         
    accent: '#FDB833',          
    positive: '#28a745',        
    negative: '#dc3545',        
    warning: '#ffc107',         
    border: '#EAECEF',          
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
  },
  typography: {
    h1: { fontSize: 34, fontWeight: 'bold' },
    h2: { fontSize: 22, fontWeight: 'bold' },
    body: { fontSize: 16 },
    caption: { fontSize: 12 },
  },

  chartConfig: {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, 
    labelColor: (opacity = 1) => `rgba(106, 113, 125, ${opacity})`, 
    strokeWidth: 2,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
    fillShadowGradient: '#007AFF',
    fillShadowGradientOpacity: 0.1, 
  },
};

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  headerContainer: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.s,
  },
  symbol: {
    color: theme.colors.text,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
  },
  companyName: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  currentPrice: {
    color: theme.colors.text,
    fontSize: 40,
    fontWeight: 'bold',
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priceChangeText: {
    color: theme.colors.text,
    fontWeight: '600',
    marginLeft: 5,
  },
  positiveBg: {
    backgroundColor: 'rgba(40, 167, 69, 0.15)',
  },
  negativeBg: {
    backgroundColor: 'rgba(220, 53, 69, 0.15)',
  },

  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
    padding: theme.spacing.m,

    shadowColor: '#95A5A6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
  },

  chart: {
    borderRadius: 8,
    marginLeft: -theme.spacing.m,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#EDF0F4', 
    borderRadius: 10,
    padding: 4,
    marginTop: theme.spacing.m,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeRange: {
    backgroundColor: theme.colors.card, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rangeText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  activeRangeText: {
    color: theme.colors.primary, 
  },

  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: theme.colors.background, 
    padding: theme.spacing.m,
    borderRadius: 10,
    marginBottom: theme.spacing.s,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },

  riskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskScore: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  riskLabel: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  riskBarContainer: {
    height: 10,
    backgroundColor: theme.colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  riskBar: {
    height: '100%',
    borderRadius: 5,
  },

  descriptionText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: theme.colors.card, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: theme.spacing.m,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: theme.spacing.m,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalItemText: {
    color: theme.colors.text,
    fontSize: 18,
    marginLeft: 15,
  },
});
