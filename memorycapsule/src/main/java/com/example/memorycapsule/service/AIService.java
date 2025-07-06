package com.example.memorycapsule.service;

import com.theokanning.openai.service.OpenAiService;
import com.theokanning.openai.completion.CompletionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${openai.apiKey}")
    private String apiKey;

    public String generateReflection(String text) {
        OpenAiService service = new OpenAiService(apiKey);

        CompletionRequest request = CompletionRequest.builder()
                .prompt("Summarize this message in an emotional and reflective way: " + text)
                .maxTokens(100)
                .model("gpt-3.5-turbo-instruct") // or "text-davinci-003"
                .build();

        String result = service.createCompletion(request).getChoices().get(0).getText();
        service.shutdownExecutor(); // clean up
        return result.trim();
    }
}

