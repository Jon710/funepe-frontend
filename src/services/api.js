import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

api.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

// api.defaults.headers.common.Authorization = `Bearer ${
//   store.getState().usuario.token
// }`;

export default api;
