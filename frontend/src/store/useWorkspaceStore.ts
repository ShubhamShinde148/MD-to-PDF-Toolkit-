import { create } from 'zustand';

export interface FileItem {
  id: string;
  name: string;
  content: string;
  folderId?: string;
  isFavorite?: boolean;
}

export interface FolderItem {
  id: string;
  name: string;
}

export interface ExportSettings {
  format: 'pdf' | 'html' | 'docx' | 'rtf' | 'markdown' | 'png' | 'jpg' | 'epub';
  paperSize: 'A4' | 'Letter' | 'Legal' | 'A3' | 'A5';
  margins: [number, number, number, number]; // Left, Top, Right, Bottom
  fontFamily: string;
  coverPage: boolean;
  coverTitle: string;
  coverSubtitle: string;
  watermark: string;
  pageNumbers: boolean;
  pdfStyle: 'colorful' | 'simple';
}

interface WorkspaceState {
  // Navigation & view states
  currentMode: 'welcome' | 'dashboard' | 'editor';
  workspaceLayout: 'split' | 'editor' | 'preview';
  activeFile: FileItem | null;
  openFiles: FileItem[];
  folders: FolderItem[];
  files: FileItem[];
  recentExports: string[];
  
  // Floating panel / drawer states
  drawerOpen: boolean;
  paletteOpen: boolean;
  searchOpen: boolean;
  aiOpen: boolean;
  exportModalOpen: boolean;
  
  // App preferences
  theme: 'dark' | 'light';
  language: 'mix' | 'marathi' | 'eng';
  customCss: string;
  
  // Settings & Layout configurations
  exportSettings: ExportSettings;
  
  // Operations & Actions
  setCurrentMode: (mode: 'welcome' | 'dashboard' | 'editor') => void;
  setWorkspaceLayout: (layout: 'split' | 'editor' | 'preview') => void;
  setActiveFile: (file: FileItem | null) => void;
  createFile: (name: string, content?: string, folderId?: string) => FileItem;
  updateFileContent: (fileId: string, content: string) => void;
  deleteFile: (fileId: string) => void;
  toggleFavorite: (fileId: string) => void;
  
  // Toggle triggers
  setDrawerOpen: (open: boolean) => void;
  setPaletteOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setAiOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setLanguage: (lang: 'mix' | 'marathi' | 'eng') => void;
  setCustomCss: (css: string) => void;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
}

const INITIAL_MARKDOWN = `# 🚀 Welcome to MD Catalyst Pro

Start writing your markdown documents with premium styling, live preview, and high-performance export options.

## Features:
* **Obsidian + Figma Style UI**: Expensively designed glassmorphic theme.
* **Monaco Editor**: Professional editing experience (bracket matching, spell check, line numbers).
* **Slide-over Settings Drawer**: All layout options in one sleek drawer.
* **Command Palette**: Access settings and switch styles with \`Ctrl + Shift + P\`.
* **Floating AI Assistant**: Generate summaries, grammar audits, or Table of Contents.

> [!NOTE]
> This is a note callout block. It has a beautiful colored left border and background accent.

> [!TIP]
> Try toggling between **Dark Mode** and **Light Mode** using the sun/moon icon at the top navbar.
`;

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  currentMode: 'welcome',
  workspaceLayout: 'split',
  activeFile: null,
  openFiles: [],
  folders: [
    { id: 'f1', name: 'Markdown Files' },
    { id: 'f2', name: 'Templates' }
  ],
  files: [
    { id: 'd1', name: 'Getting Started.md', content: INITIAL_MARKDOWN, folderId: 'f1', isFavorite: true }
  ],
  recentExports: ['Overview.pdf', 'Resume.pdf', 'Monthly_Report.html'],
  
  drawerOpen: false,
  paletteOpen: false,
  searchOpen: false,
  aiOpen: false,
  exportModalOpen: false,
  
  theme: 'light',
  language: 'mix',
  customCss: '',
  
  exportSettings: {
    format: 'pdf',
    paperSize: 'A4',
    margins: [36, 36, -36, -36],
    fontFamily: 'Inter',
    coverPage: false,
    coverTitle: 'Document Title',
    coverSubtitle: 'Generated Report',
    watermark: '',
    pageNumbers: true,
    pdfStyle: 'colorful'
  },
  
  setCurrentMode: (mode) => set({ currentMode: mode }),
  setWorkspaceLayout: (layout) => set({ workspaceLayout: layout }),
  
  setActiveFile: (file) => {
    set({ activeFile: file });
    if (file) {
      set({ currentMode: 'editor' });
      // Add to open files if not exists
      const openFiles = get().openFiles;
      if (!openFiles.some(f => f.id === file.id)) {
        set({ openFiles: [...openFiles, file] });
      }
    }
  },
  
  createFile: (name, content = '', folderId = 'f1') => {
    const newFile: FileItem = {
      id: `d_${Date.now()}`,
      name: name.endsWith('.md') ? name : `${name}.md`,
      content,
      folderId
    };
    set((state) => ({
      files: [...state.files, newFile],
      activeFile: newFile,
      currentMode: 'editor'
    }));
    return newFile;
  },
  
  updateFileContent: (fileId, content) => {
    set((state) => {
      const updatedFiles = state.files.map(f => f.id === fileId ? { ...f, content } : f);
      const activeFile = state.activeFile && state.activeFile.id === fileId ? { ...state.activeFile, content } : state.activeFile;
      return { files: updatedFiles, activeFile };
    });
  },
  
  deleteFile: (fileId) => {
    set((state) => {
      const updatedFiles = state.files.filter(f => f.id !== fileId);
      const activeFile = state.activeFile && state.activeFile.id === fileId ? null : state.activeFile;
      const currentMode = activeFile ? state.currentMode : 'welcome';
      return { files: updatedFiles, activeFile, currentMode };
    });
  },
  
  toggleFavorite: (fileId) => {
    set((state) => ({
      files: state.files.map(f => f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f)
    }));
  },
  
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setPaletteOpen: (open) => set({ paletteOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setAiOpen: (open) => set({ aiOpen: open }),
  setExportModalOpen: (open) => set({ exportModalOpen: open }),
  
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setCustomCss: (customCss) => set({ customCss }),
  
  updateExportSettings: (settings) => set((state) => ({
    exportSettings: { ...state.exportSettings, ...settings }
  }))
}));
