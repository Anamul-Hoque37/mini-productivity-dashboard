import axios from 'axios';
import React from 'react';

const axiosSecure = axios.create({
    baseURL: 'https://mini-productivity-dashboard-server-2.onrender.com/'
    
})

const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;