const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages/dashboard');
const componentsDir = path.join(__dirname, 'src/components/dashboard');

// We are replacing Neo-brutalist specific classes with Premium, Soft, Glassmorphic ones
const replacements = [
    // Heavy borders and brutalist shadows to soft borders and smooth large shadows
    { from: /border-2 border-brandBlack shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\]/g, to: 'border border-gray-100 shadow-xl shadow-gray-200/40 backdrop-blur-md' },
    { from: /border-2 border-brandBlack shadow-\[8px_8px_0px_0px_rgba\(0,0,0,1\)\]/g, to: 'border border-gray-100 shadow-2xl shadow-gray-200/50 backdrop-blur-xl' },
    { from: /border-4 border-brandBlack shadow-\[12px_12px_0px_0px_rgba\(0,0,0,1\)\]/g, to: 'border-2 border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-2xl' },
    { from: /border-2 border-brandBlack shadow-\[2px_2px_0px_0px_rgba\(0,0,0,1\)\]/g, to: 'border border-gray-100 shadow-md shadow-gray-200/30 backdrop-blur-sm' },
    { from: /border-2 border-brandBlack shadow-\[4px_4px_0px_0px_rgba\(0,0,0,0\.2\)\]/g, to: 'shadow-lg shadow-brandPurple/20 border border-transparent' },
    { from: /border-2 border-brandBlack shadow-\[6px_6px_0px_0px_rgba\(0,0,0,0\.2\)\]/g, to: 'shadow-xl shadow-brandPurple/30 border border-transparent' },

    // Convert harsh black borders into subtle gray/transparent ones
    { from: /border-2 border-brandBlack/g, to: 'border border-gray-100/80 shadow-sm backdrop-blur-sm bg-white/50' },
    { from: /border border-brandBlack/g, to: 'border border-gray-100 shadow-sm' },

    // Remove "italic" from elements where brutalism enforced it artificially
    { from: /font-black italic/g, to: 'font-black tracking-tight' },
    { from: /font-black uppercase italic tracking-tighter/g, to: 'font-black uppercase tracking-tight' },
    { from: /font-black uppercase italic tracking-tight/g, to: 'font-black uppercase tracking-tight' },
    { from: /font-black italic tracking-tighter/g, to: 'font-extrabold tracking-tight' },
    { from: /font-extrabold uppercase italic/g, to: 'font-extrabold uppercase' },
];

function processDir(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            replacements.forEach(r => {
                updated = updated.replace(r.from, r.to);
            });
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log('Premium overhaul applied to: ' + fullPath);
            }
        }
    }
}

processDir(dir);
processDir(componentsDir);
console.log('Premium Overhaul Script Complete');
