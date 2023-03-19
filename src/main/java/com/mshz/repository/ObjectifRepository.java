package com.mshz.repository;

import java.time.Instant;
import java.util.List;

import com.mshz.domain.Objectif;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Objectif entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ObjectifRepository extends JpaRepository<Objectif, Long>, JpaSpecificationExecutor<Objectif> {
    @Query("SELECT obj FROM Objectif obj "+
          "WHERE (obj.createdAt BETWEEN :startDate AND :endDate) AND ("+
          "(obj.employee != null AND obj.employee.id = :empId) "+
          "OR (obj.fonction != null AND obj.fonction.id = :fonctionId) "+
          "OR (obj.department != null AND obj.department.id = :deptId) "+ 
          ")") 
    List<Objectif> getEmployeeObjectifBetween(@Param("empId") Long employeeId, @Param("deptId") Long departmentId,
                @Param("fonctionId") Long fonctionId,@Param("startDate") Instant startDate,@Param("endDate") Instant endDate);
    
}
