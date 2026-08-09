package com.aiinterview.backend.service;

import com.aiinterview.backend.dto.RegisterRequest;
import com.aiinterview.backend.entity.User;
import com.aiinterview.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.aiinterview.backend.response.ApiResponse;
import java.util.Optional;
import com.aiinterview.backend.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.aiinterview.backend.dto.LoginResponse;
import com.aiinterview.backend.security.JwtUtil;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public ApiResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole("USER");

        userRepository.save(user);

        return new ApiResponse(true, "User Registered Successfully");
    }public ApiResponse loginUser(LoginRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
     throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        return new ApiResponse(true, "Login Successful");
    }
}