package com.aiinterview.backend.service;

import com.aiinterview.backend.dto.ResumeAnalysisResponse;
import com.aiinterview.backend.entity.Resume;
import com.aiinterview.backend.repository.ResumeRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class ResumeAnalysisService {

    private final ResumeRepository resumeRepository;

    private static final Map<String, String> SKILLS = new LinkedHashMap<>();

    static {
        SKILLS.put("java", "Java");
        SKILLS.put("spring boot", "Spring Boot");
        SKILLS.put("mysql", "MySQL");
        SKILLS.put("sql", "SQL");
        SKILLS.put("mongodb", "MongoDB");
        SKILLS.put("react", "React");
        SKILLS.put("angular", "Angular");
        SKILLS.put("javascript", "JavaScript");
        SKILLS.put("typescript", "TypeScript");
        SKILLS.put("python", "Python");
        SKILLS.put("c++", "C++");
        SKILLS.put("git", "Git");
        SKILLS.put("github", "GitHub");
        SKILLS.put("docker", "Docker");
        SKILLS.put("aws", "AWS");
    }

    public ResumeAnalysisService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    public ResumeAnalysisResponse analyzeLatestResume() {

        Resume resume = resumeRepository.findTopByOrderByIdDesc()
                .orElseThrow(() ->
                        new IllegalStateException("No uploaded resume found"));

        String resumeText = resume.getResumeText() == null
                ? ""
                : resume.getResumeText();

        String normalizedText = resumeText.toLowerCase(Locale.ROOT);

        List<String> detectedSkills = SKILLS.entrySet().stream()
                .filter(skill -> normalizedText.contains(skill.getKey()))
                .map(Map.Entry::getValue)
                .toList();

        boolean educationDetected = containsAny(
                normalizedText,
                "education",
                "bachelor",
                "master",
                "university",
                "college"
        );

        boolean experienceDetected = containsAny(
                normalizedText,
                "experience",
                "internship",
                "worked",
                "employment"
        );

        return new ResumeAnalysisResponse(
                resume.getId(),
                resume.getFileName(),
                resumeText.length(),
                detectedSkills,
                educationDetected,
                experienceDetected
        );
    }

    private boolean containsAny(String text, String... keywords) {

        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }
}