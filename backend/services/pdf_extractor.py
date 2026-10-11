import pymupdf as fitz


def extract_pdf_text(pdf_bytes: bytes) -> dict:
    """
    Extract selectable text and structured table data from a PDF held in memory.
    The PDF is not saved to disk.
    """
    if not pdf_bytes.startswith(b"%PDF-"):
        raise ValueError("The uploaded file is not a valid PDF.")

    try:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as document:
            if document.is_encrypted:
                raise ValueError(
                    "Password-protected PDFs are not supported yet."
                )

            pages = []
            for page_number, page in enumerate(document, start=1):
                # 1. Structured table extraction
                table_lines = []
                try:
                    tables = page.find_tables()
                    for tab in tables:
                        for row in tab.extract():
                            cleaned_cells = [
                                str(c).strip()
                                for c in row
                                if c is not None and str(c).strip()
                            ]
                            if cleaned_cells:
                                table_lines.append(" ".join(cleaned_cells))
                except Exception:
                    table_lines = []

                # 2. Raw text extraction
                raw_text = page.get_text("text").strip()

                if table_lines:
                    # Place reconstructed table rows first so parser reads clean records
                    combined_text = "\n".join(table_lines) + "\n\n" + raw_text
                else:
                    combined_text = raw_text

                pages.append({
                    "page": page_number,
                    "text": combined_text,
                })

            if not pages:
                raise ValueError("The PDF contains no pages.")

            full_text = "\n\n".join(
                f"Page {page['page']}\n{page['text']}"
                for page in pages
                if page["text"]
            )

            return {
                "page_count": len(pages),
                "pages": pages,
                "extracted_text": full_text,
                "ocr_required": not bool(full_text.strip()),
            }

    except ValueError:
        raise
    except Exception as exc:
        raise ValueError(
            "Could not read the PDF. Check that it is valid and readable."
        ) from exc
