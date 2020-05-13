import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
// api.defaults.headers.common.Authorization = `Bearer ${
//   store.getState().usuario.token
// }`;

export default api;
