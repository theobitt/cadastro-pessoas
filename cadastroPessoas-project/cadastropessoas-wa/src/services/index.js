import axios from "axios"
import PessoasService from "./pessoas"
export const httpClient = axios.create({
    baseURL: "http://localhost:5186",
    headers: {
      "Content-Type": "application/json",
    },
  });

  export default {
    pessoas: PessoasService(httpClient)
  }