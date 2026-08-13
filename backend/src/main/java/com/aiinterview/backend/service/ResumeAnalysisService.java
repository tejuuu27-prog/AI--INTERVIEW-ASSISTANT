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
    private final OllamaService ollamaService;

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

    public ResumeAnalysisService(
            ResumeRepository resumeRepository,
            OllamaService ollamaService
    ) {
        this.resumeRepository = resumeRepository;
        this.ollamaService = ollamaService;
    }

    public ResumeAnalysisResponse analyzeLatestResume() {

        Resume resume = resumeRepository.findTopByOrderByIdDesc()
                .orElseThrow(() ->
                        new IllegalStateException("No uploaded resume found"));

        String resumeText = resume.getResumeText() == null
                ? ""
                : resume.getResumeText();

        String normalizedText =
                resumeText.toLowerCase(Locale.ROOT);

        // Existing skill detection
        List<String> detectedSkills = SKILLS.entrySet().stream()
                .filter(skill ->
                        normalizedText.contains(skill.getKey()))
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

        // Send resume to local AI
        String prompt = buildPrompt(resumeText);

        String aiResponse =
                ollamaService.generateResponse(prompt);

        // Temporary parsing
        int score = extractScore(aiResponse);

        List<String> strengths =
                extractSection(aiResponse, "STRENGTHS");

        List<String> weaknesses =
                extractSection(aiResponse, "WEAKNESSES");

        List<String> suggestions =
                extractSection(aiResponse, "SUGGESTIONS");

        String interviewFocus =
                extractTextSection(aiResponse, "INTERVIEW FOCUS");

        return new ResumeAnalysisResponse(
                resume.getId(),
                resume.getFileName(),
                resumeText.length(),
                detectedSkills,
                educationDetected,
                experienceDetected,
                score,
                strengths,
                weaknesses,
                suggestions,
                interviewFocus
        );
    }

    private String buildPrompt(String resumeText) {

        return """
                You are an expert AI resume and interview assistant.

                Analyze the following candidate resume.

                Return your response using EXACTLY these headings:

                SCORE:
                Give a score from 0 to 100.

                STRENGTHS:
                Give 3 to 5 important strengths.
                Put each strength on a separate line beginning with "-".

                WEAKNESSES:
                Give 2 to 4 important weaknesses.
                Put each weakness on a separate line beginning with "-".

                SUGGESTIONS:
                Give 3 to 5 practical suggestions.
                Put each suggestion on a separate line beginning with "-".

                INTERVIEW FOCUS:
                Explain what areas an interviewer should focus on
                based on this resume.

                RESUME:
                """ + resumeText;
    }

    private int extractScore(String response) {

        try {
            int start = response.indexOf("SCORE:");

            if (start == -1) {
                return 0;
            }

            String afterScore =
                    response.substring(start + 6).trim();

            StringBuilder number = new StringBuilder();

            for (char c : afterScore.toCharArray()) {

                if (Character.isDigit(c)) {
                    number.append(c);
                } else if (number.length() > 0) {
                    break;
                }
            }

            if (number.length() == 0) {
                return 0;
            }

            int score = Integer.parseInt(number.toString());

            return Math.min(100, Math.max(0, score));

        } catch (Exception e) {
            return 0;
        }
    }

    private List<String> extractSection(
            String response,
            String section
    ) {

        String text =
                extractTextSection(response, section);

        return text.lines()
                .map(String::trim)
                .filter(line -> line.startsWith("-"))
                .map(line -> line.substring(1).trim())
                .filter(line -> !line.isEmpty())
                .toList();
    }

    private String extractTextSection(
            String response,
            String section
    ) {

        String marker = section + ":";

        int start = response.indexOf(marker);

        if (start == -1) {
            return "";
        }

        start += marker.length();

        String remaining =
                response.substring(start);

        String[] sections = {
                "SCORE:",
                "STRENGTHS:",
                "WEAKNESSES:",
                "SUGGESTIONS:",
                "INTERVIEW FOCUS:"
        };

        int end = remaining.length();

        for (String nextSection : sections) {

            if (nextSection.equals(marker)) {
                continue;
            }

            int position =
                    remaining.indexOf(nextSection);

            if (position >= 0 && position < end) {
                end = position;
            }
        }

        return remaining.substring(0, end).trim();
    }

    private boolean containsAny(
            String text,
            String... keywords
    ) {

        for (String keyword : keywords) {

            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }
}