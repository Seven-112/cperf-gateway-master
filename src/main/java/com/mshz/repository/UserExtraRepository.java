package com.mshz.repository;

import java.util.Optional;

import com.mshz.domain.UserExtra;
import com.mshz.domain.projection.UserExtraIdOnly;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Spring Data  repository for the UserExtra entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserExtraRepository extends JpaRepository<UserExtra, Long>, JpaSpecificationExecutor<UserExtra> {
    @Query("select ue from UserExtra ue where ue.employee != null and ue.employee.id =:empId")
    Optional<UserExtra> getUserExtratByEmployeeId(@Param("empId") Long empId);

    Page<UserExtra> findByEmployee_IdNotInAndEmployee_IdNotNull(List<Long> ids, Pageable pageable);

    @Query("select distinct ue from UserExtra ue "+
    "join ue.employee.department dept "+
    "where ue.employee != null and dept.id =:deptId")
    List<UserExtra> getByDeparementId(@Param("deptId") Long deptId);

    @Modifying(flushAutomatically = true)
    @Query("delete from UserExtra ue where ue.employee != null and ue.employee.id=:empId")
    void deleteByeEmployeeId(@Param("empId") Long employeeId);

    Page<UserExtra> findByIdNotIn(List<Long> ids, Pageable pageable);

    @Query("select distinct ue from UserExtra ue "+
    "where (ue.user != null AND (lower(ue.user.firstName) LIKE %:term% OR lower(ue.user.lastName) LIKE %:term%))")
    Page<UserExtra> searchByFirstOrLastName(@Param("term") String term, Pageable pageable);
    

    Page<UserExtra> findByUserNotNullAndUser_activated(Boolean status, Pageable pageable);

    Page<UserExtra> findByUserNotNullAndUser_activatedAndIdNotIn(Boolean status, List<Long> ids, Pageable pageable);

    @Query("select distinct ue from UserExtra ue "+
    "join ue.employee emp join emp.department dept "+
    "where ue.employee != null and ue.user != null "+
    " and dept != null and dept.id=:deptId and ue.user.activated=:status")
    Page<UserExtra> findByStatusAndDepartement(@Param("status") Boolean status,@Param("deptId") Long departmentId, Pageable pageable);

    Optional<UserExtra> findFirstByEmployee_IdAndUserNotNull(Long id);

    UserExtra findFirstByUser_emailOrUser_loginOrEmployee_email(String loginOrEmail, String loginOrEmail2, String loginOrEmail3);

    List<UserExtra> findByUser_emailInOrUser_loginInOrEmployee_emailIn(List<String> emails,
            List<String> emails2, List<String> email3);

    Optional<UserExtra> findFirstByIdOrUser_Login(Long senderId, String senderLogin);

    List<UserExtra> findDistinctByIdIn(List<Long> targetIds);

    List<UserExtra> findByIdIn(List<Long> ids);

    Page<UserExtra> findDistinctByEmployeeNotNullAndIdNotAndEmployee_pathContaining(Long managerId, String string,
            Pageable pageable);

        @Query("select distinct ue from UserExtra ue "+
        "join ue.employee.department dept "+
        "where ue.employee != null and dept.id =:deptId")
        List<UserExtraIdOnly> findIdOnlyByDepartementId(@Param("deptId") Long deptId);
}
