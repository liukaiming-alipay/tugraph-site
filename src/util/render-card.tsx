import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
export const renderCard = ({ node }: any): React.ReactNode => {
  try {
    const { name, value } = node?.children?.[0] || {};
    const jsonString = decodeURIComponent(value?.replace('data:', '')) || '';
    const nodeData = JSON.parse(jsonString);

    if (name === 'video') {
      return <video src={nodeData?.url} controls width="100%" />;
    }
    if (name === 'image') {
      return (
        <img
          src={nodeData?.src}
          alt={nodeData?.name}
          width={nodeData?.width}
          height={nodeData?.height}
        />
      );
    }
    if (name === 'codeblock') {
      return (
        <pre>
          <code className={`language-${nodeData?.name}`}>
            <SyntaxHighlighter language={nodeData?.name} PreTag="div">
              {String(nodeData?.code)?.replace(/\n$/, '')}
            </SyntaxHighlighter>
          </code>
        </pre>
      );
    }
    return null;
  } catch (error) {
    console.log('Error parsing JSON:', error);
    return null;
  }
};
