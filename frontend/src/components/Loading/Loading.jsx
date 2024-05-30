import { useEffect } from "react"
import apiData from "../../services/apiData"
import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"


const Loading = () => {
    const { user, isAuthenticated } = useAuth0()
    const navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticated) {
            apiData.register(user).then((res) => {
                window.location.href = "/"

            })
        }
    }, [isAuthenticated])

    return (<div style={{ margin: "100px" }}>
        <a style={{ fontSize: "Larger", fontWeight: "530" }}>Loading ...</a>
    </div >)
}

export default Loading