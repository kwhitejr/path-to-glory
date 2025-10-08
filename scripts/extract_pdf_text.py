#!/usr/bin/env python3
"""
Extract text from a single PDF file.
Usage: python extract_pdf_text.py <path_to_pdf>
"""

import pdfplumber
import sys
from pathlib import Path

def extract_pdf_text(pdf_path):
    """Extract text from a PDF file and save to a .txt file."""
    pdf_path = Path(pdf_path)
    txt_path = pdf_path.with_suffix('.txt')

    print(f"Processing: {pdf_path.name}")

    try:
        with pdfplumber.open(pdf_path) as pdf:
            text_content = []

            for i, page in enumerate(pdf.pages, 1):
                print(f"  Extracting page {i}/{len(pdf.pages)}...", end='\r')
                page_text = page.extract_text()
                if page_text:
                    text_content.append(f"--- Page {i} ---\n{page_text}\n")

            # Write extracted text to file
            with open(txt_path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(text_content))

            print(f"  ✓ Extracted {len(pdf.pages)} pages to {txt_path.name}")
            return True

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python extract_pdf_text.py <path_to_pdf>")
        sys.exit(1)

    pdf_file = sys.argv[1]
    extract_pdf_text(pdf_file)
