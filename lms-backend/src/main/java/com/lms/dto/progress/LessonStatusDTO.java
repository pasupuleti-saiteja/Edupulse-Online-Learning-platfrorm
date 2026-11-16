package com.lms.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonStatusDTO {

    private Long lessonId;
    private String title;
    private Integer sequenceNumber;
    private String duration;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
}
