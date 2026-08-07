// Pure text-edit maths for the code editor. Kept free of any DOM so the
// tricky bits (block indent, dedent, auto-indent) can be reasoned about and
// tested directly. Each function returns a replacement descriptor:
//   { from, to, text, selStart, selEnd }
// meaning "replace value[from..to) with text, then select [selStart, selEnd)".

export const INDENT = '    '; // 4 spaces, matching PEP 8 / most CP styles

// Start index of the line containing `pos`.
function lineStartAt(value, pos) {
  return value.lastIndexOf('\n', pos - 1) + 1;
}

// End index (exclusive) of the line containing `pos`.
function lineEndAt(value, pos) {
  const idx = value.indexOf('\n', pos);
  return idx === -1 ? value.length : idx;
}

// Tab / Shift+Tab. Only a bare caret inserts an indent; ANY live selection
// indents whole lines instead. Replacing a selection with spaces (what a plain
// textarea and even VS Code do) would silently eat the selected code.
export function tabEdit(value, start, end, shiftKey) {
  if (start === end && !shiftKey) {
    const caret = start + INDENT.length;
    return { from: start, to: end, text: INDENT, selStart: caret, selEnd: caret };
  }

  const from = lineStartAt(value, start);
  const to = lineEndAt(value, end);
  const lines = value.slice(from, to).split('\n');

  const out = shiftKey
    ? lines.map((line) => {
        const lead = line.match(/^( {1,4}|\t)/);
        return lead ? line.slice(lead[0].length) : line;
      })
    : lines.map((line) => INDENT + line);

  const text = out.join('\n');
  return { from, to, text, selStart: from, selEnd: from + text.length };
}

// Enter keeps the current line's leading whitespace, so nested code doesn't
// snap back to column 0 on every newline.
export function enterEdit(value, start, end) {
  const from = lineStartAt(value, start);
  const lead = value.slice(from, start).match(/^[ \t]*/)[0];
  const text = `\n${lead}`;
  const caret = start + text.length;
  return { from: start, to: end, text, selStart: caret, selEnd: caret };
}
