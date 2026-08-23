package com.documentsummary.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class AiSummaryService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    private static final String GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

    public static class SummaryResult {
        private final String summary;
        private final List<String> keyPoints;
        private final List<String> improvementSuggestions;

        public SummaryResult(String summary, List<String> keyPoints, List<String> improvementSuggestions) {
            this.summary = summary;
            this.keyPoints = keyPoints;
            this.improvementSuggestions = improvementSuggestions;
        }

        public String getSummary() {
            return summary;
        }

        public List<String> getKeyPoints() {
            return keyPoints;
        }

        public List<String> getImprovementSuggestions() {
            return improvementSuggestions;
        }
    }

    public SummaryResult generateSummary(String documentText, String summaryLength) {
        String lengthInstruction = switch (summaryLength) {
            case "SHORT" -> "as 2-3 separate lines, each stating one key idea";
            case "LONG" -> "as 6-10 separate lines, each stating one distinct point or idea from the document";
            default -> "as 4-6 separate lines, each stating one key idea";
        };

        String prompt = """
            You are analyzing a document for the user. Follow these rules strictly:
            - Base everything ONLY on the content in the document below. Do not invent facts.
            - Preserve important names, dates, numbers, and terminology exactly as written.

            Respond in EXACTLY this format, with these three section headers written exactly as shown,
            and nothing else before, after, or between them:

            ===SUMMARY===
            (Write the summary %s. One point per line, no bullet symbols or numbering.)

            ===KEY_POINTS===
            (List exactly 5 of the most important standalone facts or points from the document.
            One point per line, no bullet symbols or numbering.)

            ===IMPROVEMENT_SUGGESTIONS===
            (List 3-5 ways this document could be improved, such as unclear sections, missing context,
            or areas that could be explained better. Base suggestions only on what is actually in the
            document. One suggestion per line, no bullet symbols or numbering.)

            Document:
            %s
            """.formatted(lengthInstruction, documentText);

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        Map<String, Object> response = restClient.post()
            .uri(GEMINI_URL + "?key=" + apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .body(requestBody)
            .retrieve()
            .body(Map.class);

        String rawText = extractTextFromResponse(response);
        return parseSections(rawText);
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> response) {
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        return (String) parts.get(0).get("text");
    }

    private SummaryResult parseSections(String rawText) {
        String summarySection = "";
        String keyPointsSection = "";
        String suggestionsSection = "";

        String[] afterSummary = rawText.split("===KEY_POINTS===");
        if (afterSummary.length == 2) {
            summarySection = afterSummary[0].replace("===SUMMARY===", "").trim();

            String[] afterKeyPoints = afterSummary[1].split("===IMPROVEMENT_SUGGESTIONS===");
            if (afterKeyPoints.length == 2) {
                keyPointsSection = afterKeyPoints[0].trim();
                suggestionsSection = afterKeyPoints[1].trim();
            } else {
                keyPointsSection = afterSummary[1].trim();
            }
        } else {
            summarySection = rawText.trim();
        }

        List<String> keyPoints = parseLines(keyPointsSection);
        List<String> suggestions = parseLines(suggestionsSection);

        return new SummaryResult(summarySection, keyPoints, suggestions);
    }

    private List<String> parseLines(String section) {
        if (section.isBlank()) {
            return new ArrayList<>();
        }
        return Arrays.stream(section.split("\n"))
            .map(String::trim)
            .filter(line -> !line.isEmpty())
            .toList();
    }
}