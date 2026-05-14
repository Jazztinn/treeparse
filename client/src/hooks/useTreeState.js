import { useState, useCallback } from 'react';
import { addChildNode, deleteNode, updateNode, makeEmptyTree, generateId } from '../utils/treeUtils';

const MAX_HISTORY = 50;

export function useTreeState() {
  const [tree, setTree] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const pushHistory = useCallback((prevTree) => {
    setHistory(h => [...h.slice(-MAX_HISTORY + 1), prevTree]);
    setFuture([]);
  }, []);

  const setTreeWithHistory = useCallback((newTree, prev) => {
    pushHistory(prev);
    setTree(newTree);
  }, [pushHistory]);

  const addChild = useCallback((parentId) => {
    setTree(prev => {
      const newNode = { id: generateId(), type: 'N', label: 'Node', word: null, children: [] };
      const next = addChildNode(prev, parentId, newNode);
      pushHistory(prev);
      return next;
    });
  }, [pushHistory]);

  const deleteSelectedNode = useCallback((nodeId) => {
    setTree(prev => {
      const next = deleteNode(prev, nodeId);
      pushHistory(prev);
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
      return next;
    });
  }, [pushHistory, selectedNodeId]);

  const updateSelectedNode = useCallback((nodeId, updates) => {
    setTree(prev => {
      const next = updateNode(prev, nodeId, updates);
      pushHistory(prev);
      return next;
    });
  }, [pushHistory]);

  const undo = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setFuture(f => [tree, ...f]);
      setTree(prev);
      return h.slice(0, -1);
    });
  }, [tree]);

  const redo = useCallback(() => {
    setFuture(f => {
      if (f.length === 0) return f;
      const next = f[0];
      setHistory(h => [...h, tree]);
      setTree(next);
      return f.slice(1);
    });
  }, [tree]);

  const loadTree = useCallback((newTree) => {
    pushHistory(tree);
    setTree(newTree);
    setSelectedNodeId(null);
  }, [tree, pushHistory]);

  const newTree = useCallback(() => {
    pushHistory(tree);
    setTree(makeEmptyTree());
    setSelectedNodeId(null);
  }, [tree, pushHistory]);

  const clearTree = useCallback(() => {
    pushHistory(tree);
    setTree(null);
    setSelectedNodeId(null);
  }, [tree, pushHistory]);

  return {
    tree, setTree,
    selectedNodeId, setSelectedNodeId,
    addChild,
    deleteNode: deleteSelectedNode,
    updateNode: updateSelectedNode,
    undo, redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    loadTree,
    newTree,
    clearTree,
  };
}
