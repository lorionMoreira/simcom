import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";

//pass new generated access token here
const token = accessToken;
let API_URL2;
//apply base url for axios
if(process.env.REACT_APP_DEFAULTAUTH == 'dev'){
   API_URL2 = "http://localhost:8080";
}else{
   API_URL2 = "http://saudeon.giize.com:8080";
}

//process.env.REACT_APP_DEFAULTAUTH == 'prod'
//const API_URL = process.env.API_URL ;
const axiosApi = axios.create({
  baseURL: API_URL2,
});
const obj = JSON.parse(localStorage.getItem("authUser"));


axiosApi.defaults.headers.common["Authorization"] = obj?.token;

export function setAuthToken(token) {
  console.log(token)
  axiosApi.defaults.headers.common["Authorization"] = token;
}

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => response.data)
    .catch(err => {
           
      throw err;
    });
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data);
}
