import React from 'react';

export default function BubbleView({ node, depth = 0 }) {
  if (!node.label) return null;
  return (
    <div style={{ marginLeft: depth > 0 ? '20px' : '0', marginTop: '12px' }}>
      <div
        style={{
          background: 'var(--color-background-secondary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '12px 16px',
          display: 'inline-block',
          minWidth: '100px',
          textAlign: 'center',
          fontWeight: '500',
          fontSize: '15px',
          color: 'var(--color-text-primary)',
        }}
      >
        {node.label}
      </div>
      {node.children && node.children.length > 0 && (
        <div style={{ marginTop: '12px', borderLeft: '2px solid var(--color-border-tertiary)', paddingLeft: '16px' }}>
          {node.children.map((child, idx) => (
            <BubbleView key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
