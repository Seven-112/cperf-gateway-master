package com.mshz.repository;

import com.mshz.domain.TypeObjectif;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the TypeObjectif entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeObjectifRepository extends JpaRepository<TypeObjectif, Long>, JpaSpecificationExecutor<TypeObjectif> {
}
