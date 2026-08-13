package com.aiinterview.backend.service;

import com.aiinterview.backend.dto.InterviewQuestionResponse;
import com.aiinterview.backend.dto.ResumeAnalysisResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InterviewQuestionService {

    private final ResumeAnalysisService resumeAnalysisService;
    private final OllamaService ollamaService;

    public InterviewQuestionService(
            ResumeAnalysisService resumeAnalysisService,
            OllamaService ollamaService
    ) {
        this.resumeAnalysisService = resumeAnalysisService;
        this.ollamaService = ollamaService;
    }

    public InterviewQuestionResponse generateQuestions() {

        ResumeAnalysisResponse analysis =
                resumeAnalysisService.analyzeLatestResume();

        List<String> skills = analysis.getDetectedSkills();

        if (skills == null) {
            skills = new ArrayList<>();
        }

        String skillText = String.join(", ", skills);

        String prompt = """
                You are an expert technical interviewer.

                Create interview questions for a candidate based on their resume.

                Candidate Resume:
                File Name: %s

                Detected Skills:
                %s

                Generate exactly 8 interview questions.

                The questions should include:
                1. Technical questions about the candidate's skills.
                2. Questions about projects and practical experience.
                3. Questions about problem solving.
                4. Questions that test real-world understanding.

                Make the questions appropriate for a technical job interview.

                IMPORTANT:
                Return ONLY the questions.
                Put each question on a separate line.
                Number them from 1 to 8.

                Do not provide answers.
                Do not provide explanations.
                """.formatted(
                analysis.getFileName(),
                skillText
        );

        List<String> questions = new ArrayList<>();

        try {

            String aiResponse =
                    ollamaService.generateResponse(prompt);

            String[] lines =
                    aiResponse.split("\\r?\\n");

            for (String line : lines) {

                String question = line.trim();

                if (question.isEmpty()) {
                    continue;
                }

                // Remove numbering such as:
                // 1.
                // 2)
                // 3 -
                question = question.replaceFirst(
                        "^\\d+[.)\\-:]\\s*",
                        ""
                );

                if (!question.isBlank()) {
                    questions.add(question.trim());
                }

                if (questions.size() >= 8) {
                    break;
                }
            }

        } catch (Exception e) {

            e.printStackTrace();

            // Safe fallback if Ollama is unavailable
            questions.add(
                    "Tell me about yourself and your technical background."
            );

            for (String skill : skills) {

                if (questions.size() >= 8) {
                    break;
                }

                questions.add(
                        "Describe a project where you used " + skill + "."
                );
            }
        }

        if (questions.isEmpty()) {

            questions.add(
                    "Tell me about yourself and your technical background."
            );

            questions.add(
                    "Describe your most important technical project."
            );

            questions.add(
                    "What technical skills are you most confident using?"
            );
        }

        return new InterviewQuestionResponse(
                analysis.getResumeId(),
                analysis.getFileName(),
                skills,
                questions
        );
    }
}