"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import { type Editor, ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Button } from "~/components/ui/button";
import {
  Bold,
  Image as ImageIcon,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  UnderlineIcon,
  Quote,
  Code2
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";

import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { ImagesToBase64 } from "~/lib/shared/images";

import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Toggle } from "~/components/ui/toggle";

import Paragraph from '@tiptap/extension-paragraph'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlock from "@tiptap/extension-code-block";
import { type Level } from '@tiptap/extension-heading'
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import php from 'highlight.js/lib/languages/php'
import json from 'highlight.js/lib/languages/json'
import python from 'highlight.js/lib/languages/python'
import csharp from 'highlight.js/lib/languages/csharp'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import java from 'highlight.js/lib/languages/java'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'

import { lowlight } from 'lowlight'

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)
lowlight.registerLanguage('bash', bash)
lowlight.registerLanguage('php', php)
lowlight.registerLanguage('json', json)
lowlight.registerLanguage('python', python)
lowlight.registerLanguage('csharp', csharp)
lowlight.registerLanguage('c', c)
lowlight.registerLanguage('cpp', cpp)
lowlight.registerLanguage('java', java)
lowlight.registerLanguage('go', go)
lowlight.registerLanguage('rust', rust)

const HeadingsSheet = [
  {
    name: "Параграф",
    type: "paragraph",
    tag: "<p>",
    level: 0,
    style: "text-sm"
  },
  {
    name: "Заголовок 1",
    type: "h1",
    tag: "<h1>",
    level: 1,
    style: "text-2xl font-bold"
  },
  {
    name: "Заголовок 2",
    type: "h2",
    tag: "<h2>",
    level: 2,
    style: "text-lg font-bold"
  },
  {
    name: "Заголовок 3",
    type: "h3",
    tag: "<h3>",
    level: 3,
    style: "text-base font-bold"
  }
];
const IconClassName = "size-4"
StarterKit.configure({
  heading: {
    levels: [1, 2, 3]
  }
})


type Options = {
  links?: boolean,
  images?: boolean,
  code?: boolean,
  quotes?: boolean
};

Link.configure({
  autolink: true
});

export default function EditorText({
  text,
  setText,
  options
}: {
  text: string,
  setText: (text: string) => void
  options?: Options
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Paragraph,
      Underline,
      Image,
      Blockquote,
      Link,
      CodeBlock,
      CodeBlockLowlight
        .extend({
          addNodeView() {
            return ReactNodeViewRenderer(CodeBlockComponent)
          }
        })
        .configure({ lowlight, defaultLanguage: "python" })

    ],
    onUpdate: ({ editor }) => {
      setText(editor.getText())
    },
    content: text
  });


  if (!editor) {
    // TODO: Placeholder
    return null;
  }
  return (
    <div className="flex flex-col gap-4 bg-secondary p-6 rounded-xl focus:outline-none">
      <EditorControllers
        editor={editor}
        options={options}
      />
      <EditorContent
        editor={editor}
        className="p-4 border border-input rounded-xl bg-white tiptap"
      />
    </div>
  );
}


function EditorControllers({
  editor,
  options
}: {
  editor: Editor,
  options?: Options
}) {
  const [currentHeading, setCurrentHeading] = useState(HeadingsSheet[0]!);

  useEffect(() => {
    if (currentHeading.level === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().setHeading({ level: currentHeading.level as Level }).run()
    }
  }, [currentHeading, editor]);

  return (
    <>
      <div className="flex flex-row gap-4 bg-white">
        <Select
          onValueChange={(value) => {
            setCurrentHeading(HeadingsSheet.find((e) => e.type === value) ?? HeadingsSheet[0]!)
          }}>
          <SelectTrigger className="w-fit px-6 gap-4 bg-white hover:bg-gray-300 transition-all">
            <SelectValue placeholder="Форматирование" />
          </SelectTrigger>
          <SelectContent>
            {
              HeadingsSheet.map((heading) => {
                return (
                  <SelectItem key={heading.type} value={heading.type} className={heading.style}>
                    {heading.name}
                  </SelectItem>
                )
              })
            }
          </SelectContent>
        </Select>
        <div className="flex gap-0.5">
          <Toggle
            pressed={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className={IconClassName} />
          </Toggle>
          <Toggle
            pressed={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className={IconClassName} />
          </Toggle>
          <Toggle
            pressed={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className={IconClassName} />
          </Toggle>
          <Toggle
            pressed={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className={IconClassName} />
          </Toggle>
        </div>
        <div className="flex gap-0.5" >
          <Toggle
            pressed={editor.isActive("bulletList")}
            onClick={() => editor.commands.toggleBulletList()}
          >
            <List className={IconClassName} />
          </Toggle>
          <Toggle
            pressed={editor.isActive("orderedList")}
            onClick={() => editor.commands.toggleOrderedList()}
          >
            <ListOrdered className={IconClassName} />
          </Toggle>
        </div>
        <div className="flex gap-0.5">
          {options?.images && <PasteImage editor={editor} />}
          {options?.code && <PasteCodeBlock editor={editor} />}
          {options?.quotes && (
            <Toggle
              pressed={editor.isActive("blockquote")}
              onClick={() => editor.commands.toggleBlockquote()}
            >
              <Quote className={IconClassName} />
            </Toggle>
          )}
        </div>
      </div>
    </>
  );
}

function PasteImage({ editor }: {
  editor: Editor
}) {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false)

  const uploadImageMutation = api.image.upload.useMutation({
    onSuccess: (res) => {
      setOpenDialog(false);
      editor.commands.setImage({ src: `/api/images/${res.storageId}` })
    },
    onError: (err) => {
      toast({
        title: "Ошибка загрузки изображения",
        description: err.message,
        variant: "destructive",
      })
    }
  })

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <ImageIcon className={IconClassName} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Input type="file"
          disabled={uploadImageMutation.isPending}
          onChange={async (e) => {
            if (!e.target.files?.[0]) return;
            const image = (await ImagesToBase64([e.target.files[0]]))[0]!;
            uploadImageMutation.mutate({ image: image })
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
function PasteCodeBlock({ editor }: {
  editor: Editor
}) {
  return (
    <Toggle
      pressed={editor.isActive("codeBlock")}
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    >
      <Code2 className={IconClassName} />
    </Toggle>
  )
}

function CodeBlockComponent({
  updateAttributes
}: {
  updateAttributes: (val: {
    language: string
  }) => void;
}) {
  return (
    <NodeViewWrapper className="code-block">
      <Select
        onValueChange={(value) => {
          updateAttributes({
            language: value
          })
        }}
      >
        <SelectTrigger
          className="w-fit bg-transparent border-0 h-fit gap-4 mb-2 rounded-none p-1"
        >
          <SelectValue placeholder="Язык" />
        </SelectTrigger>
        <SelectContent>
          {lowlight.listLanguages().map((lang, index) => (
            <SelectItem key={index} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  )
}
