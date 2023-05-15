import axiosClient from './axiosClient';

const url = '/discussion';

const discussionApi = {
  getAll: () => axiosClient.get(url),
  getByID: (id) => axiosClient.get(`${url}/${id}`),
  add: (data) => axiosClient.post(url, data),
  update: (data, id) => axiosClient.put(`${url}/${id}`, data),
  delete: (id) => axiosClient.delete(`${url}/${id}`),
  getTaskByTask: (id) => axiosClient.get(`${url}/task/${id}`),
  getTaskBySubtask: (id) => axiosClient.get(`${url}/subtask/${id}`),
};

export default discussionApi;
