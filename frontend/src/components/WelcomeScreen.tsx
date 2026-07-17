import React from 'react';
import { FilePlus, Upload, BookOpen, Compass } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const WelcomeScreen: React.FC = () => {
  const { setCurrentMode, createFile } = useWorkspaceStore();

  const handleCreateNew = () => {
    createFile('Untitled.md');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          createFile(file.name, content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 select-none relative overflow-hidden h-full w-full">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-primary opacity-[0.06] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[300px] h-[300px] bg-accent-secondary opacity-[0.04] rounded-full blur-[60px] pointer-events-none" />

      {/* Main Container */}
      <div className="glass-panel p-10 rounded-premium max-w-2xl w-full border border-border flex flex-col items-center gap-6 relative z-10">
        
        {/* Logo Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center shadow-premium-glow animate-pulse">
          <Compass className="w-9 h-9 text-white" />
        </div>

        {/* Hero Header */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary mb-2">
            MD Catalyst Pro
          </h1>
          <p className="text-text-secondary text-sm font-medium">
            Professional Markdown Studio • Write Once, Export Anywhere
          </p>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-2 gap-3 w-full my-2">
          <div className="bg-bg-secondary/60 border border-border p-3 rounded-xl text-left">
            <span className="text-text-primary text-xs font-semibold block mb-0.5">🚀 Ultimate Speed</span>
            <span className="text-text-secondary text-[11px]">Instant parsing and live scrolling preview.</span>
          </div>
          <div className="bg-bg-secondary/60 border border-border p-3 rounded-xl text-left">
            <span className="text-text-primary text-xs font-semibold block mb-0.5">📂 Premium Export</span>
            <span className="text-text-secondary text-[11px]">Download as custom styled PDF, HTML, or DOCX.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-4">
          <button
            onClick={handleCreateNew}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-accent-primary/20 to-accent-primary/5 hover:from-accent-primary/30 hover:to-accent-primary/10 border border-accent-primary/30 hover:border-accent-primary/60 text-text-primary transition-all duration-300 transform hover:-translate-y-1 shadow-premium group"
          >
            <FilePlus className="w-7 h-7 mb-3 text-accent-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">New Document</span>
            <span className="text-[10px] text-text-secondary mt-1">Create Document</span>
          </button>

          <button
            onClick={handleImport}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-accent-secondary/20 to-accent-secondary/5 hover:from-accent-secondary/30 hover:to-accent-secondary/10 border border-accent-secondary/30 hover:border-accent-secondary/60 text-text-primary transition-all duration-300 transform hover:-translate-y-1 shadow-premium group"
          >
            <Upload className="w-7 h-7 mb-3 text-accent-secondary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Import File</span>
            <span className="text-[10px] text-text-secondary mt-1">Import Markdown</span>
          </button>

          <button
            onClick={() => setCurrentMode('dashboard')}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-bg-secondary/60 hover:bg-bg-secondary border border-border hover:border-slate-500 text-text-primary transition-all duration-300 transform hover:-translate-y-1 shadow-premium group"
          >
            <BookOpen className="w-7 h-7 mb-3 text-text-secondary group-hover:text-text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Open Dashboard</span>
            <span className="text-[10px] text-text-secondary mt-1">Go to Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
