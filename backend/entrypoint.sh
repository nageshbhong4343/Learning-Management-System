#!/bin/sh
set -e

echo "=== [Railway Backend] Applying Database Migrations ==="
python manage.py migrate --noinput

echo "=== [Railway Backend] Collecting Static Files ==="
python manage.py collectstatic --noinput

echo "=== [Railway Backend] Seeding Default LMS Demo Data ==="
python manage.py seed_data || true

echo "=== [Railway Backend] Launching Gunicorn WSGI Server ==="
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers ${WEB_CONCURRENCY:-3} \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
