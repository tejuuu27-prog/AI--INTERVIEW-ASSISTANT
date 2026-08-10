package com.aiinterview.backend.controller;

import com.aiinterview.backend.dto.InterviewQuestionResponse;
import com.aiinterview.backend.dto.MockInterviewFeedbackResponse;
import com.aiinterview.backend.dto.MockInterviewRequest;
import com.aiinterview.backend.dto.ResumeAnalysisResponse;
import com.aiinterview.backend.response.ApiResponse;
import com.aiinterview.backend.service.InterviewQuestionService;
import com.aiinterview.backend.service.MockInterviewService;
import com.aiinterview.backend.service.ResumeAnalysisService;
import com.aiinterview.backend.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private ResumeAnalysisService resumeAnalysisService;

    @Autowired
    private InterviewQuestionService interviewQuestionService;

    @Autowired
    private MockInterviewService mockInterviewService;

    @PostMapping("/upload")
    public ApiResponse uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedBy") String uploadedBy) {

        return resumeService.saveResume(file, uploadedBy);
    }

    @GetMapping("/analyze/latest")
    public ResumeAnalysisResponse analyzeLatestResume() {
        return resumeAnalysisService.analyzeLatestResume();
    }

    @GetMapping("/questions/latest")
    public InterviewQuestionResponse generateQuestions() {
        return interviewQuestionService.generateQuestions();
    }

    @PostMapping("/mock-interview/feedback")
    public MockInterviewFeedbackResponse evaluateAnswer(
            @RequestBody MockInterviewRequest request
    ) {
        return mockInterviewService.evaluateAnswer(request);
    }
}