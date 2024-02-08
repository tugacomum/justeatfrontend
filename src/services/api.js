import axios from "axios";
import { BACKEND_SERVER } from "./env";

const api = axios.create({
    baseURL: BACKEND_SERVER,
    timeout: 5000
});

export default api;