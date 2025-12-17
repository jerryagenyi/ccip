#!/bin/sh
# Startup script to verify files and start nginx

echo "=== Container Startup Verification ==="
echo "Checking /usr/share/nginx/html/ contents:"
ls -la /usr/share/nginx/html/

echo ""
echo "Checking for index.html:"
if [ -f /usr/share/nginx/html/index.html ]; then
    echo "✅ index.html exists"
    head -3 /usr/share/nginx/html/index.html
else
    echo "❌ index.html NOT FOUND!"
fi

echo ""
echo "Checking nginx config:"
ls -la /etc/nginx/conf.d/

echo ""
echo "Starting nginx..."
exec nginx -g "daemon off;"

