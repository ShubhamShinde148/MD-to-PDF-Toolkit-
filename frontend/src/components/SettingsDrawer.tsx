import React from 'react';
import { X, Sliders, Palette, FileSpreadsheet, RefreshCw, FileCode } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const SettingsDrawer: React.FC = () => {
  const {
    drawerOpen,
    setDrawerOpen,
    theme,
    setTheme,
    customCss,
    setCustomCss,
    exportSettings,
    updateExportSettings
  } = useWorkspaceStore();

  if (!drawerOpen) return null;

  const handleResetCss = () => {
    setCustomCss('');
  };

  const handleMarginChange = (idx: number, val: string) => {
    const nextMargins = [...exportSettings.margins] as [number, number, number, number];
    nextMargins[idx] = parseInt(val) || 0;
    updateExportSettings({ margins: nextMargins });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div 
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer Body */}
      <div className="w-80 h-full bg-surface border-l border-border relative z-10 flex flex-col shadow-premium animate-slide-left text-left">
        
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-bg-secondary">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <Sliders className="w-4 h-4 text-accent-primary" />
            <span>Workspace Settings</span>
          </div>
          <button 
            onClick={() => setDrawerOpen(false)}
            className="p-1 hover:bg-white/5 rounded-full text-text-secondary hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          
          {/* Section 1: UI Theme */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-extrabold text-text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5 text-accent-secondary" /> 1. Interface Style
            </h4>
            
            <div className="flex flex-col gap-2.5 pl-1.5">
              <div>
                <label className="text-[10px] text-text-secondary block mb-1">Theme Mode</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                  className="w-full bg-bg-primary border border-border rounded-lg text-xs text-text-primary p-2 outline-none focus:border-accent-primary"
                >
                  <option value="dark">Dark Mode</option>
                  <option value="light">Light Mode</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: PDF Settings */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-extrabold text-text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5 text-feedback-success" /> 2. PDF & Page Configuration
            </h4>

            <div className="flex flex-col gap-3 pl-1.5">
              <div>
                <label className="text-[10px] text-text-secondary block mb-1">Paper Size</label>
                <select
                  value={exportSettings.paperSize}
                  onChange={(e) => updateExportSettings({ paperSize: e.target.value as any })}
                  className="w-full bg-bg-primary border border-border rounded-lg text-xs text-text-primary p-2 outline-none focus:border-accent-primary"
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="Letter">Letter (8.5 × 11 in)</option>
                  <option value="Legal">Legal (8.5 × 14 in)</option>
                  <option value="A3">A3 (297 × 420 mm)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-text-secondary block mb-1">Margins (L, T, R, B)</label>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {[0, 1, 2, 3].map(idx => {
                    const labels = ['L', 'T', 'R', 'B'];
                    return (
                      <div key={idx} className="flex flex-col gap-0.5">
                        <input
                          type="number"
                          value={Math.abs(exportSettings.margins[idx])}
                          onChange={(e) => handleMarginChange(idx, e.target.value)}
                          className="w-full bg-bg-primary border border-border rounded-lg text-xs text-text-primary p-1 text-center outline-none focus:border-accent-primary"
                        />
                        <span className="text-[8px] text-text-secondary font-bold font-mono">{labels[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Watermark text */}
              <div>
                <label className="text-[10px] text-text-secondary block mb-1">Watermark Text</label>
                <input
                  type="text"
                  placeholder="e.g. CONFIDENTIAL"
                  value={exportSettings.watermark}
                  onChange={(e) => updateExportSettings({ watermark: e.target.value })}
                  className="w-full bg-bg-primary border border-border rounded-lg text-xs text-text-primary p-2 outline-none focus:border-accent-primary"
                />
              </div>

              {/* Page numbers & cover toggles */}
              <div className="flex flex-col gap-2 mt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-primary">
                  <input
                    type="checkbox"
                    checked={exportSettings.pageNumbers}
                    onChange={(e) => updateExportSettings({ pageNumbers: e.target.checked })}
                    className="accent-accent-primary rounded"
                  />
                  <span>Show Page Numbers</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-primary">
                  <input
                    type="checkbox"
                    checked={exportSettings.coverPage}
                    onChange={(e) => updateExportSettings({ coverPage: e.target.checked })}
                    className="accent-accent-primary rounded"
                  />
                  <span>Include Cover Page</span>
                </label>
              </div>

              {/* Conditional Cover options */}
              {exportSettings.coverPage && (
                <div className="p-3 bg-bg-primary/40 border border-border rounded-xl flex flex-col gap-2 mt-1">
                  <div>
                    <label className="text-[9px] text-text-secondary block mb-0.5">Cover Title</label>
                    <input
                      type="text"
                      value={exportSettings.coverTitle}
                      onChange={(e) => updateExportSettings({ coverTitle: e.target.value })}
                      className="w-full bg-bg-primary border border-border rounded-lg text-[11px] text-text-primary p-1.5 outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-text-secondary block mb-0.5">Cover Subtitle</label>
                    <input
                      type="text"
                      value={exportSettings.coverSubtitle}
                      onChange={(e) => updateExportSettings({ coverSubtitle: e.target.value })}
                      className="w-full bg-bg-primary border border-border rounded-lg text-[11px] text-text-primary p-1.5 outline-none focus:border-accent-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Custom CSS Editor */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-extrabold text-text-primary flex items-center justify-between uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><FileCode className="w-3.5 h-3.5 text-accent-primary" /> 3. Custom CSS</span>
              <button 
                onClick={handleResetCss}
                title="Reset CSS"
                className="p-1 hover:bg-white/5 rounded text-text-secondary hover:text-white"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </h4>

            <div className="pl-1.5">
              <textarea
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder="/* Add custom CSS styles here */"
                rows={5}
                className="w-full bg-bg-primary border border-border rounded-lg text-xs font-mono text-text-primary p-2.5 outline-none focus:border-accent-primary resize-y"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
