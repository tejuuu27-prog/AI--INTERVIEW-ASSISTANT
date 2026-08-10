package com.aiinterview.backend.dto;

public class MockInterviewRequest {

    private String question;
    private String answer;

    public MockInterviewRequest() {
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}