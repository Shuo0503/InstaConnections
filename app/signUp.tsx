// signUp.tsx
"use client";
import React, { useState } from "react";
import Head from "next/head";
import "./signUp.css";

interface SignupProps {
  onSignupSuccess: (username: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    instagram: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the Instagram username to the parent component
    onSignupSuccess(formData.instagram);
  };

  return (
    <div className="container">
      <Head>
        <title>Signup Page</title>
        <meta name="description" content="Sign up for our service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="signupContainer">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="instagram">Instagram Username</label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="signupBtn">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
