import React, { memo, useCallback } from 'react';

// Simple optimization - just memo wrapper without heavy processing
export const withSimpleOptimization = (WrappedComponent) => {
  const OptimizedComponent = memo((props) => {
    return <WrappedComponent {...props} />;
  });

  OptimizedComponent.displayName = `SimpleOptimized(${WrappedComponent.displayName || WrappedComponent.name})`;
  return OptimizedComponent;
};

// Simple image component
export const SimpleImage = memo(({ src, alt, className, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      {...props}
    />
  );
});

SimpleImage.displayName = 'SimpleImage';

// Simple button component
export const SimpleButton = memo(({ children, onClick, ...props }) => {
  const handleClick = useCallback((e) => {
    if (onClick) {
      onClick(e);
    }
  }, [onClick]);

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
});

SimpleButton.displayName = 'SimpleButton';

// Simple input component
export const SimpleInput = memo(({ onChange, ...props }) => {
  const handleChange = useCallback((e) => {
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  return <input onChange={handleChange} {...props} />;
});

SimpleInput.displayName = 'SimpleInput';

// Simple form component
export const SimpleForm = memo(({ onSubmit, children, ...props }) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
});

SimpleForm.displayName = 'SimpleForm';
