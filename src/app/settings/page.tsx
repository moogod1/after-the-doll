// src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { updateUser } from '@/lib/firestore';
import type { ThemePreset } from '@/types';

function SettingsContent() {
  const { user } = useAuthContext();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [themePreset, setThemePreset] = useState<ThemePreset>('vintage');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setBio(user.bio);
      setThemePreset(user.themePreset);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage('');
    try {
      await updateUser(user.uid, {
        displayName,
        bio,
        themePreset,
      });
      setMessage('Settings saved successfully!');
      // Reload page to apply theme changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes('success')
              ? 'bg-green-100 border border-green-300 text-green-800'
              : 'bg-red-100 border border-red-300 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-300 rounded p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
          <input
            type="text"
            value={user.username}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
          />
          <p className="text-xs text-gray-600 mt-1">Username cannot be changed</p>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-1 text-gray-700">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1 text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Tell people about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Theme Preset</label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="vintage"
                checked={themePreset === 'vintage'}
                onChange={(e) => setThemePreset(e.target.value as ThemePreset)}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Vintage</div>
                <div className="text-sm text-gray-600">Cream and brown, nostalgic feel</div>
              </div>
            </label>
            <label className="flex items-center p-3 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="ocean"
                checked={themePreset === 'ocean'}
                onChange={(e) => setThemePreset(e.target.value as ThemePreset)}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Ocean</div>
                <div className="text-sm text-gray-600">Light blue and deep teal</div>
              </div>
            </label>
            <label className="flex items-center p-3 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="forest"
                checked={themePreset === 'forest'}
                onChange={(e) => setThemePreset(e.target.value as ThemePreset)}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Forest</div>
                <div className="text-sm text-gray-600">Light green and dark forest</div>
              </div>
            </label>
            <label className="flex items-center p-3 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                value="sunset"
                checked={themePreset === 'sunset'}
                onChange={(e) => setThemePreset(e.target.value as ThemePreset)}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Sunset</div>
                <div className="text-sm text-gray-600">Pink and rose tones</div>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 px-4 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
