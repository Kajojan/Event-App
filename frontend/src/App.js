import './App.css'
import { RouterProvider } from 'react-router-dom'
import AppRouter from './router.js'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Notification } from './store/slices/socketSlice.js'
import Footer from '../src/components/Footer/Footer'

function App() {
  const socket = useSelector((state) => state.socket.socket)
  const dispatch = useDispatch()
  useEffect(() => {
    if (socket || socket?.connected) {
      socket.on('Powiadomienie', (data) => {
        console.log(data)
        dispatch(Notification(data))
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
