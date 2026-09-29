#!/usr/bin/env python3
"""Wrap a contract Markdown file in print-ready A4 HTML (EN + 中文)."""
import re
import sys

import markdown

CSS = """
@page { size: A4; margin: 18mm 16mm 20mm 16mm; }
html { -webkit-print-color-adjust: exact; }
body {
  font-family: "Liberation Serif", "Times New Roman", "WenQuanYi Zen Hei", serif;
  font-size: 9.4pt; line-height: 1.45; color: #111; margin: 0;
}
h1 { font-size: 15pt; margin: 0 0 2mm; letter-spacing: .3px; }
h1 + h1 { margin-top: -1mm; color: #333; font-size: 13pt; }
h2 { font-size: 10.6pt; margin: 6mm 0 2mm; padding-bottom: 1mm;
     border-bottom: .6pt solid #999; page-break-after: avoid; }
h3 { font-size: 10pt; margin: 4mm 0 1.5mm; page-break-after: avoid; }
p { margin: 0 0 2mm; text-align: justify; }
strong { font-weight: bold; }
hr { border: 0; border-top: .6pt solid #bbb; margin: 5mm 0; }
blockquote {
  margin: 3mm 0; padding: 2.5mm 3mm; background: #f4f4f0;
  border-left: 2pt solid #8a8a7a; font-size: 8.6pt; line-height: 1.4;
}
blockquote p { margin: 0 0 1mm; text-align: left; }
table { border-collapse: collapse; width: 100%; margin: 2.5mm 0 3.5mm;
        font-size: 8.8pt; page-break-inside: avoid; }
th, td { border: .5pt solid #888; padding: 1.4mm 2mm; vertical-align: top;
         text-align: left; }
th { background: #ececeb; font-weight: bold; }
ol, ul { margin: 0 0 2mm; padding-left: 6mm; }
li { margin-bottom: 1mm; }
h2, h3, table, blockquote { break-inside: avoid; }
"""

def main() -> None:
    src, out = sys.argv[1], sys.argv[2]
    with open(src, encoding="utf-8") as fh:
        text = fh.read()
    body = markdown.markdown(text, extensions=["tables", "sane_lists"])
    # Markdown requires a header row; drop the empty grey bar it leaves on
    # label/value tables that have no real headings.
    body = re.sub(r"<thead>\s*<tr>(?:\s*<th[^>]*>\s*</th>)+\s*</tr>\s*</thead>",
                  "", body)
    html = (
        "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">"
        f"<title>{src}</title><style>{CSS}</style></head><body>{body}</body></html>"
    )
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(html)

if __name__ == "__main__":
    main()
