import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import Fetch from "../utils/fetch";

export default function Signin() {
    const navigate = useNavigate();
    const [loginDetails, setLoginDetails] = useState({
        username: "",
        password: "",
      });




      const Login = async (e) => {
        e.preventDefault();

    
    try {
        const response = await Fetch("auth/login", "post", loginDetails);
        console.log(response);
        const data = await response.json();
        console.log(data);

        console.log(response.ok, "true?");

        if (response.ok) {
        localStorage.setItem(
            "token",
            JSON.stringify(data?.access_token)
        );
        localStorage.setItem("userDetails", JSON.stringify(data?.user)); //sets token and user details to localstorage
        navigate('/feed')


        } else {

        console.log(data?.errors[0]?.value, "message");
        }
    } catch (error) {
        console.log(error);

    }
    };



    const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({
        ...loginDetails,
        [name]: value,
    });
    console.log(name, value);
    };



  return (
    <>
   
        <div className="main-rec" id="signin">
          <div className="txt">

            <p>Log in to your account</p>
          </div>

          <div className="form-container">
            <form  onSubmit={Login}>
              <div className="auth-input-container">
                <label>Username</label> <br />
                <input
                  type="text"
                  placeholder="username"
                  className="auth-input"
                  onChange={handleChange}
                  name="username"
                  required
                />
              </div>
              <div className="auth-input-container">
                <label>Password</label> <br />
                <input
                  type="password"
                  placeholder="*******"
                  className="auth-input"
                  onChange={handleChange}
                  name="password"
                  required
                />
              </div>
              <div>
                <button className="signup-btn" id="signin-btn">
                  Log In
                </button>
                
              </div>
              <div>
            <Link to={"/signup"}> <button className="createacc-btn">
                  Create Account
                </button></Link> 
              </div>

            </form>
          </div>
        </div>

    </>
  );
}