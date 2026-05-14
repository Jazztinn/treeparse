import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { layoutTree, NODE_WIDTH, NODE_HEIGHT } from '../utils/treeLayout';
import styles from './TreeVisualizer.module.css';

const PAD = 60;
const DRAG_MIME = 'application/x-tree-node';

function readDragPayload(e) {
  const raw = e.dataTransfer.getData(DRAG_MIME);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function getEffectivePos(node, autoPositions, customPositions) {
  if (customPositions[node.id]) return customPositions[node.id];
  return autoPositions[node.id];
}

function collectEdges(node, autoPositions, customPositions, out = []) {
  if (!node.children || node.children.length === 0) return out;
  const from = getEffectivePos(node, autoPositions, customPositions);
  for (const child of node.children) {
    const to = getEffectivePos(child, autoPositions, customPositions);
    if (!to || !from) continue;
    const isTriangle = child.triangle && (!child.children || child.children.length === 0);
    const x1 = from.x + PAD;
    const y1 = from.y + NODE_HEIGHT / 2 + PAD;
    const x2 = to.x + PAD;
    const y2 = to.y - NODE_HEIGHT / 2 + PAD;

    if (isTriangle) {
      const triWidth = Math.max(NODE_WIDTH * 0.9, (child.word || '').length * 7 + 16);
      const leftX = x2 - triWidth / 2;
      const rightX = x2 + triWidth / 2;
      out.push({
        key: `${node.id}-${child.id}`,
        type: 'triangle',
        points: `${x1},${y1} ${leftX},${y2} ${rightX},${y2}`,
      });
    } else {
      out.push({ key: `${node.id}-${child.id}`, type: 'line', x1, y1, x2, y2 });
    }
    collectEdges(child, autoPositions, customPositions, out);
  }
  return out;
}

function flattenNodes(node, out = []) {
  out.push(node);
  (node.children || []).forEach(c => flattenNodes(c, out));
  return out;
}

function NodeShape({
  node, pos, isLeaf, isSelected, isDropTarget,
  unlocked, annotateMode,
  onClick, onDropOnNode, onDragMoveStart, onAnnotate,
  setDropTargetId, setHoverNode,
}) {
  function onSvgDragOver(e) {
    if (!e.dataTransfer.types.includes(DRAG_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDropTargetId(node.id);
  }

  function onSvgDragLeave() {
    setDropTargetId(prev => (prev === node.id ? null : prev));
  }

  function onSvgDrop(e) {
    const payload = readDragPayload(e);
    if (!payload) return;
    e.preventDefault();
    e.stopPropagation();
    setDropTargetId(null);
    onDropOnNode(node.id, payload);
  }

  function handleMouseDown(e) {
    if (annotateMode) {
      e.stopPropagation();
      onAnnotate(node.id);
      return;
    }
    if (!unlocked) return;
    e.stopPropagation();
    e.preventDefault();
    onDragMoveStart(node.id, e.clientX, e.clientY);
  }

  let boxClass = '';
  if (isDropTarget) boxClass = styles.dropTarget;
  else if (isLeaf) boxClass = isSelected ? styles.leafSelected : styles.leaf;
  else if (isSelected) boxClass = styles.selected;

  const isTriangle = node.triangle && isLeaf;

  function handleEnter(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverNode({
      id: node.id,
      label: node.label || node.type,
      type: node.type,
      word: node.word,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }
  function handleLeave() {
    setHoverNode(prev => (prev && prev.id === node.id ? null : prev));
  }

  return (
    <g
      className={`${styles.node} ${unlocked ? styles.nodeDraggable : ''}`}
      transform={`translate(${pos.x - NODE_WIDTH / 2 + PAD}, ${pos.y - NODE_HEIGHT / 2 + PAD})`}
      onClick={() => { if (!annotateMode && !unlocked) onClick(node.id); }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onDragOver={onSvgDragOver}
      onDragLeave={onSvgDragLeave}
      onDrop={onSvgDrop}
    >
      {!isTriangle && (
        <rect
          className={`${styles.nodeBox} ${boxClass}`}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx={6}
          ry={6}
        />
      )}
      <text
        className={`${styles.nodeType} ${isLeaf && !isTriangle ? styles.nodeTypeLeaf : ''}`}
        x={NODE_WIDTH / 2}
        y={isLeaf && !isTriangle ? NODE_HEIGHT / 2 - 4 : NODE_HEIGHT / 2 + 5}
        textAnchor="middle"
        dominantBaseline="middle"
        style={isTriangle ? { fontStyle: 'italic', fill: '#1a1a1a' } : {}}
      >
        {isTriangle ? node.word : node.type}
      </text>
      {isLeaf && !isTriangle && (
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
      {node.annotation && (
        <text
          className={styles.annotation}
          x={NODE_WIDTH / 2}
          y={-6}
          textAnchor="middle"
        >
          {node.annotation}
        </text>
      )}
    </g>
  );
}

function pathToD(points) {
  if (!points || points.length === 0) return '';
  return 'M ' + points.map(p => `${p.x} ${p.y}`).join(' L ');
}

function NodeTooltip({ data, wrapperRef }) {
  const rect = wrapperRef.current?.getBoundingClientRect();
  if (!rect) return null;
  const left = data.x - rect.left;
  const top = data.y - rect.top - 8;
  return (
    <div className={styles.nodeTooltip} style={{ left, top, transform: 'translate(-50%, -100%)' }}>
      <div className={styles.tooltipType}>{data.type}</div>
      <div className={styles.tooltipLabel}>{data.label}</div>
      {data.word && <div className={styles.tooltipWord}>“{data.word}”</div>}
    </div>
  );
}

export default function TreeVisualizer({
  tree, selectedNodeId, onNodeClick, onDropNode,
  unlocked, penMode, annotateMode, theme,
  customPositions, onPositionChange,
  penPaths, onPenPathsChange,
  onAnnotate,
  floatingMenu,
}) {
  const { positions: autoPositions, width, height } = useMemo(() => layoutTree(tree), [tree]);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [wrapperDropActive, setWrapperDropActive] = useState(false);
  const [penDrafting, setPenDrafting] = useState(null);
  const [overlaySize, setOverlaySize] = useState({ w: 0, h: 0 });
  const [hoverNode, setHoverNode] = useState(null);
  const [scale, setScale] = useState(1);

  const wrapperRef = useRef(null);
  const dragRef = useRef(null);
  const penDrawingRef = useRef(null);

  // Track wrapper size for the pen overlay
  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const update = () => setOverlaySize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tree]);

  const themeVars = theme ? {
    '--canvas-bg': theme.bg,
    '--node-bg': theme.nodeBg,
    '--node-stroke': theme.nodeStroke,
    '--node-text': theme.nodeText,
    '--leaf-bg': theme.leafBg,
    '--leaf-stroke': theme.leafStroke,
    '--edge-color': theme.edge,
  } : {};

  const handleNodeDragStart = useCallback((nodeId, clientX, clientY) => {
    const startPos = customPositions[nodeId] || autoPositions[nodeId];
    if (!startPos) return;
    dragRef.current = {
      nodeId,
      startClientX: clientX,
      startClientY: clientY,
      startPos: { x: startPos.x, y: startPos.y },
    };

    function onMove(ev) {
      if (!dragRef.current) return;
      const dx = (ev.clientX - dragRef.current.startClientX) / scale;
      const dy = (ev.clientY - dragRef.current.startClientY) / scale;
      onPositionChange(dragRef.current.nodeId, {
        x: dragRef.current.startPos.x + dx,
        y: dragRef.current.startPos.y + dy,
      });
    }
    function onUp() {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [autoPositions, customPositions, onPositionChange]);

  function getOverlayPoint(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handlePenDown(e) {
    if (!penMode) return;
    const p = getOverlayPoint(e);
    penDrawingRef.current = [p];
    setPenDrafting([p]);
  }

  function handlePenMove(e) {
    if (!penMode || !penDrawingRef.current) return;
    const p = getOverlayPoint(e);
    penDrawingRef.current.push(p);
    setPenDrafting([...penDrawingRef.current]);
  }

  function handlePenUp() {
    if (!penMode || !penDrawingRef.current) return;
    if (penDrawingRef.current.length > 1) {
      onPenPathsChange([...penPaths, penDrawingRef.current]);
    }
    penDrawingRef.current = null;
    setPenDrafting(null);
  }

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

  let hintText = null;
  if (penMode) hintText = 'Pen Mode — draw!';
  else if (unlocked) hintText = 'Nodes Unlocked — drag to position nodes.';
  else if (annotateMode) hintText = 'Annotate Mode — click a node';

  const penOverlay = (
    <svg
      className={`${styles.penOverlay} ${penMode ? styles.penOverlayActive : ''}`}
      width={overlaySize.w}
      height={overlaySize.h}
      onMouseDown={handlePenDown}
      onMouseMove={handlePenMove}
      onMouseUp={handlePenUp}
      onMouseLeave={handlePenUp}
    >
      {penPaths.map((path, i) => (
        <path key={i} className={styles.penPath} d={pathToD(path)} />
      ))}
      {penDrafting && (
        <path className={styles.penPath} d={pathToD(penDrafting)} />
      )}
    </svg>
  );

  if (!tree) {
    return (
      <div
        ref={wrapperRef}
        className={`${styles.wrapper} ${wrapperDropActive ? styles.dropActive : ''}`}
        style={themeVars}
        onDragOver={handleWrapperDragOver}
        onDragLeave={handleWrapperDragLeave}
        onDrop={handleWrapperDrop}
      >
        {hintText && <div className={styles.toolHint}>{hintText}</div>}
        {penMode && (
          <button
            className={styles.clearBtn}
            onClick={() => onPenPathsChange([])}
            disabled={penPaths.length === 0}
          >
            ✕ Clear Drawing
          </button>
        )}
        <div className={styles.scroll}>
          <div className={styles.empty}>
            {wrapperDropActive ? 'Drop to create root node' : 'Parse a sentence, drag a node here, or click New Tree to begin.'}
          </div>
        </div>
        {penOverlay}
        {floatingMenu}
      </div>
    );
  }

  const allNodes = flattenNodes(tree);
  let maxX = width, maxY = height, minX = 0, minY = 0;
  for (const n of allNodes) {
    const p = getEffectivePos(n, autoPositions, customPositions);
    if (!p) continue;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
  }

  const svgWidth = maxX + PAD * 2 + Math.abs(Math.min(minX, 0));
  const svgHeight = maxY + PAD * 2 + Math.abs(Math.min(minY, 0));

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      style={themeVars}
      onDragOver={handleWrapperDragOver}
      onDrop={handleWrapperDrop}
    >
      {hintText && <div className={styles.toolHint}>{hintText}</div>}
      {penMode && (
        <button
          className={styles.clearBtn}
          onClick={() => onPenPathsChange([])}
          disabled={penPaths.length === 0}
        >
          ✕ Clear Drawing
        </button>
      )}

      <div className={styles.zoomControls}>
        <button className={styles.zoomBtn} onClick={() => setScale(s => Math.max(0.2, s - 0.1))} title="Zoom Out">−</button>
        <button className={styles.zoomBtn} onClick={() => setScale(1)} title="Reset Zoom" style={{ fontSize: '11px', width: 'auto', padding: '0 8px' }}>{(scale * 100).toFixed(0)}%</button>
        <button className={styles.zoomBtn} onClick={() => setScale(s => Math.min(3, s + 0.1))} title="Zoom In">+</button>
      </div>

      <div className={styles.scroll}>
        <svg
          id="tree-svg"
          className={styles.svg}
          width={svgWidth * scale}
          height={svgHeight * scale}
        >
          <g transform={`scale(${scale})`}>
            {collectEdges(tree, autoPositions, customPositions).map(e =>
              e.type === 'triangle'
                ? <polygon key={e.key} className={styles.triangleEdge} points={e.points} />
                : <line key={e.key} className={styles.edge} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
            )}
            {allNodes.map(n => {
              const pos = getEffectivePos(n, autoPositions, customPositions);
              if (!pos) return null;
              const isLeaf = n.word !== null && n.word !== undefined && n.word !== '';
              return (
                <NodeShape
                  key={n.id}
                  node={n}
                  pos={pos}
                  isLeaf={isLeaf}
                  isSelected={n.id === selectedNodeId}
                  isDropTarget={n.id === dropTargetId}
                  unlocked={unlocked}
                  annotateMode={annotateMode}
                  onClick={onNodeClick}
                  onDropOnNode={onDropNode}
                  onDragMoveStart={handleNodeDragStart}
                  onAnnotate={onAnnotate}
                  setDropTargetId={setDropTargetId}
                  setHoverNode={setHoverNode}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {hoverNode && (
        <NodeTooltip data={hoverNode} wrapperRef={wrapperRef} />
      )}

      {penOverlay}
      {floatingMenu}
    </div>
  );
}
