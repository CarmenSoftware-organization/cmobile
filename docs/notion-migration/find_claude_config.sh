#!/bin/bash

echo "? Finding Claude Desktop Config on macOS"
echo "========================================"

echo "? The config file should be at:"
echo "   ~/Library/Application Support/Claude/claude_desktop_config.json"
echo ""

# Check if the directory exists
CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"

echo "? Checking if directory exists..."
if [ -d "$CONFIG_DIR" ]; then
    echo "? Claude directory exists: $CONFIG_DIR"
    
    echo "? Contents of Claude directory:"
    ls -la "$CONFIG_DIR"
    echo ""
    
    if [ -f "$CONFIG_FILE" ]; then
        echo "? Config file exists!"
        echo "? File details:"
        ls -la "$CONFIG_FILE"
        echo ""
        echo "? Current contents:"
        cat "$CONFIG_FILE"
    else
        echo "? Config file does not exist"
        echo "? Need to create: $CONFIG_FILE"
    fi
else
    echo "? Claude directory does not exist"
    echo "? Need to create: $CONFIG_DIR"
    echo ""
    echo "? This is normal - the directory is created when you first configure MCPs"
fi

echo ""
echo "? Next Steps:"
if [ ! -d "$CONFIG_DIR" ]; then
    echo "  1. Create the directory: mkdir -p \"$CONFIG_DIR\""
    echo "  2. Create the config file with your Notion integration"
elif [ ! -f "$CONFIG_FILE" ]; then
    echo "  1. Create the config file in the existing directory"
    echo "  2. Add your Notion MCP configuration"
else
    echo "  1. Review and update the existing configuration"
    echo "  2. Ensure your Notion integration token is correct"
fi

echo ""
echo "? To view hidden Library folder in Finder:"
echo "  1. Open Finder"
echo "  2. Press Cmd+Shift+G (Go to Folder)"
echo "  3. Type: ~/Library/Application Support/Claude"
echo "  4. Press Enter"

echo ""
echo "? Want me to create the config file for you? (y/n)"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "? Creating Claude directory and config file..."
    
    # Create directory if it doesn't exist
    mkdir -p "$CONFIG_DIR"
    
    # Create the config file
    cat > "$CONFIG_FILE" << 'EOF'
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-notion"
      ],
      "env": {
        "NOTION_API_KEY": "YOUR_NOTION_INTEGRATION_TOKEN_HERE"
      }
    }
  }
}
EOF
    
    echo "? Config file created at: $CONFIG_FILE"
    echo ""
    echo "? Next steps:"
    echo "  1. Get your Notion integration token from:"
    echo "     https://www.notion.so/my-integrations"
    echo "  2. Replace 'YOUR_NOTION_INTEGRATION_TOKEN_HERE' with your actual token"
    echo "  3. Restart Claude Desktop"
    echo ""
    echo "? Edit the file with:"
    echo "  nano \"$CONFIG_FILE\""
    echo "  or open it in any text editor"
fi
