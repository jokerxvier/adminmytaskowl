'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface SimpleRichEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const SimpleRichEditor = ({ 
  content = '', 
  onChange, 
  placeholder = 'Start typing...', 
  className = '' 
}: SimpleRichEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${className}`,
        style: 'min-height: 120px; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px;'
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
  })

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  if (!editor) {
    return (
      <div className="min-h-[120px] border border-gray-300 rounded-lg p-3 bg-gray-50 flex items-center justify-center text-gray-500">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="border border-gray-300 border-b-0 rounded-t-lg p-2 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm border rounded ${
            editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-default'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm border rounded ${
            editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-default'
          }`}
        >
          <em>I</em>
        </button>
      </div>
      
      {/* Editor Content */}
      <div className="border border-gray-300 rounded-b-lg">
        <EditorContent editor={editor} />
      </div>
      
      {/* Helper text */}
      <div className="mt-2 text-xs text-gray-500">
        {placeholder}
      </div>
    </div>
  )
}

export default SimpleRichEditor