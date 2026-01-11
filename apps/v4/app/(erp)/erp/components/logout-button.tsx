'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { SidebarMenuButton } from '@/registry/new-york-v4/ui/sidebar';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarMenuButton size="sm" onClick={handleLogout} disabled={loading}>
      <LogOut className="size-4" />
      <span>{loading ? 'Logging out...' : 'Logout'}</span>
    </SidebarMenuButton>
  );
}
