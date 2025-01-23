import axios from "axios";

// Create an Axios instance with the desired base URL
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // Set the base URL
});

export default apiClient;
