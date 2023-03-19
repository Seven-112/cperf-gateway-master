package com.mshz.repository;

import java.util.Collection;
import java.util.List;

import com.mshz.domain.Privilege;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Privilege entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PrivilegeRepository extends JpaRepository<Privilege, Long>, JpaSpecificationExecutor<Privilege> {

    Collection<Privilege> findByAuthorityInIgnoreCase(List<String> autorities);
}
