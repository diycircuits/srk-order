#!/bin/bash
# Move to script directory
cd "$(dirname "$0")"

# Auto-detect Node paths on macOS
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:$PATH"

echo "======================================================"
echo "    🚀 STARTING SRK INNOVATIONS ERP SOFTWARE...       "
echo "======================================================"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not found in PATH."
    echo "Please ensure Node.js is installed."
    read -p "Press Enter to close..."
    exit 1
fi

# Build frontend if dist is missing
if [ ! -d "dist" ]; then
    echo "📦 Packaging software interface for first run..."
    npm run build
fi

# Auto open the browser
(sleep 1.5 && open "http://localhost:5001") &

# Run unified software
node server/server.js
