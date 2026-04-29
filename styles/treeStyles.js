// Main container
export const containerStyle = {
  padding: '1.5rem',
  fontFamily: 'var(--font-sans)',
  maxWidth: '1200px',
  margin: '0 auto',
};

// Title
export const titleStyle = {
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 1.5rem 0',
  color: 'var(--color-text-primary)',
};

// Mode buttons container
export const buttonGroupStyle = {
  display: 'flex',
  gap: '8px',
  marginBottom: '1.5rem',
};

// Mode button (base)
export const getButtonStyle = (isActive) => ({
  padding: '8px 16px',
  borderRadius: 'var(--border-radius-md)',
  border: `0.5px solid ${isActive ? 'var(--color-border-info)' : 'var(--color-border-tertiary)'}`,
  background: isActive ? 'var(--color-background-info)' : 'transparent',
  color: isActive ? 'var(--color-text-info)' : 'var(--color-text-primary)',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s ease',
});

// Input section
export const inputSectionStyle = {
  marginBottom: '1.5rem',
};

export const labelStyle = {
  display: 'block',
  fontSize: '14px',
  color: 'var(--color-text-secondary)',
  marginBottom: '8px',
  fontWeight: '500',
};

export const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 'var(--border-radius-md)',
  border: '0.5px solid var(--color-border-tertiary)',
  fontSize: '14px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  backgroundColor: 'var(--color-background-primary)',
  color: 'var(--color-text-primary)',
};

export const helpTextStyle = {
  fontSize: '12px',
  color: 'var(--color-text-tertiary)',
  margin: '8px 0 0 0',
};

export const codeStyle = {
  background: 'var(--color-background-secondary)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '12px',
};

// Path display
export const pathSectionStyle = {
  marginBottom: '1.5rem',
};

export const pathTextStyle = {
  fontSize: '12px',
  color: 'var(--color-text-secondary)',
  margin: '0 0 8px 0',
};

export const pathValueStyle = {
  fontFamily: 'monospace',
  fontWeight: '500',
  color: 'var(--color-text-info)',
};

// Tree display container
export const treeContainerStyle = {
  background: 'var(--color-background-secondary)',
  border: '0.5px solid var(--color-border-tertiary)',
  borderRadius: 'var(--border-radius-lg)',
  padding: '1.5rem',
  minHeight: '150px',
  maxHeight: '600px',
  overflowY: 'auto',
  marginBottom: '1rem',
};

export const emptyStateStyle = {
  color: 'var(--color-text-tertiary)',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center',
  paddingTop: '2rem',
};

// Clear button
export const clearButtonStyle = {
  padding: '8px 12px',
  borderRadius: 'var(--border-radius-md)',
  border: '0.5px solid var(--color-border-secondary)',
  background: 'transparent',
  color: 'var(--color-text-primary)',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.2s ease',
};
