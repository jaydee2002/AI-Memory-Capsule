package com.example.memorycapsule.service;

import com.example.memorycapsule.config.S3Config;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final S3Config s3Config;

    public String generatePresignedUrl(String fileName) {
        S3Presigner presigner = s3Config.s3Presigner();

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(s3Config.getBucketName())
                .key(fileName)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(15))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toString();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        S3Client s3 = s3Config.s3Client();
        PutObjectRequest putOb = PutObjectRequest.builder()
                .bucket(s3Config.getBucketName())
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3.putObject(putOb, software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes()));

        return "https://" + s3Config.getBucketName() + ".s3." + s3Config.getRegion() + ".amazonaws.com/" + fileName;
    }

    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        // Extract fileName from URL
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

        S3Client s3 = s3Config.s3Client();
        DeleteObjectRequest deleteOb = DeleteObjectRequest.builder()
                .bucket(s3Config.getBucketName())
                .key(fileName)
                .build();

        s3.deleteObject(deleteOb);
    }
}