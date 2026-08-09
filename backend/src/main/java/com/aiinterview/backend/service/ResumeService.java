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

    public ApiResponse saveResume(MultipartFile file, String uploadedBy) {

        try {

            String uploadDir = "uploads/";

            Files.createDirectories(Paths.get(uploadDir));

            String fileName = file.getOriginalFilename();

            Path filePath = Paths.get(uploadDir, fileName);

            Files.copy(file.getInputStream(), filePath);

            Resume resume = new Resume();

            resume.setFileName(fileName);
            resume.setFilePath(filePath.toString());
            resume.setUploadedBy(uploadedBy);
            resume.setUploadDate(LocalDate.now().toString());

            resumeRepository.save(resume);

            return new ApiResponse(true, "Resume Uploaded Successfully");

        } catch (IOException e) {
            throw new RuntimeException("File Upload Failed");
        }
    }

}