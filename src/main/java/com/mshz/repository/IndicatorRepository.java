package com.mshz.repository;

import java.time.Instant;
import java.util.List;

import com.mshz.domain.Indicator;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Indicator entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IndicatorRepository extends JpaRepository<Indicator, Long>, JpaSpecificationExecutor<Indicator> {
    @Query("SELECT ind FROM Indicator ind JOIN Objectif obj ON ind.objectif.id = obj.id "+
          "WHERE (obj.createdAt BETWEEN :startDate AND :endDate) AND ("+
          "(obj.employee != null AND obj.employee.id = :empId) "+
          "OR (obj.fonction != null AND obj.fonction.id = :fonctionId) "+
          "OR (obj.department != null AND obj.department.id = :deptId) "+ 
          ")")
    List<Indicator> getEmployeesIndicatorsObjectifCreatedBetween(@Param("empId") Long employeeId, @Param("deptId") Long departmentId,
                        @Param("fonctionId") Long fonctionId,@Param("startDate") Instant startDate,@Param("endDate") Instant endDate);
}
