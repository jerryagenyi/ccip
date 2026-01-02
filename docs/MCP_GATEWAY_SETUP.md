# Docker MCP Gateway Setup on VPS

## Installation Complete ✅

The Docker MCP Gateway CLI plugin has been installed on your VPS at:
- **Plugin location**: `~/.docker/cli-plugins/docker-mcp`
- **Configuration directory**: `~/.docker/mcp/`

## Usage

### 1. Run Gateway (On-Demand - stdio mode)

For Claude CLI to connect directly:

```bash
# Run gateway in stdio mode (for Claude CLI)
docker mcp gateway run
```

This runs the gateway and listens on stdio, which Claude CLI can connect to.

### 2. Run Gateway as Service (Streaming mode)

For multiple clients or remote access:

```bash
# Run gateway on port 8080 with streaming transport
docker mcp gateway run --port 8080 --transport streaming
```

### 3. Connect Claude CLI to Gateway

On your VPS, configure Claude CLI to use the gateway:

```bash
# Connect Claude CLI to the gateway
docker mcp client connect claude-code --global
```

Or manually edit `~/.claude.json` to add MCP server configuration.

### 4. Manage Servers

```bash
# List available servers in catalog
docker mcp catalog show docker-mcp

# Enable servers
docker mcp server enable <server-name>

# List enabled servers
docker mcp server ls

# Inspect a server
docker mcp server inspect <server-name>
```

### 5. Manage Tools

```bash
# List all available tools
docker mcp tools ls

# Inspect a tool
docker mcp tools inspect <tool-name>

# Call a tool
docker mcp tools call <tool-name> [arguments...]
```

## Configuration Files

Configuration is stored in `~/.docker/mcp/`:
- `docker-mcp.yaml` - Server catalog
- `registry.yaml` - Enabled servers
- `config.yaml` - Server configurations
- `tools.yaml` - Enabled tools

## Secrets Management

Since Docker Desktop isn't available, use `.env` files:

```bash
# Use .env file for secrets instead of Docker Desktop
docker mcp gateway run --secrets /path/to/.env
```

## Adding to Docker Compose (Optional)

If you want the gateway running as a service, see `docker-compose.production.yml` for the `mcp-gateway` service.

## Troubleshooting

- **Docker Desktop warnings**: Normal on VPS, can be ignored
- **Secrets**: Use `--secrets` flag with `.env` file path
- **Port conflicts**: Change port with `--port` flag

## References

- [Docker MCP Gateway GitHub](https://github.com/docker/mcp-gateway)
- [MCP Specification](https://modelcontextprotocol.io)

