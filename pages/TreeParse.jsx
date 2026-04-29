import React, { useState, useRef } from 'react';
import BracketView from '../components/BracketView';
import BubbleView from '../components/BubbleView';
import TreeStructure from '../components/TreeStructure';
import { getNodeAtPath, addNodeAtPath, getParentPath } from '../utils/treeUtils';
import * as styles from '../styles/treeStyles';

export default function TreeParse() {
  const [tree, setTree] = useState({ label: '', children: [] });
  const [currentPath, setCurrentPath] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('bubble');
  const inputRef = useRef(null);

  /**
   * Add a new node to the tree at current path
   */
  const handleAddNode = (label) => {
    if (!label.trim()) return;

    const updatedTree = addNodeAtPath(tree, label, currentPath);
    setTree(updatedTree);
    setInput('');

    // Update path to point to the newly added node
    const currentNode = getNodeAtPath(updatedTree, currentPath);
    if (currentNode.children && currentNode.children.length > 0) {
      setCurrentPath([...currentPath, currentNode.children.length - 1]);
    }
  };

  /**
   * Go back to parent node
   */
  const handleGoUp = () => {
    if (currentPath.length === 0) return;
    const newPath = getParentPath(currentPath, tree);
    setCurrentPath(newPath);
    setInput('');
  };

  /**
   * Handle keyboard input
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        handleAddNode(input);
      }
    } else if (e.key === 'Backspace' && !input) {
      e.preventDefault();
      handleGoUp();
    }
  };

  /**
   * Clear the entire tree
   */
  const handleClearTree = () => {
    setTree({ label: '', children: [] });
    setCurrentPath([]);
    setInput('');
  };

  return (
    <div style={styles.containerStyle}>
      <h2 style={styles.titleStyle}>TreeParse</h2>

      {/* Mode Toggle Buttons */}
      <div style={styles.buttonGroupStyle}>
        <button
          onClick={() => setMode('bubble')}
          style={styles.getButtonStyle(mode === 'bubble')}
        >
          Bubble mode
        </button>
        <button
          onClick={() => setMode('bracket')}
          style={styles.getButtonStyle(mode === 'bracket')}
        >
          Bracket mode
        </button>
        <button
          onClick={() => setMode('structure')}
          style={styles.getButtonStyle(mode === 'structure')}
        >
          Structure
        </button>
      </div>

      {/* Input Section */}
      <div style={styles.inputSectionStyle}>
        <label style={styles.labelStyle}>Node label</label>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a node name..."
          style={styles.inputStyle}
          autoFocus
        />
        <p style={styles.helpTextStyle}>
          Press <code style={styles.codeStyle}>Enter</code> to add node •{' '}
          <code style={styles.codeStyle}>Backspace</code> to go back
        </p>
      </div>

      {/* Current Path Display */}
      <div style={styles.pathSectionStyle}>
        <p style={styles.pathTextStyle}>
          Current path:{' '}
          <span style={styles.pathValueStyle}>
            {currentPath.length === 0 ? 'root' : currentPath.join(' → ')}
          </span>
        </p>
      </div>

      {/* Tree Display */}
      <div style={styles.treeContainerStyle}>
        {tree.label ? (
          mode === 'bubble' ? (
            <BubbleView node={tree} />
          ) : mode === 'bracket' ? (
            <BracketView node={tree} />
          ) : (
            <TreeStructure node={tree} />
          )
        ) : (
          <p style={styles.emptyStateStyle}>Start typing to build your tree...</p>
        )}
      </div>

      {/* Clear Button */}
      <button onClick={handleClearTree} style={styles.clearButtonStyle}>
        Clear tree
      </button>
    </div>
  );
}
