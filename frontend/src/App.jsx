import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainNavigation from "@/components/MainNavigation";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import ProtectedRoute from "@/components/ProtectedRoute";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import MyPosts from "@/pages/MyPosts";
import Landing from "@/pages/Landing";
import { useAuth } from "@/context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IndexGate = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Home /> : <Landing />;
};

 const router = createBrowserRouter([
  {
    path: "/", element: <MainNavigation />,
    children: [
      { path: "/", element: <IndexGate /> },
      { element: <ProtectedRoute />, children: [
        { path: "/profile", element: <Profile /> },
        { path: "/my-posts", element: <MyPosts /> },
      ]},
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Register /> },
    ]
  }
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
};

export default App;
