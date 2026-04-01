'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: '📊', label: 'Overview' },
  { href: '/dashboard/assessments', icon: '📝', label: 'Assessments' },
  { href: '/dashboard/candidates', icon: '👥', label: 'Candidates' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userName = session.user?.name || 'Company';
  const userEmail = session.user?.email || '';
  const initials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Link href="/dashboard" className="dashboard-sidebar-brand">
          <div className="dashboard-sidebar-brand-icon">H</div>
          <span className="dashboard-sidebar-brand-text">HireIQ</span>
        </Link>

        <ul className="dashboard-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="dashboard-sidebar-nav-item">
              <Link
                href={item.href}
                className={`dashboard-sidebar-nav-link ${
                  pathname === item.href ? 'active' : ''
                }`}
              >
                <span className="dashboard-sidebar-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-sidebar-user">
            <div className="dashboard-sidebar-avatar">{initials}</div>
            <div className="dashboard-sidebar-user-info">
              <div className="dashboard-sidebar-user-name">{userName}</div>
              <div className="dashboard-sidebar-user-email">{userEmail}</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm w-full mt-4"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}
