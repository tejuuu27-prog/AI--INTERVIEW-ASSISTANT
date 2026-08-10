package com.aiinterview.backend.dto;

public class MockInterviewFeedbackResponse {

    private int score;
    private String feedback;

    public MockInterviewFeedbackResponse(
            int score,
            String feedback
    ) {
        this.score = score;
        this.feedback = feedback;
    }

    public int getScore() {
        return score;
    }

    public String getFeedback() {
        return feedback;
    }
}