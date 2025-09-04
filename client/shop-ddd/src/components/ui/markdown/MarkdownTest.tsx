import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

const MarkdownTest: React.FC = () => {
    // Test different markdown list formats
    const testCases = [
        {
            title: "Current (4 spaces - creates code block)",
            content: `* Real estate agents, property managers, and administrative staff at real estate agencies.
    - Content`
        },
        {
            title: "Correct (2 spaces - creates nested list)",
            content: `* Real estate agents, property managers, and administrative staff at real estate agencies.
  - Content`
        },
        {
            title: "Alternative (using tabs)",
            content: `* Real estate agents, property managers, and administrative staff at real estate agencies.
\t- Content`
        },
        {
            title: "Multiple levels",
            content: `* Real estate agents, property managers, and administrative staff at real estate agencies.
  - Content
  - More content
    - Deeply nested content`
        }
    ];

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">Markdown List Test</h1>
            {testCases.map((testCase, index) => (
                <div key={index} className="border p-4 rounded">
                    <h3 className="font-semibold mb-2">{testCase.title}</h3>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Raw content:</p>
                        <pre className="bg-gray-100 p-2 text-xs overflow-x-auto">{testCase.content}</pre>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Rendered:</p>
                        <div className="border p-2 bg-white">
                            <MarkdownRenderer content={testCase.content} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MarkdownTest;
