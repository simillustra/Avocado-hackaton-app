import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_KEY, API_KEY} from '@env';
import APIKit from './axios';

class Helpers {
  async genActiveUser() {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      // console.log('AUth2', userInfo);
      if (userInfo) {
        return userInfo !== null ? JSON.parse(userInfo) : null;
      }
    } catch (e) {
      // read error
      return null;
    }
  }

  postAction = async (API_URL, formData) => {
    return new Promise(async (resolve, reject) => {
      const config = {
        headers: {
          'x-api-key': '5adea9-044a85-708016-7ae662-646d59',
          'sandbox-key': `${API_KEY}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };
      try {
        console.log('JSON.stringify(formData)', JSON.stringify(formData));
        const postResponse = await APIKit.post(
          `${API_URL}`,
          JSON.stringify(formData),
          config,
        );

        console.log('postAction', postResponse.data);
        if (postResponse) {
          resolve(postResponse.data);
        }
      } catch (error) {
        console.log('error', error);
        reject(error);
      }
    });
  };

  getAction = async (API_URL) => {
    return new Promise(async (resolve, reject) => {
      const config = {
        headers: {
          'x-api-key': '5adea9-044a85-708016-7ae662-646d59',
          'sandbox-key': `${API_KEY}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };
      try {
        const getResponse = await APIKit.get(`${API_URL}`, config);
        console.log('getAction', getResponse.data);
        if (getResponse) {
          resolve(getResponse.data);
        }
      } catch (error) {
        console.log('error', error);
        reject(error);
      }
    });
  };

  putAction = async (formData, API_URL) => {
    return new Promise(async (resolve, reject) => {
      const config = {
        headers: {
          'x-api-key': '5adea9-044a85-708016-7ae662-646d59',
          'sandbox-key': `${API_KEY}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      };
      try {
        const putResponse = await APIKit.put(
          `${API_URL}`,
          JSON.stringify(formData),
          config,
        );

        console.log('putAction', putResponse.json);

        if (putResponse) {
          resolve(putResponse.data);
        }
      } catch (error) {
        // read error
        console.log('error', error);
        reject(error);
      }
    });
  };
}

export default new Helpers();
