import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { PaginatedResponse } from "../model/pagination";
import { store } from '../store/configureStore'; // Putanja do tvog Redux store fajla

// Simulate a delay to mimic server latency
const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config =>{
    const token = store.getState().account.user?.token
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  })

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    
    console.log("Response Headers:", response.headers); // Ispisivanje svih zaglavlja
    console.log("Response Body:", response.data); // Ispisivanje tela odgovora
    
    // Pristup pagination zaglavlju
    const pagination = response.headers['pagination'] || response.headers['Pagination'];

    if (pagination) {
      console.log("Pagination Data:", pagination);
      response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
      console.log("Updated Response:", response);
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { data, status } = error.response;
      if (data && typeof data === "object") {
        const errorData = data as { title?: string; errors?: Record<string, string[]>; detail?: string };
        switch (status) {
          case 400:
            if (errorData.errors) {
              const modelStateErrors: string[] = [];
              for (const key in errorData.errors) {
                if (errorData.errors[key]) {
                  modelStateErrors.push(...errorData.errors[key]);
                }
              }
              throw modelStateErrors.flat();
            }
            toast.error(errorData.title || "Bad Request");
            break;
          case 401:
            toast.error(errorData.title || "Unauthorized");
            break;
          case 500:
            window.location.href = "/server-error";
            break;
          default:
            toast.error("An unexpected error occurred.");
            break;
        }
      }
    } else {
      toast.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

const requests = {
  get: (url: string , params ?: URLSearchParams) => axios.get(url,{params}).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
  list: (params:URLSearchParams) => requests.get("Product" , params),
  details: (id: number) => requests.get(`product/${id}`),
  fetchFilters : () => requests.get('Product/filters')
};

const Basket = {
  get : () => requests.get('basket'),
  addItem: (productId: number, quantity = 1) =>
  requests.post(`Basket/basket/item?productId=${productId}&quantity=${quantity}`,{}),
  removeItem: (productId:number , quantity = 1) => requests.delete(`/Basket/basket/item?productId=${productId}&quantity=${quantity}`),
};
const TestError = {
  getError400Error: () => requests.get("Buggy/bad-request"),
  getError401Error: () => requests.get("Buggy/unauthorized"),
  getError404Error: () => requests.get("Buggy/not-found").catch((error) => console.log(error)),
  getError500Error: () => requests.get("Buggy/server-error"),
  getValidationError: () => requests.get("Buggy/validation-error"),
};

const Account = {
  login : (values : any) => requests.post('Account/login' , values),
  register : (values : any) => requests.post('Account/register' , values),
  currentUser : () => requests.get('Account/currentUser' ),
  getAddress : () => requests.get("Account/getAddress")
}

const Orders = {

    list : () => requests.get('Orders'),
    fetch: (id: number) => requests.get(`Orders/${id}`),
    create : (values : any) => requests.post('Orders' , values)
}

const agent = {
  Catalog,
  TestError,
  Basket,
  Account,
  Orders
};

export default agent;
