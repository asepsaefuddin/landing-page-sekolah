"use client";

import { useMemo } from "react";

interface RichTextContentProps {
  content: string;
  className?: string;
}

// Fungsi untuk mengkonversi plain text format ke HTML untuk display
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
        if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
        if (inBulletList) { result.push('</ul>'); inBulletList = false; }
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
      
      // Regular paragraph
      if (inNumberedList) { result.push('</ol>'); inNumberedList = false; }
      if (inBulletList) { result.push('</ul>'); inBulletList = false; }
      
      result.push(`<p>${processInlineFormatting(trimmed)}</p>`);
    });
    
    // Close any open tags
    if (inNumberedList) result.push('</ol>');
    if (inBulletList) result.push('</ul>');
    
    return result.join('\n');
  } catch (error) {
    console.error('Error converting plain text to HTML:', error);
    return plainText;
  }
};

// Helper function untuk process inline formatting (bold, italic, underline, links)
const processInlineFormatting = (text: string): string => {
  // Convert links first
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Convert bold **text** (harus dilakukan sebelum italic)
  text = text.replace(/\*([^*]+?)\*/g, '<strong>$1</strong>');
  
  // Convert underline __text__
  text = text.replace(/_([^_]+?)_/g, '<u>$1</u>');
  
  // Convert italic -text- (setelah bold, dan bukan bagian dari **)
  text = text.replace(/-([^-]+?)-/g, '<em>$1</em>');
  
  return text;
};

export default function RichTextContent({ content, className = '' }: RichTextContentProps) {
  const htmlContent = useMemo(() => {
    if (!content) return '';
    
    // Jika content sudah HTML (mengandung tag HTML selain img), convert dulu ke plain text lalu ke HTML
    // Jika sudah plain text, langsung convert ke HTML
    if (content.match(/<(?!img\s)[a-z]+[^>]*>/i)) {
      // HTML lama, perlu dikonversi dulu (ini seharusnya tidak terjadi karena kita sudah save sebagai plain text)
      // Tapi untuk backward compatibility, kita biarkan
      return content;
    }
    
    return plainTextToHtml(content);
  }, [content]);
  
  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

