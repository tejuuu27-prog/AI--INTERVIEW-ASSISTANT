package com.aiinterview.backend.service;

import com.aiinterview.backend.entity.Resume;
import com.aiinterview.backend.repository.ResumeRepository;
import com.aiinterview.backend.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.io.IOException;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ResumeTextExtractionService resumeTextExtractionService;

    public ApiResponse saveResume(MultipartFile file, String uploadedBy) {

        try {

            String uploadDir = "uploads/";

            Files.createDirectories(Paths.get(uploadDir));

            String originalFileName = file.getOriginalFilename();

            if (originalFileName == null || originalFileName.isBlank()) {
                return new ApiResponse(false, "Invalid file name");
            }

            // Create a unique filename so the same resume
            // can be uploaded multiple times.
            String fileName =
                    System.currentTimeMillis() + "_" + originalFileName;

            Path filePath = Paths.get(uploadDir, fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath
            );

            // Extract text from PDF
            String extractedText =
                    resumeTextExtractionService.extractText(file);

            Resume resume = new Resume();

            resume.setFileName(originalFileName);
            resume.setFilePath(filePath.toString());
            resume.setUploadedBy(uploadedBy);
            resume.setUploadDate(LocalDate.now().toString());

            resumeRepository.save(resume);

            return new ApiResponse(
                    true,
                    "Resume Uploaded Successfully"
            );

        } catch (IOException e) {

            e.printStackTrace();

            return new ApiResponse(
                    false,
                    "File Upload Failed: " + e.getMessage()
            );
        }
    }
}
