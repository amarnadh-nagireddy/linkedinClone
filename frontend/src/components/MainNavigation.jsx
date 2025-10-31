import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';

const MainNavigation = () => {
  const [showTop, setShowTop] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16"> 
        <Outlet />
      </main>
      <Footer />
      {showTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 z-40 bg-blue-600 text-white rounded-full shadow-lg px-3 py-2 hover:bg-blue-700"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  )
}

export default MainNavigation;