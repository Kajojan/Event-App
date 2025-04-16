import { useAuth0 } from '@auth0/auth0-react'

import { Outlet } from 'react-router-dom'
import NotLoggedInView from './view/NotLogin'

const ProtectedRoutes = () => {
  const { isAuthenticated, } = useAuth0()
  return isAuthenticated ? <Outlet /> : <NotLoggedInView></NotLoggedInView>

}
export default ProtectedRoutes
