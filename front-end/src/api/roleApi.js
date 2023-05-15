import axiosClient from './axiosClient';

const url = '/role';

const roleApi = {
  getAll: () => axiosClient.get(url),
  getRoles: () => axiosClient.get(`${url}`),
  getByID: (id) => axiosClient.get(`${url}/${id}`),
  update: (data, id) => axiosClient.put(`${url}/${id}`, data),
  addRole: (data) => axiosClient.post(`${url}`, data),
  delete: (id) => axiosClient.delete(`${url}/${id}`),
};

export default roleApi;
