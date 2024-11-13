// backend/src/config/db.js
import axios from 'axios';

// URL de tu base de datos en phpMyAdmin
const API_URL = 'http://localhost/phpmyadmin/index.php?db=db_atr';

const axiosInstance = axios.create({
  baseURL: API_URL,
  auth: {
    username: 'chiara',
    password: '0801'
  },
  // Agrega más configuración aquí, como headers, interceptores, etc.
});

export default axiosInstance;