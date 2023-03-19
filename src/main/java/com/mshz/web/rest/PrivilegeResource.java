package com.mshz.web.rest;

import com.mshz.domain.Privilege;
import com.mshz.security.AuthoritiesConstants;
import com.mshz.service.PrivilegeService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.PrivilegeCriteria;
import com.mshz.service.PrivilegeQueryService;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
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
 * REST controller for managing {@link com.mshz.domain.Privilege}.
 */
@RestController
@RequestMapping("/api")
public class PrivilegeResource {

    private final Logger log = LoggerFactory.getLogger(PrivilegeResource.class);

    private static final String ENTITY_NAME = "privilege";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PrivilegeService privilegeService;

    private final PrivilegeQueryService privilegeQueryService;

    public PrivilegeResource(PrivilegeService privilegeService, PrivilegeQueryService privilegeQueryService) {
        this.privilegeService = privilegeService;
        this.privilegeQueryService = privilegeQueryService;
    }

    /**
     * {@code POST  /privileges} : Create a new privilege.
     *
     * @param privilege the privilege to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new privilege, or with status {@code 400 (Bad Request)} if the privilege has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/privileges")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Privilege> createPrivilege(@Valid @RequestBody Privilege privilege) throws URISyntaxException {
        log.debug("REST request to save Privilege : {}", privilege);
        if (privilege.getId() != null) {
            throw new BadRequestAlertException("A new privilege cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Privilege result = privilegeService.save(privilege);
        return ResponseEntity.created(new URI("/api/privileges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /privileges} : Updates an existing privilege.
     *
     * @param privilege the privilege to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated privilege,
     * or with status {@code 400 (Bad Request)} if the privilege is not valid,
     * or with status {@code 500 (Internal Server Error)} if the privilege couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/privileges")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Privilege> updatePrivilege(@Valid @RequestBody Privilege privilege) throws URISyntaxException {
        log.debug("REST request to update Privilege : {}", privilege);
        if (privilege.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Privilege result = privilegeService.save(privilege);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, privilege.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /privileges} : get all the privileges.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of privileges in body.
     */
    @GetMapping("/privileges")
    public ResponseEntity<List<Privilege>> getAllPrivileges(PrivilegeCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Privileges by criteria: {}", criteria);
        Page<Privilege> page = privilegeQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /privileges/count} : count all the privileges.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/privileges/count")
    public ResponseEntity<Long> countPrivileges(PrivilegeCriteria criteria) {
        log.debug("REST request to count Privileges by criteria: {}", criteria);
        return ResponseEntity.ok().body(privilegeQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /privileges/:id} : get the "id" privilege.
     *
     * @param id the id of the privilege to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the privilege, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/privileges/{id}")
    public ResponseEntity<Privilege> getPrivilege(@PathVariable Long id) {
        log.debug("REST request to get Privilege : {}", id);
        Optional<Privilege> privilege = privilegeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(privilege);
    }

    /**
     * {@code DELETE  /privileges/:id} : delete the "id" privilege.
     *
     * @param id the id of the privilege to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/privileges/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deletePrivilege(@PathVariable Long id) {
        log.debug("REST request to delete Privilege : {}", id);
        privilegeService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
