package com.aiinterview.backend.dto;

import java.util.List;

public class ResumeAnalysisResponse {

    private Long resumeId;
    private String fileName;
    private int textLength;
    private List<String> detectedSkills;
    private boolean educationDetected;
    private boolean experienceDetected;

    public ResumeAnalysisResponse(
            Long resumeId,
            String fileName,
            int textLength,
            List<String> detectedSkills,
            boolean educationDetected,
            boolean experienceDetected
    ) {
        this.resumeId = resumeId;
        this.fileName = fileName;
        this.textLength = textLength;
        this.detectedSkills = detectedSkills;
        this.educationDetected = educationDetected;
        this.experienceDetected = experienceDetected;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public String getFileName() {
        return fileName;
    }

    public int getTextLength() {
        return textLength;
    }

    public List<String> getDetectedSkills() {
        return detectedSkills;
    }

    public boolean isEducationDetected() {
        return educationDetected;
    }

    public boolean isExperienceDetected() {
        return experienceDetected;
    }
}