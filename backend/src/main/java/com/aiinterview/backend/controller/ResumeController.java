package com.aiinterview.backend.controller;

import com.aiinterview.backend.response.ApiResponse;
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

    @PostMapping("/upload")
    public ApiResponse uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedBy") String uploadedBy) {

        return resumeService.saveResume(file, uploadedBy);
    }
}