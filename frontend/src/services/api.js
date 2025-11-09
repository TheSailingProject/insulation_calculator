/**
 * API service for communicating with the backend
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get available regions and configuration data
 */
export const getRegions = async () => {
  try {
    const response = await api.get('/config/regions');
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw new Error('Failed to fetch region data');
  }
};

/**
 * Calculate insulation savings
 */
export const calculateSavings = async (data) => {
  try {
    const response = await api.post('/calculate/savings', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating savings:', error);
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error('Failed to calculate savings');
  }
};

/**
 * Download PDF report
 */
export const downloadPdfReport = async (data) => {
  try {
    const response = await api.post('/calculate/pdf', data, {
      responseType: 'blob',
    });

    // Create a download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'insulation_savings_report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to generate PDF report');
  }
};

export default api;
