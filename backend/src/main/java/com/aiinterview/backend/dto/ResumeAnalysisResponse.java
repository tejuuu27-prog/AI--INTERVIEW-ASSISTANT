package com.aiinterview.backend.dto;

import java.util.List;

public class ResumeAnalysisResponse {

    private Long resumeId;
    private String fileName;
    private int textLength;

    private List<String> detectedSkills;
    private boolean educationDetected;
    private boolean experienceDetected;

    // AI analysis
    private int score;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
    private String interviewFocus;

    public ResumeAnalysisResponse(
            Long resumeId,
            String fileName,
            int textLength,
            List<String> detectedSkills,
            boolean educationDetected,
            boolean experienceDetected,
            int score,
            List<String> strengths,
            List<String> weaknesses,
            List<String> suggestions,
            String interviewFocus
    ) {
        this.resumeId = resumeId;
        this.fileName = fileName;
        this.textLength = textLength;
        this.detectedSkills = detectedSkills;
        this.educationDetected = educationDetected;
        this.experienceDetected = experienceDetected;
        this.score = score;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.suggestions = suggestions;
        this.interviewFocus = interviewFocus;
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

    public int getScore() {
        return score;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public String getInterviewFocus() {
        return interviewFocus;
    }
}