const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const replacements = [
    { from: /bg-\[#1A1A1A\]/g, to: 'bg-brandBlack' },
    { from: /text-\[#1A1A1A\]/g, to: 'text-brandBlack' },
    { from: /border-\[#1A1A1A\]/g, to: 'border-brandBlack' },
    { from: /fill-\[#1A1A1A\]/g, to: 'fill-brandBlack' },
    { from: /shadow-\[([^\]]*)#1A1A1A([^\]]*)\]/g, to: 'shadow-[$1var(--brand-black)$2]' },
    { from: /bg-\[#F8D448\]/g, to: 'bg-brandYellow' },
    { from: /text-\[#F8D448\]/g, to: 'text-brandYellow' },
    { from: /border-\[#F8D448\]/g, to: 'border-brandYellow' },
    { from: /from-\[#F8D448\]/g, to: 'from-brandYellow' },
    { from: /to-\[#F8D448\]/g, to: 'to-brandYellow' },
    { from: /bg-\[#C7D2FE\]/g, to: 'bg-brandPurple' },
    { from: /text-\[#C7D2FE\]/g, to: 'text-brandPurple' },
    { from: /border-\[#C7D2FE\]/g, to: 'border-brandPurple' },
    { from: /from-\[#C7D2FE\]/g, to: 'from-brandPurple' },
    { from: /to-\[#C7D2FE\]/g, to: 'to-brandPurple' },
    { from: /bg-\[#F0F2F5\]/g, to: 'bg-brandBg' },
    { from: /bg-\[#FB7185\]/g, to: 'bg-brandPink' },
    { from: /text-\[#FB7185\]/g, to: 'text-brandPink' },
];

function processDir(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            replacements.forEach(r => {
                updated = updated.replace(r.from, r.to);
            });
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log('Updated: ' + fullPath);
            }
        }
    }
}

processDir(dir);
console.log('Done');
