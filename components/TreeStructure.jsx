import React from 'react';

const LEVEL_H = 72;
const MIN_W = 48;
const H_GAP = 12;
const FONT_SIZE = 14;

function charW(label) {
  return Math.max(MIN_W, label.length * 9 + 20);
}

function measure(node) {
  if (!node.children || !node.children.length) return charW(node.label);
  const total = node.children.reduce((s, c) => s + measure(c), 0) + H_GAP * (node.children.length - 1);
  return Math.max(charW(node.label), total);
}

function position(node, x0, y) {
  const w = measure(node);
  const cx = x0 + w / 2;
  if (!node.children || !node.children.length) {
    return { ...node, x: cx, y, w };
  }
  let childX = x0;
  const cws = node.children.map(measure);
  const children = node.children.map((child, i) => {
    const laid = position(child, childX, y + LEVEL_H);
    childX += cws[i] + H_GAP;
    return laid;
  });
  return { ...node, x: cx, y, w, children };
}

function flatten(node, nodes = [], edges = []) {
  nodes.push(node);
  if (node.children) {
    node.children.forEach(c => {
      edges.push({ p: node, c });
      flatten(c, nodes, edges);
    });
  }
  return { nodes, edges };
}

export default function TreeView({ node }) {
  if (!node || !node.label) return null;

  const laid = position(node, 0, 0);
  const { nodes, edges } = flatten(laid);

  const pad = 32;
  const minX = Math.min(...nodes.map(n => n.x)) - pad;
  const maxX = Math.max(...nodes.map(n => n.x)) + pad;
  const maxY = Math.max(...nodes.map(n => n.y)) + pad + 16;
  const vw = maxX - minX;
  const vh = maxY + pad;

  return (
    <svg
      viewBox={`${minX} ${-pad} ${vw} ${vh}`}
      style={{ display: 'block', maxWidth: '100%', width: Math.min(vw, 700), height: 'auto' }}
    >
      {edges.map(({ p, c }, i) => (
        <line
          key={i}
          x1={p.x} y1={p.y + 10}
          x2={c.x} y2={c.y - 10}
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.6"
        />
      ))}
      {nodes.map((node, i) => {
        const isLeaf = !node.children?.length;
        const isTrace = node.trace && isLeaf;
        return (
          <text
            key={i}
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={FONT_SIZE}
            fontFamily="Georgia, serif"
            fontWeight={isLeaf ? '400' : '600'}
            fontStyle={isTrace ? 'italic' : 'normal'}
            fill={isTrace ? '#999' : 'currentColor'}
          >
            {node.label}
          </text>
        );
      })}
    </svg>
  );
}