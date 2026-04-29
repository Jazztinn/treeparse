import React, { useState } from 'react';

export default function TreeStructure({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2); // Auto-expand first 2 levels

  if (!node.label) return null;

  const hasChildren = Array.isArray(node.children) && node.children.length > 0;

  return (
    <div style={{ marginLeft: depth > 0 ? '24px' : '0', marginBottom: '4px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: hasChildren ? 'pointer' : 'default',
          padding: '6px 8px',
          borderRadius: '4px',
          backgroundColor: hasChildren ? 'var(--color-background-tertiary)' : 'transparent',
          userSelect: 'none',
          transition: 'background-color 0.2s',
        }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <span
            style={{
              display: 'inline-flex',
              width: '16px',
              justifyContent: 'center',
              marginRight: '6px',
              color: 'var(--color-text-secondary)',
              fontSize: '12px',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            ▶
          </span>
        )}
        {!hasChildren && (
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              marginRight: '6px',
              textAlign: 'center',
            }}
          />
        )}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: 'var(--color-text-primary)',
            fontWeight: '500',
          }}
        >
          {node.label}
        </span>
        {hasChildren && (
          <span
            style={{
              marginLeft: '8px',
              fontSize: '11px',
              color: 'var(--color-text-tertiary)',
              fontWeight: '400',
            }}
          >
            ({node.children.length})
          </span>
        )}
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children.map((child, idx) => (
            <TreeStructure key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
