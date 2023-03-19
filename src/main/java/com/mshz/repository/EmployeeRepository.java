package com.mshz.repository;

import java.util.List;

import com.mshz.domain.Department;
import com.mshz.domain.Employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Employee entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    Page<Employee> findByIdNotIn(List<Long> ids, Pageable page);
    
    @Query("SELECT e from Employee e WHERE e.id NOT IN :ids AND (e.department = null OR (e.department != null AND e.department.id != :departmentId))")
    Page<Employee> findByIdNotInAndDepartmentNot(@Param("ids") List<Long> ids, @Param("departmentId") Long departmentId, Pageable page);
}
