import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Search, ArrowRight } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

interface CommandItem {
  name: string;
  engName: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    paletteOpen,
    setPaletteOpen,
    createFile,
    setTheme,
    setDrawerOpen,
    setExportModalOpen,
    updateExportSettings
  } = useWorkspaceStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const COMMANDS: CommandItem[] = [
    {
      name: 'Create New Document',
      engName: 'Initialize a new empty markdown file',
      action: () => createFile('Untitled.md')
    },
    {
      name: 'Switch to Dark Theme',
      engName: 'Change interface coloring mode to dark glass',
      action: () => setTheme('dark')
    },
    {
      name: 'Switch to Light Theme',
      engName: 'Change interface coloring mode to glassmorphic light',
      action: () => setTheme('light')
    },
    {
      name: 'Open Workspace Settings',
      engName: 'Adjust margins, cover page, and watermark configurations',
      action: () => setDrawerOpen(true)
    },
    {
      name: 'Export to PDF Document',
      engName: 'Open PDF export permission style dialog and download',
      action: () => {
        updateExportSettings({ format: 'pdf' });
        setExportModalOpen(true);
      }
    },
    {
      name: 'Export to HTML Document',
      engName: 'Compile self-contained HTML file and trigger download',
      action: () => {
        updateExportSettings({ format: 'html' });
        setExportModalOpen(true);
      }
    }
  ];

  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.name.toLowerCase().includes(query.toLowerCase()) ||
    cmd.engName.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (paletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [paletteOpen]);

  // Bind keydown events for Ctrl+Shift+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'P' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paletteOpen, setPaletteOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      setPaletteOpen(false);
    }
  };

  if (!paletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 select-none">
      {/* Backdrop */}
      <div 
        onClick={() => setPaletteOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Palette Body */}
      <div className="glass-panel w-full max-w-xl rounded-xl border border-border relative z-10 flex flex-col overflow-hidden bg-surface/90 shadow-premium">
        
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg-secondary/40">
          <Terminal className="w-4 h-4 text-accent-primary" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search or run commands..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-text-primary text-xs placeholder-text-secondary"
          />
          <Search className="w-3.5 h-3.5 text-text-secondary" />
        </div>

        {/* Command list */}
        <div className="max-h-72 overflow-y-auto p-2 flex flex-col gap-0.5">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-text-secondary text-xs">
              No commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    cmd.action();
                    setPaletteOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-accent-primary text-white font-semibold shadow-premium-glow' 
                      : 'hover:bg-bg-primary text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="flex flex-col text-left gap-0.5">
                    <span className={`text-[11px] ${isSelected ? 'text-white' : 'text-text-primary'}`}>{cmd.name}</span>
                    <span className="text-[9px] opacity-75">{cmd.engName}</span>
                  </div>
                  {isSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="bg-bg-primary/45 border-t border-border px-4 py-2 flex items-center justify-between text-[8px] text-text-secondary">
          <span>Use <kbd className="font-mono text-[7px] bg-bg-secondary px-1 py-0.5 border border-white/10 rounded">↑↓</kbd> to navigate</span>
          <span>Press <kbd className="font-mono text-[7px] bg-bg-secondary px-1 py-0.5 border border-white/10 rounded">Enter</kbd> to select</span>
        </div>

      </div>
    </div>
  );
};
