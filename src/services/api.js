import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

// .then(request => {
//   return request.headers['access-control-allow-origin'];
// });

// api.defaults.headers.post['Access-Control-Allow-Origin'] =
//   'https://funepe-backend.herokuapp.com';

// api.defaults.headers.common.Authorization = `Bearer ${
//   store.getState().usuario.token
// }`;

export default api;
