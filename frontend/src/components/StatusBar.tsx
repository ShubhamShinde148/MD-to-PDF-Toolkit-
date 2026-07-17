import React, { useMemo } from 'react';
import { Sparkles, FileSignature } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const StatusBar: React.FC = () => {
  const { activeFile } = useWorkspaceStore();

  const metrics = useMemo(() => {
    if (!activeFile) return { words: 0, chars: 0, readTime: 0 };
    const text = activeFile.content.trim();
    const chars = text.length;
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const readTime = Math.ceil(words / 200); // 200 words per minute average reading speed
    return { words, chars, readTime };
  }, [activeFile]);

  if (!activeFile) return null;

  return (
    <footer className="h-6 bg-bg-secondary border-t border-border flex items-center justify-between px-4 text-[10px] text-text-secondary select-none relative z-40">
      
      {/* Left: Document Metrics */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <FileSignature className="w-3 h-3 text-accent-primary" />
          <span>Words: <strong className="text-text-primary">{metrics.words}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span>Characters: <strong className="text-text-primary">{metrics.chars}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span>Reading Time: <strong className="text-text-primary">{metrics.readTime} min</strong></span>
        </div>
      </div>

      {/* Middle: Status Alerts */}
      <div className="flex items-center gap-1 text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded">
        <Sparkles className="w-2.5 h-2.5 text-accent-primary animate-pulse" />
        <span>Autosave Active</span>
      </div>

      {/* Right: Layout Info */}
      <div className="flex items-center gap-4">
        <div>
          <span>Encoding: <strong className="text-text-primary">UTF-8</strong></span>
        </div>
        <div>
          <span>Format: <strong className="text-text-primary">Markdown</strong></span>
        </div>
        <div>
          <span>Zoom: <strong className="text-text-primary">100%</strong></span>
        </div>
      </div>

    </footer>
  );
};
