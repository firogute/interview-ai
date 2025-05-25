import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function MarkdownRenderer({ children }) {
    return (
        <div className="w-full max-w-full overflow-x-auto">
            <Markdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                    code({ node, inline, className, children: codeChildren, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const [copied, setCopied] = useState(false);

                        return !inline && match ? (
                            <div className="relative group my-4 w-full max-w-full overflow-x-auto rounded-md bg-[#282a36]">
                                <CopyToClipboard
                                    text={String(codeChildren).trim()}
                                    onCopy={() => {
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                >
                                    <button
                                        className="absolute top-2 right-2 z-10 bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition cursor-pointer"
                                        title="Copy code"
                                    >
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </CopyToClipboard>

                                <div className="overflow-x-auto w-full cursor-pointer">
                                    <SyntaxHighlighter
                                        style={dracula}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                            margin: 0,
                                            padding: "1rem",
                                            background: "transparent",
                                            fontSize: "0.875rem",
                                            minWidth: "100%",
                                        }}
                                        {...props}
                                    >
                                        {String(codeChildren).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        ) : (
                            <code className="bg-gray-200 text-pink-600 px-1 py-0.5 rounded text-sm font-mono cursor-pointer">
                                {codeChildren}
                            </code>
                        );
                    },

                    p({ children, ...props }) {
                        return (
                            <p className="text-gray-800 leading-relaxed break-words whitespace-pre-line mb-3">
                                {children}
                            </p>
                        );
                    },

                    a({ href, children, ...props }) {
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-words"
                            >
                                {children}
                            </a>
                        );
                    },

                    ul({ children }) {
                        return <ul className="list-disc list-inside text-gray-800 mb-2">{children}</ul>;
                    },

                    ol({ children }) {
                        return <ol className="list-decimal list-inside text-gray-800 mb-2">{children}</ol>;
                    },

                    blockquote({ children }) {
                        return (
                            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">
                                {children}
                            </blockquote>
                        );
                    },
                }}
            >
                {children}
            </Markdown>
        </div>
    );
}
