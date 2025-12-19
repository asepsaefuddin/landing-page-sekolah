"use client";

import { useState } from "react";

interface SimpleRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SimpleRichEditor({ value, onChange, placeholder }: SimpleRichEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const imageHtml = `<img src="${result.url}" alt="Uploaded image" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
        onChange(value + '\n' + imageHtml + '\n');
      } else {
        alert("Gagal upload gambar: " + result.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Gagal upload gambar");
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  return (
    <div className="simple-rich-editor border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 bg-gray-50 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => insertText('<h1>', '</h1>')}
          className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => insertText('<h2>', '</h2>')}
          className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertText('<h3>', '</h3>')}
          className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100"
          title="Heading 3"
        >
          H3
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => insertText('<strong>', '</strong>')}
          className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertText('<em>', '</em>')}
          className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertText('<u>', '</u>')}
          className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100 underline"
          title="Underline"
        >
          U
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => insertText('<ul>\n<li>', '</li>\n</ul>')}
          className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => insertText('<ol>\n<li>', '</li>\n</ol>')}
          className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100"
          title="Numbered List"
        >
          1. List
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => insertText('<blockquote>', '</blockquote>')}
          className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-100"
          title="Quote"
        >
          "Quote"
        </button>
        
        <div className="w-px bg-gray-300 mx-1"></div>
        
        <label className="px-2 py-1 text-sm bg-blue-500 text-white border rounded hover:bg-blue-600 cursor-pointer">
          {isUploading ? 'Uploading...' : '📷 Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>
      
      {/* Editor */}
      <textarea
        id="content-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border-0 resize-none focus:outline-none min-h-[300px]"
        style={{ fontFamily: 'inherit' }}
      />
      
      {/* Preview */}
      {value && (
        <div className="border-t p-3 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
          <div 
            className="rich-content bg-white p-3 border rounded max-h-40 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}
    </div>
  );
}