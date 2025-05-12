import './App.css'
import { RouterProvider } from 'react-router-dom'
import AppRouter from './router.js'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Notification, AddRevie } from './store/slices/socketSlice.js'
import Footer from '../src/components/Footer/Footer'
import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const socket = useSelector((state) => state.socket.socket)
  const dispatch = useDispatch()
  const { logout } = useAuth0()
  useEffect(() => {
    if (socket || socket?.connected) {
      socket.on('Powiadomienie', (data) => {
        dispatch(Notification(data))
      })
      socket.on('addRevie', (data) => {
        dispatch(AddRevie(data))
      })
      socket.on('auth_error', (_data)=>{
        logout()
      })
    }
  }, [socket, dispatch])
  return (
    <div className="App">
      <RouterProvider router={AppRouter} />
      <Footer></Footer>
    </div>
  )
}

export default App
