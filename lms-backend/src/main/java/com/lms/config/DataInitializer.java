package com.lms.config;

import com.lms.entity.*;
import com.lms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Ensures default demonstration accounts and data fixtures exist
 * upon application startup with guaranteed valid BCrypt password hashes.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking LMS seed data fixtures...");

        // 1. Seed or Verify Administrator
        seedUserIfAbsent("admin@lms.com", "System Administrator", "Admin@123", "+1-555-0100", Role.ADMIN);

        // 2. Seed or Verify Instructors
        User instructor1 = seedUserIfAbsent("john.doe@lms.com", "Dr. John Doe", "Password@123", "+1-555-0101", Role.INSTRUCTOR);
        User instructor2 = seedUserIfAbsent("jane.smith@lms.com", "Prof. Jane Smith", "Password@123", "+1-555-0102", Role.INSTRUCTOR);

        // 3. Seed or Verify Students
        seedUserIfAbsent("alice.johnson@lms.com", "Alice Johnson", "Password@123", "+1-555-0103", Role.STUDENT);
        seedUserIfAbsent("bob.miller@lms.com", "Bob Miller", "Password@123", "+1-555-0104", Role.STUDENT);
        seedUserIfAbsent("charlie.brown@lms.com", "Charlie Brown", "Password@123", "+1-555-0105", Role.STUDENT);

        // 4. Seed sample course if no courses exist
        if (courseRepository.count() == 0 && instructor1 != null) {
            log.info("Seeding initial demonstration courses...");
            Course javaCourse = Course.builder()
                    .title("Full Stack Java Development with Spring Boot & React")
                    .description("Master modern enterprise full-stack development with Spring Boot 3 REST APIs, Spring Security 6 with JWT, and React 18.")
                    .category("Development")
                    .instructor(instructor1)
                    .thumbnail("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80")
                    .duration("35 hours")
                    .price(new BigDecimal("89.99"))
                    .level(CourseLevel.INTERMEDIATE)
                    .status(CourseStatus.PUBLISHED)
                    .build();
            Course savedCourse = courseRepository.save(javaCourse);

            Lesson lesson1 = Lesson.builder()
                    .course(savedCourse)
                    .title("Introduction to Three-Tier Architecture & Project Setup")
                    .description("Presentation, Application, and Persistence tier architecture.")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .content("### Architecture Deep Dive\nIn this lesson, we explore how React interfaces connect cleanly with Spring Boot REST services.")
                    .sequenceNumber(1)
                    .duration("45 mins")
                    .build();

            Lesson lesson2 = Lesson.builder()
                    .course(savedCourse)
                    .title("Securing REST APIs with Spring Security 6 & JWT")
                    .description("Stateless authentication and RBAC.")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .content("### JWT Essentials\nLearn how to generate, sign, and validate JSON Web Tokens.")
                    .sequenceNumber(2)
                    .duration("60 mins")
                    .build();

            lessonRepository.save(lesson1);
            lessonRepository.save(lesson2);
            log.info("Sample course and lessons seeded successfully.");
        }

        log.info("LMS seed verification completed successfully.");
    }

    private User seedUserIfAbsent(String email, String fullName, String rawPassword, String phone, Role role) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            User newUser = User.builder()
                    .email(email)
                    .fullName(fullName)
                    .password(passwordEncoder.encode(rawPassword))
                    .phoneNumber(phone)
                    .role(role)
                    .status(UserStatus.ACTIVE)
                    .build();
            User saved = userRepository.save(newUser);
            log.info("Seeded default account: [{}] - Role: {}", email, role);
            return saved;
        } else {
            // Verify and refresh password hash to ensure login credentials always work
            User user = existingUser.get();
            if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(rawPassword));
                userRepository.save(user);
                log.info("Updated password hash for default user: [{}]", email);
            }
            return user;
        }
    }
}
