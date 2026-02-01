
# 🚀 Vercel Deployment Guide (Testnet)

Your Solana program is live on Testnet! Follow these steps to deploy the frontend and connect it.

## 1. Project Setup
Ensure your local project is connected to a Git repository (GitHub/GitLab/Bitbucket).

## 2. Deploy on Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `lokachakra-superbase` repository.

## 3. Environment Variables (Critical)
Before clicking "Deploy", you **MUST** add the following Environment Variables in the Vercel Project Settings. 
(Copy these values from your local `.env` and `WALLET_KEYS_BASE58.txt` file setup)

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | `https://egxcmvexsfxcjvytcwob.supabase.co` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | *(Your Anon Key)* | Found in your local `.env` |
| `VITE_SOLANA_NETWORK` | `testnet` | **Changed from devnet** |
| `VITE_SOLANA_RPC_URL` | `https://api.testnet.solana.com` | Testnet RPC URL |
| `VITE_PROGRAM_ID` | `GbMMLzLoDwSjk7R5dgFh3i5dUPcaqkHtBXF4NyhZFtjw` | Your Deployed Program ID |
| `SOLANA_MASTER_PRIVATE_KEY` | `[230,30,158,...]` | **Private Key Array** of the *Operational Wallet* (The Runner) |
| `VITE_OPERATIONAL_PUBKEY` | `6R1RvT3zB59nTYgX1pwZUe9wTtsGuYSt5o9fdCg2FnrY` | Public Key of the Operational Wallet |

> **⚠️ Security Note:** 
> - Use the **Operational Wallet's** Private Key for `SOLANA_MASTER_PRIVATE_KEY`. 
> - **NEVER** upload the Master Authority (Vault) Private Key to Vercel.

## 4. Build Settings
Vercel should auto-detect Vite, but if needed:
-   **Framework Preset:** Vite
-   **Build Command:** `npm run build` or `vite build`
-   **Output Directory:** `dist`

## 5. Verify
Once deployed:
1.  Open your Vercel URL.
2.  Perform an action that writes to the blockchain (e.g., Record Document Proof).
3.  Check the "Network" tab in Developer Tools for a call to `/api/sign-transaction`.
4.  If successful, the API provided the signature using the `Operational Wallet`.
