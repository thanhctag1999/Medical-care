import axiosClient from './axiosClient';

const url = '/task';

const userApi = {
  getAll: () => axiosClient.get(url),
  getByID: (id) => axiosClient.get(`${url}/${id}`),
  add: (data) => axiosClient.post(url, data),
  updateProgress: (data) => axiosClient.post(`${url}/update-progress`, data),
  update: (data, id) => axiosClient.put(`${url}/${id}`, data),
  delete: (id) => axiosClient.delete(`${url}/${id}`),
  getTaskByUser: (id) => axiosClient.get(`${url}/user/${id}`),
};

export default userApi;
