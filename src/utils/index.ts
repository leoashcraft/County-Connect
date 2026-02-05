


export function createPageUrl(pageName: string) {
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}

/**
 * Convert simple markdown to HTML.
 * Handles: **bold**, - list items, blank line paragraph breaks
 */
export function markdownToHtml(text: string): string {
    if (!text) return '';
    // If it already contains HTML tags, return as-is
    if (/<[a-z][\s\S]*>/i.test(text)) return text;

    const lines = text.split('\n');
    const htmlParts: string[] = [];
    let inList = false;
    let paragraph: string[] = [];

    const flushParagraph = () => {
        if (paragraph.length > 0) {
            htmlParts.push(`<p>${paragraph.join(' ')}</p>`);
            paragraph = [];
        }
    };

    const formatInline = (line: string): string => {
        return line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    };

    for (const rawLine of lines) {
        const line = rawLine.trim();

        if (line === '') {
            if (inList) {
                htmlParts.push('</ul>');
                inList = false;
            }
            flushParagraph();
            continue;
        }

        if (line.startsWith('- ') || line.startsWith('* ')) {
            flushParagraph();
            if (!inList) {
                htmlParts.push('<ul>');
                inList = true;
            }
            htmlParts.push(`<li>${formatInline(line.slice(2))}</li>`);
        } else if (/^\*\*[^*]+\*\*$/.test(line)) {
            // Standalone bold line → treat as subheading
            flushParagraph();
            if (inList) {
                htmlParts.push('</ul>');
                inList = false;
            }
            htmlParts.push(`<h4>${line.replace(/\*\*/g, '')}</h4>`);
        } else {
            if (inList) {
                htmlParts.push('</ul>');
                inList = false;
            }
            paragraph.push(formatInline(line));
        }
    }

    if (inList) htmlParts.push('</ul>');
    flushParagraph();

    return htmlParts.join('\n');
}