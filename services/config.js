import { API_BASE_URL as ENV_API_BASE_URL, ML_BASE_URL as ENV_ML_BASE_URL } from '@env';

export const API_BASE_URL = ENV_API_BASE_URL || 'http://192.168.1.27:3000';
export const ML_BASE_URL = ENV_ML_BASE_URL || 'http://192.168.1.27:5050';
