import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Fetch from "../utils/fetch";

export default function Signup() {
    const navigate = useNavigate();

    const [registerDetails, setRegisterDetails] = useState({
        username: "",
        first_name: "",
        last_name: "",
        password: "",
      });



      const Register = async (e) => {
        e.preventDefault();

        try {
          const response = await Fetch("auth/register", "post", registerDetails);
          console.log(response, "response");
          const data = await response.json();
          console.log(data, "data");

          if (response.ok) {
            navigate('/signin')
          } else {
            console.log(data?.message);
          }
          // history.push("/home");
        } catch (error) {
          console.log("error");
        }
      };






    
    const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterDetails({
        ...registerDetails,
        [name]: value,
    });
    console.log(name, value);
    };




    return (
      <>



          <div className="main-rec">
          <div className="txt">

            <p>Sign Up</p>
          </div>


            <div className="form-container">
              <form onSubmit={Register}>
                <div className="auth-input-container">
                  <label>Username</label> <br />
                  <input
                    type="text"
                    placeholder="john123"
                    className="auth-input"
                    name="username"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="auth-input-container">
                  <label>First Name</label> <br />
                  <input
                    type="text"
                    placeholder="first name"
                    className="auth-input"
                    name="first_name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="auth-input-container">
                  <label>LastName</label> <br />
                  <input
                    type="text"
                    placeholder="last name"
                    className="auth-input"
                    name="last_name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="auth-input-container">
                  <label>Password</label> <br />
                  <input
                    type="password"
                    placeholder="*******"
                    className="auth-input"
                    name="password"
                    onChange={handleChange}
                    required
                  />

                </div>

                <div>
                  <button className="signup-btn">Create Account</button>
                </div>
                <div>
                <Link to={"/signin"}> <button className="createacc-btn">
                  Log in
                </button></Link>
                </div>
              </form>
            </div>
          </div>

      </>
    );
  }