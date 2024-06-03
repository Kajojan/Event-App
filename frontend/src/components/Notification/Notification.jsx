import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IntNotification, Notification } from "../../store/slices/socketSlice"
import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import styles from "./Notification.module.scss"

const Notifications = () => {
    const dispatch = useDispatch()
    const notifications = useSelector(state => state.socket.notification)
    useEffect(() => {
        dispatch(IntNotification(0))
    })

    return <Box >
        <Typography
            variant="h1"
            fontWeight="500"
            className={styles.Typography_home}
            sx={{
                fontSize: ["xx-large", "xx-large", "xxx-large", "xxx-large"],
                paddingLeft: [0, 0, 3, 0],
            }}
        >
            Powiadomienia
        </Typography>
        <Box className={styles.notificationContainer}>
            {
                notifications.length == 0 &&
                <a style={{ width: "fit-content", padding: "15px", marginTop: "20px" }}>{`Tu będą powiadomienia o nadchodzących wydarzeniach`}</a>
            }
            {notifications.map((el) => {
                return (
                    <Link to={`/event/${el.identity.low}`} style={{ width: "fit-content", padding: "15px", marginTop: "20px", border: "1px solid grey", borderRadius: "8px" }}>{`Wydarzenie ${el.properties.eventName}, w którym bierzesz udział, odbędzie się za 24h`}</Link>)
            })}

        </Box>
    </Box>
}

export default Notifications