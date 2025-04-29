import axios from 'axios'


const getAuthorizationHeader = () => {
  const auth0CacheKey = `@@auth0spajs@@::${process.env.REACT_APP_CLIENT_ID}::${process.env.REACT_APP_AUDIENCE}::openid profile email offline_access`
  const auth0Cache = JSON.parse(localStorage.getItem(auth0CacheKey)) || []
  if (auth0Cache) {
    return `Bearer ${auth0Cache?.body?.access_token}`
  } else {
    return null
  }
}

const apiClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: getAuthorizationHeader(),
  },
})

export default {
  login(user) {
    return apiClient.post('/login', user)
  },
  logout() {
    return apiClient.get('/logout')
  },
  isLogIn() {
    return apiClient.get('/isLogin')
  },
  register(newUser) {
    return apiClient.post('/register', newUser)
  },
  getComments(postId) {
    return apiClient.get(`/api/post/comments/${postId}`)
  },
  qrcode(data) {
    return apiClient.get('/api/qr', {
      params: {
        data: data,
      },
    })
  },
  getImage() {
    return apiClient.get('/api/aws/image')
  },
  editEvent(id, data) {
    return apiClient.put('/api/event/edit', { id, data })
  },
  deleteEvent(id) {
    return apiClient.delete(`/api/event/${id}`)
  },
  getPersons(username) {
    return apiClient.get(`/api/user/getAll/${username}`)
  },
  getEvent(id, email) {
    return apiClient.get(`/api/event/get_event/${id}/${email}`)
  },
  getEvents(email, name) {
    return apiClient.get(`/api/events/${name}/get_event/${email}`)
  },

  takePart(data) {
    return apiClient.post('/api/event/takePart', data)
  },

  sendFile(file) {
    return apiClient.post('/api/aws/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getEventByName(name) {
    return apiClient.get(`/api/event/getByName/${name}`)
  },
  changeUser(email, data) {
    return apiClient.put('/api/user/change', { email, data })
  },
  getOnlyPersonData(username) {
    return apiClient.get(`/api/user/${username}`)
  },
  getStatsUser(email) {
    return apiClient.get(`/api/user/stats/${email}`)
  },
  changeAbout(username, about) {
    return apiClient.put('/api/user/changeabout', { username, about })
  },
  filters() {
    return apiClient.get('/api/events/filters')
  },
  filtersArg(body) {
    return apiClient.post('/api/events/filters/arg', body)
  },
  filtersEvents(body) {
    return apiClient.post('/api/events/filters/events', body)
  },
  addReview(body) {
    return apiClient.post('/api/event/review', body)
  }
}
