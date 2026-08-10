package com.aiinterview.backend.service;

import com.aiinterview.backend.dto.MockInterviewFeedbackResponse;
import com.aiinterview.backend.dto.MockInterviewRequest;
import com.aiinterview.backend.dto.MockInterviewResultRequest;
import com.aiinterview.backend.dto.MockInterviewResultResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class MockInterviewService {

    public MockInterviewFeedbackResponse evaluateAnswer(
            MockInterviewRequest request
    ) {

        String answer = request.getAnswer();

        if (answer == null || answer.trim().isEmpty()) {
            return new MockInterviewFeedbackResponse(
                    0,
                    "Please provide an answer before submitting."
            );
        }

        String trimmedAnswer = answer.trim();
        String normalizedAnswer = trimmedAnswer.toLowerCase(Locale.ROOT);
        int wordCount = trimmedAnswer.split("\\s+").length;

        int score = 30;

        if (wordCount >= 20) {
            score += 25;
        }

        if (wordCount >= 50) {
            score += 20;
        }

        if (normalizedAnswer.contains("example")
                || normalizedAnswer.contains("project")
                || normalizedAnswer.contains("implemented")
                || normalizedAnswer.contains("experience")) {
            score += 15;
        }

        score = Math.min(score, 100);

        String feedback;

        if (wordCount < 20) {
            feedback = "Your answer is too short. Add an explanation and a practical example.";
        } else if (score >= 80) {
            feedback = "Strong answer. You explained your point clearly and included useful detail.";
        } else {
            feedback = "Good start. Add a real project example and more technical detail to improve your answer.";
        }

        return new MockInterviewFeedbackResponse(
                score,
                feedback
        );
    }

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
                totalScore += Math.max(0, Math.min(score, 100));
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

        int finalScore = totalScore / answerCount;

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
