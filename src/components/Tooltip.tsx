import { ReactNode, useEffect, useId, useRef, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  /** Logical horizontal alignment relative to trigger to prevent mobile viewport clipping */
  align?: 'start' | 'center' | 'end';
  /** Suppresses tooltip display (e.g. while an adjacent dropdown menu is open) */
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  align = 'center',
  disabled = false,
  className = '',
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();
  const touchTimerRef = useRef<number | null>(null);
  const autoHideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (disabled && visible) {
      setVisible(false);
    }
  }, [disabled, visible]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  useEffect(() => {
    return () => {
      if (touchTimerRef.current) window.clearTimeout(touchTimerRef.current);
      if (autoHideTimerRef.current) window.clearTimeout(autoHideTimerRef.current);
    };
  }, []);

  const show = () => {
    if (!disabled && content) setVisible(true);
  };

  const hide = () => {
    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    setVisible(false);
  };

  const handleTouchStart = () => {
    if (disabled || !content) return;
    if (touchTimerRef.current) window.clearTimeout(touchTimerRef.current);
    touchTimerRef.current = window.setTimeout(() => {
      setVisible(true);
      if (autoHideTimerRef.current) window.clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
      }, 2200);
    }, 320);
  };

  const handleTouchEndOrMove = () => {
    if (touchTimerRef.current) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const alignmentClasses =
    align === 'start'
      ? 'start-0'
      : align === 'end'
      ? 'end-0'
      : 'left-1/2 -translate-x-1/2';

  const arrowAlignmentClasses =
    align === 'start'
      ? 'start-3'
      : align === 'end'
      ? 'end-3'
      : 'left-1/2 -translate-x-1/2';

  const isShown = visible && !disabled && Boolean(content);

  return (
    <span
      className={`relative inline-flex items-center min-w-0 ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onClick={hide}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEndOrMove}
      onTouchMove={handleTouchEndOrMove}
      aria-describedby={isShown ? tooltipId : undefined}
    >
      {children}

      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isShown}
        className={`pointer-events-none absolute top-full mt-2 z-50 max-w-[240px] sm:max-w-xs px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium leading-snug whitespace-normal break-words shadow-md border border-violet-400/20 transition-all duration-150 ${alignmentClasses} ${
          isShown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 invisible'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute -top-1 w-2 h-2 rotate-45 bg-slate-900 border-t border-l border-violet-400/20 ${arrowAlignmentClasses}`}
        />
        <span className="relative block w-max max-w-[220px] sm:max-w-xs break-words">
          {content}
        </span>
      </span>
    </span>
  );
}
