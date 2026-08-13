package com.aiinterview.backend.controller;

import com.aiinterview.backend.dto.MockInterviewRequest;
import com.aiinterview.backend.service.MockInterviewService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:5173")
public class InterviewController {

    private final MockInterviewService mockInterviewService;

    public InterviewController(
            MockInterviewService mockInterviewService
    ) {
        this.mockInterviewService = mockInterviewService;
    }

    @PostMapping("/feedback")
    public Object getFeedback(
            @RequestBody MockInterviewRequest request
    ) {
        return mockInterviewService.evaluateAnswer(request);
    }
}