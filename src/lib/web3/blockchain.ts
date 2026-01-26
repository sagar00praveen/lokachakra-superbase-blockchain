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

export const recordDocumentProofOnChain = async (employeeId: string, documentHashHex: string) => {
    // 1. Ensure Wallet is Connected
    if (!(window as any).solana) throw new Error("Wallet not found");
    if (!(window as any).solana.isConnected) {
        await (window as any).solana.connect();
    }

    const program = getProgram();
    const provider = getProvider();

    const encoder = new TextEncoder();
    const empData = encoder.encode(employeeId);
    const empHashBuffer = await crypto.subtle.digest('SHA-256', empData);
    const empHashArray = Array.from(new Uint8Array(empHashBuffer));

    // Derive Employee PDA
    const [employeePda] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("employee"),
            new Uint8Array(empHashBuffer)
        ],
        program.programId
    );

    // 2. Check if Employee Account exists; if not, initialize it
    try {
        const account = await program.account.employeeAccount.fetch(employeePda);
        console.log("Employee Account found:", account);
    } catch (e) {
        console.log("Employee Account not found. Initializing...", e);
        // Auto-initialize with dummy Company ID for now
        await initializeEmployeeOnChain(employeeId, "LOKACHAKRA_US_INC");
    }

    // Convert hex string to u8 array for document hash
    const docHashBytes = new Uint8Array(
        documentHashHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );
    const docHashArray = Array.from(docHashBytes);

    // Proof PDA: seeds = [b"proof", document_hash]
    const [proofPda] = await PublicKey.findProgramAddress(
        [
            utils.bytes.utf8.encode("proof"),
            docHashBytes
        ],
        program.programId
    );

    // 3. Check if Document Proof already exists
    try {
        const proofAccount = await program.account.documentProof.fetch(proofPda);
        console.log("Document Proof already exists on-chain:", proofAccount);
        return "ALREADY_VERIFIED";
    } catch (e) {
        console.log("Document Proof not found. Creating new proof...", e);
    }

    const tx = await program.methods.recordDocumentProof(docHashArray)
        .accounts({
            documentProof: proofPda,
            employeeAccount: employeePda,
            authority: provider.wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

    console.log("Proof Recorded! Tx:", tx);
    return tx;
};

