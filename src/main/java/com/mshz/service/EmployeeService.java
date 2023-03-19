package com.mshz.service;

import com.mshz.domain.Department;
import com.mshz.domain.Employee;
import com.mshz.repository.DepartmentRepository;
import com.mshz.repository.EmployeeRepository;
import com.mshz.repository.UserExtraRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Employee}.
 */
@Service
@Transactional
public class EmployeeService {

    private final Logger log = LoggerFactory.getLogger(EmployeeService.class);

    private final EmployeeRepository employeeRepository;
    private final UserExtraRepository userExtraRepostiory; 

    public EmployeeService(EmployeeRepository employeeRepository, UserExtraRepository userExtraRepostiory) {
        this.employeeRepository = employeeRepository;
        this.userExtraRepostiory = userExtraRepostiory;
    }

    /**
     * Save a employee.
     *
     * @param employee the entity to save.
     * @return the persisted entity.
     */
    public Employee save(Employee employee) {
        log.debug("Request to save Employee : {}", employee);
        employee.setPath(generateOrganigramPath(employee));
        return employeeRepository.save(employee);
    }

    /**
     * Get all the employees.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Employee> findAll(Pageable pageable) {
        log.debug("Request to get all Employees");
        return employeeRepository.findAll(pageable);
    }


    /**
     * Get one employee by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Employee> findOne(Long id) {
        log.debug("Request to get Employee : {}", id);
        return employeeRepository.findById(id);
    }

    /**
     * Delete the employee by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Employee : {}", id);
        this.userExtraRepostiory.deleteByeEmployeeId(id);
        employeeRepository.deleteById(id);
    }

    public Page<Employee> findNoteIn(List<Long> ids, Pageable page){
        return employeeRepository.findByIdNotIn(ids, page);
    }

    public Page<Employee> findNoteInAndDepartmentIsNot(List<Long> ids, Long departmentId, Pageable page){
            return employeeRepository.findByIdNotInAndDepartmentNot(ids, departmentId,page);
    }

    public Employee updateManagerId(Long employeId, Long managerId) {
        if(employeId != null && managerId != employeId){
            try{
                Employee employee = employeeRepository.getOne(employeId);
                if(employee != null){
                    employee.setManagerId(managerId);
                    if(managerId != null){
                        Employee manager = employeeRepository.getOne(managerId);
                        if(manager != null && manager.getManagerId() == employee.getId()){
                            manager.setManagerId(null);
                            manager.setPath(generateOrganigramPath(manager));
                            employeeRepository.save(manager);
                        }
                    }
                    employee.setPath(generateOrganigramPath(employee));
                    return employeeRepository.save(employee);
                }
            }catch(Exception e){
                e.printStackTrace();
            }
        }
        return null;
    }

    private String generateOrganigramPath(Employee employee){
        String path = null;
        if(employee != null){
            Employee parent = null;
            if(employee.getManagerId() != null){
                parent = employeeRepository.findById(employee.getManagerId()).orElse(null);
                if(parent != null)
                    path = parent.getPath() != null ? parent.getPath()+'-'+parent.getId().toString() : parent.getId().toString();
            }
        }
        return path;
    }
}
