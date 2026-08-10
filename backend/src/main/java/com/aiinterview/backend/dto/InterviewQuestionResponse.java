package com.aiinterview.backend.dto;

import java.util.List;

public class InterviewQuestionResponse {

    private Long resumeId;
    private String fileName;
    private List<String> detectedSkills;
    private List<String> interviewQuestions;

    public InterviewQuestionResponse(
            Long resumeId,
            String fileName,
            List<String> detectedSkills,
            List<String> interviewQuestions
    ) {
        this.resumeId = resumeId;
        this.fileName = fileName;
        this.detectedSkills = detectedSkills;
        this.interviewQuestions = interviewQuestions;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public String getFileName() {
        return fileName;
    }

    public List<String> getDetectedSkills() {
        return detectedSkills;
    }

    public List<String> getInterviewQuestions() {
        return interviewQuestions;
    }
}
