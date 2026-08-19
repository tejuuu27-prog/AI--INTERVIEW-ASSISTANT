package com.aiinterview.backend.service;

import com.aiinterview.backend.entity.Resume;
import com.aiinterview.backend.repository.ResumeRepository;
import com.aiinterview.backend.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ResumeTextExtractionService resumeTextExtractionService;

    public ApiResponse saveResume(
            MultipartFile file,
            String uploadedBy
    ) {

        try {

            // Create upload directory
            String uploadDir = "uploads/";

            Files.createDirectories(Paths.get(uploadDir));

            // Get original filename
            String fileName = file.getOriginalFilename();

            if (fileName == null || fileName.trim().isEmpty()) {
                throw new RuntimeException("Invalid file name");
            }

            // File location
            Path filePath = Paths.get(uploadDir, fileName);

            // Save/overwrite file
            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            // Extract text from PDF
            String extractedText =
                    resumeTextExtractionService.extractText(file);

            // Create Resume entity
            Resume resume = new Resume();

            resume.setFileName(fileName);
            resume.setFilePath(filePath.toString());
            resume.setUploadedBy(uploadedBy);
            resume.setUploadDate(LocalDate.now().toString());

            // IMPORTANT:
            // Save extracted resume text
            resume.setResumeText(extractedText);

            // Save to database
            resumeRepository.save(resume);

            return new ApiResponse(
                    true,
                    "Resume Uploaded Successfully"
            );

        } catch (IOException e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "File Upload Failed: " + e.getMessage()
            );
        }
    }
}