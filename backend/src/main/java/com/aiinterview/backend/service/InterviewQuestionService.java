package com.aiinterview.backend.service;

import com.aiinterview.backend.dto.InterviewQuestionResponse;
import com.aiinterview.backend.dto.ResumeAnalysisResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InterviewQuestionService {

    private final ResumeAnalysisService resumeAnalysisService;

    public InterviewQuestionService(
            ResumeAnalysisService resumeAnalysisService
    ) {
        this.resumeAnalysisService = resumeAnalysisService;
    }

    public InterviewQuestionResponse generateQuestions() {

        ResumeAnalysisResponse analysis =
                resumeAnalysisService.analyzeLatestResume();

        List<String> questions = new ArrayList<>();

        for (String skill : analysis.getDetectedSkills()) {

            switch (skill) {
                case "Java" -> questions.add(
                        "Explain the difference between an interface and an abstract class in Java."
                );

                case "Spring Boot" -> questions.add(
                        "What is dependency injection in Spring Boot?"
                );

                case "MySQL", "SQL" -> questions.add(
                        "What is the difference between INNER JOIN and LEFT JOIN in SQL?"
                );

                case "MongoDB" -> questions.add(
                        "What is the difference between MongoDB and a relational database?"
                );

                case "Angular" -> questions.add(
                        "What is data binding in Angular?"
                );

                case "React" -> questions.add(
                        "What is the difference between props and state in React?"
                );

                case "Python" -> questions.add(
                        "What are Python lists and dictionaries used for?"
                );

                case "Git", "GitHub" -> questions.add(
                        "Explain the difference between git commit and git push."
                );

                default -> questions.add(
                        "Describe a project where you used " + skill + "."
                );
            }
        }

        if (questions.isEmpty()) {
            questions.add(
                    "Tell me about yourself and the technical projects you have worked on."
            );
        }

        return new InterviewQuestionResponse(
                analysis.getResumeId(),
                analysis.getFileName(),
                analysis.getDetectedSkills(),
                questions
        );
    }
}