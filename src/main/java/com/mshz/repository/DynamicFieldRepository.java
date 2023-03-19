package com.mshz.repository;

import com.mshz.domain.DynamicField;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the DynamicField entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DynamicFieldRepository extends JpaRepository<DynamicField, Long>, JpaSpecificationExecutor<DynamicField> {
}
