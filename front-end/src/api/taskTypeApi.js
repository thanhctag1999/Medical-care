import axiosClient from './axiosClient';

const url = '/taskType';

const roleApi = {
  getTaskTypes: () => axiosClient.get(`${url}`),
  getByID: (id) => axiosClient.get(`${url}/${id}`),
  update: (data, id) => axiosClient.put(`${url}/${id}`, data),
  addRole: (data) => axiosClient.post(`${url}`, data),
  delete: (id) => axiosClient.delete(`${url}/${id}`),
};

export default roleApi;
