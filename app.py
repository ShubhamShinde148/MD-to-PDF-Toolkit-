import os
import re
import sys
import tempfile
from flask import Flask, request, jsonify, send_file, render_template_string, render_template
from markdown_pdf import MarkdownPdf, Section
from markdown_it import MarkdownIt
import fitz

app = Flask(
    __name__,
    static_folder="frontend/dist/assets",
    static_url_path="/assets",
    template_folder="frontend/dist"
)

# Base Directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "frontend", "dist")
STATIC_DIR = os.path.join(BASE_DIR, "frontend", "dist", "assets")

# Default Premium CSS Stylesheet for PDF & Exported HTML
DEFAULT_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Noto+Sans+Devanagari:wght@400;500;700&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600;700&family=Rozha+One&family=Yatra+One&display=swap');

/* Font Family Utilities */
.font-noto-sans-devanagari { font-family: 'Noto Sans Devanagari', sans-serif !important; }
.font-poppins { font-family: 'Poppins', sans-serif !important; }
.font-yatra-one { font-family: 'Yatra One', cursive !important; }
.font-rozha-one { font-family: 'Rozha One', serif !important; }
.font-nirmala { font-family: 'Nirmala UI', 'Mangal', sans-serif !important; }
.font-times { font-family: 'Times New Roman', Times, serif !important; }
.font-georgia { font-family: Georgia, serif !important; }
.font-calibri { font-family: Calibri, Candara, Segoe, sans-serif !important; }
.font-arial { font-family: Arial, Helvetica, sans-serif !important; }
.font-lora { font-family: 'Lora', serif !important; }
.font-merriweather { font-family: 'Merriweather', serif !important; }
.font-inter { font-family: 'Inter', sans-serif !important; }
.font-outfit { font-family: 'Outfit', sans-serif !important; }
.font-playfair { font-family: 'Playfair Display', serif !important; }
.font-fira-code { font-family: 'Fira Code', monospace !important; }

/* Page break utility */
.page-break {
    page-break-after: always;
    break-after: page;
}

/* Pygments Highlight Colors (Light Theme for PDF & Exported HTML) */
pre code .c, pre code .c1 { color: #64748b; font-style: italic; }
pre code .k, pre code .kc, pre code .kd, pre code .kp, pre code .kr, pre code .kt { color: #7c3aed; font-weight: bold; }
pre code .s, pre code .s1, pre code .s2, pre code .sb, pre code .sc, pre code .sd { color: #059669; }
pre code .nb, pre code .bp { color: #0284c7; }
pre code .nf, pre code .fm { color: #2563eb; }
pre code .m, pre code .mi, pre code .mf { color: #d97706; }
pre code .o, pre code .ow { color: #dc2626; }
pre code .nt { color: #2563eb; font-weight: bold; }
pre code .nd { color: #7c3aed; }

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.6;
    color: #1e293b;
    background-color: #ffffff;
    padding: 2em;
    max-width: 800px;
    margin: 0 auto;
}

h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    color: #0f172a;
    margin-top: 1.6em;
    margin-bottom: 0.6em;
    page-break-inside: avoid;
    page-break-after: avoid;
}

h1 {
    font-size: 22pt;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 0.3em;
    margin-top: 0.6em;
}

h2 {
    font-size: 16pt;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 0.25em;
}

h3 {
    font-size: 13pt;
}

p {
    margin-top: 0;
    margin-bottom: 1em;
}

a {
    color: #2563eb;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 9pt;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 0.15em 0.3em;
    border-radius: 4px;
}

pre {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 1em;
    overflow-x: auto;
    margin-top: 0;
    margin-bottom: 1.2em;
}

pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: 8.5pt;
    color: #334155;
}

blockquote {
    border-left: 4px solid #94a3b8;
    padding-left: 1em;
    margin-left: 0;
    margin-right: 0;
    color: #475569;
    font-style: italic;
    background-color: #f8fafc;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    margin-bottom: 1.2em;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 1.2em;
    margin-bottom: 1.2em;
    font-size: 9.5pt;
}

th, td {
    border: 1px solid #e2e8f0;
    padding: 0.6em 0.8em;
    text-align: left;
}

th {
    background-color: #f1f5f9;
    font-weight: 600;
    color: #0f172a;
}

tr:nth-child(even) {
    background-color: #f8fafc;
}

hr {
    border: 0;
    border-top: 1px solid #e2e8f0;
    margin: 2em 0;
}

ul, ol {
    margin-top: 0;
    margin-bottom: 1em;
    padding-left: 1.5em;
}

li {
    margin-bottom: 0.4em;
}

/* Alert styles matching GitHub-style alerts */
.alert {
    padding: 1em;
    margin-top: 0.8em;
    margin-bottom: 1.2em;
    border-left: 4px solid;
    border-radius: 0 6px 6px 0;
}

.alert p {
    margin-bottom: 0.6em;
}

.alert p:last-child {
    margin-bottom: 0;
}

.alert-title {
    margin-top: 0;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 9pt;
    letter-spacing: 0.05em;
}

.alert-note {
    background-color: #eff6ff;
    border-left-color: #1d4ed8;
    color: #1e3a8a;
}

.alert-tip {
    background-color: #f0fdf4;
    border-left-color: #15803d;
    color: #14532d;
}

.alert-important {
    background-color: #faf5ff;
    border-left-color: #7e22ce;
    color: #581c87;
}

.alert-warning {
    background-color: #fffbeb;
    border-left-color: #b45309;
    color: #78350f;
}

.alert-caution {
    background-color: #fef2f2;
    border-left-color: #b91c1c;
    color: #7f1d1d;
}
"""

def parse_alerts_in_html(html: str) -> str:
    """Post-process blockquotes to replace GitHub alert labels with HTML div styled containers."""
    bq_pattern = re.compile(r'<blockquote>(.*?)</blockquote>', re.DOTALL)
    
    def replace_bq(match):
        content = match.group(1)
        alert_match = re.match(
            r'^\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:\n|<br\s*/?>)?(.*)$',
            content,
            re.DOTALL | re.IGNORECASE
        )
        if alert_match:
            alert_type = alert_match.group(1).lower()
            rest_of_first_p = alert_match.group(2)
            
            emojis = {
                "note": "ℹ️",
                "tip": "💡",
                "important": "📢",
                "warning": "⚠️",
                "caution": "🚫"
            }
            emoji = emojis.get(alert_type, "ℹ️")
            title = f"{emoji} {alert_type.upper()}"
            first_p_content = rest_of_first_p.strip()
            
            if first_p_content:
                if first_p_content.startswith('</p>'):
                    rest = first_p_content[4:].lstrip()
                    inner_html = f'<p class="alert-title"><strong>{title}</strong></p>{rest}'
                else:
                    inner_html = f'<p class="alert-title"><strong>{title}</strong></p><p>{first_p_content}'
            else:
                inner_html = f'<p class="alert-title"><strong>{title}</strong></p>'
                
            return f'<div class="alert alert-{alert_type}">{inner_html}</div>'
        return match.group(0)
        
    return bq_pattern.sub(replace_bq, html)

def highlight_code(code, name, attrs):
    try:
        from pygments import highlight
        from pygments.lexers import get_lexer_by_name, TextLexer
        from pygments.formatters import HtmlFormatter
        try:
            lexer = get_lexer_by_name(name)
        except Exception:
            lexer = TextLexer()
        formatter = HtmlFormatter(nowrap=True)
        return highlight(code, lexer, formatter)
    except Exception:
        return ""

class CustomMarkdownPdf(MarkdownPdf):
    """Subclass of MarkdownPdf to post-process standard HTML rendering output for custom styling."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize markdown-it with the highlight option enabled
        self.m_d = MarkdownIt("commonmark", {"highlight": highlight_code}).enable('table')

    def add_section(self, section: Section, user_css: str = None) -> str:
        where = section.rect + section.borders
        raw_html = self.m_d.render(self.apply_plugins(section.text))
        html = parse_alerts_in_html(raw_html)
        
        story = fitz.Story(html=html, archive=section.root, user_css=user_css)
        more = 1
        while more:
            self.page_num += 1
            section.page_count += 1
            device = self.writer.begin_page(section.rect)
            more, _ = story.place(where)
            story.element_positions(self._recorder, {"toc": section.toc, "pdfile": self})
            story.draw(device)
            self.writer.end_page()

        self.sections.append(section)
        return html

    def save(self, file_name, watermark_text=None, has_cover_page=False, show_page_numbers=True):
        """Build and post-process PDF with headers, footers, page numbers and watermarks."""
        doc = self._make_doc()
        total_pages = len(doc)
        
        for idx in range(total_pages):
            page = doc[idx]
            is_cover = has_cover_page and (idx == 0)
            
            # 1. Draw Diagonal Watermark
            if watermark_text and watermark_text.strip():
                page.insert_text(
                    fitz.Point(120, 520),
                    watermark_text.strip().upper(),
                    fontsize=45,
                    color=(0.95, 0.95, 0.95),
                    rotate=45,
                    fill_opacity=0.3
                )
                
            # 2. Draw Header & Footer (Skip on Cover Page)
            if not is_cover:
                # Header
                page.insert_text(
                    fitz.Point(36, 24),
                    "MD CATALYST PRO — REPORT",
                    fontsize=7.5,
                    color=(0.5, 0.5, 0.5),
                    fontname="helv"
                )
                page.draw_line(fitz.Point(36, 28), fitz.Point(page.rect.width - 36, 28), color=(0.9, 0.9, 0.9), width=0.4)
                
                # Footer Line
                page.draw_line(fitz.Point(36, page.rect.height - 28), fitz.Point(page.rect.width - 36, page.rect.height - 28), color=(0.9, 0.9, 0.9), width=0.4)
                
                # Page Numbers
                if show_page_numbers:
                    footer_text = f"Page {idx + 1} of {total_pages}"
                    page.insert_text(
                        fitz.Point(page.rect.width - 90, page.rect.height - 18),
                        footer_text,
                        fontsize=7.5,
                        color=(0.5, 0.5, 0.5),
                        fontname="helv"
                    )
                
        # Save modified document
        if self.optimize:
            doc.ez_save(file_name)
        else:
            doc.save(file_name)
        doc.close()
        self.temp_files.clean()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/<path:path>")
def serve_root_files(path):
    dist_dir = os.path.join(BASE_DIR, "frontend", "dist")
    if os.path.exists(os.path.join(dist_dir, path)):
        return send_file(os.path.join(dist_dir, path))
    return jsonify({"error": "Not Found"}), 404

@app.route("/convert", methods=["POST"])
def convert():
    try:
        data = request.json or {}
        markdown_text = data.get("markdown", "")
        output_format = data.get("format", "pdf").lower()
        paper_size = data.get("paper", "A4")
        margins = data.get("margins", [36, 36, -36, -36])
        custom_css = data.get("css", "")
        
        # New options
        watermark = data.get("watermark", "")
        has_cover = data.get("cover", False)
        cover_title = data.get("cover_title", "Document Title")
        cover_subtitle = data.get("cover_subtitle", "")

        # Combine default CSS and user's custom CSS
        pdf_style = data.get("pdf_style", "colorful").lower()
        css_style = DEFAULT_CSS
        
        if pdf_style == "simple":
            css_style += """
/* Simple Mode Overrides (Grayscale & Flat styling) */
.alert-note, .alert-tip, .alert-important, .alert-warning, .alert-caution {
    background-color: #f8fafc !important;
    border-left-color: #475569 !important;
    color: #0f172a !important;
}
.alert-title {
    color: #0f172a !important;
}
pre code span {
    color: #0f172a !important;
    font-weight: normal !important;
    font-style: normal !important;
}
"""
        if custom_css.strip():
            css_style += "\n" + custom_css

        if output_format == "pdf":
            # PDF Generation
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
                temp_pdf_path = temp_pdf.name

            try:
                pdf = CustomMarkdownPdf(toc_level=3)
                
                # Prepend cover page if requested
                if has_cover:
                    cover_text = f"""
<div style="text-align: center; margin-top: 180pt; font-family: -apple-system, sans-serif;">
    <h1 style="font-size: 30pt; color: #0f172a; border: none; margin-bottom: 12pt; font-weight: 800; line-height: 1.2;">{cover_title}</h1>
    <p style="font-size: 13pt; color: #475569; margin-bottom: 50pt;">{cover_subtitle}</p>
    <div style="width: 70pt; height: 3pt; background: #3b82f6; margin: 0 auto 50pt auto;"></div>
    <p style="font-size: 9.5pt; color: #94a3b8; margin-bottom: 4pt; font-weight: bold;">MD CATALYST PRO</p>
    <p style="font-size: 9.5pt; color: #94a3b8;">Format: PDF Report</p>
</div>
<div class="page-break"></div>
"""
                    cover_section = Section(text=cover_text, paper_size=paper_size, borders=tuple(margins))
                    pdf.add_section(cover_section, user_css=css_style)
                
                # Add main content section
                section = Section(
                    text=markdown_text,
                    paper_size=paper_size,
                    borders=tuple(margins)
                )
                pdf.add_section(section, user_css=css_style)
                
                # Save with post-processing parameters
                pdf.save(temp_pdf_path, watermark_text=watermark, has_cover_page=has_cover, show_page_numbers=data.get("page_numbers", True))

                return send_file(
                    temp_pdf_path,
                    as_attachment=True,
                    download_name="document.pdf",
                    mimetype="application/pdf"
                )
            except Exception as e:
                if os.path.exists(temp_pdf_path):
                    os.unlink(temp_pdf_path)
                raise e

        elif output_format == "html":
            # HTML Generation (Self-contained file)
            # 1. Parse markdown
            pdf_dummy = CustomMarkdownPdf(toc_level=3)
            raw_html = pdf_dummy.m_d.render(markdown_text)
            parsed_html = parse_alerts_in_html(raw_html)

            # 2. Embed into document template with CSS
            full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Markdown Document</title>
    <style>
        {css_style}
    </style>
</head>
<body>
    {parsed_html}
</body>
</html>
"""
            with tempfile.NamedTemporaryFile(suffix=".html", delete=False, mode="w", encoding="utf-8") as temp_html:
                temp_html.write(full_html)
                temp_html_path = temp_html.name

            return send_file(
                temp_html_path,
                as_attachment=True,
                download_name="document.html",
                mimetype="text/html"
            )

        else:
            return jsonify({"error": "Unsupported output format"}), 400

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/pdf-to-html", methods=["POST"])
def pdf_to_html():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
            
        if not file.filename.lower().endswith(".pdf"):
            return jsonify({"error": "File must be a PDF"}), 400

        pdf_bytes = file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        pages_html = []
        for i, page in enumerate(doc):
            page_text_html = page.get_text("html")
            rect = page.rect
            w_pt = rect.width
            h_pt = rect.height
            
            wrapped_page = f'<div class="pdf-page" data-page="{i}" style="width:{w_pt}pt; height:{h_pt}pt; position:relative; background-color:#ffffff; margin:0 auto 1.5rem auto; box-shadow:0 8px 24px rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); overflow:hidden; border-radius:4px;">{page_text_html}</div>'
            pages_html.append(wrapped_page)
            
        doc.close()
        
        full_pages_html = "\n".join(pages_html)
        
        full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted PDF Document</title>
    <style>
        body {{
            background-color: #0f172a;
            color: #cbd5e1;
            margin: 0;
            padding: 2rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: system-ui, -apple-system, sans-serif;
        }}
        .pdf-page {{
            box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
        }}
    </style>
</head>
<body>
    {full_pages_html}
</body>
</html>
"""
        return jsonify({
            "html_preview": full_pages_html,
            "html_download": full_html
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting MDConverterApp Flask Server...")
    app.run(host="127.0.0.1", port=5000, debug=True)
