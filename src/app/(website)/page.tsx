"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '~/components/ui/button';
import { Quote, Link as LinkIcon, Bold, Image as ImageIcon, Italic, Strikethrough, List, ListOrdered } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { ImagesToBase64 } from '~/lib/shared/images';
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Blockquote from '@tiptap/extension-blockquote'
import { useState } from 'react';

// Чтобы работали некоторые расширения, нужно добавить им CSS
// Например, чтобы заставить работать Blockquote и списки нужно сделать так:
//
// globals.css
//   ul {
//   @apply list-disc pl-4;
// }
//
// ol {
//   @apply list-decimal pl-4;
// }
//
// blockquote {
//   @apply border-l-4 border-muted p-4 pl-6 text-secondary-foreground;
// }

function RichTextEditor({
  text,
  setText,
}: {
  text: string;
  setText: (text: string) => void;
}) {
  Image.configure({
    allowBase64: true,
  })
  Blockquote.configure({
    HTMLAttributes: {
      class: 'bg-red-400 p-4 rounded-lg',
    },
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Youtube,
      Blockquote,
      Link,
      Dropcursor,
    ],
    content: text,
    onUpdate: ({ editor }) => {
      setText(editor.getText())
    }
  })

  if (!editor) return null

  return (
    <div className="flex flex-col gap-4 bg-secondary p-6 rounded-xl">
      <div className="flex flex-row gap-4">
        <Select
          value={
            editor.isActive("paragraph") ? "paragraph" :
              editor.isActive("heading") ? "h1" :
                editor.isActive("heading", { level: 2 }) ? "h2" :
                  editor.isActive("heading", { level: 3 }) ? "h3" :
                    "paragraph"
          }
          onValueChange={(value) => {
            // говно
            if (value === "paragraph") {
              editor.chain().focus().setParagraph().run()
              return;
            } else if (value === "h1") {
              editor.chain().focus().setHeading({ level: 1 }).run()
              return;
            } else if (value === "h2") {
              editor.chain().focus().setHeading({ level: 2 }).run()
              return;
            } else if (value === "h3") {
              editor.chain().focus().setHeading({ level: 3 }).run()
              return;
            }
          }}
        >
          <SelectTrigger className="w-fit px-6 gap-4">
            <SelectValue placeholder="Форматирование" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">
              Параграф
            </SelectItem>
            <SelectItem value="h1">
              Заголовок 1
            </SelectItem>
            <SelectItem value="h2">
              Заголовок 2
            </SelectItem>
            <SelectItem value="h3">
              Заголовок 3
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </Button>
        <Button
          variant={editor?.isActive("italic") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </Button>
        <Button
          variant={editor?.isActive("underline") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
          variant={editor?.isActive("link") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.commands.toggleLink({ href: "https://yandex.ru" })}
        >
          <LinkIcon className="size-4" />
        </Button>
        <Button
          variant={editor?.isActive("blockquote") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.commands.toggleBlockquote()}
        >
          <Quote className="size-4" />
        </Button>
        <Button
          variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.commands.toggleBulletList()}
        >
          <List className="size-4" />
        </Button>
        <Button
          variant={editor?.isActive("orderedList") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.commands.toggleOrderedList()}
        >
          <ListOrdered className="size-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <ImageIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Input type="file"
              onChange={async (e) => {
                if (!e.target.files?.[0]) return;

                const image = (await ImagesToBase64([e.target.files[0]]))[0]!;
                editor.commands.setImage({ src: image })
              }}
            />
          </DialogContent>
        </Dialog>

      </div>
      <EditorContent editor={editor} className="p-4 border border-input rounded-xl" />
    </div>
  )
}


export default function Home() {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col gap-4 bg-secondary p-6 rounded-xl">
      <RichTextEditor text={text} setText={setText} />
    </div>
  )
}
