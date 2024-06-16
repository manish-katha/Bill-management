import { Link } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth as defaultAuth, myauth } from "../config/firbase"; 
import './Styles/nav.css';




export const Nav =()=>{
    const [user] = useAuthState(!defaultAuth.currentUser ? myauth : defaultAuth);

    return (
        <>
        <div className="Nav">
            <div className="left">
            <div><Link to ="/Home">Home</Link></div>
            <div><Link to ="/Home">Back</Link></div>
            </div>
             <div className="right">
            {user ? (
                <>
                    <p>{user.displayName}</p>
                    <p>{user.email}</p>
                </>
            ) : (
                <p>No user signed in</p>
            )}
        </div>
        </div>
        </>
    );
}