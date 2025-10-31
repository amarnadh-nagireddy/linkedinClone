import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

function Navbar(){
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((o)=> !o);
  const go = (path) => { setOpen(false); navigate(path); };
  const dropdownRef = React.useRef(null);
  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

  React.useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 h-14 bg-slate-900 text-white border-b border-slate-800 fixed top-0 w-full z-10">
      <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}> 
        <span className="font-bold text-lg">TieIn</span>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-sm border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 hidden sm:inline-block">Home</button>
        {isAuthenticated ? (
          <>
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggle} className="flex items-center gap-2">
                <img 
                  src={user?.profileImage?.url || "/default.png"}
                  onError={(e)=> { e.currentTarget.onerror=null; e.currentTarget.src="/default.png"; }}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="hidden sm:block text-sm font-medium">{cap(user?.firstname)} {cap(user?.lastname)}</span>
              </button>
              {open && (
                <div className="absolute right-0 top-12 w-44 bg-white text-slate-900 border rounded-md shadow-lg py-1 z-20" onClick={(e)=> e.stopPropagation()}>
                  <button onClick={(e)=> { e.stopPropagation(); go("/my-posts"); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50">My Posts</button>
                  <button onClick={(e)=> { e.stopPropagation(); go("/profile"); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Edit Profile</button>
                  <button onClick={(e)=> { e.stopPropagation(); setOpen(false); logout(); }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50">Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/")} className="text-sm border border-slate-700 px-3 py-1 rounded hover:bg-slate-800 sm:hidden">Home</button>
            <button onClick={() => navigate("/login")} className="text-sm border border-slate-700 px-3 py-1 rounded hover:bg-slate-800">Login</button>
            <button onClick={() => navigate("/signup")} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Signup</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

