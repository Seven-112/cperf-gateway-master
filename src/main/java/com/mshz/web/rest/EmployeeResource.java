package com.mshz.web.rest;

import com.mshz.domain.Department;
import com.mshz.domain.Employee;
import com.mshz.service.EmployeeService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.EmployeeCriteria;
import com.mshz.service.EmployeeQueryService;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mshz.domain.Employee}.
 */
@RestController
@RequestMapping("/api")
public class EmployeeResource {

    private final Logger log = LoggerFactory.getLogger(EmployeeResource.class);

    private static final String ENTITY_NAME = "employee";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmployeeService employeeService;

    private final EmployeeQueryService employeeQueryService;

    public EmployeeResource(EmployeeService employeeService, EmployeeQueryService employeeQueryService) {
        this.employeeService = employeeService;
        this.employeeQueryService = employeeQueryService;
    }

    /**
     * {@code POST  /employees} : Create a new employee.
     *
     * @param employee the employee to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new employee, or with status {@code 400 (Bad Request)} if the employee has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("@customPermissionEvalutor.hasPermission(\""+ENTITY_NAME+"\",'CREATE') || @customPermissionEvalutor.hasPermission('Organigram','CREATE')")
    @PostMapping("/employees")
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) throws URISyntaxException {
        log.debug("REST request to save Employee : {}", employee);
        if (employee.getId() != null) {
            throw new BadRequestAlertException("A new employee cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Employee result = employeeService.save(employee);
        return ResponseEntity.created(new URI("/api/employees/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /employees} : Updates an existing employee.
     *
     * @param employee the employee to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated employee,
     * or with status {@code 400 (Bad Request)} if the employee is not valid,
     * or with status {@code 500 (Internal Server Error)} if the employee couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/employees")
    @PreAuthorize("@customPermissionEvalutor.hasPermission(\""+ENTITY_NAME+"\",'UPDATE')  || @customPermissionEvalutor.hasPermission('Organigram','UPDATE')")
    public ResponseEntity<Employee> updateEmployee(@Valid @RequestBody Employee employee) throws URISyntaxException {
        log.debug("REST request to update Employee : {}", employee);
        if (employee.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Employee result = employeeService.save(employee);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, employee.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /employees} : get all the employees.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of employees in body.
     */
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees(EmployeeCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Employees by criteria: {}", criteria);
        Page<Employee> page = employeeQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /employees/count} : count all the employees.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/employees/count")
    public ResponseEntity<Long> countEmployees(EmployeeCriteria criteria) {
        log.debug("REST request to count Employees by criteria: {}", criteria);
        return ResponseEntity.ok().body(employeeQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /employees/:id} : get the "id" employee.
     *
     * @param id the id of the employee to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the employee, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        log.debug("REST request to get Employee : {}", id);
        Optional<Employee> employee = employeeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(employee);
    }

    /**
     * {@code DELETE  /employees/:id} : delete the "id" employee.
     *
     * @param id the id of the employee to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/employees/{id}")
    @PreAuthorize("@customPermissionEvalutor.hasPermission(\""+ENTITY_NAME+"\",'DELETE')  || @customPermissionEvalutor.hasPermission('Organigram','DELETE')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        log.debug("REST request to delete Employee : {}", id);
        employeeService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code GET  /employees} : get all the employees.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of employees in body.
     */
    @GetMapping("/employees/notIn")
    public ResponseEntity<List<Employee>> getAllEmployeesNotIn(@RequestParam("ids") List<Long> notInEmployeesIds, @RequestParam("page") int page, @RequestParam("size") int size) {
        log.debug("REST request to get Employees not in array id: {}", notInEmployeesIds);
        Page<Employee> result = employeeService.findNoteIn(notInEmployeesIds, PageRequest.of(page, size));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), result);
        return ResponseEntity.ok().headers(headers).body(result.getContent());
    }

    /**
     * {@code GET  /employees} : get all the employees.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of employees in body.
     */
    @GetMapping("/employees/idAndDeptnotIn")
    public ResponseEntity<List<Employee>> getAllEmployeesNotIn(@RequestParam("ids") List<Long> notInEmployeesIds, @RequestParam("departmentId") Long departmentId, @RequestParam("page") int page, @RequestParam("size") int size) {
        log.debug("REST request to get Employees not in array id and department id not {}: {}", notInEmployeesIds, departmentId);
        Page<Employee> result = employeeService.findNoteInAndDepartmentIsNot(notInEmployeesIds, departmentId, PageRequest.of(page, size));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), result);
        return ResponseEntity.ok().headers(headers).body(result.getContent());
    }

    @PutMapping("/employees/updateManager/{employeId}/{managerId}")
    @PreAuthorize("@customPermissionEvalutor.hasPermission(\""+ENTITY_NAME+"\",'UPDATE')  || @customPermissionEvalutor.hasPermission('Organigram','UPDATE')")
    public ResponseEntity<Employee> updateEmployeeManagerId(
        @PathVariable Long employeId , @PathVariable(required = false) Long managerId) throws URISyntaxException {
        log.debug("REST request to update Employee {} managerId {}", employeId, managerId);
        if (employeId == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Employee result = employeeService.updateManagerId(employeId, managerId);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, employeId.toString()))
            .body(result);
    }
}
