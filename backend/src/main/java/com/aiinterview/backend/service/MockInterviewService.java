package com.aiinterview.backend.service;

import com.aiinterview.backend.dto.MockInterviewFeedbackResponse;
import com.aiinterview.backend.dto.MockInterviewRequest;
import com.aiinterview.backend.dto.MockInterviewResultRequest;
import com.aiinterview.backend.dto.MockInterviewResultResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MockInterviewService {

    private final OllamaService ollamaService;

    public MockInterviewService(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    // ==========================================
    // AI ANSWER EVALUATION
    // ==========================================

    public MockInterviewFeedbackResponse evaluateAnswer(
            MockInterviewRequest request
    ) {

        String question = request.getQuestion();
        String answer = request.getAnswer();

        if (answer == null || answer.trim().isEmpty()) {
            return new MockInterviewFeedbackResponse(
                    0,
                    "Please provide an answer before submitting."
            );
        }

        String prompt = """
                You are an expert technical interviewer.

                Evaluate the candidate's interview answer.

                Interview Question:
                %s

                Candidate Answer:
                %s

                Evaluate the answer based on:
                - Technical correctness
                - Relevance
                - Clarity
                - Depth
                - Practical understanding

                Give a score from 0 to 100.

                Then provide concise and useful feedback.

                IMPORTANT:
                Return ONLY in this format:

                SCORE: number
                FEEDBACK: feedback text
                """.formatted(
                question,
                answer
        );

        try {

            String aiResponse =
                    ollamaService.generateResponse(prompt);

            int score = extractScore(aiResponse);

            String feedback = extractFeedback(aiResponse);

            return new MockInterviewFeedbackResponse(
                    score,
                    feedback
            );

        } catch (Exception e) {

            return new MockInterviewFeedbackResponse(
                    0,
                    "Unable to get AI feedback. Please make sure Ollama is running."
            );
        }
    }

    // ==========================================
    // EXTRACT SCORE FROM OLLAMA RESPONSE
    // ==========================================

    private int extractScore(String response) {

        try {

            String upper = response.toUpperCase();

            int start = upper.indexOf("SCORE:");

            if (start == -1) {
                return 50;
            }

            start += "SCORE:".length();

            StringBuilder number = new StringBuilder();

            for (int i = start; i < upper.length(); i++) {

                char c = upper.charAt(i);

                if (Character.isDigit(c)) {
                    number.append(c);
                } else if (number.length() > 0) {
                    break;
                }
            }

            if (number.length() == 0) {
                return 50;
            }

            int score = Integer.parseInt(number.toString());

            return Math.max(0, Math.min(score, 100));

        } catch (Exception e) {

            return 50;
        }
    }

    // ==========================================
    // EXTRACT FEEDBACK
    // ==========================================

    private String extractFeedback(String response) {

        String upper = response.toUpperCase();

        int start = upper.indexOf("FEEDBACK:");

        if (start == -1) {
            return response.trim();
        }

        start += "FEEDBACK:".length();

        return response.substring(start).trim();
    }

    // ==========================================
    // FINAL MOCK INTERVIEW RESULT
    // ==========================================

    public MockInterviewResultResponse calculateFinalResult(
            MockInterviewResultRequest request
    ) {

        List<Integer> scores = request.getScores();

        if (scores == null || scores.isEmpty()) {

            return new MockInterviewResultResponse(
                    0,
                    "Not Attempted",
                    "Submit at least one answer to receive your final result."
            );
        }

        int totalScore = 0;
        int answerCount = 0;

        for (Integer score : scores) {

            if (score != null) {

                totalScore +=
                        Math.max(0, Math.min(score, 100));

                answerCount++;
            }
        }

        if (answerCount == 0) {

            return new MockInterviewResultResponse(
                    0,
                    "Not Attempted",
                    "Submit valid answer scores to receive your final result."
            );
        }

        int finalScore =
                totalScore / answerCount;

        if (finalScore >= 80) {

            return new MockInterviewResultResponse(
                    finalScore,
                    "Excellent",
                    "Excellent performance. You gave clear and detailed answers."
            );
        }

        if (finalScore >= 60) {

            return new MockInterviewResultResponse(
                    finalScore,
                    "Good",
                    "Good performance. Add more project examples to make your answers stronger."
            );
        }

        return new MockInterviewResultResponse(
                finalScore,
                "Needs Improvement",
                "Keep practicing. Focus on clearer explanations and practical examples."
        );
    }
}