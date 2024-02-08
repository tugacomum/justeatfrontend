import { Fragment, useEffect, useState } from "react";
import { useUser } from "../Contexts/User";
import { useNavigate } from "react-router-dom";

export default function CheckRole(props) {
    const { getUserInfo, user } = useUser();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if(!props.roles.includes(user.role)){
            navigate("/");
        }else{
            setIsAuthorized(true);
        }
    }, [user]);

    return (
        <Fragment>
            { isAuthorized ? props.children : null }
        </Fragment>
    );
}