import React from 'react';
import { Compass, Plus, Save, Download, Search, Settings, Sun, Moon, Terminal } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const TopNavBar: React.FC = () => {
  const {
    currentMode,
    activeFile,
    createFile,
    setDrawerOpen,
    setPaletteOpen,
    setSearchOpen,
    setExportModalOpen,
    theme,
    setTheme,
    workspaceLayout,
    setWorkspaceLayout
  } = useWorkspaceStore();

  const handleNewFile = () => {
    createFile('Untitled.md');
  };

  const handleSaveFile = () => {
    if (activeFile) {
      // Trigger a visual confirmation toast (handled locally or via state)
      const event = new CustomEvent('app-toast', { 
        detail: { message: 'Document successfully saved!', type: 'success' } 
      });
      window.dispatchEvent(event);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-14 border-b border-border bg-bg-secondary/80 backdrop-blur-premium flex items-center justify-between px-4 select-none relative z-40">
      
      {/* Left: Logo & Core Actions */}
      <div className="flex items-center gap-6">
        <div 
          onClick={() => useWorkspaceStore.getState().setCurrentMode('welcome')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center shadow-premium-glow">
            <Compass className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-text-primary group-hover:text-accent-primary transition-colors">
            MD Catalyst Pro
          </span>
        </div>

        {/* Quick File actions - only show if not in Welcome view */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={handleNewFile}
            title="New File (Ctrl+N)"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-lg text-text-secondary hover:text-text-primary transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          {currentMode === 'editor' && (
            <>
              <button
                onClick={handleSaveFile}
                title="Save (Ctrl+S)"
                className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-lg text-text-secondary hover:text-text-primary transition-all"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setExportModalOpen(true)}
                title="Export (Ctrl+Shift+E)"
                className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-lg text-accent-primary hover:text-accent-primary/80 transition-all font-semibold"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Layout Switcher (Edit, Split, Preview) */}
              <div className="flex items-center bg-bg-primary/50 border border-border p-0.5 rounded-xl ml-4 text-[10px] font-bold">
                <button
                  onClick={() => setWorkspaceLayout('editor')}
                  className={`px-2 py-1 rounded-lg transition-all ${workspaceLayout === 'editor' ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setWorkspaceLayout('split')}
                  className={`px-2 py-1 rounded-lg transition-all ${workspaceLayout === 'split' ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Split
                </button>
                <button
                  onClick={() => setWorkspaceLayout('preview')}
                  className={`px-2 py-1 rounded-lg transition-all ${workspaceLayout === 'preview' ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Preview
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle: Universal Search & Command Palette Trigger */}
      <div className="flex-1 max-w-sm mx-4 hidden sm:block">
        <div 
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-bg-primary/50 border border-border hover:border-slate-500 rounded-xl cursor-pointer text-text-secondary transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px]">Search or run commands...</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[8px] font-mono">Ctrl</kbd>
            <kbd className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[8px] font-mono">Shift</kbd>
            <kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[8px] font-mono">P</kbd>
          </div>
        </div>
      </div>

      {/* Right: Controls, Theme & Settings Drawer Toggle */}
      <div className="flex items-center gap-3">
        {/* Command Palette Icon Button */}
        <button
          onClick={() => setPaletteOpen(true)}
          title="Command Palette"
          className="p-1.5 bg-bg-primary/45 border border-border hover:border-slate-500 rounded-xl text-text-secondary hover:text-text-primary transition-all"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-full text-text-secondary hover:text-text-primary transition-all"
        >
          {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

        {/* Settings Slide-over Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-full text-text-secondary hover:text-text-primary transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-[11px] text-white border border-white/20 select-none shadow-sm">
          S
        </div>
      </div>
      
    </header>
  );
};
