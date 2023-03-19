package com.mshz.web.rest;

import com.mshz.domain.User;
import com.mshz.domain.UserExtra;
import com.mshz.domain.projection.UserExtraIdOnly;
import com.mshz.service.UserExtraService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.UserDTO;
import com.mshz.service.dto.UserExtraCriteria;
import com.mshz.service.UserExtraQueryService;

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
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mshz.domain.UserExtra}.
 */
@RestController
@RequestMapping("/api")
public class UserExtraResource {

    private final Logger log = LoggerFactory.getLogger(UserExtraResource.class);

    private static final String ENTITY_NAME = "userExtra";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserExtraService userExtraService;

    private final UserExtraQueryService userExtraQueryService;

    public UserExtraResource(UserExtraService userExtraService, UserExtraQueryService userExtraQueryService) {
        this.userExtraService = userExtraService;
        this.userExtraQueryService = userExtraQueryService;
    }

    /**
     * {@code POST  /user-extras} : Create a new userExtra.
     *
     * @param userExtra the userExtra to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userExtra, or with status {@code 400 (Bad Request)} if the userExtra has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-extras")
    public ResponseEntity<UserExtra> createUserExtra(@Valid @RequestBody UserExtra userExtra) throws URISyntaxException {
        log.debug("REST request to save UserExtra : {}", userExtra);
        if (userExtra.getId() != null) {
            throw new BadRequestAlertException("A new userExtra cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (Objects.isNull(userExtra.getUser())) {
            throw new BadRequestAlertException("Invalid association value provided", ENTITY_NAME, "null");
        }
        UserExtra result = userExtraService.save(userExtra);
        return ResponseEntity.created(new URI("/api/user-extras/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-extras} : Updates an existing userExtra.
     *
     * @param userExtra the userExtra to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userExtra,
     * or with status {@code 400 (Bad Request)} if the userExtra is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userExtra couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-extras")
    public ResponseEntity<UserExtra> updateUserExtra(@Valid @RequestBody UserExtra userExtra) throws URISyntaxException {
        log.debug("REST request to update UserExtra : {}", userExtra);
        if (userExtra.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserExtra result = userExtraService.save(userExtra);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userExtra.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /user-extras} : get all the userExtras.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userExtras in body.
     */
    @GetMapping("/user-extras")
    public ResponseEntity<List<UserExtra>> getAllUserExtras(UserExtraCriteria criteria, Pageable pageable) {
        log.debug("REST request to get UserExtras by criteria: {}", criteria);
        Page<UserExtra> page = userExtraQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-extras/count} : count all the userExtras.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/user-extras/count")
    public ResponseEntity<Long> countUserExtras(UserExtraCriteria criteria) {
        log.debug("REST request to count UserExtras by criteria: {}", criteria);
        return ResponseEntity.ok().body(userExtraQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /user-extras/:id} : get the "id" userExtra.
     *
     * @param id the id of the userExtra to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userExtra, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-extras/{id}")
    public ResponseEntity<UserExtra> getUserExtra(@PathVariable Long id) {
        log.debug("REST request to get UserExtra : {}", id);
        Optional<UserExtra> userExtra = userExtraService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userExtra);
    }

    @GetMapping("/user-extras/getByEmployeeIdAndUserNotNull/{id}")
    public ResponseEntity<UserExtra> getByEmployeeIdAndUserNotNull(@PathVariable Long id) {
        log.debug("REST request to get use of UserExtra by employee : {}", id);
        Optional<UserExtra> userExtra = userExtraService.getByEmployeeIdAndUserNotNull(id);
        return ResponseUtil.wrapOrNotFound(userExtra);
    }

    /**
     * {@code DELETE  /user-extras/:id} : delete the "id" userExtra.
     *
     * @param id the id of the userExtra to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-extras/{id}")
    public ResponseEntity<Void> deleteUserExtra(@PathVariable Long id) {
        log.debug("REST request to delete UserExtra : {}", id);
        userExtraService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    /**
     * {@code GET  /user-extras/by-employee:id} : get the "id" userExtra.
     *
     * @param id the id of the Employee to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userExtra, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-extras/employee-account/{id}")
    public UserDTO getUserExtraByEmployee(@PathVariable Long id) {
        log.debug("REST request to get use of UserExtra by employee : {}", id);
        Optional<User> optUser = userExtraService.findUserByEmployeeId(id);
        if(optUser != null && optUser.isPresent()){
            return optUser.map(UserDTO::new)
                .orElseThrow(() -> new AccountResourceException("User could not be found"));
        }
        return null;
    }


    @GetMapping("/user-extras/employeId-not-in/{empIds}")
    public ResponseEntity<List<UserExtra>> getByIdsNotIn(@PathVariable List<Long> empIds,
         @RequestParam(name="page", defaultValue="0") int page, @RequestParam(name="size", defaultValue="20") int size){
        Page<UserExtra> result = userExtraService.finByEmployeeIdsNotIn(empIds,page,size);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), result);
        return ResponseEntity.ok().headers(headers).body(result.getContent());
    }

    /**
     * {@code GET  /user-extras} : get all the userExtras.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userExtras in body.
     */
    @GetMapping("/user-extras/search")
    public ResponseEntity<List<UserExtra>> search(
        @RequestParam(name="term", defaultValue = "") String term, 
        @RequestParam(name="page", defaultValue = "0") int page, 
        @RequestParam(name="size", defaultValue = "20") int size) {
        log.debug("REST request to get UserExtras by term: {}", term);
        Page<UserExtra> result = userExtraService.searchByFirstOrLastName(term, PageRequest.of(page, size));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), result);
        return ResponseEntity.ok().headers(headers).body(result.getContent());
    }

    @GetMapping("/user-extras/by-dept/{groupId}")
    public ResponseEntity<List<UserExtra>> getByDeparementId(@PathVariable Long groupId){
        List<UserExtra> result = userExtraService.getByDeparementId(groupId);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/user-extras/id-not-in")
    public ResponseEntity<List<UserExtra>> getByIdNotIn(
        @RequestParam("ids") List<Long> ids, Pageable pageable) {
        Page<UserExtra> result = userExtraService.findByIdNotIn(ids, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), result);
        return ResponseEntity.ok().headers(headers).body(result.getContent());
    }

    @GetMapping("/user-extras/by-user-status")
    public ResponseEntity<List<UserExtra>> getByUserActive(
        @RequestParam("status") Boolean status,  Pageable pageable) {
        Page<UserExtra> result = userExtraService.findByUserStatus(status, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), result);
        return ResponseEntity.ok().headers(headers).body(result.getContent());
    }
    
    @GetMapping("/user-extras/getByStatusAndDepartement")
    public ResponseEntity<List<UserExtra>> findUserByStatusAndDepartement(
        @RequestParam(name="departmentId", required = false) Long departmentId, 
        @RequestParam(name="status", defaultValue = "true") Boolean status, Pageable pageable) {
        Page<UserExtra> result = userExtraService.findUserByStatusAndDepartement(status,departmentId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), result);
        return ResponseEntity.ok().headers(headers).body(result.getContent());
    }

    @GetMapping("/user-extras/getByUserStatusAndIdNotIn")
    public ResponseEntity<List<UserExtra>> getByUserStatusAndIdNotIn(
        @RequestParam("status") Boolean status,
        @RequestParam("ids") List<Long> ids,  
        @RequestParam(name="page", defaultValue = "0") int page, 
        @RequestParam(name="size", defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserExtra> result = userExtraService.getByUserStatusAndIdNotIn(status, ids,pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), result);
        return ResponseEntity.ok().headers(headers).body(result.getContent());
    }
    
    
    private static class AccountResourceException extends RuntimeException {
        private AccountResourceException(String message) {
            super(message);
        }
    }

    @GetMapping("/user-extras/getByIdIn/")
    public ResponseEntity<List<UserExtra>> getByDeparementId(@RequestParam("ids") List<Long> ids){
        List<UserExtra> result = userExtraService.findByIdIn(ids);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/user-extras/getOrgUsersByManager/{managerId}")
    public ResponseEntity<List<UserExtra>> getOrgPeopleByManager(@PathVariable("managerId") Long managerId, Pageable pageable){
        Page<UserExtra> result = userExtraService.getOrgChildren(managerId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), result);
        return ResponseEntity.ok().headers(headers).body(result.getContent());
    }

    @GetMapping("/user-extras/getUserIdsByDept/{deptId}")
    public ResponseEntity<List<Long>> getUserIdsByDept(@PathVariable Long deptId){
        List<Long> result = userExtraService.getUserIdByDeptId(deptId);
        return ResponseEntity.ok().body(result);
    }
}
