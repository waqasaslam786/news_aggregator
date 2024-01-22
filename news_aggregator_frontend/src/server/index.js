import axios from "axios";

export const get = async (url) => {
  let data = [];
  let message = "";
  let status;
  let headers = {};

  let token = JSON.parse(localStorage.getItem("loggedUser"))?.token;

  if (token) {
    headers = { Authorization: `Bearer ${token}` };
  }

  await axios
    .get(url, { headers })
    .then((res) => {
      data = res.data.data;
      message = res.data.message;
      status = res.data.status;
    })
    .catch((error) => {
      if (error.response) {
        data = error.response.data.data;
        message = error.response.data.message;
        status = error.response.data.status;
      } else {
        data = null;
        message = "No server response";
        status = false;
      }
    });

  return { status, message, data };
};

export const post = async (url, payload = {}) => {
  let data = [];
  let message = "";
  let status;
  let headers = {};

  let token = JSON.parse(localStorage.getItem("loggedUser"))?.token;

  if (token) {
    headers = { Authorization: `Bearer ${token}` };
  }

  await axios
    .post(url, payload, { headers })
    .then((res) => {
      data = res.data.data;
      message = res.data.message;
      status = res.data.status;
    })
    .catch((error) => {
      if (error.response) {
        data = error.response.data.data;
        message = error.response.data.message;
        status = error.response.data.status;
      } else {
        data = null;
        message = "No server response";
        status = false;
      }
    });

  return { status, message, data };
};
