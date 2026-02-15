#!/bin/bash
# Nginx and SSL setup script for webdev-ai-agent
# Run with: sudo bash scripts/deploy-nginx-ssl.sh

set -e

echo "=== Configuring Nginx for agent.davidfdzmorilla.dev ==="

# Copy nginx config
cp /tmp/agent.davidfdzmorilla.dev /etc/nginx/sites-available/agent.davidfdzmorilla.dev
echo "✅ Nginx config copied"

# Enable site
ln -sf /etc/nginx/sites-available/agent.davidfdzmorilla.dev /etc/nginx/sites-enabled/agent.davidfdzmorilla.dev
echo "✅ Site enabled"

# Test nginx config
nginx -t
echo "✅ Nginx config valid"

# Reload nginx
systemctl reload nginx
echo "✅ Nginx reloaded"

echo ""
echo "=== Requesting SSL Certificate ==="
certbot --nginx -d agent.davidfdzmorilla.dev --non-interactive --agree-tos --email contact@davidfdzmorilla.dev || echo "⚠️ Certbot failed (may already exist or need manual setup)"

echo ""
echo "=== Deployment Complete ==="
echo "Application should be accessible at: https://agent.davidfdzmorilla.dev"
