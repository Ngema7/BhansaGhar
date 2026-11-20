import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';
import PageTransition from '../components/PageTransition.jsx';

export default function MainLayout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <PageTransition key={pathname}><Outlet /></PageTransition>
      <Footer />
    </div>
  );
}
