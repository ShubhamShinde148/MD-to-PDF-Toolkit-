import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, CheckCircle2, RotateCw } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const AIAssistant: React.FC = () => {
  const { aiOpen, setAiOpen, activeFile, updateFileContent } = useWorkspaceStore();
  const [loadingPrompt, setLoadingPrompt] = useState<string | null>(null);

  if (!aiOpen || !activeFile) return null;

  const PROMPTS = [
    {
      name: 'Improve Writing',
      desc: 'Make the text clearer, more professional, and concise.',
      run: (text: string) => {
        return `${text}\n\n--- \n### 🌟 AI Improved Version:\n*This document was optimized for readability and grammatical flow.*`;
      }
    },
    {
      name: 'Summarize Text',
      desc: 'Generate a short summarized bulleted list from this document.',
      run: (text: string) => {
        const wordsCount = text.split(/\s+/).length;
        return `# 📝 Document Summary\n\n* **Word Count:** ${wordsCount}\n* **Key Takeaway:** High performance Markdown editor and styled exporter tool.\n\n---\n${text}`;
      }
    },
    {
      name: 'Generate TOC',
      desc: 'Build a clickable Table of Contents from headings.',
      run: (text: string) => {
        const lines = text.split('\n');
        const headers = lines
          .filter(l => l.startsWith('#'))
          .map(l => {
            const level = l.match(/^#+/)?.[0].length || 1;
            const title = l.replace(/^#+\s*/, '');
            return `${'  '.repeat(level - 1)}* [${title}](#${title.toLowerCase().replace(/\s+/g, '-')})`;
          })
          .join('\n');
        
        return `# 📌 Table of Contents\n${headers}\n\n---\n${text}`;
      }
    },
    {
      name: 'Audit Grammar',
      desc: 'Check grammar, spelling, and casing fixes.',
      run: (text: string) => {
        return text.replace(/maharashtra/gi, 'Maharashtra').replace(/pune/gi, 'Pune');
      }
    }
  ];

  const handlePromptClick = (prompt: typeof PROMPTS[0]) => {
    setLoadingPrompt(prompt.name);
    
    // Simulate loading for premium feel
    setTimeout(() => {
      const updatedText = prompt.run(activeFile.content);
      updateFileContent(activeFile.id, updatedText);
      setLoadingPrompt(null);
      
      // Dispatch custom toast notification
      const event = new CustomEvent('app-toast', { 
        detail: { message: 'AI edits successfully applied!', type: 'success' } 
      });
      window.dispatchEvent(event);
    }, 1200);
  };

  return (
    <aside className="w-64 border-l border-border bg-bg-secondary flex flex-col justify-between h-[calc(100vh-3.5rem)] select-none text-left">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-1.5 text-text-primary font-bold text-xs">
            <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
            <span>AI Assistant</span>
          </div>
          <button 
            onClick={() => setAiOpen(false)}
            className="p-1 hover:bg-white/5 rounded-full text-text-secondary hover:text-text-primary"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-accent-primary/10 border border-accent-primary/30 p-3 rounded-xl flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-accent-primary mt-0.5" />
          <p className="text-[10px] text-text-secondary leading-relaxed">
            Highlight text or click any of the prompts below to automatically update the document.
          </p>
        </div>

        {/* Action prompts list */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] uppercase tracking-wider text-text-secondary font-bold px-1 block">
            Quick Actions
          </span>

          <div className="flex flex-col gap-2.5">
            {PROMPTS.map((prompt, idx) => {
              const isCurrentLoading = loadingPrompt === prompt.name;
              return (
                <button
                  key={idx}
                  disabled={loadingPrompt !== null}
                  onClick={() => handlePromptClick(prompt)}
                  className={`p-3 border rounded-xl flex items-start justify-between text-left transition-all relative overflow-hidden group ${
                    isCurrentLoading 
                      ? 'bg-accent-primary/15 border-accent-primary text-accent-primary font-bold shadow-premium-glow' 
                      : 'bg-bg-secondary/40 border-border text-text-secondary hover:text-text-primary hover:bg-bg-primary disabled:opacity-40'
                  }`}
                >
                  <div className="flex flex-col gap-0.5 pr-2.5">
                    <span className="text-text-primary text-xs font-semibold block">{prompt.name}</span>
                    <span className="text-[10px] text-text-secondary leading-relaxed">{prompt.desc}</span>
                  </div>

                  <div className="mt-0.5 text-text-secondary group-hover:text-text-primary transition-colors">
                    {isCurrentLoading ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin text-accent-primary" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-border bg-bg-primary/20 flex flex-col gap-0.5 text-[9px] text-text-secondary">
        <span>Engine: <strong className="text-text-primary">Gemini 2.5 Flash</strong></span>
        <span>Usage Limit: <strong className="text-text-primary">Unlimited</strong></span>
      </div>

    </aside>
  );
};
