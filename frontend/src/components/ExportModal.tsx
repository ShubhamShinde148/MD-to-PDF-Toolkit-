import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, Loader2, Palette, FileText, Globe, FileCode } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const ExportModal: React.FC = () => {
  const {
    exportModalOpen,
    setExportModalOpen,
    activeFile,
    customCss,
    exportSettings,
    updateExportSettings
  } = useWorkspaceStore();

  const [pdfStyle, setPdfStyle] = useState<'colorful' | 'simple'>('colorful');
  const [statusStep, setStatusStep] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(false);

  if (!exportModalOpen || !activeFile) return null;

  const steps = [
    'Gathering document elements...',
    'Rendering markdown parser...',
    'Injecting fonts & stylesheets...',
    'Compressing and final packaging...',
    'Export Complete!'
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setShowProgress(true);
    setStatusStep(0);

    // Simulate progress bar increments
    const interval = setInterval(() => {
      setStatusStep(prev => {
        if (prev < 3) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 900);

    try {
      const response = await fetch('/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          markdown: activeFile.content,
          format: exportSettings.format,
          paper: exportSettings.paperSize,
          margins: exportSettings.margins,
          css: customCss,
          cover: exportSettings.coverPage,
          cover_title: exportSettings.coverTitle,
          cover_subtitle: exportSettings.coverSubtitle,
          watermark: exportSettings.watermark,
          page_numbers: exportSettings.pageNumbers,
          pdf_style: pdfStyle
        })
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document_${Date.now()}.${exportSettings.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatusStep(4);
      setTimeout(() => {
        setIsExporting(false);
        setShowProgress(false);
        setExportModalOpen(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setIsExporting(false);
      setShowProgress(false);
      alert('Export failed. Please check connection and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div 
        onClick={() => !isExporting && setExportModalOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Modal Container */}
      <div className="glass-panel p-6 rounded-premium border border-border w-full max-w-lg relative z-10 text-left bg-surface/90 shadow-premium flex flex-col gap-6 animate-zoom">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3.5">
          <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent-primary" />
            <span>Export Document</span>
          </h3>
          <button 
            disabled={isExporting}
            onClick={() => setExportModalOpen(false)}
            className="p-1 hover:bg-white/5 rounded-full text-text-secondary hover:text-text-primary disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Inner Body */}
        {!showProgress ? (
          <div className="flex flex-col gap-5">
            {/* Format choice */}
            <div>
              <label className="text-[11px] text-text-secondary block mb-1.5 font-bold">Export Format</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'pdf', name: 'PDF Document', icon: FileText },
                  { id: 'html', name: 'Web HTML', icon: Globe },
                  { id: 'docx', name: 'MS Word', icon: FileCode },
                  { id: 'markdown', name: 'Markdown', icon: FileText }
                ].map(item => {
                  const isActive = exportSettings.format === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => updateExportSettings({ format: item.id as any })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold text-center ${
                        isActive 
                          ? 'bg-accent-primary/20 border-accent-primary text-text-primary shadow-premium-glow' 
                          : 'bg-bg-secondary/40 border-border text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional Style Choice for PDF */}
            {exportSettings.format === 'pdf' && (
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-text-secondary block font-bold">Select PDF Layout Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setPdfStyle('simple')}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      pdfStyle === 'simple'
                        ? 'bg-accent-secondary/10 border-accent-secondary text-text-primary shadow-premium-glow'
                        : 'bg-bg-secondary/20 border-border text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="p-2 bg-slate-500/10 rounded-lg text-slate-400 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">Simple (Grayscale)</h4>
                      <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">Formal grayscale layout suitable for official records and resumes.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPdfStyle('colorful')}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      pdfStyle === 'colorful'
                        ? 'bg-accent-primary/10 border-accent-primary text-text-primary shadow-premium-glow'
                        : 'bg-bg-secondary/20 border-border text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary mt-0.5">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-accent-primary">Premium (Colorful)</h4>
                      <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">Designed layout featuring highlight callouts and colorful code blocks.</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Confirm button */}
            <button
              onClick={handleExport}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-xs font-bold flex items-center justify-center gap-2 hover:shadow-premium-glow transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Download Exported File</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Premium Progress Dialog */
          <div className="flex flex-col items-center justify-center p-8 gap-5 text-center">
            {statusStep < 4 ? (
              <Loader2 className="w-10 h-10 text-accent-primary animate-spin" />
            ) : (
              <CheckCircle className="w-10 h-10 text-feedback-success animate-bounce" />
            )}

            <div>
              <h4 className="text-sm font-bold text-text-primary mb-1.5">{steps[statusStep]}</h4>
              <p className="text-[10px] text-text-secondary">Please wait while we package your document...</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-bg-primary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-300"
                style={{ width: `${((statusStep + 1) / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
