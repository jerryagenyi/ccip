#!/bin/sh
# Startup script to verify files and start nginx

echo "=== Container Startup Verification ==="
echo "Checking /usr/share/nginx/html/ contents:"
ls -la /usr/share/nginx/html/ || true

echo ""
echo "Checking for index.html:"
if [ -f /usr/share/nginx/html/index.html ]; then
    echo "✅ index.html exists"
    head -3 /usr/share/nginx/html/index.html || true
else
    echo "❌ index.html NOT FOUND!"
    exit 1
fi

echo ""
echo "Checking nginx config:"
ls -la /etc/nginx/conf.d/ || true

echo ""
echo "Testing nginx configuration:"
nginx -t || exit 1

echo ""
echo "Starting nginx..."
exec nginx -g "daemon off;"

