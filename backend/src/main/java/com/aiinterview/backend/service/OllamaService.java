package com.aiinterview.backend.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class OllamaService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String OLLAMA_URL =
            "http://localhost:11434/api/generate";

    public String generateResponse(String prompt) {

        Map<String, Object> request = new HashMap<>();
        request.put("model", "llama3.2");
        request.put("prompt", prompt);
        request.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        OLLAMA_URL,
                        entity,
                        Map.class
                );

        if (!response.getStatusCode().is2xxSuccessful()
                || response.getBody() == null) {

            throw new RuntimeException(
                    "Unable to connect to Ollama"
            );
        }

        Object result = response.getBody().get("response");

        if (result == null) {
            throw new RuntimeException(
                    "Ollama returned an empty response"
            );
        }

        return result.toString();
    }
}