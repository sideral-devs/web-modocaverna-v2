'use client'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useRef, useState } from 'react'
import { MenuBar } from './menu-bar'

interface NotedEditorProps {
  startingContent: string
  documentId: string
  editable: boolean
}

export function NoteEditor({
  startingContent,
  editable,
  documentId,
}: NotedEditorProps) {
  const queryClient = useQueryClient()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [content, setContent] = useState(startingContent)

  async function saveContent(newContent: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const doc = new DOMParser().parseFromString(newContent, 'text/html')
      const firstTextElement = doc.body.querySelector(
        'p, h1, h2, h3, h4, h5, h6, div, span',
      )
      const firstLine = firstTextElement?.textContent?.trim() || ''

      await api.post('/notas/upload/' + documentId, {
        descricao: firstLine,
        anotacao: newContent,
      })

      queryClient.refetchQueries({ queryKey: ['note-content', documentId] })
    }, 500)
  }

  const editor = useEditor({
    autofocus: true,
    editable,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl p-4 focus:outline-none',
      },
    },
    extensions: [
      StarterKit,
      Typography,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full',
        },
      }),
    ],
    content,
    onUpdate({ editor }) {
      const html = editor.getHTML()
      setContent(html)
      saveContent(html)
    },
  })

  return (
    <div className="flex flex-col w-full h-full">
      <MenuBar editor={editor} />
      <EditorContent className="h-full" editor={editor} />
    </div>
  )
}
