import { StyleSheet } from 'react-native';

const colors = {
  primary: '#1976d2',
  secondary: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  success: '#28a745',
  light: '#f8f9fa',
  dark: '#343a40',
  gray: '#6c757d',
  lightGray: '#e9ecef',
  white: '#ffffff',
  profit: '#28a745',
  loss: '#dc3545',
  border: '#dee2e6',
  textPrimary: '#212529',
  textSecondary: '#6c757d',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  formContainer: {
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.light,
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.light,
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  datePickerLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  datePickerValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButton: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: colors.danger,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.7,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  assetListContainer: {
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  assetItem: {
    backgroundColor: colors.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  assetName: {
    fontWeight: '700',
    fontSize: 17,
    color: colors.textPrimary,
  },
  assetType: {
    fontSize: 14,
    color: colors.textSecondary,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  assetDetails: {
    marginTop: 4,
  },
  assetDetail: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  resultsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContainer: {
    backgroundColor: colors.light,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profitText: {
    color: colors.profit,
  },
  lossText: {
    color: colors.loss,
  },
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  detailedResultsContainer: {
    marginBottom: 20,
  },
  detailedResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  detailedResultItem: {
    backgroundColor: colors.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailedItemHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  detailedItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailedItemLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  detailedItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
    flex: 1,
  },
});

export default styles;