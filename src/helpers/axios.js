import Axios from 'axios';

const APIKit = Axios.create({
  baseURL: 'https://silicon-pay.com',
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = (token) => {
  APIKit.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};
export const BASEURL = 'https://silicon-pay.com';
export default APIKit;
