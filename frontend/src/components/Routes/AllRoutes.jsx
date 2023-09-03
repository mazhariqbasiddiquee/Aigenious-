import React from "react";
import { Route, Routes } from "react-router-dom";
import Hero from "../Hero";
import InterviewPage from "../InterviewPage";
import SignupForm from "../Signup";
import LoginForm from "../Login";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default AllRoutes;
