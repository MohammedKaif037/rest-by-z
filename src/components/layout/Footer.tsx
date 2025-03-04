import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <Zap className="h-6 w-6 text-primary-500" />
              <span className="ml-2 text-lg font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                RestWave
              </span>
            </Link>
            <p className="mt-2 text-sm text-dark-300">
              A modern REST client for the next generation of developers.
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="#"
                className="text-dark-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-dark-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/features"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/tutorials"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  to="/changelog"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/status"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-dark-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-dark-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-dark-400 text-sm">
            &copy; {new Date().getFullYear()} RestWave. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link
              to="/privacy"
              className="text-dark-400 hover:text-white transition-colors text-sm"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-dark-400 hover:text-white transition-colors text-sm"
            >
              Terms
            </Link>
            <Link
              to="/cookies"
              className="text-dark-400 hover:text-white transition-colors text-sm"
            >
              Cookies
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-dark-400 text-sm flex items-center justify-center">
          Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for developers
        </div>
      </div>
    </footer>
  );
};

export default Footer;