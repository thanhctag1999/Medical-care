import axiosClient from './axiosClient';

const url = '/user';

const userApi = {
  getAll: () => axiosClient.get(url),
  getByID: (id) => axiosClient.get(`${url}/${id}`),
  add: (data) => axiosClient.post(url, data),
  uploadImg: (data) => axiosClient.post(`${url}/upload-img`, data),
  update: (data, id) => axiosClient.put(`${url}/${id}`, data),
  delete: (id) => axiosClient.delete(`${url}/${id}`),
};

export default userApi;
