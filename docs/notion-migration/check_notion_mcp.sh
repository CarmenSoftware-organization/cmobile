#!/bin/bash
echo "? Notion MCP Configuration Check"
echo "================================="

# Determine config path based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
    OS_NAME="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CONFIG_PATH="$HOME/.config/claude/claude_desktop_config.json" 
    OS_NAME="Linux"
else
    CONFIG_PATH="$APPDATA/Claude/claude_desktop_config.json"
    OS_NAME="Windows"
fi

echo "? Operating System: $OS_NAME"
echo "? Expected config location: $CONFIG_PATH"
echo ""

# Check if config file exists
if [ -f "$CONFIG_PATH" ]; then
    echo "? Configuration file exists"
    echo "? File size: $(ls -lh "$CONFIG_PATH" | awk '{print $5}')"
    echo ""
    
    # Check for Notion configuration
    if grep -q '"notion"' "$CONFIG_PATH"; then
        echo "? Notion MCP configuration found"
        
        # Check for API key
        if grep -q "NOTION_API_KEY" "$CONFIG_PATH"; then
            echo "? NOTION_API_KEY is configured"
            
            # Check token format (without revealing actual token)
            if grep -q "secret_" "$CONFIG_PATH"; then
                echo "? Token format appears correct (contains 'secret_')"
                echo ""
                echo "? Configuration looks good! Try testing in Claude now."
            else
                echo "??  Token format may be incorrect"
                echo "   Expected format: secret_xxxxxxxxxxxxxxxxxxxx"
            fi
        else
            echo "? NOTION_API_KEY not found in configuration"
            echo "   Add your Notion integration token to the config"
        fi
    else
        echo "? Notion MCP configuration not found"
        echo "   Need to add Notion server configuration"
    fi
    
    echo ""
    echo "? Current configuration structure:"
    if command -v jq &> /dev/null; then
        jq 'keys' "$CONFIG_PATH" 2>/dev/null || echo "   Invalid JSON format detected"
    else
        echo "   (Install 'jq' for better JSON formatting)"
        head -5 "$CONFIG_PATH"
    fi
    
else
    echo "? Configuration file not found"
    echo ""
    echo "? Create the file at: $CONFIG_PATH"
    echo "? Use the sample configuration from the setup guide"
fi

echo ""
echo "? Notion Integration Checklist:"
echo "  1. ? Go to https://www.notion.so/my-integrations"
echo "  2. ? Create integration named 'Carmen Mobile Documentation'"
echo "  3. ? Copy the integration token (starts with 'secret_')"
echo "  4. ? Invite integration to your Notion workspace"
echo "  5. ? Grant 'Edit' permissions to the integration"

echo ""
echo "? Next Steps:"
if [ ! -f "$CONFIG_PATH" ]; then
    echo "  ? Create configuration file with sample template"
    echo "  ? Add your Notion integration token"
    echo "  ? Restart Claude Desktop completely"
elif ! grep -q "notion" "$CONFIG_PATH"; then
    echo "  ? Add Notion MCP configuration to existing file"
    echo "  ? Include your integration token"
    echo "  ? Restart Claude Desktop"
else
    echo "  ? Verify Notion integration token is correct"
    echo "  ? Check integration permissions in Notion"
    echo "  ? Restart Claude Desktop if changes were made"
    echo "  ? Test connection in Claude"
fi

echo ""
echo "? Alternative: Manual import method is ready and often faster!"
echo "? All your Carmen documentation is organized and ready to import"
