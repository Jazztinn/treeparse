import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--color-background-secondary)',
            border: '1px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            color: 'var(--color-text-primary)',
          }}
        >
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#ff6b6b' }}>Something went wrong</h3>
          <p style={{ margin: '0.5rem 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              marginTop: '1rem',
              padding: '8px 12px',
              borderRadius: 'var(--border-radius-md)',
              border: '0.5px solid var(--color-border-tertiary)',
              background: 'var(--color-background-primary)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Reset & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
