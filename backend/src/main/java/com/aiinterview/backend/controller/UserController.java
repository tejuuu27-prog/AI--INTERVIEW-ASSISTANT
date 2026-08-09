package com.aiinterview.backend.controller;

import com.aiinterview.backend.dto.RegisterRequest;
import com.aiinterview.backend.entity.User;
import com.aiinterview.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.aiinterview.backend.response.ApiResponse;
import com.aiinterview.backend.dto.LoginRequest;



@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ApiResponse register(@Valid @RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }
    @PostMapping("/login")
    public ApiResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.loginUser(request);
    }
}