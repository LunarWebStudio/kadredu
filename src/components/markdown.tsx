'use client'
import { useState } from 'react';
import { remark } from 'remark'
import html from 'remark-html'

async function Parser(line:string){
  return (await remark()
    .use(html)
    .process(line))
    .toString();
}

export function  Markdown({text, className}:
  {
    text:string,
    className?:string
  }) {
  const regex = /<[^>]+>/;
  const pending =  text.split("\n").map((line) =>{
    if(regex.test(line) || line === '' ){
      return line
    }
    return Parser(line)
  })
  const [res, setRes] = useState<string>("pending")
  Promise.all(pending).then((fin) => setRes(fin.join('\n')))

  return (
    <>
      {
        res !== "pending" ? 
            <div className={className ?? "p-4 space-y-1"} dangerouslySetInnerHTML={{__html:res}}></div>
            :
            ""
      }
    </>
  )
}
