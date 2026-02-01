
# PowerShell Script to Deploy to Vercel via CLI
# Usage: .\scripts\deploy_vercel_cli.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== Vercel CLI Deployment ==="
Write-Host "target: lokachakra-superbase-blockchain"

# 1. Link to Project
Write-Host "`n1. Linking Project..."
# Using --yes to skip confirmation
npx vercel link --yes --project lokachakra-superbase-blockchain

# 2. Add Environment Variables
$EnvVars = @{
    "VITE_SUPABASE_URL" = "https://egxcmvexsfxcjvytcwob.supabase.co"
    "VITE_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVneGNtdmV4c2Z4Y2p2eXRjd29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTIzMjIsImV4cCI6MjA4NDU4ODMyMn0.TCJSHvACVvoXvrCqz2rw0NXWquIwHS4Y6e2dlMA7l1U"
    "VITE_SOLANA_NETWORK" = "testnet"
    "VITE_SOLANA_RPC_URL" = "https://api.testnet.solana.com"
    "VITE_PROGRAM_ID" = "GbMMLzLoDwSjk7R5dgFh3i5dUPcaqkHtBXF4NyhZFtjw"
    "VITE_OPERATIONAL_PUBKEY" = "6R1RvT3zB59nTYgX1pwZUe9wTtsGuYSt5o9fdCg2FnrY"
    "SOLANA_MASTER_PRIVATE_KEY" = "[230,30,158,164,248,186,170,107,175,33,63,83,109,204,109,128,97,32,49,205,231,178,145,205,94,160,54,91,178,252,143,1,80,112,220,33,228,234,250,239,171,70,126,26,156,93,88,210,16,90,76,179,221,10,183,243,2,180,142,61,210,240,221,237]"
}

Write-Host "`n2. Adding Environment Variables (Production)..."

foreach ($key in $EnvVars.Keys) {
    $val = $EnvVars[$key]
    Write-Host " - Setting $key ..."
    
    # Piping input in PowerShell to a command
    # We use negation of $val to echo it? No, just Write-Output or string input
    
    # Try using echo with pipe
    $val | npx vercel env add $key production
}

# 3. Deploy
Write-Host "`n3. Deploying to Production..."
npx vercel --prod

Write-Host "`nDone."
