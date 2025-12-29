// src/components/ThemeWrapper.tsx
'use client';

import { useAuthContext } from './AuthProvider';
import type { ThemePreset } from '@/types';

const themeClasses: Record<ThemePreset, string> = {
  vintage: 'bg-vintage-cream text-vintage-brown',
  ocean: 'bg-ocean-blue text-ocean-dark',
  forest: 'bg-forest-green text-forest-dark',
  sunset: 'bg-sunset-pink text-sunset-dark',
};

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const theme = user?.themePreset || 'vintage';

  return <div className={`min-h-screen ${themeClasses[theme]}`}>{children}</div>;
}
