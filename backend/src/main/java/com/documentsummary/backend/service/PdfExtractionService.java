package com.documentsummary.backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class PdfExtractionService {

    public ExtractionResult extractText(byte[] fileBytes) throws IOException {
        try (PDDocument document = Loader.loadPDF(fileBytes)) {
            int pageCount = document.getNumberOfPages();

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            stripper.setLineSeparator("\n");
            stripper.setParagraphStart("\n");

            String text = stripper.getText(document);

            if (text == null || text.isBlank()) {
                throw new IOException(
                    "No readable text found in this PDF. It may be a scanned document without a text layer."
                );
            }

            String cleanedText = text.replaceAll("\n{3,}", "\n\n").trim();

            return new ExtractionResult(cleanedText, pageCount);
        }
    }

    public static class ExtractionResult {
        private final String text;
        private final int pageCount;

        public ExtractionResult(String text, int pageCount) {
            this.text = text;
            this.pageCount = pageCount;
        }

        public String getText() {
            return text;
        }

        public int getPageCount() {
            return pageCount;
        }
    }
}