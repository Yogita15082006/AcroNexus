package com.acronexus.dto;

import java.util.ArrayList;
import java.util.List;

public class UploadStats {
    public int totalRecords = 0;
    public int successfulRecords = 0;
    public int failedRecords = 0;
    public int updatedRecords = 0;
    public int skippedRecords = 0;
    public int duplicateRecords = 0;
    public List<UploadErrorDto> errors = new ArrayList<>();

    public void addError(UploadErrorDto error) {
        errors.add(error);
    }
}
