import React, { useState } from "react";
import "../style/Login.css"; // Import CSS file with corrected path

function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleGenerateOTP = (e) => {
    e.preventDefault();
    // logic to generate OTP
    
    setShowOtpForm(true);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    const otp = otpDigits.join(""); 
    //logic to verify the OTP 
    
    console.log("OTP verified successfully:", otp);
  };

  const handleOtpChange = (index, value) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
  };

  return (
    <div className="login-container">
      {!showOtpForm ? (
        <form className="login-form" onSubmit={handleGenerateOTP}>
          <div className="tital">
            <div class="Snappy">Snappy</div>
            <div class="subtital">A Complete Grocery Store</div>
          </div>
          <div class="log">Login/Sing up</div>
          <div className="mobile-number-container">
            <div className="country-code-select">
              <select class="select"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                <option value="us">+1 (USA)</option>
                <option value="uk">United Kingdom</option>
                <option value="in">+91(IND)</option>
                {/*more options*/}
              </select>
            </div>
            <div className="mobile-number-input">
              <label htmlFor="mobileNumber">Mobile Number:</label>
              <input
              type="text"
              placeholder="Enter Your Mobile number"
              id="mobileNumber"
              value={mobileNumber} 
              onChange={(e) => {
    
               const input = e.target.value.replace(/\D/g, '');
    
              const limitedInput = input.slice(0, 10);
    
    setMobileNumber(limitedInput);
  }}
  pattern="[0-9]{10}" 
/>
            </div>
          </div>
          <button type="submit">Generate OTP</button>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleVerifyOTP}>
          <div className="tital">
            <div class="Snappy">Snappy</div>
            <div class="subtital">A Complete Grocery Store</div>
          </div>
          <div class="subtital-2">OTP Verification</div>
          <div className="otp-input">
          <label htmlFor="otp">OTP</label>
          <div className="otp-input">
            {otpDigits.map((digit, index) => (
              <input
                id="opt"
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
              />
            ))}
            </div>
          </div>
          <button type="submit">Verify OTP</button>
          <div class="resend">Resend OTP</div>
        </form>
      )}
    </div>
  );
}

export default Login;
