import React, { useMemo, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { Eye, Maximize2, Minimize2 } from 'lucide-react';
import hljs from 'highlight.js';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const LivePreview: React.FC = () => {
  const { activeFile, customCss, workspaceLayout, setWorkspaceLayout } = useWorkspaceStore();
  const previewRef = useRef<HTMLDivElement>(null);

  if (!activeFile) return null;

  // Custom Github-style Alerts post processing
  const renderedHtml = useMemo(() => {
    const rawHtml = marked(activeFile.content) as string;
    
    try {
      // Find alert patterns: > [!NOTE] etc.
      // Marked renders blockquotes as <blockquote>\n<p>[!NOTE]...\n</p></blockquote>
      const alertRegex = /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]([\s\S]*?)<\/p>\s*<\/blockquote>/gi;
      
      return rawHtml.replace(alertRegex, (_, type, content) => {
        const lowerType = type.toLowerCase();
        let icon = '📢';
        if (lowerType === 'note') icon = 'ℹ️';
        else if (lowerType === 'tip') icon = '💡';
        else if (lowerType === 'important') icon = '💜';
        else if (lowerType === 'warning') icon = '⚠️';
        else if (lowerType === 'caution') icon = '🚫';

        return `
          <div class="alert alert-${lowerType}">
            <div class="alert-title">
              <span>${icon}</span>
              <span>${type}</span>
            </div>
            <div class="alert-content">${content.trim()}</div>
          </div>
        `;
      });
    } catch (e) {
      console.error(e);
      return rawHtml;
    }
  }, [activeFile.content]);

  useEffect(() => {
    if (previewRef.current) {
      const blocks = previewRef.current.querySelectorAll('pre code');
      console.log('[LivePreview] Found pre code blocks:', blocks.length);
      blocks.forEach((block, idx) => {
        console.log(`[LivePreview] Block ${idx} class:`, block.className);
        block.removeAttribute('data-highlighted');
        try {
          hljs.highlightElement(block as HTMLElement);
          console.log(`[LivePreview] Block ${idx} highlighted successfully. InnerHTML length:`, block.innerHTML.length);
        } catch (e) {
          console.error(`[LivePreview] Error highlighting block ${idx}:`, e);
        }
      });
    }
  }, [activeFile?.content, renderedHtml]);

  return (
    <div className="flex-1 border-l border-border bg-bg-secondary flex flex-col h-full select-none text-left">
      
      {/* Pane Header */}
      <div className="h-10 border-b border-border bg-bg-secondary/40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-accent-secondary" />
          <span className="text-xs font-bold text-text-primary tracking-tight">Live Preview</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-text-secondary">
          <span>Auto Sync Active</span>
          <button
            onClick={() => setWorkspaceLayout(workspaceLayout === 'preview' ? 'split' : 'preview')}
            title={workspaceLayout === 'preview' ? "Restore Split View" : "Maximize Preview (Full Screen)"}
            className="p-1.5 hover:bg-bg-primary border border-transparent hover:border-border rounded-lg text-text-secondary hover:text-text-primary transition-all flex items-center justify-center"
          >
            {workspaceLayout === 'preview' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Styled Render Content */}
      <div ref={previewRef} className="flex-1 overflow-y-auto p-8 bg-bg-primary flex justify-center relative">
        {/* Inject live custom CSS styling */}
        {customCss.trim() && (
          <style dangerouslySetInnerHTML={{ __html: customCss }} />
        )}

        {/* Realistic Page Sheet Card (Print Layout representation) */}
        <div className="w-full max-w-[820px] min-h-[1160px] bg-surface border border-border rounded-xl shadow-premium p-12 text-left relative transition-all duration-300">
          <div 
            className="preview-body markdown-body"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      </div>

    </div>
  );
};
