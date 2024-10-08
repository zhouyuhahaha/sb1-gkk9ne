import axios from 'axios';
import CryptoJS from 'crypto-js';

export const md5Encrypt = (text) => {
  return CryptoJS.MD5(text).toString().toLowerCase();
};

export const getTokenWithMd5 = async (account, text) => {
  const url = 'https://openapi.vzan.com/api/v2/token/get_token';
  const timestamp = Math.floor(Date.now() / 1000);
  const sign = md5Encrypt(text + timestamp);

  const jsonData = {
    account: account,
    signkey: sign,
    timestamp: timestamp.toString()
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, jsonData, { headers });
    if (response.data && response.data.data && response.data.data.token) {
      return 'Bearer ' + response.data.data.token;
    } else {
      throw new Error("Token not found in response");
    }
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};