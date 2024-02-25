import axios from "axios";

// Set the baseURL of the deployed api 
// Sent content-type to multipart/form-data as that is the data format the api will be expecting. 
// We need multipart because our app will be dealing with images as well as text in its requests
// To avoid any CORS errors when sending cookies, we also need to set withCredentials to true
axios.defaults.baseURL = 'https://djangorf-api-76c3c6fb6902.herokuapp.com/'
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true

// Export instances that we'll attach interceptors to. One to intercept the request and one for hte response
export const axiosReq = axios.create();
export const axiosRes = axios.create();