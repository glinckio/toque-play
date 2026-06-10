import { useState } from 'react';
import { AdminSidebar, AdminRoute } from './Sidebar';
import { AdminTopbar } from './Topbar';
import { AdminDashboard } from './pages/Dashboard';
import { AdminUsers } from './pages/Users';
import { AdminTournaments } from './pages/Tournaments';
import { AdminMatches } from './pages/Matches';
import { AdminAthletes } from './pages/Athletes';
import { AdminPayments } from './pages/Payments';
import { AdminSettings } from './pages/Settings';

export function AdminApp({ onExit }: { onExit: () => void }) {
  const [route, setRoute] = useState<AdminRoute>('dashboard');

  return (
    <div className="min-h-screen w-full flex bg-[#F5F4F8]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <AdminSidebar active={route} onChange={setRoute} onExit={onExit} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar route={route} />
        <main className="flex-1 px-8 py-7 overflow-y-auto">
          {route === 'dashboard' && <AdminDashboard />}
          {route === 'users' && <AdminUsers />}
          {route === 'tournaments' && <AdminTournaments />}
          {route === 'matches' && <AdminMatches />}
          {route === 'athletes' && <AdminAthletes />}
          {route === 'payments' && <AdminPayments />}
          {route === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}
