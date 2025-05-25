import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function MarkdownRenderer({ children }) {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                code({ node, inline, className, children: codeChildren, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match?.[1] || 'text';

                    return !inline ? (
                        <div className="relative my-4 rounded-lg overflow-hidden shadow-lg">
                            <div className="flex items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className="ml-2 text-xs text-gray-300">
                                    {language}
                                </span>
                            </div>
                            <SyntaxHighlighter
                                style={atomDark}
                                language={language}
                                PreTag="div"
                                customStyle={{
                                    margin: 0,
                                    padding: '1rem',
                                    background: '#282C34',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                }}
                                codeTagProps={{
                                    style: {
                                        fontFamily: '"Fira Code", "Consolas", "Monaco", "Andale Mono", monospace',
                                    }
                                }}
                                {...props}
                            >
                                {String(codeChildren).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className="px-1.5 py-0.5 rounded bg-gray-100 text-red-600 text-sm font-mono">
                            {codeChildren}
                        </code>
                    );
                },

                p({ node, children, ...props }) {
                    return (
                        <p className="mb-4 text-gray-800 leading-relaxed" {...props}>
                            {children}
                        </p>
                    );
                },

                h1({ node, children, ...props }) {
                    return (
                        <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2" {...props}>
                            {children}
                        </h1>
                    );
                },

                h2({ node, children, ...props }) {
                    return (
                        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800" {...props}>
                            {children}
                        </h2>
                    );
                },

                h3({ node, children, ...props }) {
                    return (
                        <h3 className="text-xl font-medium mt-5 mb-2 text-gray-700" {...props}>
                            {children}
                        </h3>
                    );
                },

                ul({ node, children, ...props }) {
                    return (
                        <ul className="list-disc pl-6 mb-4 space-y-1" {...props}>
                            {children}
                        </ul>
                    );
                },

                ol({ node, children, ...props }) {
                    return (
                        <ol className="list-decimal pl-6 mb-4 space-y-1" {...props}>
                            {children}
                        </ol>
                    );
                },

                li({ node, children, ...props }) {
                    return (
                        <li className="mb-1 text-gray-700" {...props}>
                            {children}
                        </li>
                    );
                },

                blockquote({ node, children, ...props }) {
                    return (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 bg-gray-50 py-2 my-4" {...props}>
                            {children}
                        </blockquote>
                    );
                },

                a({ node, children, href, ...props }) {
                    return (
                        <a
                            href={href}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        >
                            {children}
                        </a>
                    );
                },

                table({ node, children, ...props }) {
                    return (
                        <div className="overflow-x-auto my-4 shadow-sm rounded-lg border">
                            <table className="min-w-full divide-y divide-gray-200" {...props}>
                                {children}
                            </table>
                        </div>
                    );
                },

                thead({ node, children, ...props }) {
                    return (
                        <thead className="bg-gray-50" {...props}>
                            {children}
                        </thead>
                    );
                },

                th({ node, children, ...props }) {
                    return (
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>
                            {children}
                        </th>
                    );
                },

                tr({ node, children, ...props }) {
                    return (
                        <tr className="hover:bg-gray-50 even:bg-gray-50" {...props}>
                            {children}
                        </tr>
                    );
                },

                td({ node, children, ...props }) {
                    return (
                        <td className="px-4 py-3 text-sm text-gray-700" {...props}>
                            {children}
                        </td>
                    );
                },

                img({ node, src, alt, ...props }) {
                    return (
                        <div className="my-4 rounded-lg overflow-hidden shadow-md">
                            <img
                                src={src}
                                alt={alt}
                                className="max-w-full h-auto mx-auto"
                                {...props}
                            />
                            {alt && (
                                <p className="text-center text-xs text-gray-500 mt-1">
                                    {alt}
                                </p>
                            )}
                        </div>
                    );
                },

                hr({ node, ...props }) {
                    return (
                        <hr className="my-6 border-gray-200" {...props} />
                    );
                },
            }}
        >
            {children}
        </Markdown>
    );
}