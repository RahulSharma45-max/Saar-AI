package com.documentsummary.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import com.documentsummary.backend.service.AiSummaryService;
import com.documentsummary.backend.service.OcrService;
import com.documentsummary.backend.service.PdfExtractionService;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "https://saar-ai-frontend.vercel.app")
@RestController
public class DocumentController {

    @Autowired
    private PdfExtractionService pdfExtractionService;

    @Autowired
    private OcrService ocrService;

    @Autowired
    private AiSummaryService aiSummaryService;

    @PostMapping("/api/documents/process")
    public ResponseEntity<Map<String, Object>> processDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("summaryLength") String summaryLength
    ) {
        Map<String, Object> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("error", "The uploaded file is empty.");
            return ResponseEntity.badRequest().body(response);
        }

        String contentType = file.getContentType();
        String extractedText;
        Integer pageCount = null;

        try {
            if ("application/pdf".equals(contentType)) {
                PdfExtractionService.ExtractionResult result = pdfExtractionService.extractText(file.getBytes());
                extractedText = result.getText();
                pageCount = result.getPageCount();

            } else if ("image/png".equals(contentType) || "image/jpeg".equals(contentType)) {
                extractedText = ocrService.extractText(file.getBytes());

            } else {
                response.put("error", "Unsupported file type. Please upload a PDF, PNG, or JPG file.");
                return ResponseEntity.badRequest().body(response);
            }

            AiSummaryService.SummaryResult aiResult = aiSummaryService.generateSummary(extractedText, summaryLength);

            response.put("fileName", file.getOriginalFilename());
            response.put("extractedText", extractedText);
            if (pageCount != null) {
                response.put("pageCount", pageCount);
            }
            response.put("summaryLength", summaryLength);
            response.put("summary", aiResult.getSummary());
            response.put("keyPoints", aiResult.getKeyPoints());
            response.put("improvementSuggestions", aiResult.getImprovementSuggestions());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
        } catch (TesseractException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Summary generation failed. Please try again.");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleFileTooLarge() {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "File is too large. Maximum size is 10MB.");
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response);
    }
}