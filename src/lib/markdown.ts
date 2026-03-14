// Minimal markdown to HTML converter used in chat rendering.
// Supports code fences, inline code, headings, bold/italic, links, lists, and paragraphs.

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function mdToHtml(md: string): string {
  if (!md) return "";
  let text = md.replace(/\r\n?/g, "\n");

  // Code fences ```
  text = text.replace(/```([\s\S]*?)```/g, (_m, code) => {
    return `<pre class=\"rounded-md bg-gray-900 text-gray-100 p-3 overflow-auto\"><code>${escapeHtml(
      String(code).trimEnd()
    )}</code></pre>`;
  });

  // Inline code `code`
  text = text.replace(/`([^`]+)`/g, (_m, c) => `<code class=\"bg-gray-100 px-1 rounded\">${escapeHtml(c)}</code>`);

  // Headings #, ##, ###
  text = text.replace(/^###\s+(.+)$/gm, '<h3 class="text-base font-semibold mt-3 mb-2">$1</h3>');
  text = text.replace(/^##\s+(.+)$/gm, '<h2 class="text-lg font-semibold mt-3 mb-2">$1</h2>');
  text = text.replace(/^#\s+(.+)$/gm, '<h1 class="text-xl font-bold mt-3 mb-2">$1</h1>');

  // Bold and italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(?!\*)([^*]+)\*/g, '<em>$1</em>');

  // Links [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>');

  // Lists - or *
  text = text.replace(/(?:^|\n)((?:[-*]\s+.*(?:\n|$))+)/g, (_m, block) => {
    const items = String(block)
      .trim()
      .split(/\n/)
      .map((l: string) => l.replace(/^[-*]\s+/, "").trim())
      .filter(Boolean)
      .map((li: string) => `<li class=\"ml-5 list-disc\">${li}</li>`)
      .join("");
    return `\n<ul class=\"my-2\">${items}</ul>\n`;
  });

  // Paragraphs: split by double newlines and wrap
  const parts = text.split(/\n{2,}/);
  const html = parts
    .map((blk) => {
      const trimmed = blk.trim();
      if (!trimmed) return "";
      if (/^<\/?(h\d|ul|ol|li|pre|blockquote|table|p|code)/i.test(trimmed)) return trimmed;
      return `<p class=\"my-2\">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  return html;
}

