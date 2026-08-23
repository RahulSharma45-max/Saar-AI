package com.documentsummary.backend.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;

@Service
public class OcrService {

    private final Tesseract tesseract;

    public OcrService() {
        tesseract = new Tesseract();
        tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
        tesseract.setLanguage("eng");
    }

    public String extractText(byte[] imageBytes) throws IOException, TesseractException {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));

        if (image == null) {
            throw new IOException("The uploaded file could not be read as an image.");
        }

        String text = tesseract.doOCR(image);

        if (text == null || text.isBlank()) {
            throw new TesseractException(
                "No readable text was found in this image. Try a clearer or higher-resolution scan."
            );
        }

        return text.trim();
    }
}