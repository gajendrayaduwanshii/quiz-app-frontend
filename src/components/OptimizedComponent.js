import React, { memo, useMemo, useCallback } from 'react';

// Simplified optimization - just memo wrapper
export const withOptimization = (WrappedComponent, options = {}) => {
  const OptimizedComponent = memo((props) => {
    return <WrappedComponent {...props} />;
  });

  OptimizedComponent.displayName = `Optimized(${WrappedComponent.displayName || WrappedComponent.name})`;
  return OptimizedComponent;
};

// Simplified image component
export const OptimizedImage = memo(({ src, alt, className, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Optimized button component
export const OptimizedButton = memo(({ children, onClick, ...props }) => {
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

OptimizedButton.displayName = 'OptimizedButton';

// Optimized input component
export const OptimizedInput = memo(({ onChange, ...props }) => {
  const handleChange = useCallback((e) => {
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  return <input onChange={handleChange} {...props} />;
});

OptimizedInput.displayName = 'OptimizedInput';

// Optimized form component
export const OptimizedForm = memo(({ onSubmit, children, ...props }) => {
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

OptimizedForm.displayName = 'OptimizedForm';

// Optimized list component
export const OptimizedList = memo(({ items, renderItem, ...props }) => {
  const memoizedItems = useMemo(() => items, [items]);

  return (
    <div {...props}>
      {memoizedItems.map(renderItem)}
    </div>
  );
});

OptimizedList.displayName = 'OptimizedList';

// Optimized modal component
export const OptimizedModal = memo(({ isOpen, onClose, children, ...props }) => {
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose} {...props}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
});

OptimizedModal.displayName = 'OptimizedModal';

// Optimized table component
export const OptimizedTable = memo(({ data, columns, ...props }) => {
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  return (
    <table {...props}>
      <thead>
        <tr>
          {memoizedColumns.map((column, index) => (
            <th key={index}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {memoizedData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {memoizedColumns.map((column, colIndex) => (
              <td key={colIndex}>
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

OptimizedTable.displayName = 'OptimizedTable';
