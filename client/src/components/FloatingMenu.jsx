import { useState } from 'react';
import styles from './FloatingMenu.module.css';

const RADIUS = 100;

const ICONS = {
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  unlock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1.5" />
      <circle cx="17.5" cy="10.5" r="1.5" />
      <circle cx="8.5" cy="7.5" r="1.5" />
      <circle cx="6.5" cy="12.5" r="1.5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  annotate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="13" y2="14" />
    </svg>
  ),
};

const MENU_ITEMS = [
  { id: 'unlock', icon: 'unlock', label: 'Unlock Nodes' },
  { id: 'pen', icon: 'pen', label: 'Pen Tool' },
  { id: 'theme', icon: 'palette', label: 'Theme' },
  { id: 'annotate', icon: 'annotate', label: 'Annotate' },
];

export default function FloatingMenu({ activeTools, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      {MENU_ITEMS.map((item, i) => {
        const angle = (Math.PI / 2) * (i / (MENU_ITEMS.length - 1));
        const x = -Math.cos(angle) * RADIUS;
        const y = -Math.sin(angle) * RADIUS;
        const isActive = activeTools[item.id];

        const style = open
          ? { transform: `translate(${x}px, ${y}px) scale(1)` }
          : { transform: 'translate(0, 0) scale(0.4)' };

        return (
          <div
            key={item.id}
            className={`${styles.item} ${open ? styles.visible : ''} ${isActive ? styles.active : ''}`}
            style={style}
            onClick={() => onToggle(item.id)}
            title={item.label}
          >
            <div className={styles.icon}>{ICONS[item.icon]}</div>
            <span className={styles.tooltip}>{item.label}</span>
          </div>
        );
      })}

      <div
        className={`${styles.center} ${open ? styles.open : ''}`}
        onClick={() => setOpen(o => !o)}
        title={open ? 'Close menu' : 'Open menu'}
      >
        <div className={styles.centerIcon}>{ICONS.plus}</div>
      </div>
    </div>
  );
}
