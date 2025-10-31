import React, { useState } from "react";
import api from "@/api";
import { useAuth } from "@/context/AuthContext.jsx";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [enableImageEdit, setEnableImageEdit] = useState(false);
  const menuRef = React.useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      if (profileImage) fd.append("profileImage", profileImage);
      const res = await api.put("/user/update", fd);
      const updatedUser = res.data?.user;
      if (updatedUser) {
        const token = localStorage.getItem("token");
        login(token, updatedUser);
      }
      setSuccess("Profile updated");
      toast.success("Profile updated");
      setForm((prev) => ({ ...prev, password: "" }));
      setProfileImage(null);
      setEnableImageEdit(false);
    } catch (e) {
      setError(e?.response?.data?.message || "Update failed");
      toast.error(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  React.useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setViewerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold mb-4">Edit profile</h1>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen((o)=>!o)} className="block">
              <img
                src={user?.profileImage?.url || "/default.png"}
                onError={(e)=> { e.currentTarget.onerror=null; e.currentTarget.src="/default.png"; }}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
            </button>
            {menuOpen && (
              <div className="absolute z-20 mt-2 w-36 bg-white border rounded-md shadow-md py-1">
                <button onClick={() => { setViewerOpen(true); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50">View</button>
                <button onClick={() => { setEnableImageEdit(true); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Edit</button>
              </div>
            )}
          </div>
          <div className="text-sm text-slate-600">
            Click the photo to view or change your profile image.
          </div>
        </div>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">First name</label>
              <input name="firstname" value={form.firstname} onChange={onChange} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Last name</label>
              <input name="lastname" value={form.lastname} onChange={onChange} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">New password</label>
            <input type="password" name="password" value={form.password} onChange={onChange} className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Leave blank to keep current" />
          </div>
          {enableImageEdit && (
            <div>
              <label className="block text-xs text-slate-600 mb-1">Profile image</label>
              <input type="file" accept="image/*" onChange={(e)=> setProfileImage(e.target.files[0])} />
              <div className="text-xs text-slate-500 mt-1">Choose a new image, then save changes.</div>
            </div>
          )}
          <div className="pt-2">
            <button disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save changes</button>
          </div>
        </form>
      </div>

      {viewerOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-3 max-w-lg w-[90%]">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Profile Photo</div>
              <button className="text-sm border px-2 py-1 rounded" onClick={()=> setViewerOpen(false)}>Close</button>
            </div>
            <img src={user?.profileImage?.url || "/default.png"} onError={(e)=> { e.currentTarget.onerror=null; e.currentTarget.src="/default.png"; }} alt="Profile" className="w-full rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

