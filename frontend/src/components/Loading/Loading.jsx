import { useEffect } from 'react'
import apiData from '../../services/apiData'
import { useAuth0 } from '@auth0/auth0-react'


const Loading = () => {
  const { user, isAuthenticated } = useAuth0()
  useEffect(() => {
    if (isAuthenticated) {
      apiData.register(user).then((_res) => {
        window.location.href = '/'

      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return (<div style={{ margin: '100px' }}>
    <a style={{ fontSize: 'Larger', fontWeight: '530' }}>Loading ...</a>
  </div >)
}

export default Loading
