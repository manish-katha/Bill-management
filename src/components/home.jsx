import { auth as defaultAuth, myauth } from "../config/firbase"; // Import both authentication instances
import { useAuthState } from 'react-firebase-hooks/auth';
import { Nav } from "./nav";
import { Link } from "react-router-dom";
import './Styles/Home.css';
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

    // Check if user exists in default authentication instance, otherwise use another instance
    const [user] = useAuthState(!defaultAuth.currentUser ? myauth : defaultAuth);
    const move=()=>{
        navigate("/bill");
    }

    return (
        <div className="Home"> {/* Apply Home class */}
             
                <button  onClick={move}>Create-Bill</button>
          
        </div>
    );
};
