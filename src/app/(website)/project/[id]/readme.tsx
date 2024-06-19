"use client";

import DOMPurify from "dompurify";
import dynamic from "next/dynamic";

const MDXRemote = dynamic(() => import("next-mdx-remote/rsc"), {
  ssr: false
});

export default function Readme({ readme }: { readme: string }) {
  return <MDXRemote source={DOMPurify.sanitize(readme)} />;
}
