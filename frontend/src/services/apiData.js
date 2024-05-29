import axios from "axios";

const getAuthorizationHeader = () => {
  const auth0CacheKey = `@@auth0spajs@@::${process.env.REACT_APP_CLIENT_ID}::${process.env.REACT_APP_AUDIENCE}::openid profile email offline_access`;
  const auth0Cache = JSON.parse(localStorage.getItem(auth0CacheKey)) || [];
  if (auth0Cache) {
    return `Bearer ${auth0Cache?.body?.access_token}`;
  } else {
    return null;
  }
};

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: getAuthorizationHeader(),
  },
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login(user) {
    return apiClient.post("/login", user);
  },
  logout() {
    return apiClient.get("/logout");
  },
  isLogIn() {
    return apiClient.get("/isLogin");
  },
  register(newUser) {
    return apiClient.post("/register", newUser);
  },
  getComments(postId) {
    return apiClient.get(`/api/post/comments/${postId}`);
  },
  qrcode(data) {
    return apiClient.get(`/api/qr`, {
      params: {
        data: data,
      },
    });
  },
  async getPerson(username, checkusername) {
    const data = {};
    const res = await apiClient.get(`/api/user/${checkusername}`);
    data.user = res.data;
    const res_1 = await apiClient.get(`/api/user/relation/${username}/${checkusername}/FOLLOW`);
    data.check = res_1.data;
    const res_2 = await apiClient.get(`/api/post/getAllPosts/${checkusername}`);
    data.posts = res_2.data;
    const res_3 = await apiClient.get(`/api/user/relation/${checkusername}/${username}/BAN`);
    data.banned = res_3.data;
    const res_4 = await apiClient.get(`/api/user/relation/${username}/${checkusername}/BAN`);
    data.ban = res_4.data;

    return data;
  },
  getPersons(username) {
    return apiClient.get(`/api/user/getAll/${username}`);
  },
  getEvent(id, email) {
    return apiClient.get(`/api/event/get_event/${id}/${email}`);
  },
  getEvents(email, name) {
    return apiClient.get(`/api/events/${name}/get_event/${email}`);
  },

  takePart(data) {
    return apiClient.post("/api/event/takePart", data);
  },

  sendFile(file) {
    return apiClient.post("/api/aws/upload", file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  changeAwatar(username, awatar) {
    return apiClient.post("/api/aws/awatar", { username, awatar });
  },
  getOnlyPersonData(username) {
    return apiClient.get(`/api/user/${username}`);
  },
  changeAbout(username, about) {
    return apiClient.put("/api/user/changeabout", { username, about });
  },
};
