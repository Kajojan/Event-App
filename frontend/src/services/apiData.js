import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
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
  getPost(id) {
    return apiClient.get(`/api/post/get_post/${id}`);
  },
  likePost(data) {
    return apiClient.post("/api/post/like", data);
  },
  viewPost(data) {
    return apiClient.post("/api/post/view", data);
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
