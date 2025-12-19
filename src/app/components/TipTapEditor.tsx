"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';
import './TipTapEditor.css';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ value, onChange, placeholder }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Underline,
      Image.extend({
        addAttributes() {
          return {
            src: {
              default: null,
            },
            alt: {
              default: null,
            },
            title: {
              default: null,
            },
            style: {
              default: null,
              parseHTML: element => element.getAttribute('style'),
              renderHTML: attributes => {
                if (!attributes.style) {
                  return {};
                }
                return { style: attributes.style };
              },
            },
            class: {
              default: null,
              parseHTML: element => element.getAttribute('class'),
              renderHTML: attributes => {
                if (!attributes.class) {
                  return {};
                }
                return { class: attributes.class };
              },
            },
          };
        },
      }).configure({
        inline: false,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Mulai menulis...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="border rounded-lg p-4 bg-gray-50">Memuat editor...</div>;
  }

  const addImage = () => {
    const url = window.prompt('Masukkan URL gambar:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Masukkan URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const setImageSize = (size: 'small' | 'medium' | 'large' | 'full' | 'custom') => {
    const { selection } = editor.state;
    const node = editor.state.doc.nodeAt(selection.from);
    
    if (!node || node.type.name !== 'image') {
      alert('Klik gambar terlebih dahulu untuk memilihnya');
      return;
    }

    let width = '';
    
    switch(size) {
      case 'small':
        width = 'width: 25%; height: auto;';
        break;
      case 'medium':
        width = 'width: 50%; height: auto;';
        break;
      case 'large':
        width = 'width: 75%; height: auto;';
        break;
      case 'full':
        width = 'width: 100%; height: auto;';
        break;
      case 'custom':
        const customWidth = window.prompt('Masukkan lebar (contoh: 300px atau 60%):');
        if (customWidth) {
          width = `width: ${customWidth}; height: auto;`;
        }
        break;
    }
    
    if (width) {
      // Get existing class to preserve position
      const currentClass = node.attrs.class || '';
      
      editor.chain().focus().updateAttributes('image', {
        style: width,
        class: currentClass // Preserve existing class
      }).run();
    }
  };

  const setImagePosition = (position: 'left' | 'center' | 'right') => {
    const { selection } = editor.state;
    const node = editor.state.doc.nodeAt(selection.from);
    
    if (!node || node.type.name !== 'image') {
      alert('Klik gambar terlebih dahulu untuk memilihnya');
      return;
    }

    // Get current width from style if exists
    const currentStyle = node.attrs.style || '';
    const widthMatch = currentStyle.match(/width:\s*([^;]+)/);
    const width = widthMatch ? widthMatch[1] : '100%';
    
    let style = '';
    let className = '';
    
    switch(position) {
      case 'left':
        style = `width: ${width}; height: auto; float: left; margin-right: 1em; margin-bottom: 1em;`;
        className = 'image-left';
        break;
      case 'center':
        style = `width: ${width}; height: auto; display: block; margin-left: auto; margin-right: auto;`;
        className = 'image-center';
        break;
      case 'right':
        style = `width: ${width}; height: auto; float: right; margin-left: 1em; margin-bottom: 1em;`;
        className = 'image-right';
        break;
    }
    
    editor.chain().focus().updateAttributes('image', {
      style: style,
      class: className
    }).run();
  };

  return (
    <div className="tiptap-container">
      <div className="tiptap-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'active' : ''}
            title="Tebal (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'active' : ''}
            title="Miring (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'active' : ''}
            title="Garis Bawah (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'active' : ''}
            title="Coret"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <select
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: level as any }).run();
              }
            }}
            value={
              editor.isActive('heading', { level: 1 }) ? '1' :
              editor.isActive('heading', { level: 2 }) ? '2' :
              editor.isActive('heading', { level: 3 }) ? '3' : '0'
            }
            className="heading-select"
          >
            <option value="0">Normal</option>
            <option value="1">Judul 1</option>
            <option value="2">Judul 2</option>
            <option value="3">Judul 3</option>
          </select>
        </div>

        <div className="toolbar-divider"></div>

        {/* Text Alignment Group */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
            title="Rata Kiri"
          >
            ⬅
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
            title="Rata Tengah"
          >
            ⬌
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
            title="Rata Kanan"
          >
            ➡
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}
            title="Rata Kiri-Kanan"
          >
            ⬍
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'active' : ''}
            title="List Bullet"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'active' : ''}
            title="List Nomor"
          >
            1. List
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'active' : ''}
            title="Kutipan"
          >
            " Kutip
          </button>
          <button
            type="button"
            onClick={addLink}
            className={editor.isActive('link') ? 'active' : ''}
            title="Link"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={addImage}
            title="Sisipkan Gambar"
          >
            🖼️
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Image Controls */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => setImageSize('small')}
            title="Ukuran Kecil (25%)"
          >
            🔸 S
          </button>
          <button
            type="button"
            onClick={() => setImageSize('medium')}
            title="Ukuran Sedang (50%)"
          >
            🔶 M
          </button>
          <button
            type="button"
            onClick={() => setImageSize('large')}
            title="Ukuran Besar (75%)"
          >
            🟧 L
          </button>
          <button
            type="button"
            onClick={() => setImageSize('custom')}
            title="Ukuran Custom"
          >
            📏
          </button>
        </div>

        <div className="toolbar-divider"></div>

        {/* Image Position */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => setImagePosition('left')}
            title="Gambar ke Kiri"
          >
            ⬅ Kiri
          </button>
          <button
            type="button"
            onClick={() => setImagePosition('center')}
            title="Gambar ke Tengah"
          >
            ⬌ Tengah
          </button>
          <button
            type="button"
            onClick={() => setImagePosition('right')}
            title="Gambar ke Kanan"
          >
            ➡ Kanan
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>
      </div>

      <div className="tiptap-content">
        <EditorContent editor={editor} />
      </div>

      <div className="tiptap-footer">
        💡 <strong>Tips:</strong> Klik gambar, lalu gunakan tombol S/M/L untuk resize. Gunakan ⬅⬌➡ untuk posisi gambar (kiri/tengah/kanan)
      </div>
    </div>
  );}
