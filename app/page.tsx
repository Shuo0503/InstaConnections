"use client";
import React, { useState } from "react";
import Signup from "./signUp";
import GetInformation from "./getInformation";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  // Function to handle signup success
  const handleSignupSuccess = (instagramUsername: string) => {
    setUsername(instagramUsername);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hackathon-7-27</h1>
      {!username ? (
        <Signup onSignupSuccess={handleSignupSuccess} />
      ) : (
        <GetInformation username={username} />
      )}
    </main>
  );
}
