// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

// 임시 로그인 체크 함수 (실제 프로젝트는 Context, Redux, React Query 등 사용)
const isLoggedIn = () => Boolean(localStorage.getItem('token'));

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn() ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isLoggedIn() ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            path="/"
            element={isLoggedIn() ? <Home /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
