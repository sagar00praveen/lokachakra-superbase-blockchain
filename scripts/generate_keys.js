
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WALLETS_DIR = path.join(__dirname, "../wallets");

if (!fs.existsSync(WALLETS_DIR)) {
    fs.mkdirSync(WALLETS_DIR);
}

function generateKeypair(filename) {
    const kp = Keypair.generate();
    const secretKey = Array.from(kp.secretKey);
    const filePath = path.join(WALLETS_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(secretKey));
    console.log(`Generated ${filename}: ${kp.publicKey.toBase58()}`);
    return kp;
}

const master = generateKeypair("master-authority.json");
const operational = generateKeypair("operational-signer.json");

console.log("\nPrivate key for operational-signer (add to Vercel/Production SOLANA_MASTER_PRIVATE_KEY):");
console.log(JSON.stringify(Array.from(operational.secretKey)));
