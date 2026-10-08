import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { VirtualCursorOverlay } from './components/automation/VirtualCursorOverlay';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <Dashboard /> : <AuthPage />}
      <VirtualCursorOverlay />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
