import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, MenuIcon, XIcon } from 'lucide-react';
import { useUser } from '../UserContext';
const Navbar = ({
  isLoggedIn = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <BookOpenIcon className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-gray-800">
                  StudSync
                </span>
              </Link>
            </div>
          </div>
          {/* Desktop navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? <>
                <Link to="/dashboard" className="px-3 py-2 text-gray-700 hover:text-blue-500">
                  Dashboard
                </Link>
                <button className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={handleLogout}>
                  Log Out
                </button>
              </> : <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-blue-500 hover:text-blue-700">
                  Log In
                </Link>
                <Link to="/register" className="ml-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Sign Up
                </Link>
              </>}
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              {isOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {isLoggedIn ? <>
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-500">
                  Dashboard
                </Link>
                <button className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-500">
                  Log Out
                </button>
              </> : <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-500">
                  Log In
                </Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-500">
                  Sign Up
                </Link>
              </>}
          </div>
        </div>}
    </nav>;
};
export default Navbar;