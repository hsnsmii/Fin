import { API_BASE_URL as ENV_API_BASE_URL, ML_BASE_URL as ENV_ML_BASE_URL } from '@env';

export const API_BASE_URL = ENV_API_BASE_URL || 'http://10.10.197.47:3000';
export const ML_BASE_URL = ENV_ML_BASE_URL || 'http://10.10.197.47:5050';
