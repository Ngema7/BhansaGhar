import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* lg:pl-64 = ठूलो screen मा sidebar को चौडाइ जति ठाउँ छोड्ने */}
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          {/* यहाँ हरेक page (Dashboard, Menu...) देखिन्छ */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}