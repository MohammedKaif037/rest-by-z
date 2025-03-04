import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Zap, User, Settings, LogOut, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Zap className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                RestWave
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.includes('/dashboard')
                      ? 'text-white bg-dark-800'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/collections"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.includes('/collections')
                      ? 'text-white bg-dark-800'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  Collections
                </Link>
                <Link
                  to="/history"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname.includes('/history')
                      ? 'text-white bg-dark-800'
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  History
                </Link>
                <div className="ml-4 flex items-center">
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-sm focus:outline-none">
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span>{user?.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-dark-700">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-dark-700 flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-white hover:bg-dark-700 flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-dark-700 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-300 hover:text-white hover:bg-dark-800 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.includes('/dashboard')
                      ? 'text-white bg-dark-700'
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/collections"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.includes('/collections')
                      ? 'text-white bg-dark-700'
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Collections
                </Link>
                <Link
                  to="/history"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.includes('/history')
                      ? 'text-white bg-dark-700'
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  History
                </Link>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.includes('/profile')
                      ? 'text-white bg-dark-700'
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname.includes('/settings')
                      ? 'text-white bg-dark-700'
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-white hover:bg-dark-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-white hover:bg-dark-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-dark-300 hover:text-white hover:bg-dark-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;