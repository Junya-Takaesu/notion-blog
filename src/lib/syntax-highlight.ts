import { codeToHtml } from 'shiki';

// Map Notion language names to shiki language identifiers
const languageMap: Record<string, string> = {
    'plain text': 'text',
    'javascript': 'javascript',
    'typescript': 'typescript',
    'python': 'python',
    'java': 'java',
    'c': 'c',
    'c++': 'cpp',
    'c#': 'csharp',
    'go': 'go',
    'rust': 'rust',
    'ruby': 'ruby',
    'php': 'php',
    'swift': 'swift',
    'kotlin': 'kotlin',
    'scala': 'scala',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'less': 'less',
    'json': 'json',
    'yaml': 'yaml',
    'xml': 'xml',
    'markdown': 'markdown',
    'sql': 'sql',
    'bash': 'bash',
    'shell': 'shellscript',
    'powershell': 'powershell',
    'dockerfile': 'dockerfile',
    'graphql': 'graphql',
    'r': 'r',
    'matlab': 'matlab',
    'latex': 'latex',
    'diff': 'diff',
    'makefile': 'makefile',
    'nginx': 'nginx',
    'toml': 'toml',
    'ini': 'ini',
    'vue': 'vue',
    'jsx': 'jsx',
    'tsx': 'tsx',
};

function mapLanguage(notionLang: string): string {
    const normalized = notionLang.toLowerCase().trim();
    return languageMap[normalized] || 'text';
}

export async function highlightCodeBlocks(html: string): Promise<string> {
    // Match <pre data-language="..."><code>...</code></pre> blocks
    const codeBlockRegex = /<pre data-language="([^"]*)">\s*<code>([\s\S]*?)<\/code>\s*<\/pre>/g;

    const matches: Array<{ fullMatch: string; language: string; code: string }> = [];
    let match;

    while ((match = codeBlockRegex.exec(html)) !== null) {
        matches.push({
            fullMatch: match[0],
            language: match[1],
            code: match[2],
        });
    }

    if (matches.length === 0) {
        return html;
    }

    // Process all code blocks
    let result = html;

    for (const { fullMatch, language, code } of matches) {
        // Decode HTML entities back to original characters
        const decodedCode = code
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');

        const shikiLang = mapLanguage(language);

        try {
            const highlighted = await codeToHtml(decodedCode, {
                lang: shikiLang,
                theme: 'github-dark',
            });

            // Wrap in a container with language label
            const wrapper = `<div class="code-block-wrapper">
                <div class="code-block-header">
                    <span class="code-block-language">${language}</span>
                </div>
                ${highlighted}
            </div>`;

            result = result.replace(fullMatch, wrapper);
        } catch {
            // If highlighting fails, keep original but with styling
            const fallback = `<div class="code-block-wrapper">
                <div class="code-block-header">
                    <span class="code-block-language">${language}</span>
                </div>
                <pre class="shiki"><code>${code}</code></pre>
            </div>`;
            result = result.replace(fullMatch, fallback);
        }
    }

    return result;
}
