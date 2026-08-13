package com.aiinterview.backend.controller;

import com.aiinterview.backend.dto.InterviewQuestionResponse;
import com.aiinterview.backend.service.InterviewQuestionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/interview")
public class InterviewQuestionController {

    private final InterviewQuestionService interviewQuestionService;

    public InterviewQuestionController(
            InterviewQuestionService interviewQuestionService
    ) {
        this.interviewQuestionService = interviewQuestionService;
    }

    @GetMapping("/questions")
    public InterviewQuestionResponse generateQuestions() {

        return interviewQuestionService.generateQuestions();
    }
}