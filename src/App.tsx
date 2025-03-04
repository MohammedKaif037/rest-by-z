import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { initAuth } from './store/authStore';
import { initRequestStore } from './store/requestStore';
import { initEnvironmentStore } from './store/environmentStore';
import { useAuthStore } from './store/authStore';
import RequestBuilder from './components/request/RequestBuilder';
import ResponseViewer from './components/request/ResponseViewer';
import CollectionsList from './components/collections/CollectionsList';
import EnvironmentSelector from './components/environment/EnvironmentSelector';
import HistoryList from './components/history/HistoryList';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  // Initialize stores
  useEffect(() => {
    initAuth();
    initRequestStore();
    initEnvironmentStore();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 text-transparent bg-clip-text mb-4">
                    Modern API Testing for Modern Developers
                  </h1>
                  <p className="text-lg text-dark-300 max-w-3xl mx-auto">
                    RestWave is a powerful, intuitive REST client that makes API testing a breeze. 
                    Build, test, and document your APIs with ease.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Get Started</h2>
                    <p className="text-dark-300 mb-6">
                      Create an account to save your collections, share with teammates, and access your requests from anywhere.
                    </p>
                    <div className="flex space-x-4">
                      <a href="/register" className="btn btn-primary">Sign Up Free</a>
                      <a href="/login" className="btn btn-outline">Login</a>
                    </div>
                  </div>
                  
                  <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Features</h2>
                    <ul className="space-y-2 text-dark-300">
                      <li>• Intuitive request builder</li>
                      <li>• Environment variables</li>
                      <li>• Request history</li>
                      <li>• Collection management</li>
                      <li>• Team collaboration</li>
                    </ul>
                  </div>
                </div>
              </div>
            } />
            
            <Route path="/login" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <LoginForm />
              </div>
            } />
            
            <Route path="/register" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <RegisterForm />
              </div>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <EnvironmentSelector />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                      <CollectionsList />
                    </div>
                    
                    <div className="lg:col-span-3 space-y-6">
                      <RequestBuilder />
                      <ResponseViewer />
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="/history" element={
              <ProtectedRoute>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <h1 className="text-2xl font-bold mb-6">Request History</h1>
                  <HistoryList />
                </div>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;