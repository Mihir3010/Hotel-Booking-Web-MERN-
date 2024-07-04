import { useEffect } from "react";
import axios from 'axios';

const baseURL = 'http://localhost:3000/api/';
var token = '';
if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') ? localStorage.getItem('token'): '';
}
console.log(token)
const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: {
        Authorization: token,
        'Content-Type': 'application/json; charset=UTF-8',
        accept: 'application/json',
    },
});


export default axiosInstance