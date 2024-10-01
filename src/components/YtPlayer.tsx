'use client'

import { EditorContent, useEditor } from "@tiptap/react"
import { Youtube } from "@tiptap/extension-youtube"
import Document from "@tiptap/extension-document"
import Text from "@tiptap/extension-text"
import { Skeleton } from "./ui/skeleton"
import { cn } from "~/lib/utils"


export function YtPlayer({ url, className}:
  {
    url:string | null
    className?:string

  }){

  Youtube.options.HTMLAttributes = {
    class:"w-full rounded-md"
  }

  const editor = useEditor({
    extensions:[
      Document,
      Text,
      Youtube.configure({
        controls:true,
        nocookie:true,
      })
    ],
    editorProps:{
      attributes:{
        class: "w-full h-full",
      },
    },
    content:`
      <div data-youtube-video >
        <iframe  src="${url}" ></iframe>
      </div>
    `,
    injectCSS:true
  })

  const t = editor?.options.element
  console.log(t)

  if(!editor){
    return (
      <div className="space-y-2">
        <Skeleton className={cn("md:h-[600px] w-full rounded-md", className)} />
      </div>
    )
  }

  return (
    <div className={className}>
      <EditorContent className="h-full w-full"  editor={editor} />
    </div>
  )
}
