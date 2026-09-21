import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

/**
 * Upload resume file and job description for ATS analysis.
 * @param {File} file - PDF or DOCX resume
 * @param {string} jobDescription - Raw job description text
 * @param {string} jobTitle - Optional target job title
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeResume = async (file, jobDescription, jobTitle = '') => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_description', jobDescription);
  if (jobTitle) {
    formData.append('job_title', jobTitle);
  }

  const response = await apiClient.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fetch a previously saved analysis by ID.
 * @param {number|string} id
 * @returns {Promise<Object>} Analysis record
 */
export const getAnalysis = async (id) => {
  const response = await apiClient.get(`/analysis/${id}`);
  return response.data;
};

/**
 * Check backend health status.
 * @returns {Promise<Object>}
 */
export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

/**
 * Get formatted report download URL.
 * @param {number|string} id
 * @returns {string}
 */
export const getReportUrl = (id) => {
  return `${API_BASE_URL}/report/${id}`;
};

export default {
  analyzeResume,
  getAnalysis,
  checkHealth,
  getReportUrl,
};
