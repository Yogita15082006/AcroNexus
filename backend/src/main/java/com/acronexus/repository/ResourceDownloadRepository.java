package com.acronexus.repository;

import com.acronexus.entity.ResourceDownload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ResourceDownloadRepository extends JpaRepository<ResourceDownload, UUID> {
}
