import axios from "axios";
import API_CONFIG from "./ApiConfig";

const { apiKey } = API_CONFIG;

const api = axios.create({
  baseURL: apiKey,
});

// POST API for Login
export const login = (data) => {
  return api.post("/auth/sign-in", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
