'use client';

import { useEffect, useState } from 'react';

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN';

  return { role, isAdmin };
}
