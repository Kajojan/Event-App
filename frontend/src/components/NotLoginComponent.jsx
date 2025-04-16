import { useAuth0 } from '@auth0/auth0-react'
import styles from './NotLoginComponent.module.scss'

const NotLoggedInComponent = () => {
  const { loginWithRedirect } = useAuth0()
  return (
    <div className={styles.container}>
      <p className={styles.message}>Muszisz być zalogowany aby wejść na tą strone</p>
      <button className={styles.button} onClick={loginWithRedirect}>
        Zaloguj
      </button>
    </div>
  )
}



export default NotLoggedInComponent
