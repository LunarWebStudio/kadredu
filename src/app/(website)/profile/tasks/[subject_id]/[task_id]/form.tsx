'use client'
import { Coins } from "lucide-react";
import { useState } from "react";
import EditorText from "~/components/Editor";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";



export function TaskForm(){

  const [text, setText] = useState("")

  return (
    <div className="w-full rounded-2xl bg-secondary">
      <div className="w-full border-b-2 px-6 py-4 text-lg font-bold text-muted-foreground">
        Решение
      </div>
      <div className="flex flex-col gap-4 p-6">
        <EditorText options={{
          code:true,
          quotes:true,
          links:true
        }} text={text} setText={setText} />
        <div>
          <Input type="file" />
        </div>
      </div>
      <div className="border-t-2 flex flex-col gap-2 px-6 py-4">
        <Button className="max-w-32">Отправить</Button>
      </div>
    </div>
  )
}
