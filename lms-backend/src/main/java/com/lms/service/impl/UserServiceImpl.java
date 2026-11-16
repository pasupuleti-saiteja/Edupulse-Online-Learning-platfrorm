package com.lms.service.impl;

import com.lms.dto.common.PagedResponse;
import com.lms.dto.user.ChangePasswordRequest;
import com.lms.dto.user.UpdateProfileRequest;
import com.lms.dto.user.UserResponse;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.entity.UserStatus;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.mapper.UserMapper;
import com.lms.repository.UserRepository;
import com.lms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long userId) {
        User user = findUserById(userId);
        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = findUserById(userId);
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
        User updated = userRepository.save(user);
        return UserMapper.toResponse(updated);
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = findUserById(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("New password cannot be the same as current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(Role role, String keyword, Pageable pageable) {
        Page<User> usersPage = userRepository.searchUsers(role, keyword, pageable);
        List<UserResponse> responses = usersPage.getContent().stream()
                .map(UserMapper::toResponse)
                .toList();
        return PagedResponse.of(usersPage, responses);
    }

    @Override
    public UserResponse updateUserStatus(Long userId, UserStatus status) {
        User user = findUserById(userId);
        user.setStatus(status);
        User updated = userRepository.save(user);
        return UserMapper.toResponse(updated);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = findUserById(userId);
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete Administrator account");
        }
        userRepository.delete(user);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
}
