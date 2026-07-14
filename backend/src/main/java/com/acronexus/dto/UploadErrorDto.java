package com.acronexus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadErrorDto {
    private Integer rowNumber;
    private String enrollmentNo;
    private String collegeEmail;
    private String errorMessage;
}
