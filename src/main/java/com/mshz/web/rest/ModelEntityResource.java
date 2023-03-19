package com.mshz.web.rest;

import com.mshz.domain.ModelEntity;
import com.mshz.service.ModelEntityService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.ModelEntityCriteria;
import com.mshz.service.ModelEntityQueryService;

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
 * REST controller for managing {@link com.mshz.domain.ModelEntity}.
 */
@RestController
@RequestMapping("/api")
public class ModelEntityResource {

    private final Logger log = LoggerFactory.getLogger(ModelEntityResource.class);

    private static final String ENTITY_NAME = "modelEntity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ModelEntityService modelEntityService;

    private final ModelEntityQueryService modelEntityQueryService;

    public ModelEntityResource(ModelEntityService modelEntityService, ModelEntityQueryService modelEntityQueryService) {
        this.modelEntityService = modelEntityService;
        this.modelEntityQueryService = modelEntityQueryService;
    }

    /**
     * {@code POST  /model-entities} : Create a new modelEntity.
     *
     * @param modelEntity the modelEntity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new modelEntity, or with status {@code 400 (Bad Request)} if the modelEntity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/model-entities")
    public ResponseEntity<ModelEntity> createModelEntity(@Valid @RequestBody ModelEntity modelEntity) throws URISyntaxException {
        log.debug("REST request to save ModelEntity : {}", modelEntity);
        if (modelEntity.getId() != null) {
            throw new BadRequestAlertException("A new modelEntity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ModelEntity result = modelEntityService.save(modelEntity);
        return ResponseEntity.created(new URI("/api/model-entities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /model-entities} : Updates an existing modelEntity.
     *
     * @param modelEntity the modelEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated modelEntity,
     * or with status {@code 400 (Bad Request)} if the modelEntity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the modelEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/model-entities")
    public ResponseEntity<ModelEntity> updateModelEntity(@Valid @RequestBody ModelEntity modelEntity) throws URISyntaxException {
        log.debug("REST request to update ModelEntity : {}", modelEntity);
        if (modelEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ModelEntity result = modelEntityService.save(modelEntity);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, modelEntity.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /model-entities} : get all the modelEntities.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of modelEntities in body.
     */
    @GetMapping("/model-entities")
    public ResponseEntity<List<ModelEntity>> getAllModelEntities(ModelEntityCriteria criteria, Pageable pageable) {
        log.debug("REST request to get ModelEntities by criteria: {}", criteria);
        Page<ModelEntity> page = modelEntityQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /model-entities/count} : count all the modelEntities.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/model-entities/count")
    public ResponseEntity<Long> countModelEntities(ModelEntityCriteria criteria) {
        log.debug("REST request to count ModelEntities by criteria: {}", criteria);
        return ResponseEntity.ok().body(modelEntityQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /model-entities/:id} : get the "id" modelEntity.
     *
     * @param id the id of the modelEntity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the modelEntity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/model-entities/{id}")
    public ResponseEntity<ModelEntity> getModelEntity(@PathVariable Long id) {
        log.debug("REST request to get ModelEntity : {}", id);
        Optional<ModelEntity> modelEntity = modelEntityService.findOne(id);
        return ResponseUtil.wrapOrNotFound(modelEntity);
    }

    /**
     * {@code DELETE  /model-entities/:id} : delete the "id" modelEntity.
     *
     * @param id the id of the modelEntity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/model-entities/{id}")
    public ResponseEntity<Void> deleteModelEntity(@PathVariable Long id) {
        log.debug("REST request to delete ModelEntity : {}", id);
        modelEntityService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
