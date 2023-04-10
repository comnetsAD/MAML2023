import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function UseCustomNavigate(){
    const { history} = useContext()
    const navigate = useNavigate();

    return(path) =>{
        history.push(path)
        navigate(path)
    }
}

export default UseCustomNavigate