import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import store from '../src/store/store.js'
import { Provider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react'

const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_CLIENT_ID}
      cacheLocation={'localstorage'}
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
      scope="openid profile email read:messages write:messages"
      authorizationParams={{
        redirect_uri: 'https://localhost:3000/login',
        audience: process.env.REACT_APP_AUDIENCE,
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
)

reportWebVitals()
