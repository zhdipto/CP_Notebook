// Fixed language menu — competitive-programming languages first, since that's
// what this notebook is for. `value` is what gets stored in
// CodeSnippet.language, so these stay lowercase slugs (and must fit the
// field's max_length=50). 'python' is deliberately kept as-is: every existing
// row in the database uses it, so old snippets still match an option.
export const LANGUAGES = [
  { value: 'cpp', label: 'C++' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'swift', label: 'Swift' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash / Shell' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: 'Plain text' },
];

const LABELS = new Map(LANGUAGES.map((l) => [l.value, l.label]));

export function languageLabel(value) {
  return LABELS.get(value) ?? value;
}

export function isKnownLanguage(value) {
  return LABELS.has(value);
}
