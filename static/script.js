/* =====================================================================
   MD Catalyst Pro — Frontend Script logic (Production-Ready)
   ===================================================================== */

const DEFAULT_MARKDOWN = `# 🚀 MD Catalyst Pro मध्ये आपले स्वागत आहे!

हा एक **प्रिमियम** आणि **प्रोफेशनल** Markdown रुपांतरण टूल आहे.

---

## 🛠️ मुख्य वैशिष्ट्ये
- **Devanagari (मराठी) फॉन्ट सपोर्ट**: सुंदर आणि स्पष्ट अक्षर जुळणी.
- **लाईव्ह प्रिव्ह्यू**: बदल क्षणात समोर पहा.
- **ॲडव्हान्स पीडीएफ**: प्रोफेशनल मांडणीसह मार्जिन सेटिंग.

---

## 💡 सूचना बॉक्सेस (Alert Callouts)

> [!NOTE]
> **टीप:** हे एक नेहमीचे माहिती देणारे सदर आहे.

> [!TIP]
> **यशस्वी संदेश:** हे काम यशस्वीरित्या पूर्ण झाले आहे!

> [!IMPORTANT]
> **महत्त्वाचे:** ही माहिती खूप महत्त्वाची आहे.

> [!WARNING]
> **इशारा:** कृपया पुढे जाण्यापूर्वी नियम वाचा.

> [!CAUTION]
> **धोका:** ही कृती पूर्ववत करता येणार नाही!

---

## 📊 कोष्टक (Table) चे उदाहरण

| आयटम | श्रेणी | स्थिती |
| :--- | :--- | :--- |
| **PDF Converter** | Backend | 🟢 कार्यरत |
| **HTML Export** | Frontend | 🟢 कार्यरत |
| **Custom Styling** | CSS | 🟡 टेस्टिंग |

---

## 💻 कोड ब्लॉक (Code Block)

\`\`\`python
# पायथन कोड उदाहरण
def calculate_margin(base, factor):
    return base * factor + 10
\`\`\`
`;

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const markdownInput = document.getElementById("markdown-input");
    const previewOutput = document.getElementById("preview-output");
    const tabWrite = document.getElementById("tab-write");
    const tabUpload = document.getElementById("tab-upload");
    const writeContent = document.getElementById("write-content");
    const uploadContent = document.getElementById("upload-content");
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const browseBtn = document.getElementById("browse-btn");
    const convertBtn = document.getElementById("convert-btn");
    const exportFormat = document.getElementById("export-format");
    const paperSize = document.getElementById("paper-size");
    const fontSelect = document.getElementById("font-family-select");
    const toggleCssBtn = document.getElementById("toggle-css-btn");
    const cssContainer = document.getElementById("css-container");
    const customCssInput = document.getElementById("custom-css-input");
    const clearBtn = document.getElementById("clear-btn");
    
    // Margin elements
    const marginLeft = document.getElementById("margin-left");
    const marginTop = document.getElementById("margin-top");
    const marginRight = document.getElementById("margin-right");
    const marginBottom = document.getElementById("margin-bottom");
    
    // Toast element
    const toast = document.getElementById("toast");

    // Cover Page & Watermark Selectors
    const coverPageToggle = document.getElementById("cover-page-toggle");
    const pageNumbersToggle = document.getElementById("page-numbers-toggle");
    const coverTitleContainer = document.getElementById("cover-title-container");
    const coverSubtitleContainer = document.getElementById("cover-subtitle-container");
    const coverTitleInput = document.getElementById("cover-title-input");
    const coverSubtitleInput = document.getElementById("cover-subtitle-input");
    const watermarkInputField = document.getElementById("watermark-input-field");
    const pdfExtraSettings = document.querySelector(".pdf-extra-settings");

    // Style modal Selectors
    const styleModal = document.getElementById("style-modal");
    const closeStyleModal = document.getElementById("close-style-modal");
    const optSimplePdf = document.getElementById("opt-simple-pdf");
    const optColorfulPdf = document.getElementById("opt-colorful-pdf");

    // Additional controls
    const printBtn = document.getElementById("print-btn");
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const langBtns = document.querySelectorAll(".lang-btn");

    // Translation Dictionaries
    const TRANSLATIONS = {
        eng: {
            logo_title: "MD Catalyst Pro",
            subtitle: "Convert Markdown to beautiful PDFs and HTML with Marathi & English support.",
            mode_md: "Markdown Converter",
            mode_pdf: "PDF to HTML Converter",
            tab_write: "Write",
            tab_upload: "Upload",
            word_count: "Words: 0",
            char_count: "Characters: 0",
            live_preview: "Live Preview",
            format_label: "Format",
            paper_size_label: "Paper Size",
            margins_label: "Margins (L, T, R, B)",
            font_family_label: "Font Family",
            cover_page_label: "Cover Page",
            cover_page_span: "Include Cover Page",
            page_numbers_label: "Page Numbers",
            page_numbers_span: "Show Page Numbers",
            cover_title_label: "Cover Title",
            cover_subtitle_label: "Cover Subtitle",
            watermark_label: "Watermark Text",
            custom_css_btn: "Custom CSS",
            convert_btn_md: "Convert & Download",
            convert_btn_pdf_empty: "Upload PDF First",
            convert_btn_pdf_ready: "Download HTML File",
            clear_btn: "Clear",
            print_btn: "Print",
            md_upload_h3: "Drag & Drop Markdown File",
            pdf_upload_h3: "Drag & Drop PDF File",
            browse_btn: "Browse File",
            clear_btn_title: "Clear Editor",
            placeholder_write: "Start writing here...",
            placeholder_css: "/* Custom CSS overrides here */",
            modal_title: "Select PDF Style",
            modal_p: "Which style of PDF would you like to download?",
            simple_pdf_title: "Simple PDF",
            simple_pdf_p: "Clean black-and-white layout for formal use.",
            colorful_pdf_title: "Colorful PDF",
            colorful_pdf_p: "Premium layout with colored alerts and code highlighting."
        },
        marathi: {
            logo_title: "एमडी कॅटॅलिस्ट प्रो",
            subtitle: "मराठी आणि इंग्रजी भाषेमध्ये मसुद्याचे पीडीएफ आणि एचटीएमएल मध्ये रुपांतर करा.",
            mode_md: "मार्कडाउन कन्व्हर्टर",
            mode_pdf: "पीडीएफ टू एचटीएमएल कन्व्हर्टर",
            tab_write: "लिहा",
            tab_upload: "अपलोड करा",
            word_count: "शब्द: 0",
            char_count: "अक्षरे: 0",
            live_preview: "थेट प्रिव्ह्यू",
            format_label: "फॉरमॅट",
            paper_size_label: "कागदाचा आकार",
            margins_label: "मार्जिन (डावी, वर, उजवी, खाली)",
            font_family_label: "फॉन्ट फॅमिली",
            cover_page_label: "कव्हर पेज",
            cover_page_span: "कव्हर पेज जोडा",
            page_numbers_label: "पान क्रमांक",
            page_numbers_span: "पान क्रमांक दर्शवा",
            cover_title_label: "कव्हर शीर्षक",
            cover_subtitle_label: "कव्हर उप-शीर्षक",
            watermark_label: "वॉटरमार्क मजकूर",
            custom_css_btn: "सानुकूल CSS",
            convert_btn_md: "कन्व्हर्ट आणि डाउनलोड",
            convert_btn_pdf_empty: "आधी पीडीएफ अपलोड करा",
            convert_btn_pdf_ready: "एचटीएमएल फाईल डाउनलोड करा",
            clear_btn: "साफ करा",
            print_btn: "प्रिंट",
            md_upload_h3: "मार्कडाउन फाईल ड्रॅग करा किंवा निवडा",
            pdf_upload_h3: "पीडीएफ फाईल ड्रॅग करा किंवा निवडा",
            browse_btn: "फाइल शोधा",
            clear_btn_title: "सर्व मजकूर पुसा",
            placeholder_write: "येथे लिहिण्यास प्रारंभ करा...",
            placeholder_css: "/* तुमचे सानुकूल CSS येथे टाका */",
            modal_title: "PDF ची शैली निवडा",
            modal_p: "तुम्हाला डाऊनलोड करण्यासाठी कोणत्या प्रकारची पीडीएफ हवी आहे?",
            simple_pdf_title: "साधी PDF",
            simple_pdf_p: "अधिकृत कामासाठी ब्लॅक-अँड-व्हाईट आणि साधी मांडणी.",
            colorful_pdf_title: "रंगीत PDF",
            colorful_pdf_p: "सूचना बॉक्सेस (Alerts) आणि रंगीत कोड हायलाइटिंगसह प्रीमियम मांडणी."
        },
        mix: {
            logo_title: "MD Catalyst Pro",
            subtitle: "मराठी आणि इंग्रजी भाषेमध्ये Markdown चे सुंदर PDF आणि HTML मध्ये रुपांतर करा.",
            mode_md: "Markdown Converter",
            mode_pdf: "PDF to HTML Converter",
            tab_write: "लिहा (Write)",
            tab_upload: "अपलोड (Upload)",
            word_count: "शब्द: 0",
            char_count: "अक्षरे: 0",
            live_preview: "लाईव्ह प्रिव्ह्यू (Live Preview)",
            format_label: "फॉरमॅट (Format)",
            paper_size_label: "पेपर साईझ (Paper Size)",
            margins_label: "मार्जिन्स (Margins - L, T, R, B)",
            font_family_label: "फॉन्ट (Font Family)",
            cover_page_label: "कव्हर पेज (Cover Page)",
            cover_page_span: "कव्हर पेज समाविष्ट करा",
            page_numbers_label: "पान क्रमांक (Page Numbers)",
            page_numbers_span: "पान क्रमांक दर्शवा",
            cover_title_label: "कव्हर शीर्षक (Title)",
            cover_subtitle_label: "कव्हर उप-शीर्षक (Subtitle)",
            watermark_label: "वॉटरमार्क (Watermark Text)",
            custom_css_btn: "Custom CSS",
            convert_btn_md: "कन्व्हर्ट आणि डाउनलोड",
            convert_btn_pdf_empty: "आधी PDF अपलोड करा",
            convert_btn_pdf_ready: "HTML फाईल डाउनलोड करा",
            clear_btn: "साफ करा (Clear)",
            print_btn: "प्रिंट (Print)",
            md_upload_h3: "Markdown फाईल ड्रॅग करा किंवा निवडा",
            pdf_upload_h3: "PDF फाईल ड्रॅग करा किंवा निवडा",
            browse_btn: "फाइल शोधा",
            clear_btn_title: "साफ करा (Clear Editor)",
            placeholder_write: "येथे लिहिण्यास प्रारंभ करा (Write here)...",
            placeholder_css: "/* सानुकूल CSS (Custom CSS) */",
            modal_title: "PDF ची शैली निवडा (Select PDF Style)",
            modal_p: "तुम्हाला डाऊनलोड करण्यासाठी कोणत्या प्रकारची पीडीएफ हवी आहे?",
            simple_pdf_title: "साधी PDF (Simple PDF)",
            simple_pdf_p: "अधिकृत कामासाठी ब्लॅक-अँड-व्हाईच आणि साधी मांडणी.",
            colorful_pdf_title: "रंगीत PDF (Colorful PDF)",
            colorful_pdf_p: "सूचना बॉक्सेस (Alerts) आणि रंगीत कोड हायलाइटिंगसह प्रीमियम मांडणी."
        }
    };

    let activeLang = "mix";

    function applyLanguage(lang) {
        activeLang = lang;
        const dict = TRANSLATIONS[lang];
        
        document.querySelectorAll("[data-i18n]").forEach(elem => {
            const key = elem.getAttribute("data-i18n");
            if (dict[key]) {
                const icon = elem.querySelector("i");
                if (icon) {
                    elem.innerHTML = "";
                    elem.appendChild(icon);
                    elem.appendChild(document.createTextNode(" " + dict[key].replace(/^[^:]+:\s*/, '')));
                } else {
                    elem.textContent = dict[key];
                }
            }
        });
        
        markdownInput.placeholder = dict.placeholder_write;
        customCssInput.placeholder = dict.placeholder_css;
        
        // Update convert button
        if (currentMode === "md") {
            convertBtn.innerHTML = `<i class="fa-solid fa-circle-arrow-down"></i> ${dict.convert_btn_md}`;
        } else {
            convertBtn.innerHTML = pdfHtmlDownloadContent 
                ? `<i class="fa-solid fa-circle-arrow-down"></i> ${dict.convert_btn_pdf_ready}` 
                : `<i class="fa-solid fa-lock"></i> ${dict.convert_btn_pdf_empty}`;
        }
    }

    langBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            langBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            applyLanguage(btn.getAttribute("data-lang"));
        });
    });

    // Theme Switcher Logic
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");
        themeToggleBtn.innerHTML = isLight ? `<i class="fa-solid fa-sun"></i>` : `<i class="fa-solid fa-moon"></i>`;
        showToast(isLight ? "लाईट मोड सक्रिय!" : "डार्क मोड सक्रिय!", "success");
    });

    // Print Button Logic
    printBtn.addEventListener("click", () => {
        const content = previewOutput.innerHTML;
        if (!content.trim() || content.includes("येथे कनव्‍हर्ट केलेल्‍या PDF चे")) {
            showToast("प्रिंट करण्यासाठी आधी फाईल निवडा किंवा मजकूर लिहा!", "error");
            return;
        }
        
        const printWindow = window.open('', '', 'height=750,width=950');
        printWindow.document.write('<html><head><title>Print Preview</title>');
        printWindow.document.write(`<style>
            @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;700&family=Poppins:wght@300;400;500;600;700&display=swap');
            body { font-family: 'Inter', 'Noto Sans Devanagari', sans-serif; padding: 25px; color: #000; background: #fff; line-height: 1.5; }
            .pdf-page { box-shadow: none !important; border: 1px solid rgba(0,0,0,0.15) !important; margin: 0 auto 20px auto !important; page-break-after: always; position: relative; overflow: hidden; background: #fff; color: #000; }
            pre { background: #f1f5f9; padding: 12px; border-radius: 6px; overflow-x: auto; border: 1px solid #e2e8f0; }
            code { font-family: monospace; font-size: 9.5pt; }
            .alert { padding: 12px 16px; margin-bottom: 12px; border-left: 4px solid #ccc; border-radius: 4px; }
            .alert-note { background: #eff6ff; border-left-color: #1d4ed8; color: #1e3a8a; }
            .alert-tip { background: #f0fdf4; border-left-color: #15803d; color: #14532d; }
            .alert-important { background: #faf5ff; border-left-color: #7e22ce; color: #581c87; }
            .alert-warning { background: #fffbeb; border-left-color: #b45309; color: #78350f; }
            .alert-caution { background: #fef2f2; border-left-color: #b91c1c; color: #7f1d1d; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background: #f8fafc; font-weight: bold; }
            .c, .c1 { color: #64748b; font-style: italic; }
            .k, .kc, .kd, .kp, .kr, .kt { color: #7c3aed; font-weight: bold; }
            .s, .s1, .s2, .sb, .sc, .sd { color: #059669; }
            .nb, .bp { color: #0284c7; }
            .nf, .fm { color: #2563eb; }
            .m, .mi, .mf { color: #d97706; }
            .o, .ow { color: #dc2626; }
        </style>`);
        printWindow.document.write('</head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 500);
    });

    // Configure marked options with Prism syntax highlighting
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        highlight: function(code, lang) {
            if (lang && Prism.languages[lang]) {
                try {
                    return Prism.highlight(code, Prism.languages[lang], lang);
                } catch (e) {
                    console.error("Prism highlight error", e);
                }
            }
            return code;
        }
    });

    // Load default content
    markdownInput.value = DEFAULT_MARKDOWN;

    // -------------------------------------------------------------
    // Helper: Parse GitHub Alerts in Preview HTML
    // -------------------------------------------------------------
    function parseAlertsInHtml(html) {
        const bqRegex = /<blockquote>([\s\S]*?)<\/blockquote>/gi;
        
        return html.replace(bqRegex, (match, innerContent) => {
            const alertRegex = /^\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:\n|<br\s*\/?>)?([\s\S]*)$/i;
            const alertMatch = innerContent.match(alertRegex);
            
            if (alertMatch) {
                const type = alertMatch[1].toLowerCase();
                const rest = alertMatch[2].trim();
                const title = type.toUpperCase();
                
                let innerHtml = "";
                if (rest) {
                    if (rest.startsWith("</p>")) {
                        const remaining = rest.slice(4).trim();
                        innerHtml = `<p class="alert-title"><strong>${title}</strong></p>${remaining}`;
                    } else {
                        innerHtml = `<p class="alert-title"><strong>${title}</strong></p><p>${rest}`;
                    }
                } else {
                    innerHtml = `<p class="alert-title"><strong>${title}</strong></p>`;
                }
                
                return `<div class="alert alert-${type}">${innerHtml}</div>`;
            }
            return match;
        });
    }

    // -------------------------------------------------------------
    // Live Preview Rendering & Word Counter
    // -------------------------------------------------------------
    function updatePreview() {
        const mdText = markdownInput.value;
        updateCounts(mdText);

        if (!mdText.trim()) {
            previewOutput.innerHTML = `<p style="color: var(--text-secondary); font-style: italic;">येथे तुमचे लेखन पहा...</p>`;
            return;
        }
        
        // Parse markdown to HTML
        let rawHtml = marked.parse(mdText);
        
        // Apply custom alert boxes
        let finalHtml = parseAlertsInHtml(rawHtml);
        
        previewOutput.innerHTML = finalHtml;
    }

    function updateCounts(text) {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        document.getElementById("word-count").innerHTML = `<i class="fa-solid fa-align-left"></i> शब्द: ${words}`;
        document.getElementById("char-count").innerHTML = `<i class="fa-solid fa-font"></i> अक्षरे: ${chars}`;
    }

    // Sync input to preview
    markdownInput.addEventListener("input", updatePreview);
    updatePreview(); // Initial render

    const FONT_CLASSES = [
        "font-noto-sans-devanagari", "font-poppins", "font-yatra-one",
        "font-rozha-one", "font-nirmala", "font-inter", "font-outfit",
        "font-playfair", "font-fira-code", "font-times", "font-georgia",
        "font-calibri", "font-arial", "font-lora", "font-merriweather"
    ];

    // Font family change handler
    fontSelect.addEventListener("change", () => {
        FONT_CLASSES.forEach(cls => previewOutput.classList.remove(cls));
        previewOutput.classList.add(fontSelect.value);
    });
    // Set default font preview class
    previewOutput.classList.add("font-nirmala");

    // -------------------------------------------------------------
    // Mode Switcher & Global Mode State
    // -------------------------------------------------------------
    let currentMode = "md"; // "md" or "pdf"
    let pdfHtmlDownloadContent = ""; // Stores generated PDF-to-HTML content

    const modeMd = document.getElementById("mode-md");
    const modePdf = document.getElementById("mode-pdf");
    const pdfConvertContent = document.getElementById("pdf-convert-content");
    const settingsGrid = document.querySelector(".settings-grid");
    const cssToggleArea = document.querySelector(".css-toggle-area");
    const paneHeaderTabs = document.querySelector(".editor-pane .pane-header");

    modeMd.addEventListener("click", () => {
        currentMode = "md";
        modeMd.classList.add("active");
        modePdf.classList.remove("active");
        
        // Show Markdown Editor & toolbar, hide PDF upload
        writeContent.classList.remove("hidden");
        pdfConvertContent.classList.add("hidden");
        tabWrite.click();
        
        // Restore elements
        paneHeaderTabs.style.display = "flex";
        settingsGrid.style.display = "grid";
        pdfExtraSettings.style.display = "grid";
        cssToggleArea.style.display = "flex";
        
        // Restore convert button style & text
        convertBtn.disabled = false;
        convertBtn.innerHTML = `<i class="fa-solid fa-circle-arrow-down"></i> कन्व्हर्ट आणि डाउनलोड`;
        
        // Reset output preview to Markdown preview
        updatePreview();
    });

    modePdf.addEventListener("click", () => {
        currentMode = "pdf";
        modePdf.classList.add("active");
        modeMd.classList.remove("active");
        
        // Hide Markdown Editor & toolbar, show PDF upload
        writeContent.classList.add("hidden");
        uploadContent.classList.add("hidden");
        pdfConvertContent.classList.remove("hidden");
        
        // Hide settings
        paneHeaderTabs.style.display = "none";
        settingsGrid.style.display = "none";
        pdfExtraSettings.style.display = "none";
        cssToggleArea.style.display = "none";
        
        // Disable convert button until a PDF is uploaded
        if (!pdfHtmlDownloadContent) {
            convertBtn.disabled = true;
            convertBtn.innerHTML = `<i class="fa-solid fa-lock"></i> आधी PDF अपलोड करा`;
        } else {
            convertBtn.disabled = false;
            convertBtn.innerHTML = `<i class="fa-solid fa-circle-arrow-down"></i> HTML फाईल डाउनलोड करा`;
        }
        
        // Clear preview output
        previewOutput.innerHTML = `<p style="color: var(--text-secondary); font-style: italic;">येथे कनव्‍हर्ट केलेल्‍या PDF चे प्रिव्ह्यू दिसेल...</p>`;
        if (pdfHtmlDownloadContent) {
            previewOutput.innerHTML = document.getElementById("pdf-html-preview-data")?.value || "";
        }
    });

    // Toggle Cover Page Title/Subtitle Visibility
    coverPageToggle.addEventListener("change", () => {
        if (coverPageToggle.checked) {
            coverTitleContainer.classList.remove("hidden");
            coverSubtitleContainer.classList.remove("hidden");
        } else {
            coverTitleContainer.classList.add("hidden");
            coverSubtitleContainer.classList.add("hidden");
        }
    });

    // -------------------------------------------------------------
    // Tab Navigation
    // -------------------------------------------------------------
    tabWrite.addEventListener("click", () => {
        if (currentMode !== "md") return;
        tabWrite.classList.add("active");
        tabUpload.classList.remove("active");
        writeContent.classList.remove("hidden");
        uploadContent.classList.add("hidden");
    });

    tabUpload.addEventListener("click", () => {
        if (currentMode !== "md") return;
        tabUpload.classList.add("active");
        tabWrite.classList.remove("active");
        uploadContent.classList.remove("hidden");
        writeContent.classList.add("hidden");
    });

    // -------------------------------------------------------------
    // PDF to HTML File Uploader & API logic
    // -------------------------------------------------------------
    const pdfDropZone = document.getElementById("pdf-drop-zone");
    const pdfFileInput = document.getElementById("pdf-file-input");
    const pdfBrowseBtn = document.getElementById("pdf-browse-btn");

    async function handlePdfFile(file) {
        if (!file.name.endsWith(".pdf")) {
            showToast("फक्त .pdf फाईल्स सपोर्टेड आहेत!", "error");
            return;
        }
        
        showToast("PDF वर प्रक्रिया चालू आहे...", "success");
        convertBtn.disabled = true;
        convertBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> PDF कन्व्हर्ट होत आहे...`;
        
        const formData = new FormData();
        formData.append("file", file);
        
        try {
            const response = await fetch("/pdf-to-html", {
                method: "POST",
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "PDF रुपांतरण अयशस्वी");
            }
            
            const data = await response.json();
            
            // Store the download HTML content
            pdfHtmlDownloadContent = data.html_download;
            
            // Render the extracted HTML inside preview
            previewOutput.innerHTML = data.html_preview;
            
            // Store preview HTML in a hidden element or variable for mode switching
            let hiddenData = document.getElementById("pdf-html-preview-data");
            if (!hiddenData) {
                hiddenData = document.createElement("input");
                hiddenData.type = "hidden";
                hiddenData.id = "pdf-html-preview-data";
                document.body.appendChild(hiddenData);
            }
            hiddenData.value = data.html_preview;
            
            // Enable download button
            convertBtn.disabled = false;
            convertBtn.innerHTML = `<i class="fa-solid fa-circle-arrow-down"></i> HTML फाईल डाउनलोड करा`;
            
            showToast("PDF यशस्वीरित्या कन्व्हर्ट झाली!", "success");
        } catch (error) {
            console.error(error);
            showToast(`त्रुटी: ${error.message}`, "error");
            convertBtn.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> कन्व्हर्ट फेल झाले`;
        }
    }

    // PDF Drag-drop events
    ["dragenter", "dragover"].forEach(eventName => {
        pdfDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            pdfDropZone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        pdfDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            pdfDropZone.classList.remove("dragover");
        }, false);
    });

    pdfDropZone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handlePdfFile(files[0]);
        }
    });

    pdfBrowseBtn.addEventListener("click", () => {
        pdfFileInput.click();
    });

    pdfFileInput.addEventListener("change", () => {
        if (pdfFileInput.files.length > 0) {
            handlePdfFile(pdfFileInput.files[0]);
        }
    });

    // -------------------------------------------------------------
    // Drag & Drop / File Loading
    // -------------------------------------------------------------
    function handleFile(file) {
        if (!file.name.endsWith(".md")) {
            showToast("फक्त .md फाईल्स सपोर्टेड आहेत!", "error");
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            markdownInput.value = e.target.result;
            updatePreview();
            showToast("फाईल यशस्वीरित्या लोड झाली!", "success");
            tabWrite.click();
        };
        reader.onerror = () => {
            showToast("फाईल वाचण्यात त्रुटी आली!", "error");
        };
        reader.readAsText(file);
    }

    // Drag-drop events
    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add("dragover");
        }, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove("dragover");
        }, false);
    });

    dropZone.addEventListener("drop", (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    browseBtn.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    // -------------------------------------------------------------
    // Editor Toolbar Actions
    // -------------------------------------------------------------
    function insertAtCursor(before, after = "") {
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        const text = markdownInput.value;
        const selected = text.substring(start, end);
        const replacement = before + selected + after;
        
        markdownInput.value = text.substring(0, start) + replacement + text.substring(end);
        markdownInput.focus();
        
        // Reset selection position
        markdownInput.selectionStart = start + before.length;
        markdownInput.selectionEnd = start + before.length + selected.length;
        
        updatePreview();
    }

    // Bind toolbar buttons
    document.querySelectorAll(".toolbar-btn[data-action]").forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.getAttribute("data-action");
            switch (action) {
                case "bold":
                    insertAtCursor("**", "**");
                    break;
                case "italic":
                    insertAtCursor("*", "*");
                    break;
                case "header":
                    insertAtCursor("# ");
                    break;
                case "link":
                    insertAtCursor("[", "](url)");
                    break;
                case "code":
                    insertAtCursor("```python\n", "\n```");
                    break;
                case "table":
                    insertAtCursor("\n| शीर्षक १ | शीर्षक २ |\n| :--- | :--- |\n| माहिती १ | माहिती २ |\n");
                    break;
                case "ul":
                    insertAtCursor("- ");
                    break;
                case "ol":
                    insertAtCursor("1. ");
                    break;
            }
        });
    });

    // Bind Alert Callout options
    document.querySelectorAll(".alert-option").forEach(option => {
        option.addEventListener("click", (e) => {
            e.stopPropagation();
            const alertType = option.getAttribute("data-alert").toUpperCase();
            insertAtCursor(`\n> [!${alertType}]\n> `);
        });
    });

    // Clear Button
    clearBtn.addEventListener("click", () => {
        if (confirm("तुम्हाला खात्री आहे की तुम्हाला सर्व मजकूर हटवायचा आहे?")) {
            markdownInput.value = "";
            updatePreview();
            showToast("सर्व मजकूर पुसला गेला!", "success");
        }
    });

    // -------------------------------------------------------------
    // Custom CSS Toggle
    // -------------------------------------------------------------
    toggleCssBtn.addEventListener("click", () => {
        cssContainer.classList.toggle("hidden");
    });

    // Disable margins and paper options if exporting to HTML
    exportFormat.addEventListener("change", () => {
        const isHtml = exportFormat.value === "html";
        const paperContainer = document.getElementById("paper-size-container");
        const marginsContainer = document.getElementById("margins-container");
        
        if (isHtml) {
            paperContainer.style.opacity = "0.3";
            paperContainer.style.pointerEvents = "none";
            marginsContainer.style.opacity = "0.3";
            marginsContainer.style.pointerEvents = "none";
        } else {
            paperContainer.style.opacity = "1";
            paperContainer.style.pointerEvents = "auto";
            marginsContainer.style.opacity = "1";
            marginsContainer.style.pointerEvents = "auto";
        }
    });

    // -------------------------------------------------------------
    // Toast Notification helper
    // -------------------------------------------------------------
    function showToast(message, type = "success") {
        toast.textContent = message;
        toast.className = `toast show toast-${type}`;
        
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // -------------------------------------------------------------
    // Close Modal Events
    closeStyleModal.addEventListener("click", () => {
        styleModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
        if (e.target === styleModal) {
            styleModal.classList.add("hidden");
        }
    });

    // Option Buttons Click Events
    optSimplePdf.addEventListener("click", () => {
        styleModal.classList.add("hidden");
        submitConvert("simple");
    });

    optColorfulPdf.addEventListener("click", () => {
        styleModal.classList.add("hidden");
        submitConvert("colorful");
    });

    // Actual Conversion Post logic
    async function submitConvert(pdfStyle = "colorful") {
        const mdText = markdownInput.value;
        const format = exportFormat.value;
        const paper = paperSize.value;
        const customCss = customCssInput.value;
        
        const margins = [
            parseInt(marginLeft.value) || 36,
            parseInt(marginTop.value) || 36,
            parseInt(marginRight.value) || -36,
            parseInt(marginBottom.value) || -36
        ];

        // Change button state
        convertBtn.disabled = true;
        const originalText = convertBtn.innerHTML;
        convertBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> प्रक्रिया चालू आहे...`;

        try {
            const response = await fetch("/convert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    markdown: mdText,
                    format: format,
                    paper: paper,
                    margins: margins,
                    css: customCss,
                    cover: coverPageToggle.checked,
                    cover_title: coverTitleInput.value || "Document Title",
                    cover_subtitle: coverSubtitleInput.value,
                    watermark: watermarkInputField.value,
                    page_numbers: pageNumbersToggle.checked,
                    pdf_style: pdfStyle
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "रुपांतरण अयशस्वी झाले");
            }

            // Receive file blob
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `document.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showToast("तुमची फाईल यशस्वीरित्या डाउनलोड झाली!", "success");
        } catch (error) {
            console.error(error);
            showToast(`त्रुटी: ${error.message}`, "error");
        } finally {
            convertBtn.disabled = false;
            convertBtn.innerHTML = originalText;
        }
    }

    // Convert & Download HTTP Request
    // -------------------------------------------------------------
    convertBtn.addEventListener("click", async () => {
        if (currentMode === "pdf") {
            if (!pdfHtmlDownloadContent) {
                showToast("कृपया आधी PDF फाईल अपलोड करा!", "error");
                return;
            }
            
            // Client-side trigger download of the converted HTML file
            const blob = new Blob([pdfHtmlDownloadContent], { type: "text/html;charset=utf-8" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "converted_pdf.html";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showToast("HTML फाईल यशस्वीरित्या डाउनलोड झाली!", "success");
            return;
        }

        // Markdown Mode
        const mdText = markdownInput.value;
        if (!mdText.trim()) {
            showToast("कृपया आधी काहीतरी मजकूर लिहा किंवा फाईल निवडा!", "error");
            return;
        }

        // Check if format is PDF to prompt style selection modal
        if (exportFormat.value === "pdf") {
            styleModal.classList.remove("hidden");
        } else {
            // HTML export defaults to colorful mode directly
            submitConvert("colorful");
        }
    });
});
