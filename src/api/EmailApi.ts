import axios from "axios";

export const apiAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// POST /sendMail
export const sendEmail = (email: string, subject: string, body: string) => {
  return apiAxios.post(`/sendMail`, {
    email,
    subject,
    body
  });
};
