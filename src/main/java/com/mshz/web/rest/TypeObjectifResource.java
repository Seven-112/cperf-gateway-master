package com.mshz.web.rest;

import com.mshz.domain.TypeObjectif;
import com.mshz.service.TypeObjectifService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.TypeObjectifCriteria;
import com.mshz.service.TypeObjectifQueryService;

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
 * REST controller for managing {@link com.mshz.domain.TypeObjectif}.
 */
@RestController
@RequestMapping("/api")
public class TypeObjectifResource {

    private final Logger log = LoggerFactory.getLogger(TypeObjectifResource.class);

    private static final String ENTITY_NAME = "typeObjectif";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeObjectifService typeObjectifService;

    private final TypeObjectifQueryService typeObjectifQueryService;

    public TypeObjectifResource(TypeObjectifService typeObjectifService, TypeObjectifQueryService typeObjectifQueryService) {
        this.typeObjectifService = typeObjectifService;
        this.typeObjectifQueryService = typeObjectifQueryService;
    }

    /**
     * {@code POST  /type-objectifs} : Create a new typeObjectif.
     *
     * @param typeObjectif the typeObjectif to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeObjectif, or with status {@code 400 (Bad Request)} if the typeObjectif has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-objectifs")
    @PreAuthorize("@customPermissionEvalutor.hasPermission('Settings','CREATE')")
    public ResponseEntity<TypeObjectif> createTypeObjectif(@Valid @RequestBody TypeObjectif typeObjectif) throws URISyntaxException {
        log.debug("REST request to save TypeObjectif : {}", typeObjectif);
        if (typeObjectif.getId() != null) {
            throw new BadRequestAlertException("A new typeObjectif cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeObjectif result = typeObjectifService.save(typeObjectif);
        return ResponseEntity.created(new URI("/api/type-objectifs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-objectifs} : Updates an existing typeObjectif.
     *
     * @param typeObjectif the typeObjectif to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeObjectif,
     * or with status {@code 400 (Bad Request)} if the typeObjectif is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeObjectif couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-objectifs")
    @PreAuthorize("@customPermissionEvalutor.hasPermission('Settings','UPDATE')")
    public ResponseEntity<TypeObjectif> updateTypeObjectif(@Valid @RequestBody TypeObjectif typeObjectif) throws URISyntaxException {
        log.debug("REST request to update TypeObjectif : {}", typeObjectif);
        if (typeObjectif.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TypeObjectif result = typeObjectifService.save(typeObjectif);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeObjectif.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /type-objectifs} : get all the typeObjectifs.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeObjectifs in body.
     */
    @GetMapping("/type-objectifs")
    public ResponseEntity<List<TypeObjectif>> getAllTypeObjectifs(TypeObjectifCriteria criteria, Pageable pageable) {
        log.debug("REST request to get TypeObjectifs by criteria: {}", criteria);
        Page<TypeObjectif> page = typeObjectifQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /type-objectifs/count} : count all the typeObjectifs.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/type-objectifs/count")
    public ResponseEntity<Long> countTypeObjectifs(TypeObjectifCriteria criteria) {
        log.debug("REST request to count TypeObjectifs by criteria: {}", criteria);
        return ResponseEntity.ok().body(typeObjectifQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /type-objectifs/:id} : get the "id" typeObjectif.
     *
     * @param id the id of the typeObjectif to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeObjectif, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-objectifs/{id}")
    public ResponseEntity<TypeObjectif> getTypeObjectif(@PathVariable Long id) {
        log.debug("REST request to get TypeObjectif : {}", id);
        Optional<TypeObjectif> typeObjectif = typeObjectifService.findOne(id);
        return ResponseUtil.wrapOrNotFound(typeObjectif);
    }

    /**
     * {@code DELETE  /type-objectifs/:id} : delete the "id" typeObjectif.
     *
     * @param id the id of the typeObjectif to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-objectifs/{id}")
    @PreAuthorize("@customPermissionEvalutor.hasPermission('Settings','DELETE')")
    public ResponseEntity<Void> deleteTypeObjectif(@PathVariable Long id) {
        log.debug("REST request to delete TypeObjectif : {}", id);
        typeObjectifService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
