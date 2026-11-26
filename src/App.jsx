
import { Routes, Route, Navigate,Outlet } from 'react-router-dom';
import { LangProvider } from './context/LangContext.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import OurStory from './pages/OurStory.jsx';
import Menu from './pages/Menu.jsx';
import Gallery from './pages/Gallery.jsx';
import Reservation from './pages/Reservation.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminLogin from './admin/pages/AdminLogin.jsx';
import AdminLayout from './admin/layouts/AdminLayout.jsx';
import PlaceholderPage from './admin/pages/PlaceholderPage.jsx';
import Dashboard from './admin/pages/Dashboard.jsx';
import { ADMIN_BASE } from './admin/config.js';

import { SiteProvider } from './context/SiteContext.jsx';
import WebsiteSettings from './admin/pages/WebsiteSettings.jsx';
import SupabaseCheck from './admin/pages/SupabaseCheck.jsx';
import Reservations from './admin/pages/Reservations.jsx';

import { AuthProvider } from './admin/context/AuthContext.jsx';
import ProtectedRoute from './admin/components/ProtectedRoute.jsx';

import MenuManagement from './admin/pages/MenuManagement.jsx';

import Categories from './admin/pages/Categories.jsx';
import { ToastProvider } from './admin/components/Toast.jsx';
import GalleryManagement from './admin/pages/GalleryManagement.jsx';



export default function App() {
  return (
    <LangProvider>
      <SiteProvider>
      <Routes>
           {/* ===== Admin ===== */}
        <Route
          path={ADMIN_BASE}
      element={
  <AuthProvider>
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  </AuthProvider>
}
        >
          <Route index element={<AdminLogin />} />
          <Route path="check" element={<SupabaseCheck />} />

          {/* ProtectedRoute: login र admin नभए भित्र छिर्न नदिने */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
           <Route path="menu" element={<MenuManagement />} />
              <Route path="categories" element={<Categories />} />
           <Route path="gallery" element={<GalleryManagement />} />
          <Route path="reservations" element={<Reservations />} />
             
              <Route path="homepage" element={<PlaceholderPage title="Homepage Content" />} />
             <Route path="settings" element={<WebsiteSettings />} />
              <Route path="profile" element={<PlaceholderPage title="Admin Profile" />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>
        </Route>

        {/* ===== Public website: पहिलेकै जस्तो ===== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reservation" element={<Reservation />} />             
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </SiteProvider>
    </LangProvider>
  );
}