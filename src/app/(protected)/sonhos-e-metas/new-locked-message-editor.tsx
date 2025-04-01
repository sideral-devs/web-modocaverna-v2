'use client'
import { MenuBar } from '@/components/tip-tap/menu-bar'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useRef, useState } from 'react'

interface NotedEditorProps {
  startingContent: string
  editable: boolean
  saveContentState?: (arg: { conteudo: string; descricao: string }) => void
}

export function NewLockedMessageEditor({
  startingContent,
  editable,
  saveContentState,
}: NotedEditorProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [content, setContent] = useState(startingContent)

  async function saveContent() {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const doc = new DOMParser().parseFromString(content, 'text/html')
      const firstTextElement = doc.body.querySelector(
        'p, h1, h2, h3, h4, h5, h6, div, span',
      )
      const firstLine = firstTextElement?.textContent?.trim() || ''

      if (saveContentState) {
        saveContentState({
          conteudo: content,
          descricao: firstLine,
        })
      }
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
      setContent(editor.getHTML())
      saveContent()
    },
  })

  return (
    <div className="flex flex-col w-full h-full min-h-[600px]">
      {editable && <MenuBar editor={editor} />}
      <EditorContent className="h-full" editor={editor} />
    </div>
  )
}
