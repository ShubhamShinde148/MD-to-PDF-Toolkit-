import React from 'react';
import { FileText, Plus, Upload, Folder, Heart, Clock, Star, Layout } from 'lucide-react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

const TEMPLATES = [
  {
    name: 'Resume / CV Template',
    engName: 'Professional CV Format',
    desc: 'Professional single page layout for job applications.',
    content: `# 📄 Resume / CV

## Personal Details
* **Name:** John Doe
* **Address:** New York, NY
* **Email:** john.doe@example.com

## Education
* **B.S. in Computer Science** — State University (2024)
* **High School Diploma** — Local Academy (2020)

## Technical Skills
* React, Node.js, Python, Tailwind CSS
* SQL, Git Version Control
* English (Native), Spanish (Conversational)
`
  },
  {
    name: 'Monthly Project Report',
    engName: 'Project Progress Report',
    desc: 'Standard report layout for companies or project teams.',
    content: `# 📊 Project Progress Report

## 1. Introduction
This month, the first milestone of the development cycle has been successfully completed.

## 2. Key Achievements
* **UX/UI Redesign**: Implemented custom glassmorphic layout.
* **API Integration**: Linked React client store with backend conversion routes.

> [!NOTE]
> Database backups are scheduled and verified automatically every Sunday.

## 3. Next Milestones
1. Configure secure payment gateway.
2. Launch QA testing phase.
`
  },
  {
    name: 'Meeting Notes',
    engName: 'Meeting Agendas & Minutes',
    desc: 'Meeting minutes structure with agendas and action items.',
    content: `# 📝 Meeting Minutes

**Date:** July 17, 2026  
**Subject:** Product Launch Strategy  

## Attendees
* John (Project Lead)
* Sarah (Marketing Head)
* Alice (Lead Developer)

## Discussion Points
* The response to the new frontend design has been highly positive.
* Need to focus on performance optimizations during PDF compilation.

## Action Items
- [x] Alice: Integrate page numbers checkbox parameter in backend converter.
- [ ] Sarah: Draft social media launch announcements.
- [ ] John: Coordinate the next review meeting.
`
  },
  {
    name: 'Research Paper Abstract',
    engName: 'Academic Research Document',
    desc: 'Formal formatting template for research or assignments.',
    content: `# 🔬 Research Abstract

## 1. Introduction
This paper discusses the user satisfaction levels when interacting with glassmorphic user interfaces vs traditional solid themes.

## 2. Methodology
We conducted test sessions with 100+ users evaluating interfaces under varying conditions.

## 3. Results
\[\text{User Satisfaction} = \frac{\text{Glassmorphic Score}}{\text{Solid Theme Score}} \times 100\% = 145\%\]
`
  }
];

export const Dashboard: React.FC = () => {
  const { files, createFile, setActiveFile } = useWorkspaceStore();

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

  const loadTemplate = (tmpl: typeof TEMPLATES[0]) => {
    createFile(tmpl.name, tmpl.content);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 select-none relative">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-accent-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Good Evening
          </h2>
          <p className="text-text-secondary text-sm">Let's be productive! Select a template or write a new document.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-xs font-bold rounded-xl shadow-premium hover:shadow-premium-glow transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-4 h-4" /> New Document
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-border text-text-primary text-xs font-bold rounded-xl hover:bg-white/10 hover:border-slate-500 transition-all duration-300"
          >
            <Upload className="w-4 h-4" /> Import Markdown
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-5 rounded-2xl border border-border flex items-center justify-between">
          <div>
            <span className="text-text-secondary text-xs font-semibold block mb-1">Total Files</span>
            <span className="text-2xl font-bold text-text-primary">{files.length}</span>
          </div>
          <div className="p-3 bg-accent-primary/10 rounded-xl">
            <FileText className="w-6 h-6 text-accent-primary" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border flex items-center justify-between">
          <div>
            <span className="text-text-secondary text-xs font-semibold block mb-1">Favorites</span>
            <span className="text-2xl font-bold text-text-primary">{files.filter(f => f.isFavorite).length}</span>
          </div>
          <div className="p-3 bg-feedback-success/10 rounded-xl">
            <Heart className="w-6 h-6 text-feedback-success" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border flex items-center justify-between">
          <div>
            <span className="text-text-secondary text-xs font-semibold block mb-1">Storage</span>
            <span className="text-2xl font-bold text-text-primary">1.2 KB</span>
          </div>
          <div className="p-3 bg-feedback-warning/10 rounded-xl">
            <Folder className="w-6 h-6 text-feedback-warning" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Recent Files list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-primary" /> Recent Files
          </h3>
          
          <div className="glass-panel p-4 rounded-2xl border border-border flex flex-col gap-2 min-h-[250px]">
            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-text-secondary text-xs">
                No recent files found. Create a new document to start!
              </div>
            ) : (
              files.map(file => (
                <div
                  key={file.id}
                  onClick={() => setActiveFile(file)}
                  className="flex items-center justify-between p-3.5 bg-bg-secondary/40 border border-transparent hover:border-border hover:bg-bg-secondary rounded-xl cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-accent-secondary" />
                    <div>
                      <span className="text-text-primary text-xs font-semibold block">{file.name}</span>
                      <span className="text-[10px] text-text-secondary">{file.content.length} characters</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.isFavorite && <Star className="w-3.5 h-3.5 text-feedback-warning fill-feedback-warning" />}
                    <span className="text-[10px] text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-md">Markdown</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Pinned Templates gallery */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Layout className="w-5 h-5 text-accent-secondary" /> Templates Gallery
          </h3>
          
          <div className="grid grid-cols-1 gap-3.5">
            {TEMPLATES.map((tmpl, idx) => (
              <div
                key={idx}
                onClick={() => loadTemplate(tmpl)}
                className="glass-card p-4 rounded-2xl border border-border cursor-pointer flex flex-col gap-1 text-left relative overflow-hidden group"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-secondary/5 rounded-full blur-xl group-hover:bg-accent-secondary/15 transition-colors" />
                
                <span className="text-text-primary text-xs font-bold block">{tmpl.name}</span>
                <span className="text-[10px] text-text-secondary block mb-1">{tmpl.engName}</span>
                <p className="text-[11px] text-text-secondary leading-relaxed">{tmpl.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
