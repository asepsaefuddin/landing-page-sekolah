"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Import ReactQuill secara dinamis dengan error handling
const ReactQuill = dynamic(
  () => {
    try {
      return import("react-quill").then((mod) => mod.default);
    } catch (error) {
      console.error("Failed to load react-quill:", error);
      throw error;
    }
  },
  { 
    ssr: false,
    loading: () => <div className="p-4 border rounded-lg bg-gray-50">Loading editor...</div>
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Fungsi untuk mengkonversi HTML ke plain text format sederhana
// Semua tag HTML dikonversi ke format markdown/simbol, KECUALI tag <img> yang tetap sebagai HTML
const htmlToPlainText = (html: string): string => {
  if (!html || typeof window === 'undefined') return html || '';
  
  // Jika sudah plain text (tidak ada tag HTML selain img), return as is
  if (!html.includes('<') || (html.includes('<img') && !html.match(/<(?!img\s)[a-z]+[^>]*>/i))) {
    return html;
  }
  
  try {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.trim();
    
    const convertNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        const children = Array.from(el.childNodes);
        
        // Rekursif konversi semua children dulu
        const textContent = children.map(child => convertNode(child)).join('');
        
        switch (tagName) {
          case 'h1':
            return `#${textContent.trim()}#\n\n`;
          case 'h2':
            return `##${textContent.trim()}##\n\n`;
          case 'h3':
            return `###${textContent.trim()}###\n\n`;
          case 'h4':
          case 'h5':
          case 'h6':
            return `###${textContent.trim()}###\n\n`;
          case 'p':
            const pContent = textContent.trim();
            return pContent ? `${pContent}\n\n` : '';
          case 'strong':
          case 'b':
            return textContent ? `*${textContent}*` : '';
          case 'em':
          case 'i':
            return textContent ? `-${textContent}-` : '';
          case 'u':
            return textContent ? `_${textContent}_` : '';
          case 'blockquote':
            const blockquoteContent = textContent.trim();
            return blockquoteContent ? `"${blockquoteContent}"\n\n` : '';
          case 'ul':
            const ulItems = children
              .filter(child => child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName.toLowerCase() === 'li')
              .map(li => {
                const liChildren = Array.from(li.childNodes);
                const liText = liChildren.map(child => convertNode(child)).join('').trim();
                return liText ? `+${liText}+` : '';
              })
              .filter(item => item) // Remove empty items
              .join('\n');
            return ulItems ? `${ulItems}\n\n` : '';
          case 'ol':
            let olCounter = 1;
            const olItems = children
              .filter(child => child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName.toLowerCase() === 'li')
              .map(li => {
                const liChildren = Array.from(li.childNodes);
                const liText = liChildren.map(child => convertNode(child)).join('').trim();
                return liText ? `${olCounter++}.${liText}` : '';
              })
              .filter(item => item) // Remove empty items
              .join('\n');
            return olItems ? `${olItems}\n\n` : '';
          case 'li':
            // li tidak perlu di-handle sendiri, sudah di-handle oleh parent ul/ol
            return textContent;
          case 'br':
            return '\n';
          case 'img':
            // Tetap pertahankan tag img sebagai HTML
            const src = el.getAttribute('src') || '';
            const alt = el.getAttribute('alt') || '';
            const style = el.getAttribute('style') || 'max-width: 100%; height: auto; margin: 10px 0;';
            return `<img src="${src}" alt="${alt}" style="${style}" />\n\n`;
          case 'a':
            const href = el.getAttribute('href') || '';
            return textContent ? `[${textContent}](${href})` : '';
          case 'div':
          case 'span':
            // Untuk div dan span, hanya ambil text content-nya
            return textContent;
          default:
            // Untuk tag lainnya yang tidak dikenal, ambil text content saja (menghapus tag)
            return textContent;
        }
      }
      
      return '';
    };
    
    let result = Array.from(tempDiv.childNodes)
      .map(child => convertNode(child))
      .join('')
      .replace(/\n{3,}/g, '\n\n') // Maksimal 2 newline berturut-turut
      .trim();
    
    // Final sanitization: pastikan tidak ada tag HTML yang tersisa kecuali img
    // Hapus semua tag HTML opening dan closing kecuali img
    result = result.replace(/<(?!img\s)[^>]+>/gi, '').replace(/<\/[^>]+>/g, '');
    
    return result;
  } catch (error) {
    console.error('Error converting HTML to plain text:', error);
    // Fallback: remove all HTML tags except img
    return html.replace(/<(?!img\s)[^>]+>/gi, '').replace(/<\/[^>]+>/g, '');
  }
};

// Fungsi untuk mengkonversi plain text format kembali ke HTML
const plainTextToHtml = (plainText: string): string => {
  if (!plainText) return '';
  
  try {
    const lines = plainText.split('\n');
    let result: string[] = [];
    let inNumberedList = false;
    let inBulletList = false;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Empty line
      if (!trimmed) {
        if (inNumberedList) {
          result.push('</ol>');
          inNumberedList = false;
        }
        if (inBulletList) {
          result.push('</ul>');
          inBulletList = false;
        }
        return;
      }
      
      // H1: #text#
      if (trimmed.match(/^#[^#]+#$/)) {
        if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
        if (inBulletList) { result.push('</ul>'); inBulletList = false; }
        
        const text = trimmed.slice(1, -1);
        result.push(`<h1>${processInlineFormatting(text)}</h1>`);
        return;
      }
      
      // H2: ##text##
      if (trimmed.match(/^##[^#]+##$/)) {
        if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
        if (inBulletList) { result.push('</ul>'); inBulletList = false; }
        
        const text = trimmed.slice(2, -2);
        result.push(`<h2>${processInlineFormatting(text)}</h2>`);
        return;
      }
      
      // H3: ###text###
      if (trimmed.match(/^###[^#]+###$/)) {
        if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
        if (inBulletList) { result.push('</ul>'); inBulletList = false; }
        
        const text = trimmed.slice(3, -3);
        result.push(`<h3>${processInlineFormatting(text)}</h3>`);
        return;
      }
      
      // Blockquote: "text"
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
        if (inBulletList) { result.push('</ul>'); inBulletList = false; }
        
        const text = trimmed.slice(1, -1);
        result.push(`<blockquote><p>${processInlineFormatting(text)}</p></blockquote>`);
        return;
      }
      
      // Numbered list: 1.text
      if (trimmed.match(/^\d+\./)) {
        if (inBulletList) { result.push('</ul>'); inBulletList = false; }
        
        if (!inNumberedList) {
          result.push('<ol>');
          inNumberedList = true;
        }
        const text = trimmed.replace(/^\d+\./, '').trim();
        result.push(`<li>${processInlineFormatting(text)}</li>`);
        return;
      }
      
      // Bullet list: +text+
      if (trimmed.startsWith('+') && trimmed.endsWith('+')) {
        if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
        
        if (!inBulletList) {
          result.push('<ul>');
          inBulletList = true;
        }
        const text = trimmed.slice(1, -1);
        result.push(`<li>${processInlineFormatting(text)}</li>`);
        return;
      }
      
      // Check if line contains img tag (keep as HTML)
      if (trimmed.match(/^<img\s+/i)) {
        if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
        if (inBulletList) { result.push('</ul>'); inBulletList = false; }
        
        // Keep img tag as is (HTML)
        result.push(trimmed);
        return;
      }
      
      // Regular paragraph
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      
      result.push(`<p>${processInlineFormatting(trimmed)}</p>`);
    });
    
    // Close any open tags
    if (inNumberedList) result.push('</ol>');
    if (inBulletList) result.push('</ul>');
    
    let html = result.join('\n');
    
    return html;
  } catch (error) {
    console.error('Error converting plain text to HTML:', error);
    return plainText;
  }
};

// Helper function untuk process inline formatting (bold, italic, underline, links)
const processInlineFormatting = (text: string): string => {
  // Convert links first
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert bold *text* (harus dilakukan sebelum italic)
  text = text.replace(/\*([^*]+?)\*/g, '<strong>$1</strong>');
  
  // Convert underline _text_
  text = text.replace(/_([^_]+?)_/g, '<u>$1</u>');
  
  // Convert italic -text-
  text = text.replace(/-([^-]+?)-/g, '<em>$1</em>');
  
  return text;
};

// Helper untuk detect apakah string mengandung HTML tags (selain img)
const containsHtmlTags = (text: string): boolean => {
  if (!text) return false;
  // Cek apakah ada tag HTML selain img
  const htmlTagPattern = /<(?!img\s)[a-z]+[^>]*>/i;
  return htmlTagPattern.test(text);
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [internalHtmlValue, setInternalHtmlValue] = useState('');
  
  // Initialize: convert plain text value to HTML untuk editing
  useEffect(() => {
    if (value !== undefined) {
      // Jika value mengandung HTML tags (selain img), berarti itu HTML lama, convert dulu ke plain text lalu ke HTML
      // Jika tidak, berarti sudah plain text format, langsung convert ke HTML
      if (value) {
        if (containsHtmlTags(value)) {
          // HTML lama, convert ke plain text dulu
          const plainText = htmlToPlainText(value);
          const html = plainTextToHtml(plainText);
          setInternalHtmlValue(html);
        } else {
          // Sudah plain text format
          const html = plainTextToHtml(value);
          setInternalHtmlValue(html);
        }
      } else {
        setInternalHtmlValue('');
      }
    }
  }, []); // Hanya sekali saat mount
  
  // Handler untuk onChange - convert HTML ke plain text sebelum disimpan
  const handleChange = useCallback((htmlContent: string) => {
    setInternalHtmlValue(htmlContent);
    // Convert HTML ke plain text format sebelum menyimpan
    let plainText = htmlToPlainText(htmlContent);
    
    // Extra sanitization: pastikan tidak ada tag HTML yang tersisa kecuali img
    // Hapus semua tag HTML opening dan closing kecuali img
    plainText = plainText.replace(/<(?!img\s)[^>]+>/gi, '').replace(/<\/[^>]+>/g, '');
    
    onChange(plainText);
  }, [onChange]);
  
  // Update internal HTML value jika value prop berubah dari luar
  useEffect(() => {
    if (value !== undefined && value !== null) {
      if (value) {
        if (containsHtmlTags(value)) {
          // HTML lama, convert ke plain text dulu
          const plainText = htmlToPlainText(value);
          const html = plainTextToHtml(plainText);
          if (html !== internalHtmlValue) {
            setInternalHtmlValue(html);
          }
        } else {
          // Sudah plain text format
          const html = plainTextToHtml(value);
          if (html !== internalHtmlValue) {
            setInternalHtmlValue(html);
          }
        }
      } else if (value !== internalHtmlValue) {
        setInternalHtmlValue('');
      }
    }
  }, [value]);

  useEffect(() => {
    setMounted(true);
    setIsClient(typeof window !== 'undefined');
    
    // Ensure Quill CSS is loaded
    if (typeof window !== 'undefined' && !document.getElementById('quill-snow-css')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
      link.id = 'quill-snow-css';
      document.head.appendChild(link);
    }
    
    // Add global error handler for React DOM errors
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('findDOMNode') || 
          event.error?.message?.includes('react_dom')) {
        console.error('React Quill compatibility error detected:', event.error);
        setHasError(true);
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // If there's an error, don't render
  if (hasError) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 text-red-700">
        Rich text editor is not compatible with your browser. Please use the simple editor instead.
      </div>
    );
  }

  // Custom image handler untuk upload ke Cloudinary
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          const imageUrl = result.url;
          // Insert image HTML langsung ke content saat ini
          setInternalHtmlValue(prev => {
            const imageHtml = `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
            const newContent = prev + imageHtml;
            // Convert ke plain text dan trigger onChange
            const plainText = htmlToPlainText(newContent);
            onChange(plainText);
            return newContent;
          });
        } else {
          alert("Gagal upload gambar: " + result.error);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Gagal upload gambar");
      }
    };
  }, [onChange]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }], // H1, H2, H3
        ['bold', 'italic', 'underline'], // Format teks
        [{ 'list': 'ordered'}, { 'list': 'bullet' }], // List berangka & bullet
        ['blockquote'], // Quote
        ['link', 'image'], // Link & gambar
        ['clean'] // Clear formatting
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), [imageHandler]);

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'blockquote',
    'link', 'image'
  ];

  if (!mounted || !isClient) {
    return (
      <div className="rich-text-editor">
        <div className="p-4 border rounded-lg bg-gray-50 min-h-[300px] flex items-center justify-center">
          <span className="text-gray-500">Loading rich text editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <div className="quill-wrapper">
        {(() => {
          try {
            return (
              <ReactQuill
                theme="snow"
                value={internalHtmlValue}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{ height: '300px', marginBottom: '50px' }}
              />
            );
          } catch (error) {
            console.error('ReactQuill render error:', error);
            setHasError(true);
            return (
              <div className="p-4 border rounded-lg bg-red-50 text-red-700">
                Rich text editor failed to load. Please refresh the page or use the simple editor.
              </div>
            );
          }
        })()}
      </div>
      <style jsx global>{`
        .ql-editor {
          min-height: 250px;
          font-size: 16px;
          line-height: 1.6;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .ql-toolbar {
          border-top: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 4px 4px 0 0;
          background-color: #fafafa;
          padding: 8px;
        }
        .ql-container {
          border-bottom: 1px solid #ccc;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 0 0 4px 4px;
          font-size: 16px;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px 0;
        }
        .ql-editor blockquote {
          border-left: 4px solid #ddd;
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: #666;
        }
        .ql-editor ol, .ql-editor ul {
          padding-left: 30px;
          margin: 10px 0;
        }
        .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 16px 0 8px 0;
        }
        .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 14px 0 8px 0;
        }
        .ql-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 12px 0 8px 0;
        }
        .quill-wrapper {
          position: relative;
        }
        .quill-wrapper .ql-snow {
          border: none;
        }
        .ql-toolbar .ql-formats {
          margin-right: 15px;
        }
        .ql-toolbar button {
          padding: 5px 8px;
        }
        .ql-toolbar button:hover,
        .ql-toolbar button:focus,
        .ql-toolbar button.ql-active {
          background-color: #e6e6e6;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}