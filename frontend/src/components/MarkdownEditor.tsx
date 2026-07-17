import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Bold, Italic, Heading, Quote, Code, Terminal, 
  Link, Table, ListTodo, Sigma, GitBranch, 
  Minus, Sparkles, Maximize2, Minimize2 
} from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const MarkdownEditor: React.FC = () => {
  const { activeFile, updateFileContent, aiOpen, setAiOpen, workspaceLayout, setWorkspaceLayout } = useWorkspaceStore();
  const editorRef = useRef<any>(null);

  if (!activeFile) return null;

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFileContent(activeFile.id, value);
    }
  };

  const insertMarkdown = (syntax: string) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const selection = editor.getSelection();
    const model = editor.getModel();
    const selectedText = model.getValueInRange(selection);

    let replacement = '';
    switch (syntax) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        replacement = `### ${selectedText || 'Heading'}`;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'Blockquote'}`;
        break;
      case 'code':
        replacement = `\`${selectedText || 'code'}\``;
        break;
      case 'codeblock':
        replacement = `\n\`\`\`javascript\n${selectedText || '// code here'}\n\`\`\`\n`;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'table':
        replacement = `\n| Column 1 | Column 2 |\n|----------|----------|\n| Data     | Data     |\n`;
        break;
      case 'checklist':
        replacement = `- [ ] ${selectedText || 'Task item'}`;
        break;
      case 'math':
        replacement = `\n\\[\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}\\]\n`;
        break;
      case 'mermaid':
        replacement = `\n\`\`\`mermaid\ngraph TD\n    A[Start] --> B(Process)\n    B --> C{Decision}\n    C -->|Yes| D[Success]\n    C -->|No| E[End]\n\`\`\`\n`;
        break;
      case 'hr':
        replacement = `\n---\n`;
        break;
      default:
        return;
    }

    const range = {
      startLineNumber: selection.startLineNumber,
      startColumn: selection.startColumn,
      endLineNumber: selection.endLineNumber,
      endColumn: selection.endColumn
    };

    editor.executeEdits('markdown-toolbar', [
      {
        range,
        text: replacement,
        forceMoveMarkers: true
      }
    ]);
    editor.focus();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-primary select-none">
      
      {/* Editor Toolbar */}
      <div className="h-10 border-b border-border bg-bg-secondary/40 flex items-center justify-between px-3">
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => insertMarkdown('bold')}
            title="Bold"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertMarkdown('italic')}
            title="Italic"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertMarkdown('heading')}
            title="Heading"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Heading className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={() => insertMarkdown('quote')}
            title="Blockquote"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertMarkdown('code')}
            title="Inline Code"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertMarkdown('codeblock')}
            title="Code Block"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={() => insertMarkdown('link')}
            title="Add Link"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Link className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertMarkdown('table')}
            title="Insert Table"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertMarkdown('checklist')}
            title="Checklist"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <ListTodo className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            onClick={() => insertMarkdown('math')}
            title="LaTeX Math"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Sigma className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertMarkdown('mermaid')}
            title="Mermaid Diagram"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <GitBranch className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertMarkdown('hr')}
            title="Horizontal Rule"
            className="p-1.5 hover:bg-white/5 border border-transparent hover:border-white/5 rounded-md text-text-secondary hover:text-white transition-all"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          {/* AI helper toggle */}
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] rounded-lg border transition-all ${
              aiOpen 
                ? 'bg-accent-primary/20 border-accent-primary text-text-primary shadow-premium-glow' 
                : 'bg-bg-secondary border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Sparkles className="w-3 h-3 text-accent-primary animate-pulse" />
            <span>AI Assistant</span>
          </button>

          {/* Maximize Editor Toggle */}
          <button
            onClick={() => setWorkspaceLayout(workspaceLayout === 'editor' ? 'split' : 'editor')}
            title={workspaceLayout === 'editor' ? "Restore Split View" : "Maximize Editor (Full Screen)"}
            className="p-1.5 bg-bg-secondary border border-border hover:border-slate-500 rounded-lg text-text-secondary hover:text-text-primary transition-all flex items-center justify-center"
          >
            {workspaceLayout === 'editor' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body (Monaco) */}
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          theme="vs-dark"
          value={activeFile.content}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Courier New', monospace",
            lineNumbers: 'on',
            wordWrap: 'on',
            minimap: { enabled: false },
            automaticLayout: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6
            },
            padding: { top: 12 },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderLineHighlight: 'all',
            bracketPairColorization: { enabled: true },
            quickSuggestions: false
          }}
        />
      </div>

    </div>
  );
};
