package com.mshz.repository;

import com.mshz.domain.ModelEntity;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the ModelEntity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ModelEntityRepository extends JpaRepository<ModelEntity, Long>, JpaSpecificationExecutor<ModelEntity> {

	ModelEntity findByEntityIgnoreCase(String entity);
}
