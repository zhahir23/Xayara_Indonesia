import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder = 'Pilih...', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const selectedOption = options.find((o) => o.value === value);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < 240 && rect.top > spaceBelow;
    setMenuStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      ...(openUp
        ? { bottom: window.innerHeight - rect.top + 4, maxHeight: Math.min(240, rect.top - 8) }
        : { top: rect.bottom + 4, maxHeight: Math.min(240, spaceBelow - 8) }),
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const close = () => setIsOpen(false);
    const onDocMouseDown = (e) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    window.addEventListener('resize', updatePosition);
    // close on any scroll of an ancestor so the menu never drifts away from its trigger
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', close, true);
    };
  }, [isOpen, updatePosition]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className="input-field w-full flex items-center justify-between text-left truncate pr-10 bg-white"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && menuStyle && createPortal(
        <ul
          ref={menuRef}
          style={menuStyle}
          className="z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto overflow-x-hidden"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2 text-sm cursor-pointer whitespace-normal break-words hover:bg-gray-100 ${
                option.value === value ? 'bg-primary-50 text-primary-700' : 'text-gray-900'
              }`}
              title={option.label}
            >
              {option.label}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
};

export default CustomSelect;
