package com.aiinterview.backend.service;

import com.aiinterview.backend.dto.MockInterviewFeedbackResponse;
import com.aiinterview.backend.dto.MockInterviewRequest;
import org.springframework.stereotype.Service;

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
}
