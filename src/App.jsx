import { Routes, Route } from 'react-router-dom';
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
import { ADMIN_BASE } from './admin/config.js';

export default function App() {
  return (
    <LangProvider>
      <Routes>
        {/* Admin: MainLayout बाहिर राखिएको छ, ताकि Navbar/Footer नदेखियोस् */}
      <Route path={ADMIN_BASE} element={<AdminLogin />} />

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
    </LangProvider>
  );
}