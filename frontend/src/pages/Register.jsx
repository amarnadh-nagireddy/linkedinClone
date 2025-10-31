import React, { useState } from "react";
import api from "@/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ firstname: "", lastname: "", username: "", email: "", password: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onPickImage = (file) => {
    if (!file) {
      if (preview) URL.revokeObjectURL(preview);
      setProfileImage(null);
      setPreview(null);
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (profileImage) fd.append("profileImage", profileImage);
      await api.post("/user/signup", fd);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border rounded-2xl shadow-lg p-8 md:p-10 space-y-5">
        <h1 className="text-2xl font-semibold text-center mb-2">Create account</h1>
        <div className="flex flex-col items-center">
          <label className="relative block cursor-pointer">
            <img
              src={preview || "/empty.jpg"}
              onError={(e)=> { e.currentTarget.onerror=null; e.currentTarget.src="/empty.jpg"; }}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <input type="file" accept="image/*" className="hidden" onChange={(e)=> onPickImage(e.target.files[0])} />
          </label>
          {preview && (
            <button type="button" onClick={()=> onPickImage(null)} className="mt-2 text-xs border px-2 py-1 rounded">Remove photo</button>
          )}
          <div className="text-xs text-slate-500 mt-1">Photo is optional</div>
        </div>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <input name="firstname" placeholder="First name" value={form.firstname} onChange={handleChange} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          <input name="lastname" placeholder="Last name" value={form.lastname} onChange={handleChange} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        </div>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
        <button className="btn-primary w-full">Sign up</button>
      </form>
    </div>
  );
};

export default Register;
