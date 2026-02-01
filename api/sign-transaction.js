
import { Connection, Keypair, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";

// Vercel Serverless Function
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { transactionBase64 } = req.body;

        if (!transactionBase64) {
            return res.status(400).json({ error: 'Missing transactionBase64' });
        }

        // specific to Vercel: process.env is standard
        // In local dev with Vite, this might need dotenv if not using 'vercel dev'
        const privateKeyString = process.env.SOLANA_MASTER_PRIVATE_KEY;
        const rpcUrl = process.env.VITE_SOLANA_RPC_URL || "https://api.devnet.solana.com";

        if (!privateKeyString) {
            console.error("Server Error: SOLANA_MASTER_PRIVATE_KEY is missing.");
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Parse Private Key
        let secretKey;
        try {
            secretKey = new Uint8Array(JSON.parse(privateKeyString));
        } catch (e) {
            console.error("Error parsing private key:", e);
            return res.status(500).json({ error: 'Invalid server key configuration' });
        }

        const operationalKeypair = Keypair.fromSecretKey(secretKey);
        const connection = new Connection(rpcUrl, "confirmed");

        // Deserialize Transaction
        const transactionBuffer = Buffer.from(transactionBase64, 'base64');
        const transaction = Transaction.from(transactionBuffer);

        // Verify the Fee Payer is indeed the Operational Wallet
        if (!transaction.feePayer.equals(operationalKeypair.publicKey)) {
            return res.status(400).json({ error: 'Transaction fee payer must be the Operational Wallet' });
        }

        // Partially Sign (Sign as Fee Payer & Signer)
        // Note: The transaction might already be partially signed by the user (Authority).
        // We need to add our signature.
        transaction.partialSign(operationalKeypair);

        // Send and Confirm
        // We use sendAndConfirmRawTransaction because we have a fully signed serialized tx (hopefully)
        // But wait, if we deserialized it, we lost the signatures if we created a new Transaction object?
        // No, Transaction.from() preserves signatures if present.

        // Check if fully signed?
        // User signature (Authority) + Operational signature (Fee Payer)
        // If there are other signers needed, this might fail unless they signed first.

        const rawTransaction = transaction.serialize();

        // Send
        const signature = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: false,
            preflightCommitment: 'confirmed'
        });

        console.log(`Transaction sent: ${signature}`);

        // Wait for confirmation (optional, but good for "daily records" assurance)
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');

        if (confirmation.value.err) {
            console.error("Transaction failed:", confirmation.value.err);
            return res.status(400).json({ error: 'Transaction failed on-chain', details: confirmation.value.err });
        }

        return res.status(200).json({ signature });

    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
