import { useCallback, useEffect, useRef } from 'react';
import { tabEdit, enterEdit } from '../lib/editorEdits';

// The gutter and the textarea must render text on the exact same grid or the
// line numbers drift, so both take their metrics from this one object.
const METRICS = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  fontSize: '13px',
  lineHeight: '20px',
  tabSize: 4,
};

export default function CodeEditor({ id, value, onChange, placeholder }) {
  const taRef = useRef(null);
  const gutterRef = useRef(null);
  // Selection to restore after a programmatic edit re-renders the textarea.
  const pendingSelection = useRef(null);

  const lineCount = Math.max(1, value.split('\n').length);

  // Keep the gutter locked to the textarea's vertical scroll.
  const syncScroll = useCallback(() => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  }, []);

  useEffect(() => {
    if (!pendingSelection.current || !taRef.current) return;
    const [start, end] = pendingSelection.current;
    pendingSelection.current = null;
    taRef.current.setSelectionRange(start, end);
  }, [value]);

  const applyEdit = (edit) => {
    const ta = taRef.current;
    const next = value.slice(0, edit.from) + edit.text + value.slice(edit.to);

    // execCommand keeps the browser's native undo stack intact (Ctrl+Z still
    // reverses an indent) and fires a real input event, which React's onChange
    // picks up. It's deprecated with no replacement, hence the fallback.
    ta.setSelectionRange(edit.from, edit.to);
    let inserted = false;
    try {
      inserted = document.execCommand('insertText', false, edit.text);
    } catch {
      inserted = false;
    }

    pendingSelection.current = [edit.selStart, edit.selEnd];
    if (inserted) {
      // React already has the new value from the input event; just fix the
      // selection, since execCommand leaves the caret at the end of the insert.
      ta.setSelectionRange(edit.selStart, edit.selEnd);
      pendingSelection.current = null;
    } else {
      onChange(next);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      applyEdit(tabEdit(value, e.target.selectionStart, e.target.selectionEnd, e.shiftKey));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      applyEdit(enterEdit(value, e.target.selectionStart, e.target.selectionEnd));
    }
  };

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-canvas">
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="w-12 shrink-0 select-none overflow-hidden border-r-2 border-[color:var(--bh-ink)]/20 py-3 pr-2 text-right opacity-45"
        style={METRICS}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <textarea
        id={id}
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        required
        placeholder={placeholder}
        // wrap="off" is load-bearing: a wrapped line would occupy two visual
        // rows while counting as one number, desyncing the gutter forever.
        wrap="off"
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        className="min-h-0 flex-1 resize-none overflow-auto border-0 bg-transparent px-3 py-3 focus:outline-none"
        style={METRICS}
      />
    </div>
  );
}
