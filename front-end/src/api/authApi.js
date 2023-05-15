import axiosClient from './axiosClient';

const url = '/auth';

const authApi = {
  login: (data) => axiosClient.post(`${url}/login`, data),
  register: (data) => axiosClient.post(`${url}/register`, data),
  changePassword: (data) => axiosClient.post(`${url}/change-password`, data),
  getAccount: (id) => axiosClient.get(`${url}/account/${id}`),
};

export default authApi;
