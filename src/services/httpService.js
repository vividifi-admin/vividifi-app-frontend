import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.headers.post["Content-Type"] = "application/json";
const allCookie = document.cookie;
let token = "";

if (allCookie.search("token") > -1) {
  token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    .split("=")[1];
}
if (token) axios.defaults.headers.common["x-auth-token"] = token;
axios.interceptors.response.use(null, (error) => {
  const expectedErrors =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedErrors) {
    // toast.error("مشکلی از سمت سرور رخ داده است.", {
    //   position: "top-right",
    //   closeOnClick: true,
    // });
    localStorage.removeItem("token");
  }
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
