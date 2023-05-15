import axiosClient from './axiosClient';

const url = '/notification';

const roleApi = {
  getByUser: (id) => axiosClient.get(`${url}/user/${id}`),
  delete: (id) => axiosClient.delete(`${url}/${id}`),
  markRead: (data) => axiosClient.post(`${url}/mark-read`, data),
};

export default roleApi;
