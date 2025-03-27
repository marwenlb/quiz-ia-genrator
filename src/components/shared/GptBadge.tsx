import Link from "next/link";
import React from "react";
import { GptIcon } from "../icons/gpt";

export default function GptBadge() {
  return (
    <div>
    <div className="flex items-center justify-center text-center">
      <Link
        href="https://www.chatgpt.com/"
        target="_blank"
        rel="noreferrer noopener"
        className="text-sm text-zinc-600"
      >
        <GptIcon />
      </Link>
    </div>

    <div className="flex flex-col items-center justify-center text-sm text-white">
      <p >
      Powered by Khalil & Marouene using GPT-4</p>
      </div>
      </div>
  );
}
