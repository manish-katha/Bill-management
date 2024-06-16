import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, provider, myauth } from "../config/firbase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Model from "react-modal";
import { GoogleIcon } from "./assets/googleicon";
import "./Styles/Login.css";

export const Login = () => {
  const navigate = useNavigate();

  const [model, setmodel] = useState(false);
  const [forgetmodel, setforgotmodel] = useState(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [Susername, setSusername] = useState("");
  const [Spassword, setSpassword] = useState("");
  const [Forgotuser, setForgotuser] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signInUsingGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    navigate("/Home");
  };

  const showPasswordHandler = () => {
    setShowPassword(!showPassword);
  };

  const sendPasswordResetEmailHandler = async () => {
    try {
      // Ensure that Forgotuser is correctly set with the email address
      console.log("Forgotuser:", Forgotuser);
      // Send password reset email using the email address
      await sendPasswordResetEmail(myauth, Forgotuser);

      // If no error occurred, display success message
      alert("Password reset email sent!");

      // Optionally, close the modal or reset the component state
      setforgotmodel(false);
    } catch (error) {
      // Log and handle any errors that occur during the process
      alert("Error sending password reset email:");
      setforgotmodel(false);
      console.log(error.message);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(myauth, Susername, Spassword);
      const user = myauth.currentUser;
      console.log(user);
      alert("Account created successfully!");
      setmodel(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const signInWithEmailAndPasswordHandler = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        myauth,
        username,
        password
      );
      const user = userCredential.user;
      console.log(user);
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>

      <div className="LoginStyle">
        <div className="leftStyle">
          <div>Don't have Account</div>
          No worries :)
          <button onClick={() => setmodel(true)}>Sign Up</button>
          <Model
            isOpen={model}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
              },
              content: {
                padding: "40px",
                borderRadius: "20px",
                height: "60%",
                width: "30%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              },
            }}
          >
            <form className="sign_popup" onSubmit={handleSubmit}>
              <h1>Create Account :) </h1>
              <input
                onChange={(event) => {
                  setSusername(event.target.value);
                }}
                placeholder="Username..."
              />
              <input
                onChange={(event) => {
                  setSpassword(event.target.value);
                }}
                placeholder="Password..."
              />

              <button type="submit">Create Account</button>
              <button onClick={signInUsingGoogle}>
                <GoogleIcon /> Sign In With Google
              </button>

              <button onClick={() => setmodel(false)}>
                Already Have Account
              </button>
            </form>
          </Model>
        </div>

        <div className="rightStyle">
          <div className="Login_box">
            <h1>Welcome :)</h1>
            <input
              onChange={(event) => {
                setusername(event.target.value);
              }}
              placeholder="Username..."
            />
            <input
              onChange={(event) => {
                setpassword(event.target.value);
              }}
              placeholder="Password..."
              type={showPassword ? "text" : "password"} // Show password only if showPassword is true
            />
            <Link onClick={() => setforgotmodel(true)}>Forgot Password</Link>
            <Model
              isOpen={forgetmodel}
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(10px)",
                },
                content: {
                  padding: "40px",
                  borderRadius: "20px",
                  height: "40%",
                  width: "30%",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                },
              }}
            >
              <div className="ForUser">Enter Username</div>
              <input
                className="Forinput"
                onChange={(event) => setForgotuser(event.target.value)}
                placeholder="username"
              />

              <button
                className="Forbutton"
                onClick={sendPasswordResetEmailHandler}
              >
                Send reset email
              </button>

              <button
                className="Forbutton"
                onClick={() => setforgotmodel(false)}
              >
                Back
              </button>
              {/* {showPassword && renderPassword()}
              {showPasswordHandler} */}
            </Model>

            <button onClick={signInWithEmailAndPasswordHandler}>Login</button>

            <button onClick={signInUsingGoogle}>
              <GoogleIcon /> Sign In With Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
