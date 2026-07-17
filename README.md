# 🚀 MD Catalyst Pro — Premium Markdown Studio & PDF Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-3-green.svg)](https://flask.palletsprojects.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan.svg)](https://tailwindcss.com/)

A world-class, premium Markdown Studio capable of writing, live previewing, converting, and exporting Markdown documents into beautifully styled, print-ready PDF and HTML documents. 

Designed with an elegant Obsidian + Figma inspired interface, **MD Catalyst Pro** provides professional document editing tools built for high-performance and absolute design control.

---

## ✨ Features

- **🎮 Split & Full-Screen Modes**: Work seamlessly using a layout pill switcher or panel maximize buttons. Instantly toggle between distraction-free writing, side-by-side editing, or full-screen print layouts.
- **📄 A4 Print View Simulation**: The Live Preview mimics a real A4 paper sheet with print margins and soft shadows (WYSIWYG layout).
- **🎨 Real-Time Syntax Highlighting**: Code blocks are parsed and highlighted in real time matching VS Code (Dark Mode) and GitHub (Light Mode) code styles using `highlight.js`.
- **✍️ Interactive Monaco Editor**: Equipped with VS Code's core editing engine, featuring bracket pair colorization, line numbers, word wraps, smart autocomplete, and a rich formatting toolbar.
- **💡 GitHub-Style Callout Alerts**: Full support for blockquote alerts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`) with custom icons and borders.
- **⚙️ Custom Style Injection**: Direct inline custom CSS styling injected dynamically into the document for custom font pairing and visual layouts.
- **📄 Professional PDF Export Options**: Prompts users to select between:
  - **Simple Style**: Minimalist grayscale layout designed for official reports and resumes.
  - **Premium Style**: Vibrant colorization, status-colored alert boxes, and syntax-highlighted code blocks.
  - *Additional options include customized margins, papers (A4, Letter), watermarks, and automated page numbers.*

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Monaco Editor, Zustand (State Management), Lucide Icons, Marked (Markdown Parser), Highlight.js (Code highlighting).
- **Backend**: Python 3, Flask, WeasyPrint (High-fidelity HTML-to-PDF rendering engine), Pygments.

---

## 📁 Repository Structure

```
MD-to-PDF-Toolkit-/
├── app.py                  # Flask backend server & PDF generation engine
├── LICENSE                 # MIT License file
├── README.md               # Main project documentation
├── static/                 # Flask compiled static files directory
├── templates/              # Flask main entry page templates
└── frontend/               # React SPA Frontend Project
    ├── src/
    │   ├── components/     # UI elements (Editor, Preview, Sidebar, modals)
    │   ├── store/          # Zustand workspace state management
    │   ├── App.tsx         # Root container
    │   ├── index.css       # Core design tokens and theme variables
    │   └── main.tsx
    ├── tailwind.config.js  # Theme configuration
    └── package.json
```

---

## 🚀 Installation & Running

### Prerequisites
- Python 3.9+
- Node.js 18+ & npm
- **WeasyPrint requirements**: WeasyPrint requires external library dependencies depending on your OS (e.g., GTK+ on Windows, Pango/Cairo on macOS). Please refer to the [WeasyPrint Documentation](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html) to install them.

### 1. Setup Backend (Flask)
From the root directory, create a virtual environment, activate it, and install python dependencies:

```bash
# Create Virtual Environment
python -m venv .venv

# Activate Virtual Environment (Windows)
.venv\Scripts\activate

# Activate Virtual Environment (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install Flask flask-cors weasyprint pygments
```

### 2. Setup Frontend (React)
Open a new terminal window inside the `frontend/` directory, install package dependencies, and build the asset bundles:

```bash
cd frontend

# Install package dependencies
npm install

# Build production asset bundles
npm run build
```

### 3. Run the Studio Application
Once the React frontend is successfully built, return to the root folder (with your python virtual environment active) and run the Flask application server:

```bash
# Return to root directory
cd ..

# Run Flask server
python app.py
```

Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser to start using MD Catalyst Pro!

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more details.
