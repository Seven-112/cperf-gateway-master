package com.mshz.web.rest;

import com.mshz.domain.Objectif;
import com.mshz.service.ObjectifService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.ObjectifCriteria;
import com.mshz.service.ObjectifQueryService;

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
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mshz.domain.Objectif}.
 */
@RestController
@RequestMapping("/api")
public class ObjectifResource {

    private final Logger log = LoggerFactory.getLogger(ObjectifResource.class);

    private static final String ENTITY_NAME = "objectif";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ObjectifService objectifService;

    private final ObjectifQueryService objectifQueryService;

    public ObjectifResource(ObjectifService objectifService, ObjectifQueryService objectifQueryService) {
        this.objectifService = objectifService;
        this.objectifQueryService = objectifQueryService;
    }

    /**
     * {@code POST  /objectifs} : Create a new objectif.
     *
     * @param objectif the objectif to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new objectif, or with status {@code 400 (Bad Request)} if the objectif has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/objectifs")
    @PreAuthorize("@customPermissionEvalutor.hasPermission(\""+ENTITY_NAME+"\",'CREATE')")
    public ResponseEntity<Objectif> createObjectif(@Valid @RequestBody Objectif objectif) throws URISyntaxException {
        log.debug("REST request to save Objectif : {}", objectif);
        if (objectif.getId() != null) {
            throw new BadRequestAlertException("A new objectif cannot already have an ID", ENTITY_NAME, "idexists");
        }
        objectif.setRealized(false);
        Objectif result = objectifService.save(objectif);
        return ResponseEntity.created(new URI("/api/objectifs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /objectifs} : Updates an existing objectif.
     *
     * @param objectif the objectif to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated objectif,
     * or with status {@code 400 (Bad Request)} if the objectif is not valid,
     * or with status {@code 500 (Internal Server Error)} if the objectif couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("@customPermissionEvalutor.hasPermission(\""+ENTITY_NAME+"\",'UPDATE')")
    @PutMapping("/objectifs")
    public ResponseEntity<Objectif> updateObjectif(@Valid @RequestBody Objectif objectif) throws URISyntaxException {
        log.debug("REST request to update Objectif : {}", objectif);
        if (objectif.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Objectif result = objectifService.save(objectif);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, objectif.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /objectifs} : get all the objectifs.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of objectifs in body.
     */
    @GetMapping("/objectifs")
    public ResponseEntity<List<Objectif>> getAllObjectifs(ObjectifCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Objectifs by criteria: {}", criteria);
        Page<Objectif> page = objectifQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /objectifs/count} : count all the objectifs.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/objectifs/count")
    public ResponseEntity<Long> countObjectifs(ObjectifCriteria criteria) {
        log.debug("REST request to count Objectifs by criteria: {}", criteria);
        return ResponseEntity.ok().body(objectifQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /objectifs/:id} : get the "id" objectif.
     *
     * @param id the id of the objectif to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the objectif, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/objectifs/{id}")
    public ResponseEntity<Objectif> getObjectif(@PathVariable Long id) {
        log.debug("REST request to get Objectif : {}", id);
        Optional<Objectif> objectif = objectifService.findOne(id);
        return ResponseUtil.wrapOrNotFound(objectif);
    }

    /**
     * {@code DELETE  /objectifs/:id} : delete the "id" objectif.
     *
     * @param id the id of the objectif to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/objectifs/{id}")
    @PreAuthorize("@customPermissionEvalutor.hasPermission(\""+ENTITY_NAME+"\",'DELETE')")
    public ResponseEntity<Void> deleteObjectif(@PathVariable Long id) {
        log.debug("REST request to delete Objectif : {}", id);
        objectifService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    @GetMapping("/objectifs/for-employee-between")
    public ResponseEntity<List<Objectif>> getEmployeeObjectifBetween(
        @RequestParam("employeeId") Long employeeId,  @RequestParam("departmentId") Long departmentId,
        @RequestParam("fonctionId") Long fonctionId,  @RequestParam("startDate") Instant startDate,  
        @RequestParam("endDate") Instant endDate){
        log.debug("REST request to get Objectifs by employee id : {}", employeeId);
        List<Objectif> result = objectifService.getEmployeeObjectifBetween(employeeId, departmentId, fonctionId, startDate, endDate);
        return ResponseEntity.ok().body(result);
    }
}
