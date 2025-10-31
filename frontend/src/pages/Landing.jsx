import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome to TieIn</h1>
        <p className="text-slate-600 mb-6">Connect, share posts, and engage with your network. Login or create an account to get full access.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={()=> navigate("/login")} className="px-4 py-2 rounded border hover:bg-gray-50">Login</button>
          <button onClick={()=> navigate("/signup")} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Create account</button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
