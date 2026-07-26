const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages/dashboard');

const replacements = [
    { from: /\bp-5\b/g, to: 'p-6' },
    { from: /\bpx-5\b/g, to: 'px-6' },
    { from: /\bpy-5\b/g, to: 'py-6' },
    { from: /\bp-3\b/g, to: 'p-4' },
    { from: /\bpx-3\b/g, to: 'px-4' },
    { from: /\bpy-3\b/g, to: 'py-4' },
    { from: /\bgap-3\b/g, to: 'gap-4' },
    { from: /\bgap-5\b/g, to: 'gap-6' },
    { from: /\bmb-3\b/g, to: 'mb-4' },
    { from: /\bmt-3\b/g, to: 'mt-4' },
    { from: /\bml-3\b/g, to: 'ml-4' },
    { from: /\bmr-3\b/g, to: 'mr-4' },
    { from: /\bm-3\b/g, to: 'm-4' },
    { from: /\bm-5\b/g, to: 'm-6' },
    { from: /\bmb-5\b/g, to: 'mb-6' },
    { from: /\bmt-5\b/g, to: 'mt-6' },
];

function processDir(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') && !fullPath.includes('WorkspaceView')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = content;
            replacements.forEach(r => {
                updated = updated.replace(r.from, r.to);
            });
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log('Fixed grid spacing in: ' + fullPath);
            }
        }
    }
}

processDir(dir);
console.log('Grid alignment complete');
