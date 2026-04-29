import React from 'react';

export default function BracketView({ node, depth = 0 }) {
  if (!node.label) return null;
  return (
    <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
      [<span style={{ color: 'var(--color-text-info)' }}>{node.label}</span>
      {Array.isArray(node.children) && node.children.length > 0 && (
        <>
          {node.children.map((child, idx) => (
            <BracketView key={idx} node={child} depth={depth + 1} />
          ))}
        </>
      )}
      ]
    </span>
  );
}
