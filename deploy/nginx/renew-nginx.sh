#!/bin/sh
# Certbot deploy hook: reload only after a successfully renewed certificate.
set -eu
/usr/sbin/nginx -t
/usr/bin/systemctl reload nginx
