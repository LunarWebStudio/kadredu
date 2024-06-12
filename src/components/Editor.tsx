"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import {
  Link as LinkIcon,
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
// import {lowlight} from 'lowlight/lib/core'

// import js from "highlight.js/lib/languages/javascript"
// import ts from "highlight.js/lib/languages/typescript"

// lowlight.registerLanguage('js', js)
// lowlight.registerLanguage('ts', ts)
// lowlight.registerLanguage('html', html)
// lowlight.registerLanguage('css', css)
// lowlight.registerLanguage('js', js)


// type Heading  = {
//   name:string
//   type:string
//   tag:string
//   level:number
// }

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
  images?: (arg0: typeof ImagesToBase64) => void,
  code?: boolean,
  quotes?: boolean
};

export default function EditorText({ text, setText, options }:
  {
    text: string,
    setText: (text: string) => void
    options?: Options
  }) {
  Link.configure({
    autolink: true
  })
  Image.configure({
    allowBase64: true,
  })
  const editor = useEditor({
    extensions: [
      StarterKit,
      Paragraph,
      Underline,
      Image,
      Blockquote,
      Link,
      CodeBlock
      // CodeBlockLowlight
      // .extend({
      //   addNodeView(){
      //     return ReactNodeViewRenderer(CodeBlockComponent)
      //   }
      // })

    ],
    onUpdate: ({ editor }) => {
      setText(editor.getText())
    },
    content: text
  });


  if (!editor) {
    // Placeholder
    return null;
  }
  return (
    <div className="flex flex-col h-full gap-4 p-6 rounded-xl focus:outline-none">
        <EditorControllers
        editor={editor}
        options={options}
        />
        <EditorContent
          editor={editor}
          className="p-4 border h-full border-input rounded-xl tiptap"
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
      <div className="flex flex-row gap-4">
        <Select
         onValueChange={(value)=>{
          setCurrentHeading(HeadingsSheet.find((e) => e.type === value) ?? HeadingsSheet[0]!)
        }}>
          <SelectTrigger className="w-fit px-6 gap-4 hover:bg-gray-300 transition-all">
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
          {options?.links && <PasteLink editor={editor} />}
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

function PasteLink({ editor }:
  {
    editor: Editor
  }
) {
  // TODO Нормальное диалоговое окно
  const SetLink = () => {
    const prevUrl = editor.getAttributes('link')

    const url = window.prompt('URL', prevUrl.href as string)
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.commands.toggleLink({ href: url, target: "_blank" })
  }

  return (
    <Toggle
      pressed={editor.isActive("link")}
      onClick={SetLink}
    >
      <LinkIcon className={IconClassName} />
    </Toggle>
  )
}
// function PasteImage({editor}:
//   {
//     editor:Editor
//     setImage:(arg0:typeof ImagesToBase64) => void
//   }
// ){
//   const [openDialog,setOpenDialog] = useState(false)
//   return(
//         <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//           <DialogTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//             >
//               <ImageIcon className={IconClassName} />
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <Input type="file"
//               onChange={async (e) => {
//                 if (!e.target.files?.[0]) return;

//                 const image = (await ImagesToBase64([e.target.files[0]]))[0]!;
//                 editor.commands.setImage({ src: image })

//                 setOpenDialog(false)
//               }}
//             />
//           </DialogContent>
//         </Dialog>
//   )
// }
function PasteCodeBlock({editor}:
  {
    editor: Editor
  }
) {

  return (
    <Toggle
      pressed={editor.isActive("codeBlock")}
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
    >
      <Code2 className={IconClassName} />
    </Toggle>
  )
}

// const CodeBlockComponent = ({ node: { attrs: { language: defaultLanguage } }, updateAttributes }) =>(
//   <NodeViewWrapper className="code-block">

//     <select contentEditable={false} defaultValue={defaultLanguage} onChange={event => updateAttributes({ language: event.target.value })}>
//       <option value="null">
//         auto
//       </option>
//       <option disabled>
//         —
//       </option>
//       {lowlight.listLanguages().map((lang, index) => (
//         <option key={index} value={lang}>
//           {lang}
//         </option>
//       ))}
//     </select>
//     <pre>
//       <NodeViewContent as="code" />
//     </pre>
//   </NodeViewWrapper>
// )
