package com.mshz.web.rest;

import com.mshz.domain.DynamicField;
import com.mshz.service.DynamicFieldService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.DynamicFieldCriteria;
import com.mshz.service.DynamicFieldQueryService;

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
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mshz.domain.DynamicField}.
 */
@RestController
@RequestMapping("/api")
public class DynamicFieldResource {

    private final Logger log = LoggerFactory.getLogger(DynamicFieldResource.class);

    private static final String ENTITY_NAME = "dynamicField";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DynamicFieldService dynamicFieldService;

    private final DynamicFieldQueryService dynamicFieldQueryService;

    public DynamicFieldResource(DynamicFieldService dynamicFieldService, DynamicFieldQueryService dynamicFieldQueryService) {
        this.dynamicFieldService = dynamicFieldService;
        this.dynamicFieldQueryService = dynamicFieldQueryService;
    }

    /**
     * {@code POST  /dynamic-fields} : Create a new dynamicField.
     *
     * @param dynamicField the dynamicField to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dynamicField, or with status {@code 400 (Bad Request)} if the dynamicField has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/dynamic-fields")
    public ResponseEntity<DynamicField> createDynamicField(@Valid @RequestBody DynamicField dynamicField) throws URISyntaxException {
        log.debug("REST request to save DynamicField : {}", dynamicField);
        if (dynamicField.getId() != null) {
            throw new BadRequestAlertException("A new dynamicField cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DynamicField result = dynamicFieldService.save(dynamicField);
        return ResponseEntity.created(new URI("/api/dynamic-fields/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /dynamic-fields} : Updates an existing dynamicField.
     *
     * @param dynamicField the dynamicField to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dynamicField,
     * or with status {@code 400 (Bad Request)} if the dynamicField is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dynamicField couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/dynamic-fields")
    public ResponseEntity<DynamicField> updateDynamicField(@Valid @RequestBody DynamicField dynamicField) throws URISyntaxException {
        log.debug("REST request to update DynamicField : {}", dynamicField);
        if (dynamicField.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DynamicField result = dynamicFieldService.save(dynamicField);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dynamicField.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /dynamic-fields} : get all the dynamicFields.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dynamicFields in body.
     */
    @GetMapping("/dynamic-fields")
    public ResponseEntity<List<DynamicField>> getAllDynamicFields(DynamicFieldCriteria criteria, Pageable pageable) {
        log.debug("REST request to get DynamicFields by criteria: {}", criteria);
        Page<DynamicField> page = dynamicFieldQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /dynamic-fields/count} : count all the dynamicFields.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/dynamic-fields/count")
    public ResponseEntity<Long> countDynamicFields(DynamicFieldCriteria criteria) {
        log.debug("REST request to count DynamicFields by criteria: {}", criteria);
        return ResponseEntity.ok().body(dynamicFieldQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /dynamic-fields/:id} : get the "id" dynamicField.
     *
     * @param id the id of the dynamicField to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dynamicField, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/dynamic-fields/{id}")
    public ResponseEntity<DynamicField> getDynamicField(@PathVariable Long id) {
        log.debug("REST request to get DynamicField : {}", id);
        Optional<DynamicField> dynamicField = dynamicFieldService.findOne(id);
        return ResponseUtil.wrapOrNotFound(dynamicField);
    }

    /**
     * {@code DELETE  /dynamic-fields/:id} : delete the "id" dynamicField.
     *
     * @param id the id of the dynamicField to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/dynamic-fields/{id}")
    public ResponseEntity<Void> deleteDynamicField(@PathVariable Long id) {
        log.debug("REST request to delete DynamicField : {}", id);
        dynamicFieldService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
