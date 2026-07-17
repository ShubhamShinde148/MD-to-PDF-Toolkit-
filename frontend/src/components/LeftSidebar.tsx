import React, { useState } from 'react';
import { 
  Folder, FileText, ChevronDown, ChevronRight, Plus, 
  Trash2, Star 
} from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const LeftSidebar: React.FC = () => {
  const { 
    files, 
    folders, 
    activeFile, 
    setActiveFile, 
    createFile, 
    deleteFile, 
    toggleFavorite 
  } = useWorkspaceStore();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    f1: true,
    f2: false
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateInFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    createFile('New_Document.md', '', folderId);
  };

  return (
    <aside className="w-60 border-r border-border bg-bg-secondary flex flex-col justify-between h-[calc(100vh-3.5rem)] select-none text-left">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        
        {/* Section 1: File Explorer */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold px-1.5 block">
            File Explorer
          </span>

          <div className="flex flex-col gap-1.5">
            {folders.map(folder => {
              const isExpanded = expandedFolders[folder.id];
              const folderFiles = files.filter(f => f.folderId === folder.id);

              return (
                <div key={folder.id} className="flex flex-col">
                  {/* Folder Row */}
                  <div
                    onClick={() => toggleFolder(folder.id)}
                    className="flex items-center justify-between p-1.5 hover:bg-bg-primary rounded-lg cursor-pointer text-text-secondary hover:text-text-primary transition-all group"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <Folder className="w-3.5 h-3.5 text-accent-primary" />
                      <span className="text-text-primary">{folder.name}</span>
                    </div>
                    <button
                      onClick={(e) => handleCreateInFolder(folder.id, e)}
                      title="Create File"
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded transition-all text-text-secondary hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Folder Files List */}
                  {isExpanded && (
                    <div className="flex flex-col gap-0.5 pl-5 mt-0.5 border-l border-white/5 ml-3">
                      {folderFiles.length === 0 ? (
                        <span className="text-[10px] text-text-secondary py-1 pl-2 italic">Folder is empty</span>
                      ) : (
                        folderFiles.map(file => {
                          const isActive = activeFile?.id === file.id;
                          return (
                            <div
                              key={file.id}
                              onClick={() => setActiveFile(file)}
                              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer text-xs transition-all group ${
                                isActive ? 'bg-accent-primary/15 text-accent-primary font-bold border-l-2 border-accent-primary' : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-3.5 h-3.5 text-text-secondary" />
                                <span className="truncate">{file.name}</span>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(file.id);
                                  }}
                                  className="p-0.5 hover:bg-white/10 rounded text-text-secondary hover:text-feedback-warning"
                                >
                                  <Star className={`w-3 h-3 ${file.isFavorite ? 'fill-feedback-warning text-feedback-warning' : ''}`} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFile(file.id);
                                  }}
                                  className="p-0.5 hover:bg-white/10 rounded text-text-secondary hover:text-feedback-danger"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Favorite Documents */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wider text-text-secondary font-bold px-1.5 block">
            Favorites
          </span>
          <div className="flex flex-col gap-1">
            {files.filter(f => f.isFavorite).length === 0 ? (
              <span className="text-[10px] text-text-secondary px-1.5 italic">Starred files will appear here.</span>
            ) : (
              files.filter(f => f.isFavorite).map(file => (
                <div
                  key={file.id}
                  onClick={() => setActiveFile(file)}
                  className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg cursor-pointer text-xs text-text-secondary hover:text-white transition-all"
                >
                  <Star className="w-3.5 h-3.5 text-feedback-warning fill-feedback-warning" />
                  <span className="truncate">{file.name}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-border bg-bg-primary/20 flex flex-col gap-1 select-none">
        <div className="flex items-center justify-between text-[10px] text-text-secondary">
          <span>Sync Status</span>
          <span className="text-feedback-success flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 bg-feedback-success rounded-full animate-ping" />
            Connected
          </span>
        </div>
      </div>
    </aside>
  );
};
