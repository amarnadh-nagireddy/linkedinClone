import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import { useAuth } from "@/context/AuthContext.jsx";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/user/login", { email, password });
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
      console.error(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-10">
      <form onSubmit={handleLogin} className="bg-white border border-slate-200 rounded-xl shadow-sm w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold mb-4 text-center">Sign in</h1>
        {error && <p className="text-red-600 text-sm text-center mb-3">{error}</p>}
        <div className="space-y-3">
          <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign in</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
