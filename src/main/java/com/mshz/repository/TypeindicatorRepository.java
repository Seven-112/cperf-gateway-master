package com.mshz.repository;

import com.mshz.domain.Typeindicator;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Typeindicator entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeindicatorRepository extends JpaRepository<Typeindicator, Long>, JpaSpecificationExecutor<Typeindicator> {
}
