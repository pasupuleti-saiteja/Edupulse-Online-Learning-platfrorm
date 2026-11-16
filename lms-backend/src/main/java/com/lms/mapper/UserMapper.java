package com.lms.mapper;

import com.lms.dto.auth.RegisterRequest;
import com.lms.dto.user.UserResponse;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.entity.UserStatus;

public class UserMapper {

    public static User toEntity(RegisterRequest request, String encodedPassword) {
        return User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .password(encodedPassword)
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();
    }

    public static UserResponse toResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
