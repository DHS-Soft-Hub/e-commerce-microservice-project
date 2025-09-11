import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

// Define the proper type for code component props
interface CodeProps extends ComponentPropsWithoutRef<'code'> {
    inline?: boolean;
    children?: React.ReactNode;
}

interface MarkdownRendererProps {
    content: string;
    className?: string;
    truncate?: number;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    className,
    truncate,
}) => {
    // Handle empty content
    if (!content) {
        return null;
    }

    // Preprocess content to fix common markdown formatting issues
    const preprocessContent = (text: string): string => {
        // Fix 4-space indented list items to 2-space (proper nested lists)
        return text.replace(/^([ \t]*[*+-].*)\n([ \t]{4,})([*+-])/gm, '$1\n  $3');
    };

    // Truncate content if needed
    const processedContent = preprocessContent(content);
    const displayContent = truncate && processedContent.length > truncate
        ? `${processedContent.substring(0, truncate)}...`
        : processedContent;

    // Define custom components
    const components = {
        // Override default element styling
        h1: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-xl font-bold mt-6 mb-4 break-words text-wrap" {...props} />,
        h2: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-lg font-bold mt-5 mb-3 break-words text-wrap" {...props} />,
        h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-md font-bold mt-4 mb-2 break-words text-wrap" {...props} />,
        a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="text-primary hover:underline break-all" {...props} />,
        ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc pl-6 my-3 break-words text-wrap" {...props} />,
        ol: ({ ...props }: React.OlHTMLAttributes<HTMLOListElement>) => <ol className="list-decimal pl-6 my-3 break-words text-wrap" {...props} />,
        li: ({ ...props }: React.LiHTMLAttributes<HTMLLIElement>) => <li className="my-1 break-words text-wrap" {...props} />,
        code: ({ className, children, inline, ...props }: CodeProps) => {
            const isInline = inline === true;
            return isInline
                ? <code className={cn("bg-muted rounded px-1 py-0.5 text-xs break-all", className)} {...props}>{children}</code>
                : <code className={cn("block bg-muted rounded p-2 overflow-x-auto text-xs my-3 whitespace-pre-wrap break-all", className)} {...props}>{children}</code>;
        },
        pre: ({ ...props }: React.HTMLAttributes<HTMLPreElement>) => <pre className="bg-muted rounded p-3 overflow-x-auto my-4 break-words whitespace-pre-wrap" {...props} />,
        blockquote: ({ ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) =>
            <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic my-4 break-words text-wrap" {...props} />,
        table: ({ ...props }: React.TableHTMLAttributes<HTMLTableElement>) => <table className="w-full border-collapse my-4 table-fixed" {...props} />,
        th: ({ ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) =>
            <th className="border border-muted p-2 bg-muted/50 font-medium break-words text-wrap" {...props} />,
        td: ({ ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className="border border-muted p-2 break-words text-wrap" {...props} />,
        p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p className="my-2 break-words text-wrap" {...props} />
    }; return (
        <span className={cn('prose prose-sm dark:prose-invert max-w-none block', className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
            >
                {displayContent}
            </ReactMarkdown>
        </span>
    );
};