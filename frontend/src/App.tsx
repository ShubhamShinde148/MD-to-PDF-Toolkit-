import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import { TopNavBar } from './components/TopNavBar';
import { LeftSidebar } from './components/LeftSidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { MarkdownEditor } from './components/MarkdownEditor';
import { LivePreview } from './components/LivePreview';
import { StatusBar } from './components/StatusBar';
import { SettingsDrawer } from './components/SettingsDrawer';
import { ExportModal } from './components/ExportModal';
import { CommandPalette } from './components/CommandPalette';
import { AIAssistant } from './components/AIAssistant';

export const App: React.FC = () => {
  const { currentMode, theme, aiOpen, workspaceLayout } = useWorkspaceStore();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Monitor CustomEvent for toast notifications
  useEffect(() => {
    const handleToast = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setToast({ message: detail.message, type: detail.type || 'success' });
        setTimeout(() => setToast(null), 3000);
      }
    };

    window.addEventListener('app-toast', handleToast);
    return () => window.removeEventListener('app-toast', handleToast);
  }, []);

  // Synchronize document.body theme class
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-bg-primary text-text-primary select-none">
      {/* Top Header */}
      <TopNavBar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Explorer Sidebar */}
        <LeftSidebar />

        {/* Center Panel (Conditional Routing) */}
        <div className="flex-1 flex overflow-hidden relative bg-bg-primary">
          {currentMode === 'welcome' && <WelcomeScreen />}
          {currentMode === 'dashboard' && <Dashboard />}
          
          {currentMode === 'editor' && (
            <div className="flex-1 flex overflow-hidden">
              <div className={`flex-1 flex overflow-hidden ${workspaceLayout === 'preview' ? 'hidden' : ''}`}>
                <MarkdownEditor />
              </div>
              <div className={`flex-1 flex overflow-hidden ${workspaceLayout === 'editor' ? 'hidden' : ''}`}>
                <LivePreview />
              </div>
            </div>
          )}
        </div>

        {/* Right AI Sidebar Panel */}
        {currentMode === 'editor' && aiOpen && <AIAssistant />}
      </div>

      {/* Bottom Status bar */}
      <StatusBar />

      {/* Modals & Drawer Overlays */}
      <SettingsDrawer />
      <ExportModal />
      <CommandPalette />

      {/* Toast Notification Pop-up */}
      {toast && (
        <div 
          className={`fixed bottom-10 right-6 px-4 py-3 rounded-xl border shadow-premium z-50 text-xs font-semibold flex items-center gap-2 animate-bounce ${
            toast.type === 'success' 
              ? 'bg-feedback-success/15 border-feedback-success text-feedback-success' 
              : 'bg-feedback-danger/15 border-feedback-danger text-feedback-danger'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;
