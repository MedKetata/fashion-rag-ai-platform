import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import MainLayout from '../layouts/MainLayout';

import Home from '../pages/Home';
import Contact from '../pages/Contact';
import News from '../pages/News';

import Login from "../pages/Login";
import Register from "../pages/Register";

import AdminDashboard from "../pages/AdminDashboard";
import PhoenixMonitoring from "../pages/PhoenixMonitoring";

import AuthGuard from './AuthGuard';

const AppRoutes = () => {

  return (

    <Routes>

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>

        <Route
          path="/home"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />

        <Route
          path="/contact"
          element={
            <AuthGuard>
              <Contact />
            </AuthGuard>
          }
        />

        <Route
          path="/news"
          element={
            <AuthGuard>
              <News />
            </AuthGuard>
          }
        />

        <Route
          path="/admin"
          element={
            <AuthGuard role="ADMIN">
              <AdminDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/phoenix"
          element={
            <AuthGuard role="ADMIN">
              <PhoenixMonitoring />
            </AuthGuard>
          }
        />
      </Route>

    </Routes>

  );

};

export default AppRoutes;