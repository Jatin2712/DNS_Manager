import axios from 'axios';

export default axios.create({
  baseURL: 'https://dns-manager-a549.onrender.com/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});
