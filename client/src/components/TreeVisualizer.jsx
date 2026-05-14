import { useMemo, useState } from 'react';
import { layoutTree, NODE_WIDTH, NODE_HEIGHT } from '../utils/treeLayout';
import styles from './TreeVisualizer.module.css';

const PAD = 40;
const DRAG_MIME = 'application/x-tree-node';

function readDragPayload(e) {
  const raw = e.dataTransfer.getData(DRAG_MIME);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

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

function renderNodes(node, positions, selectedNodeId, dropTargetId, onNodeClick, onDropOnNode, setDropTargetId) {
  const pos = positions[node.id];
  const isLeaf = node.word !== null && node.word !== undefined && node.word !== '';
  const isSelected = node.id === selectedNodeId;
  const isDropTarget = node.id === dropTargetId;

  let circleClass = '';
  if (isDropTarget) circleClass = styles.dropTarget;
  else if (isLeaf) circleClass = isSelected ? styles.leafSelected : styles.leaf;
  else if (isSelected) circleClass = styles.selected;

  function onDragOver(e) {
    if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDropTargetId(node.id);
  }

  function onDragLeave() {
    setDropTargetId(prev => (prev === node.id ? null : prev));
  }

  function onDrop(e) {
    const payload = readDragPayload(e);
    if (!payload) return;
    e.preventDefault();
    e.stopPropagation();
    setDropTargetId(null);
    onDropOnNode(node.id, payload);
  }

  return (
    <>
      <g
        key={node.id}
        className={styles.node}
        transform={`translate(${pos.x - NODE_WIDTH / 2 + PAD}, ${pos.y - NODE_HEIGHT / 2 + PAD})`}
        onClick={() => onNodeClick(node.id)}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
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
        renderNodes(child, positions, selectedNodeId, dropTargetId, onNodeClick, onDropOnNode, setDropTargetId)
      )}
    </>
  );
}

export default function TreeVisualizer({ tree, selectedNodeId, onNodeClick, onDropNode }) {
  const { positions, width, height } = useMemo(() => layoutTree(tree), [tree]);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [wrapperDropActive, setWrapperDropActive] = useState(false);

  function handleWrapperDragOver(e) {
    if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!tree) setWrapperDropActive(true);
  }

  function handleWrapperDragLeave(e) {
    if (e.currentTarget === e.target) setWrapperDropActive(false);
  }

  function handleWrapperDrop(e) {
    const payload = readDragPayload(e);
    if (!payload) return;
    e.preventDefault();
    setWrapperDropActive(false);
    if (!tree) onDropNode(null, payload);
  }

  function handleDropOnNode(parentId, payload) {
    onDropNode(parentId, payload);
  }

  if (!tree) {
    return (
      <div
        className={`${styles.wrapper} ${wrapperDropActive ? styles.dropActive : ''}`}
        onDragOver={handleWrapperDragOver}
        onDragLeave={handleWrapperDragLeave}
        onDrop={handleWrapperDrop}
      >
        <div className={styles.empty}>
          {wrapperDropActive ? 'Drop to create root node' : 'Parse a sentence, drag a node here, or click New Tree to begin.'}
        </div>
      </div>
    );
  }

  const svgWidth = width + PAD * 2;
  const svgHeight = height + PAD * 2;

  return (
    <div
      className={styles.wrapper}
      onDragOver={handleWrapperDragOver}
      onDrop={handleWrapperDrop}
    >
      <svg
        className={styles.svg}
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        {renderEdges(tree, positions)}
        {renderNodes(tree, positions, selectedNodeId, dropTargetId, onNodeClick, handleDropOnNode, setDropTargetId)}
      </svg>
    </div>
  );
}
