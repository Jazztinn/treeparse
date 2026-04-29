import React, { useState, useRef } from 'react';
import BracketView from '../components/BracketView';
import BubbleView from '../components/BubbleView';

export default function TreeParse() {
  const [tree, setTree] = useState({ label: '', children: [] });
  const [currentPath, setCurrentPath] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('bubble');
  const inputRef = useRef(null);

  const getCurrentNode = () => {
    let node = tree;
    for (let idx of currentPath) {
      if (!node.children || !Array.isArray(node.children) || !node.children[idx]) {
        return { label: '', children: [] };
      }
      node = node.children[idx];
    }
    if (!node.children || !Array.isArray(node.children)) {
      node.children = [];
    }
    return node;
  };

  const addNode = (label) => {
    if (!label.trim()) return;
    const newNode = { label: label.trim(), children: [] };
    if (currentPath.length === 0 && !tree.label) {
      setTree(newNode);
    } else {
      setTree(prevTree => {
        const deepCopy = JSON.parse(JSON.stringify(prevTree));
        let node = deepCopy;
        for (let idx of currentPath) {
          if (!node.children || !Array.isArray(node.children)) {
            node.children = [];
          }
          node = node.children[idx];
        }
        if (!node.children || !Array.isArray(node.children)) node.children = [];
        node.children.push(newNode);
        return deepCopy;
      });
    }
    setCurrentPath([...currentPath, (getCurrentNode().children?.length || 0)]);
    setInput('');
  };

  const goUp = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      const currentNode = getCurrentNode();
      if (currentNode.children && currentNode.children.length > 0) {
        setCurrentPath([...newPath, currentNode.children.length]);
      }
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        addNode(input);
        if (currentPath.length === 0) {
          setCurrentPath([0]);
        }
      }
    } else if (e.key === 'Backspace' && !input) {
      e.preventDefault();
      goUp();
    }
  };

  return (
    <div style={{ padding: '1.5rem 0', fontFamily: 'var(--font-sans)' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 1.5rem 0', color: 'var(--color-text-primary)' }}>
        TreeParse
      </h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setMode('bubble')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--border-radius-md)',
            border: `0.5px solid ${mode === 'bubble' ? 'var(--color-border-info)' : 'var(--color-border-tertiary)'}`,
            background: mode === 'bubble' ? 'var(--color-background-info)' : 'transparent',
            color: mode === 'bubble' ? 'var(--color-text-info)' : 'var(--color-text-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Bubble mode
        </button>
        <button
          onClick={() => setMode('bracket')}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--border-radius-md)',
            border: `0.5px solid ${mode === 'bracket' ? 'var(--color-border-info)' : 'var(--color-border-tertiary)'}`,
            background: mode === 'bracket' ? 'var(--color-background-info)' : 'transparent',
            color: mode === 'bracket' ? 'var(--color-text-info)' : 'var(--color-text-primary)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Bracket mode
        </button>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          Node label
        </label>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a node name..."
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 'var(--border-radius-md)',
            border: '0.5px solid var(--color-border-tertiary)',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
          autoFocus
        />
        <p style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '8px', margin: '8px 0 0 0' }}>
          Press <code style={{ background: 'var(--color-background-secondary)', padding: '2px 6px', borderRadius: '4px' }}>Enter</code> to add node • <code style={{ background: 'var(--color-background-secondary)', padding: '2px 6px', borderRadius: '4px' }}>Backspace</code> to go back
        </p>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 8px 0' }}>
          Current path: <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>{currentPath.length === 0 ? 'root' : currentPath.join(' → ')}</span>
        </p>
      </div>
      <div style={{
        background: 'var(--color-background-secondary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '1.5rem',
        minHeight: '120px',
      }}>
        {tree.label ? (
          mode === 'bubble' ? (
            <BubbleView node={tree} />
          ) : (
            <BracketView node={tree} />
          )
        ) : (
          <p style={{ color: 'var(--color-text-tertiary)', fontSize: '14px', margin: '0' }}>
            Start typing to build your tree...
          </p>
        )}
      </div>
      <button
        onClick={() => {
          setTree({ label: '', children: [] });
          setCurrentPath([]);
          setInput('');
        }}
        style={{
          marginTop: '1rem',
          padding: '8px 12px',
          borderRadius: 'var(--border-radius-md)',
          border: '0.5px solid var(--color-border-secondary)',
          background: 'transparent',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Clear tree
      </button>
    </div>
  );
}
