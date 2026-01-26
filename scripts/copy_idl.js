import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const src = path.join(projectRoot, 'blockchain', 'lokachakra_verif', 'target', 'idl', 'lokachakra_verif.json');
const destDir = path.join(projectRoot, 'src', 'lib', 'web3');
const dest = path.join(destDir, 'idl.json');

console.log(`Looking for IDL at: ${src}`);

if (!fs.existsSync(destDir)) {
    console.log(`Creating directory: ${destDir}`);
    fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied IDL to ${dest}`);
} else {
    console.error(`❌ Source IDL not found at ${src}.`);
    console.error("Please run 'anchor build' in the blockchain directory first.");
    process.exit(1);
}
