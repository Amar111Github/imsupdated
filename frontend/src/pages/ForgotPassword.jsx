import React, { useState, useEffect } from 'react';
import { base_Url } from './api';
import axios from 'axios';
import "./forgot.css";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate()
  const [stage, setStage] = useState(1);
  const [data, setData] = useState({
    userEmail: "",
    otp: "",
    userPass: ""
  });
  const [formError, setFormError] = useState({
    password: "",
    confirmPassword: "",
  });
  useEffect(()=>{
    setFormError({
        password: "",
        confirmPassword: "",
    })
  }, [stage])
  const [passMatch, setPassMatch]= useState({
    password: "",
    confirmPassword: ""
  })

  const [countDown, setCountDown] = useState(0);
  const [message, setMessage] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      if (countDown > 0) {
        if(countDown===1 && stage ===2){
           alert("time out")
            setStage(1);
            clearInterval(timer)
            setMessage("");
            return;
        }
        setCountDown(countDown - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countDown]);

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/user/email_verify", data);
      console.log(response)
      if (response.data.message === "ok") {
        alert("Otp Sent");
        let day = new Date();
        let secounds = day.getSeconds();
        console.log(response.data.time-secounds+1)
        setCountDown(response.data.time-secounds+1);
      }
    } catch (error) {
      alert(error.response.data.message);
      setMessage(error.response.data.message)
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    // Perform email validation logic
    // For example, check if the email is valid
    // Then proceed to the next stage
    console.log(data.userEmail)
    setStage(2);
    sendOtp();
  };

  const handleOtpSubmit =async (e) => {
    e.preventDefault();
    try{
        const response = await axios.post("http://localhost:8000/user/verify_otp", data);
        console.log(response)
    }catch(error){
        console.log(error.response.data.message)
        if(error.response.data.message==="your requist is faild"){
            alert("invalid otp")
            setStage(1);
            return;
        }
    }
   
    // Perform OTP validation logic
    // For example, check if the entered OTP is correct
    // Then proceed to the next stage
    setStage(3);
  };

 

  const validateFormInput = (event) => {
    event.preventDefault();
    if (passMatch.confirmPassword !== passMatch.password) {
        setFormError({
         
          confirmPassword: "Password and confirm password should be same",
        });
        return;
      }
  
      if (!passMatch.password || !passMatch.confirmPassword) {
        setFormError({
        
          password: "Password should not be empty",
        });
        return
      }
  
    setStage(3);
  };
  let success = ()=>{
    if((passMatch.password) && (passMatch.confirmPassword === passMatch.password)  ){
        alert("successfully changed");
        navigate("/")
    }
   return
  }

  return (
    <>
      <div className="login-container">
        <div className="stage-indicator">
          <div className="progress-container">
            <div className={`progress-bar step-${stage}`} />
          </div>
          <span className="stage-text">Stage {stage} of 3</span>
        </div>

        {stage === 1 && (
          <form onSubmit={handleEmailSubmit} className="login-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={data.userEmail}
              onChange={(e) => setData((prev)=>({...prev, userEmail:e.target.value}))}
              className="login-input"
              required
            />
            <button type="submit" className="login-button">Next</button>
          </form>
        )}

        {(stage === 2 && countDown> 0)? <> 
          <form onSubmit={handleOtpSubmit} className="login-form">
            <p className='count-Down'>Time Left: {countDown} sec</p>
            <input
              type="number"
              placeholder='Enter OTP'
              value={data.otp}
              onChange={(e) => setData((prev)=>({...prev, otp:e.target.value}))}
              className="login-input"
              required
            />
            <button type="submit" className="login-button">Next</button>
          </form>
    </>:<p>{message}</p>}

    {stage === 3 && (
        <form onSubmit={validateFormInput} className="login-form">
        

        <p className="label">Password</p>
        <input
          value={passMatch.password}
          onChange={(e)=>setPassMatch((prev)=>({...prev, password: e.target.value}))}
          name="password"
          type="password"
          className="login-input"
          placeholder="Password"
          required
        />
        <p className="error-message">{formError.password}</p>

        <p className="label">Confirm Password</p>
        <input
          value={passMatch.confirmPassword}
          onChange={(e)=>setPassMatch((prev)=>({...prev, confirmPassword: e.target.value})) }
          name="confirmPassword"
          type="password"
          className="login-input"
          placeholder="Confirm Password"
          required
        />
        <p className="error-message">{formError.confirmPassword}</p>

        <input type="submit" className="login-button" value="Submit" onClick={success}/>
      </form>
      )}


      </div>
    </>
  )
}

export default ForgotPassword;
