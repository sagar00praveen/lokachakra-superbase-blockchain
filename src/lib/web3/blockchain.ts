import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
}
import { Program, AnchorProvider, web3, utils } from '@coral-xyz/anchor';
import idl from './idl.json';

// Configuration
const network = import.meta.env.VITE_SOLANA_NETWORK || 'devnet';
const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl('devnet');
const programID = new PublicKey(import.meta.env.VITE_PROGRAM_ID || 'GbMMLzLoDwSjk7R5dgFh3i5dUPcaqkHtBXF4NyhZFtjw');

const opts = {
    preflightCommitment: "processed" as web3.Commitment
};

export const getProvider = () => {
    if (!(window as any).solana) {
        throw new Error("Solana wallet not found! Please install Phantom.");
    }

    const connection = new Connection(rpcUrl, opts.preflightCommitment);
    const provider = new AnchorProvider(
        connection,
        (window as any).solana,
        opts
    );
    return provider;
};

export const getProgram = () => {
    const provider = getProvider();
    return new Program(idl as any, provider);
};

export const initializeEmployeeOnChain = async (employeeId: string, companyId: string) => {
    const program = getProgram();
    const provider = getProvider();

    const encoder = new TextEncoder();
    const data = encoder.encode(employeeId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const employeeHash = Array.from(new Uint8Array(hashBuffer));

    const [employeePda] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("employee"),
            new Uint8Array(hashBuffer)
        ],
        program.programId
    );

    console.log("Initializing Employee PDA:", employeePda.toString());

    const tx = await program.methods.initializeEmployee(employeeHash, companyId)
        .accounts({
            employeeAccount: employeePda,
            authority: provider.wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

    console.log("Transaction Signature:", tx);
    return tx;
};

// Operational Wallet (Public Key)
const OPERATIONAL_PUBKEY_STR = import.meta.env.VITE_OPERATIONAL_PUBKEY;

export const recordDocumentProofOnChain = async (employeeId: string, documentHashHex: string) => {
    // 1. Validate Env
    if (!OPERATIONAL_PUBKEY_STR) throw new Error("VITE_OPERATIONAL_PUBKEY is not set.");
    const operationalPubKey = new PublicKey(OPERATIONAL_PUBKEY_STR);

    // 2. Setup Connection & Dummy Provider (So Anchor can build instruction)
    const connection = new Connection(rpcUrl, opts.preflightCommitment);
    const dummyWallet = {
        publicKey: operationalPubKey,
        signTransaction: () => Promise.reject(new Error("Client cannot sign for Operational Wallet")),
        signAllTransactions: () => Promise.reject(new Error("Client cannot sign for Operational Wallet"))
    };
    const provider = new AnchorProvider(connection, dummyWallet as any, opts);
    const program = new Program(idl as any, provider);

    const encoder = new TextEncoder();
    const empData = encoder.encode(employeeId);
    const empHashBuffer = await crypto.subtle.digest('SHA-256', empData);

    // Derive Employee PDA
    const [employeePda] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("employee"),
            new Uint8Array(empHashBuffer)
        ],
        program.programId
    );

    // 3. Check if Employee Account exists (Read-Only)
    try {
        await program.account.employeeAccount.fetch(employeePda);
    } catch (e) {
        console.log("Employee Account not found. Initialization is required (via separate flow/user).", e);
        // We might want to handle this gracefully or throw. 
        // For now, assuming Employee exists or User must initialize separately.
    }

    // Convert hex string to u8 array for document hash
    const docHashBytes = new Uint8Array(
        documentHashHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );
    const docHashArray = Array.from(docHashBytes);

    // Proof PDA
    const [proofPda] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("proof"),
            docHashBytes
        ],
        program.programId
    );

    // 4. Check if Proof exists
    try {
        const proofAccount = await program.account.documentProof.fetch(proofPda);
        console.log("Document Proof already exists on-chain:", proofAccount);
        return "ALREADY_VERIFIED";
    } catch (e) {
        // Continue
    }

    // 5. Build Transaction Instruction
    // Authority => Operational Wallet
    const instruction = await program.methods.recordDocumentProof(docHashArray)
        .accounts({
            documentProof: proofPda,
            employeeAccount: employeePda,
            authority: operationalPubKey, // Operational Wallet is Authority & Payer
            systemProgram: web3.SystemProgram.programId,
        })
        .instruction();

    // 6. Construct Transaction
    const { blockhash } = await connection.getLatestBlockhash();
    const transaction = new web3.Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = operationalPubKey;
    transaction.add(instruction);

    // 7. Serialize (Unsigned)
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
    const transactionBase64 = serializedTransaction.toString('base64');

    // 8. Send to Backend for Signing & Broadcast
    console.log("Delegating signature to Operational Wallet...");

    // Determine API Endpoint (Vercel or Local Proxy)
    // Assuming relative path works if served correctly, otherwise configured base URL
    const apiUrl = '/api/sign-transaction';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionBase64 })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`Transaction Signing Failed: ${err.error || response.statusText}`);
    }

    const { signature } = await response.json();
    console.log("Proof Recorded via Operational Wallet! Sig:", signature);
    return signature;
};

