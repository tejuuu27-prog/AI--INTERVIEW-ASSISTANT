package com.aiinterview.backend.dto;

import java.util.List;

public class MockInterviewResultRequest {

    private List<Integer> scores;

    public MockInterviewResultRequest() {
    }

    public List<Integer> getScores() {
        return scores;
    }

    public void setScores(List<Integer> scores) {
        this.scores = scores;
    }
}