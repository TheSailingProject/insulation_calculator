/**
 * API service for Tectura Isolatie Calculator
 */

import axios from 'axios';
import type { ApiConfig, CalculationRequest, CalculationResults } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get available regions and heating sources configuration
 */
export const getRegions = async (): Promise<ApiConfig> => {
  const response = await api.get<ApiConfig>('/config/regions');
  return response.data;
};

/**
 * Calculate insulation savings
 */
export const calculateSavings = async (data: CalculationRequest): Promise<CalculationResults> => {
  const response = await api.post<CalculationResults>('/calculate/savings', data);
  return response.data;
};

/**
 * Download PDF report (if implemented)
 */
export const downloadPdfReport = async (data: CalculationRequest): Promise<void> => {
  const response = await api.post('/calculate/pdf', data, {
    responseType: 'blob',
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'tectura-isolatie-rapport.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default api;
