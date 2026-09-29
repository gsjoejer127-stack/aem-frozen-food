#!/usr/bin/env bash
# Renders the OEM/ODM contract pack to signable A4 PDFs in docs/legal/pdf/.
#
# Requirements: python3 with the `markdown` package (pip install markdown) and a
# Chromium binary. Override the binary with CHROME=/path/to/chrome if needed.
set -euo pipefail

cd "$(dirname "$0")"
mkdir -p pdf
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

CHROME="${CHROME:-}"
if [ -z "$CHROME" ]; then
  for c in /opt/pw-browsers/chromium /usr/bin/chromium /usr/bin/chromium-browser /usr/bin/google-chrome; do
    [ -x "$c" ] && CHROME="$c" && break
  done
fi
[ -n "$CHROME" ] || { echo "No Chromium found. Set CHROME=/path/to/chrome" >&2; exit 1; }

for src in oem-odm-agreement.md oem-order-confirmation-short-form.md; do
  base="${src%.md}"
  python3 md2html.py "$src" "$work/$base.html"
  "$CHROME" --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
            --print-to-pdf="pdf/$base.pdf" "$work/$base.html" >/dev/null 2>&1
  echo "pdf/$base.pdf"
done
