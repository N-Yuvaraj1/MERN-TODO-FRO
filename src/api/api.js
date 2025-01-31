import axios from 'axios';

export const api = axios.create({
    baseURL: "https://mern-todo-back-wdqp.onrender.com"
});
