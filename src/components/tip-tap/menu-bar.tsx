'use client'
import { cn } from '@/lib/utils'
import { Editor } from '@tiptap/react'
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Code2Icon,
  CodeIcon,
  Highlighter,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  StrikethroughIcon,
} from 'lucide-react'
import React, { ReactNode, useCallback, useRef, useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

function MenuBarButton({
  onClick,
  active,
  icon,
  ...props
}: {
  onClick?: () => void
  active: boolean
  icon: ReactNode
} & React.ComponentProps<'button'>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-7 h-7 items-center justify-center rounded disabled:opacity-50',
        active && 'bg-slate-600',
      )}
      {...props}
    >
      {icon}
    </button>
  )
}

export function MenuBar({ editor }: { editor: Editor | null }) {
  const [linkUrl, setLinkUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const linkDialogCloseRef = useRef<HTMLButtonElement>(null)
  const imageDialogCloseRef = useRef<HTMLButtonElement>(null)

  const setLink = useCallback(() => {
    if (!editor) return

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl })
      .run()

    setLinkUrl('')
    linkDialogCloseRef.current?.click()
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (!editor) return

    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      imageDialogCloseRef.current?.click()
    }
  }, [editor, imageUrl])

  if (!editor) {
    return null
  }

  function getTextSelectValue() {
    if (!editor) return 'normal-text'

    if (editor.isActive('paragraph')) {
      return 'normal-text'
    } else if (editor.isActive('heading', { level: 1 })) {
      return 'heading-1'
    } else if (editor.isActive('heading', { level: 2 })) {
      return 'heading-2'
    } else if (editor.isActive('heading', { level: 3 })) {
      return 'heading-3'
    } else {
      return 'normal-text'
    }
  }

  function getAlignSelectValue() {
    if (!editor) return 'left'

    if (editor.isActive({ textAlign: 'left' })) {
      return 'left'
    } else if (editor.isActive({ textAlign: 'center' })) {
      return 'center'
    } else if (editor.isActive({ textAlign: 'right' })) {
      return 'right'
    } else if (editor.isActive({ textAlign: 'justify' })) {
      return 'justify'
    } else {
      return 'left'
    }
  }

  function handleTextSelect(
    val: 'normal-text' | 'heading-1' | 'heading-2' | 'heading-3',
  ) {
    if (!editor) return null

    if (val === 'normal-text') {
      editor.chain().focus().setParagraph().run()
    } else if (val === 'heading-1') {
      editor.chain().focus().setHeading({ level: 1 }).run()
    } else if (val === 'heading-2') {
      editor.chain().focus().setHeading({ level: 2 }).run()
    } else if (val === 'heading-3') {
      editor.chain().focus().setHeading({ level: 3 }).run()
    }
  }

  function handleAlignSelect(val: 'left' | 'center' | 'right' | 'justify') {
    if (!editor) return null

    editor.chain().focus().setTextAlign(val).run()
  }

  if (!editor) {
    return null
  }

  return (
    <div className="flex w-full items-center gap-2">
      {/* <div className="flex gap-[0.5rem]">
        <MenuBarButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          icon={<Undo2Icon size={20} />}
          disabled={!editor.can().undo()}
        />
        <MenuBarButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          icon={<Redo2Icon size={20} />}
          disabled={!editor.can().redo()}
        />
      </div> */}
      <Select value={getTextSelectValue()} onValueChange={handleTextSelect}>
        <SelectTrigger className="pl-2 pr-1 rounded border-0 focus:ring-zinc-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="normal-text" className="text-sm">
            Texto normal
          </SelectItem>
          <SelectItem value="heading-1" className="text-2xl font-bold">
            Heading 1
          </SelectItem>
          <SelectItem value="heading-2" className="text-lg font-bold">
            Heading 2
          </SelectItem>
          <SelectItem value="heading-3" className="text-base font-bold">
            Heading 3
          </SelectItem>
        </SelectContent>
      </Select>
      <Select value={getAlignSelectValue()} onValueChange={handleAlignSelect}>
        <SelectTrigger className="w-fit pl-2 pr-1 rounded border-0 focus:ring-zinc-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-fit min-w-0">
          <SelectItem value="left" hideIcon>
            <AlignLeftIcon size={20} />
          </SelectItem>
          <SelectItem value="center" hideIcon>
            <AlignCenterIcon size={20} />
          </SelectItem>
          <SelectItem value="right" hideIcon>
            <AlignRightIcon size={20} />
          </SelectItem>
          <SelectItem value="justify" hideIcon>
            <AlignJustifyIcon size={20} />
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-[0.5rem]">
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={<BoldIcon size={20} />}
        />
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={<ItalicIcon size={20} />}
        />
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={<StrikethroughIcon size={20} />}
        />
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
          icon={<CodeIcon size={20} />}
        />
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive('highlight')}
          icon={<Highlighter size={20} />}
        />
      </div>
      <div className="flex gap-[0.5rem]">
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={<ListIcon size={20} />}
        />
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={<ListOrderedIcon size={20} />}
        />
      </div>

      <div className="flex gap-[0.5rem]">
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <MenuBarButton
              active={editor.isActive('link')}
              icon={<LinkIcon size={20} />}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <label htmlFor="link">URL</label>
                <Input
                  id="link"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setLink()
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose ref={linkDialogCloseRef} asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={setLink}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <MenuBarButton
              active={editor.isActive('image')}
              icon={<ImageIcon size={20} />}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar imagem</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 p-4">
              <div className="grid gap-2">
                <label htmlFor="image-url">Link da Imagem</label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addImage()
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter className="p-4">
              <DialogClose ref={imageDialogCloseRef} asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={addImage} disabled={!imageUrl}>
                Inserir imagem
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <MenuBarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={<Code2Icon size={20} />}
        />
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={<QuoteIcon size={20} />}
        />
        {/* <MenuBarButton
          onClick={() => {
            console.log('TODO: Adicionar linha horizontal')
          }}
          active={false}
          icon={<MinusIcon size={20} />}
        /> */}
      </div>
    </div>
  )
}
