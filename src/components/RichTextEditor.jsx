import React, { useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Type } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleSelect = (e) => {
    setSelectionStart(e.target.selectionStart);
    setSelectionEnd(e.target.selectionEnd);
  };

  const insertFormatting = (prefix, suffix = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    let newText;
    if (selectedText) {
      // Wrap selected text
      newText = beforeText + prefix + selectedText + suffix + afterText;
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // Insert at cursor
      newText = beforeText + prefix + suffix + afterText;
      const newCursorPos = start + prefix.length;
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const insertBulletPoint = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(start);
    
    // Check if we're at the start of a line
    const lastNewline = beforeText.lastIndexOf('\n');
    const currentLineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    const currentLine = beforeText.substring(currentLineStart);
    
    let newText;
    if (currentLine.trim() === '') {
      // Add bullet at current position
      newText = beforeText + '• ' + afterText;
      const newCursorPos = start + 2;
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // Add bullet on new line
      newText = beforeText + '\n• ' + afterText;
      const newCursorPos = start + 3;
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const insertNumberedPoint = () => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(start);
    
    // Count existing numbered items to determine next number
    const numberedItems = (value.match(/^\d+\./gm) || []).length;
    const nextNumber = numberedItems + 1;
    
    const lastNewline = beforeText.lastIndexOf('\n');
    const currentLineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    const currentLine = beforeText.substring(currentLineStart);
    
    let newText;
    if (currentLine.trim() === '') {
      newText = beforeText + `${nextNumber}. ` + afterText;
      const newCursorPos = start + `${nextNumber}. `.length;
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      newText = beforeText + `\n${nextNumber}. ` + afterText;
      const newCursorPos = start + `\n${nextNumber}. `.length;
      onChange(newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border border-gray-300 rounded-t-lg">
        <button
          type="button"
          onClick={() => insertFormatting('**', '**')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold (wrap text with **)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('*', '*')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic (wrap text with *)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={insertBulletPoint}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet Point"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertNumberedPoint}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="ml-auto text-xs text-gray-500 flex items-center gap-1">
          <Type className="w-3 h-3" />
          <span>**bold** *italic*</span>
        </div>
      </div>
      
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-t-0 border-gray-300 rounded-b-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        rows="6"
      />
      
      {/* Help Text */}
      <div className="mt-1 text-xs text-gray-500">
        Select text and click formatting buttons, or use: **bold**, *italic*, • bullets, 1. numbered
      </div>
    </div>
  );
};

export default RichTextEditor;
