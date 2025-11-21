import api from './api';

export const fileUploadService = {
  uploadFile: async (file, endpoint, additionalData = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      if (additionalData[key] !== null && additionalData[key] !== undefined) {
        if (typeof additionalData[key] === 'object') {
          formData.append(key, JSON.stringify(additionalData[key]));
        } else {
          formData.append(key, additionalData[key]);
        }
      }
    });

    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getFileUrl: (filename) => {
    return `${api.defaults.baseURL.replace('/api', '')}/api/files/${filename}`;
  },
};

