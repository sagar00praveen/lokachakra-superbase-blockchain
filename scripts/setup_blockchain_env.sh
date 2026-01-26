#!/bin/bash
set -e

echo "--- Starting Blockchain Environment Setup (WSL) ---"

# 1. Update Packages
echo "[1/4] Updating packages..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y pkg-config build-essential libudev-dev libssl-dev

# 2. Install Rust
if ! command -v rustc &> /dev/null; then
    echo "[2/4] Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    echo "[2/4] Rust already installed."
fi

# 3. Install Solana
if ! command -v solana &> /dev/null; then
    echo "[3/4] Installing Solana CLI..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.22/install)"
    export PATH="/home/$(whoami)/.local/share/solana/install/active_release/bin:$PATH"
    
    # Add to .bashrc if not there
    if ! grep -q "solana" ~/.bashrc; then
        echo 'export PATH="/home/$(whoami)/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
    fi
else
    echo "[3/4] Solana CLI already installed."
fi

# 4. Install Anchor
if ! command -v avm &> /dev/null; then
    echo "[4/4] Installing Anchor (AVM)... (This might take a while)"
    source "$HOME/.cargo/env"
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
else
    echo "[4/4] Anchor (AVM) already installed."
fi

echo "--- Setup Complete! ---"
echo "Please run: 'source ~/.bashrc' or restart your terminal."
