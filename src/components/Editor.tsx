"use client";
import {
  type Editor,
  EditorContent,
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import {
  Bold,
  Code2,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  UnderlineIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Toggle } from "~/components/ui/toggle";

import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import type { Level } from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Underline from "@tiptap/extension-underline";
import { api } from "~/trpc/react";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import js from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

import { lowlight } from "lowlight";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import Youtube from "@tiptap/extension-youtube";

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);
lowlight.registerLanguage("bash", bash);
lowlight.registerLanguage("php", php);
lowlight.registerLanguage("json", json);
lowlight.registerLanguage("python", python);
lowlight.registerLanguage("csharp", csharp);
lowlight.registerLanguage("c", c);
lowlight.registerLanguage("cpp", cpp);
lowlight.registerLanguage("java", java);
lowlight.registerLanguage("go", go);
lowlight.registerLanguage("rust", rust);

const HeadingsSheet = [
  {
    name: "Параграф",
    type: "paragraph",
    tag: "<p>",
    level: 0,
    style: "text-sm",
  },
  {
    name: "Заголовок 1",
    type: "h1",
    tag: "<h1>",
    level: 1,
    style: "text-2xl font-bold",
  },
  {
    name: "Заголовок 2",
    type: "h2",
    tag: "<h2>",
    level: 2,
    style: "text-lg font-bold",
  },
  {
    name: "Заголовок 3",
    type: "h3",
    tag: "<h3>",
    level: 3,
    style: "text-base font-bold",
  },
];
const IconClassName = "size-4";
StarterKit.configure({
  heading: {
    levels: [1, 2, 3],
  },
});

type Options = {
  links?: boolean;
  images?: boolean;
  code?: boolean;
  quotes?: boolean;
};

Link.configure({
  autolink: true,
});

export default function EditorText({
  text,
  setText,
  options,
  disabled,
  className,
  video
}: {
  text: string;
  className?:string;
  setText?: (text: string) => void;
  options?: Options;
  disabled?: boolean;
  video?:string;
}) {
  Youtube.options.HTMLAttributes = {
    class:"w-full mt-4 rounded-md"
  }
  const editor = useEditor({
    extensions: [
      StarterKit,
      Paragraph,
      Underline,
      Image,
      Blockquote,
      Link,
      CodeBlock,
      Youtube.configure({
        controls:true,
        nocookie:true,
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight, defaultLanguage: "python" }),
    ],
    onUpdate: ({ editor }) => {
      setText ? setText(editor.getHTML()) : "";
    },
    content: `
      ${text}

      ${video ?  `<div data-youtube-video><iframe src="${video}"/></div>` : ""}
    `,
  });


  if (disabled) {
    editor?.setEditable(false);
  }

  if (!editor) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Skeleton className="w-40 h-10 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="size-10 rounded-md" />
        </div>
        <Skeleton className="h-40 w-full rounded-md" />
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full gap-4 rounded-xl focus:outline-none">
      {disabled ?? (
        <EditorControllers
          editor={editor}
          options={options}
        />
      )}
      <EditorContent
        editor={editor}
        className={ cn("p-4 border border-input rounded-xl tiptap bg-secondary tiptap" , className)}
      />
    </div>
  );
}

function EditorControllers({
  editor,
  options,
}: {
  editor: Editor;
  options?: Options;
}) {
  const [currentHeading, setCurrentHeading] = useState(HeadingsSheet[0]!);

  useEffect(() => {
    if (currentHeading.level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor
        .chain()
        .focus()
        .setHeading({ level: currentHeading.level as Level })
        .run();
    }
  }, [currentHeading, editor]);

  return (
    <>
      <div className="flex flex-row gap-4 dark:bg-inherit bg-white">
        <Select
          onValueChange={(value) => {
            setCurrentHeading(
              HeadingsSheet.find((e) => e.type === value) ?? HeadingsSheet[0]!,
            );
          }}
        >
          <SelectTrigger className="w-fit px-6 gap-4 dark:bg-neutral-800 bg-white hover:bg-gray-300 transition-all">
            <SelectValue placeholder="Форматирование" />
          </SelectTrigger>
          <SelectContent>
            {HeadingsSheet.map((heading) => {
              return (
                <SelectItem
                  key={heading.type}
                  value={heading.type}
                  className={heading.style}
                >
                  {heading.name}
                </SelectItem>
              );
            })}
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
        <div className="flex gap-0.5">
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

function PasteImage({
  editor,
}: {
  editor: Editor;
}) {
  const [openDialog, setOpenDialog] = useState(false);

  const uploadImageMutation = api.file.create.useMutation({
    onSuccess: (res) => {
      setOpenDialog(false);
      editor.commands.setImage({ src: `/api/file/${res.id}` });
    },
    onError: (err) => {
      toast.error("Ошибка", {
        description: err.message,
      });
    },
  });

  return (
    <Dialog
      open={openDialog}
      onOpenChange={setOpenDialog}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <ImageIcon className={IconClassName} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Input
          type="file"
          disabled={uploadImageMutation.isPending}
          onUpload={(f) => {
            if (!f[0]) return;
            uploadImageMutation.mutate({
              ...f[0],
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
function PasteCodeBlock({
  editor,
}: {
  editor: Editor;
}) {
  return (
    <Toggle
      pressed={editor.isActive("codeBlock")}
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    >
      <Code2 className={IconClassName} />
    </Toggle>
  );
}

function CodeBlockComponent({
  updateAttributes,
}: {
  updateAttributes: (val: {
    language: string;
  }) => void;
}) {
  return (
    <NodeViewWrapper className="code-block">
      <Select
        onValueChange={(value) => {
          updateAttributes({
            language: value,
          });
        }}
      >
        <SelectTrigger className="w-fit bg-transparent border-0 h-fit gap-4 mb-2 rounded-none p-1">
          <SelectValue placeholder="Язык" />
        </SelectTrigger>
        <SelectContent>
          {lowlight.listLanguages().map((lang, index) => (
            <SelectItem
              key={index}
              value={lang}
            >
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}
