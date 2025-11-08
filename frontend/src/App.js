import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import StallPage from './pages/StallPage';
import TenantPage from './pages/TenantPage';

function App() {
  return (
    <Routes>
      {/* Ana Layout (Menü vb.) */}
      <Route path="/" element={<Layout />}>
        {/* Layout içindeki Outlet'e yüklenecek sayfalar */}
        <Route index element={<DashboardPage />} />
        <Route path="marketplaces" element={<MarketplacePage />} />
        <Route path="stalls" element={<StallPage />} />
        <Route path="tenants" element={<TenantPage />} />
      </Route>
    </Routes>
  );
}

export default App;