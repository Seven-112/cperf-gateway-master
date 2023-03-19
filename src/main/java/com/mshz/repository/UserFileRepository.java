package com.mshz.repository;

import java.util.List;

import com.mshz.domain.UserFile;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UserFile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserFileRepository extends JpaRepository<UserFile, Long>, JpaSpecificationExecutor<UserFile> {
    
    @Modifying(flushAutomatically = true)
    @Query("delete from UserFile uf where uf.parentId=:parentId")
    void deleteByParentId(@Param("parentId") Long parentId);

    List<UserFile> findByUserIdAndParentIdAndIsEmployeIs(Long userId, Long folderId, Boolean isEmploye);
}
