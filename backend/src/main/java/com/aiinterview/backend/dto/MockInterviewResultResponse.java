package com.aiinterview.backend.dto;

public class MockInterviewResultResponse {

    private int finalScore;
    private String performanceLevel;
    private String finalFeedback;

    public MockInterviewResultResponse(
            int finalScore,
            String performanceLevel,
            String finalFeedback
    ) {
        this.finalScore = finalScore;
        this.performanceLevel = performanceLevel;
        this.finalFeedback = finalFeedback;
    }

    public int getFinalScore() {
        return finalScore;
    }

    public String getPerformanceLevel() {
        return performanceLevel;
    }

    public String getFinalFeedback() {
        return finalFeedback;
    }
}