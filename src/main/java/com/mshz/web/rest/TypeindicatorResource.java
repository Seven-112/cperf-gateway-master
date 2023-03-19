package com.mshz.web.rest;

import com.mshz.domain.Typeindicator;
import com.mshz.service.TypeindicatorService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.TypeindicatorCriteria;
import com.mshz.service.TypeindicatorQueryService;

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
 * REST controller for managing {@link com.mshz.domain.Typeindicator}.
 */
@RestController
@RequestMapping("/api")
public class TypeindicatorResource {

    private final Logger log = LoggerFactory.getLogger(TypeindicatorResource.class);

    private static final String ENTITY_NAME = "typeindicator";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeindicatorService typeindicatorService;

    private final TypeindicatorQueryService typeindicatorQueryService;

    public TypeindicatorResource(TypeindicatorService typeindicatorService, TypeindicatorQueryService typeindicatorQueryService) {
        this.typeindicatorService = typeindicatorService;
        this.typeindicatorQueryService = typeindicatorQueryService;
    }

    /**
     * {@code POST  /typeindicators} : Create a new typeindicator.
     *
     * @param typeindicator the typeindicator to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeindicator, or with status {@code 400 (Bad Request)} if the typeindicator has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/typeindicators")
    @PreAuthorize("@customPermissionEvalutor.hasPermission('Settings','CREATE')")
    public ResponseEntity<Typeindicator> createTypeindicator(@Valid @RequestBody Typeindicator typeindicator) throws URISyntaxException {
        log.debug("REST request to save Typeindicator : {}", typeindicator);
        if (typeindicator.getId() != null) {
            throw new BadRequestAlertException("A new typeindicator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Typeindicator result = typeindicatorService.save(typeindicator);
        return ResponseEntity.created(new URI("/api/typeindicators/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /typeindicators} : Updates an existing typeindicator.
     *
     * @param typeindicator the typeindicator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeindicator,
     * or with status {@code 400 (Bad Request)} if the typeindicator is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeindicator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/typeindicators")
    @PreAuthorize("@customPermissionEvalutor.hasPermission('Settings','UPDATE')")
    public ResponseEntity<Typeindicator> updateTypeindicator(@Valid @RequestBody Typeindicator typeindicator) throws URISyntaxException {
        log.debug("REST request to update Typeindicator : {}", typeindicator);
        if (typeindicator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Typeindicator result = typeindicatorService.save(typeindicator);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeindicator.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /typeindicators} : get all the typeindicators.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeindicators in body.
     */
    @GetMapping("/typeindicators")
    public ResponseEntity<List<Typeindicator>> getAllTypeindicators(TypeindicatorCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Typeindicators by criteria: {}", criteria);
        Page<Typeindicator> page = typeindicatorQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /typeindicators/count} : count all the typeindicators.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/typeindicators/count")
    public ResponseEntity<Long> countTypeindicators(TypeindicatorCriteria criteria) {
        log.debug("REST request to count Typeindicators by criteria: {}", criteria);
        return ResponseEntity.ok().body(typeindicatorQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /typeindicators/:id} : get the "id" typeindicator.
     *
     * @param id the id of the typeindicator to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeindicator, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/typeindicators/{id}")
    public ResponseEntity<Typeindicator> getTypeindicator(@PathVariable Long id) {
        log.debug("REST request to get Typeindicator : {}", id);
        Optional<Typeindicator> typeindicator = typeindicatorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(typeindicator);
    }

    /**
     * {@code DELETE  /typeindicators/:id} : delete the "id" typeindicator.
     *
     * @param id the id of the typeindicator to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/typeindicators/{id}")
    @PreAuthorize("@customPermissionEvalutor.hasPermission('Settings','DELETE')")
    public ResponseEntity<Void> deleteTypeindicator(@PathVariable Long id) {
        log.debug("REST request to delete Typeindicator : {}", id);
        typeindicatorService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
