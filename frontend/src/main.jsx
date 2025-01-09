import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Learn from './Learn';
import ParentControl from './ParentControl';
import AuthProvider from './AuthProvider';
import Login from './Login';
import PrivateRoute from './routes/privateRoute';
import Root from './routes/root';
import Register from './Register';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Root />}>
              <Route path="/" element={<Learn />} />
              <Route path="/login" element={<Login />} />
              <Route path="/parent-control" element={<PrivateRoute />}>
                <Route path="" element={<ParentControl />} />
              </Route>
              <Route path="/learn" element={<Learn />} />
              <Route path="*" element={<h1>404 error: Not Found</h1>} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);