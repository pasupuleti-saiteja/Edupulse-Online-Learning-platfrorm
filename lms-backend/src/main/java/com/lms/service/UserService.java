package com.lms.service;

import com.lms.dto.common.PagedResponse;
import com.lms.dto.user.ChangePasswordRequest;
import com.lms.dto.user.UpdateProfileRequest;
import com.lms.dto.user.UserResponse;
import com.lms.entity.Role;
import com.lms.entity.UserStatus;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserResponse getUserProfile(Long userId);

    UserResponse updateUserProfile(Long userId, UpdateProfileRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);

    PagedResponse<UserResponse> getAllUsers(Role role, String keyword, Pageable pageable);

    UserResponse updateUserStatus(Long userId, UserStatus status);

    void deleteUser(Long userId);
}
