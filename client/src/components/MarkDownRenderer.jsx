// src/components/MarkdownRenderer.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import remarkGfm from 'remark-gfm';

const syntaxTheme = {
    plain: {
        color: "#393A34",
        backgroundColor: "#f6f8fa",
    },
    styles: [
        {
            types: ["comment", "prolog", "doctype", "cdata"],
            style: {
                color: "#999988",
                fontStyle: "italic",
            },
        },
        {
            types: ["namespace"],
            style: {
                opacity: 0.7,
            },
        },
        {
            types: ["string", "attr-value"],
            style: {
                color: "#e3116c",
            },
        },
        {
            types: ["punctuation", "operator"],
            style: {
                color: "#393A34",
            },
        },
        {
            types: [
                "entity",
                "url",
                "symbol",
                "number",
                "boolean",
                "variable",
                "constant",
                "property",
                "regex",
                "inserted",
            ],
            style: {
                color: "#36acaa",
            },
        },
        {
            types: ["atrule", "keyword", "attr-name", "selector"],
            style: {
                color: "#00a4db",
            },
        },
        {
            types: ["function", "deleted", "tag"],
            style: {
                color: "#d73a49",
            },
        },
        {
            types: ["function-variable"],
            style: {
                color: "#6f42c1",
            },
        },
        {
            types: ["tag", "selector", "keyword"],
            style: {
                color: "#00009f",
            },
        },
    ],
};

const MarkdownRenderer = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                        <div className="rounded-md overflow-hidden my-2">
                            <SyntaxHighlighter
                                language={match[1]}
                                style={syntaxTheme}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        </div>
                    ) : (
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-600">
                            {children}
                        </code>
                    );
                },
                pre({ children }) {
                    return <div className="my-2">{children}</div>;
                },
                h1({ children }) {
                    return <h1 className="text-2xl font-bold my-3">{children}</h1>;
                },
                h2({ children }) {
                    return <h2 className="text-xl font-bold my-2">{children}</h2>;
                },
                h3({ children }) {
                    return <h3 className="text-lg font-bold my-2">{children}</h3>;
                },
                ul({ children }) {
                    return <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                    return <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>;
                },
                blockquote({ children }) {
                    return (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">
                            {children}
                        </blockquote>
                    );
                },
                a({ children, href }) {
                    return (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {children}
                        </a>
                    );
                },
                table({ children }) {
                    return (
                        <div className="overflow-auto my-2">
                            <table className="min-w-full border">{children}</table>
                        </div>
                    );
                },
                th({ children }) {
                    return (
                        <th className="border px-4 py-2 text-left bg-gray-50 font-semibold">
                            {children}
                        </th>
                    );
                },
                td({ children }) {
                    return <td className="border px-4 py-2">{children}</td>;
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;