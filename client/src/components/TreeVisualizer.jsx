import { useMemo } from 'react';
import { layoutTree, NODE_WIDTH, NODE_HEIGHT } from '../utils/treeLayout';
import styles from './TreeVisualizer.module.css';

const PAD = 40;

function renderEdges(node, positions) {
  if (!node.children || node.children.length === 0) return null;
  const from = positions[node.id];
  return (
    <>
      {node.children.map(child => {
        const to = positions[child.id];
        return (
          <line
            key={`${node.id}-${child.id}`}
            className={styles.edge}
            x1={from.x + PAD}
            y1={from.y + NODE_HEIGHT / 2 + PAD}
            x2={to.x + PAD}
            y2={to.y - NODE_HEIGHT / 2 + PAD}
          />
        );
      })}
      {node.children.map(child => renderEdges(child, positions))}
    </>
  );
}

function renderNodes(node, positions, selectedNodeId, onNodeClick) {
  const pos = positions[node.id];
  const isLeaf = node.word !== null && node.word !== undefined && node.word !== '';
  const isSelected = node.id === selectedNodeId;

  const circleClass = isLeaf
    ? isSelected ? styles.leafSelected : styles.leaf
    : isSelected ? styles.selected : '';

  return (
    <>
      <g
        key={node.id}
        className={styles.node}
        transform={`translate(${pos.x - NODE_WIDTH / 2 + PAD}, ${pos.y - NODE_HEIGHT / 2 + PAD})`}
        onClick={() => onNodeClick(node.id)}
      >
        <rect
          className={`${styles.nodeCircle} ${circleClass}`}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx={6}
          ry={6}
        />
        <text
          className={styles.nodeType}
          x={NODE_WIDTH / 2}
          y={isLeaf ? NODE_HEIGHT / 2 - 4 : NODE_HEIGHT / 2 + 5}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {node.type}
        </text>
        {isLeaf && (
          <text
            className={styles.nodeWord}
            x={NODE_WIDTH / 2}
            y={NODE_HEIGHT / 2 + 10}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {node.word}
          </text>
        )}
      </g>
      {(node.children || []).map(child =>
        renderNodes(child, positions, selectedNodeId, onNodeClick)
      )}
    </>
  );
}

export default function TreeVisualizer({ tree, selectedNodeId, onNodeClick }) {
  const { positions, width, height } = useMemo(() => layoutTree(tree), [tree]);

  if (!tree) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>Parse a sentence or create a new tree to get started.</div>
      </div>
    );
  }

  const svgWidth = width + PAD * 2;
  const svgHeight = height + PAD * 2;

  return (
    <div className={styles.wrapper}>
      <svg
        className={styles.svg}
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        {renderEdges(tree, positions)}
        {renderNodes(tree, positions, selectedNodeId, onNodeClick)}
      </svg>
    </div>
  );
}
