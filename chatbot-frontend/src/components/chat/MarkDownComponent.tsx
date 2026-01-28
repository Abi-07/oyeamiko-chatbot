import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";

export const markdownComponents: Components = {
    code(props: any) {
        const { inline, className, children } = props;
        const match = /language-(\w+)/.exec(className || "");

        if (!inline && match) {
            return (
                <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
            );
        }

        return (
            <code
                className="bg-black/10 px-1 py-0.5 rounded"
                {...props}
            >
                {children}
            </code>
        );
    },
};
