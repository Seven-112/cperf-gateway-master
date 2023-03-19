package com.mshz.web.rest;

import com.mshz.domain.Indicator;
import com.mshz.service.IndicatorService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.IndicatorCriteria;
import com.mshz.service.IndicatorQueryService;

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
 * REST controller for managing {@link com.mshz.domain.Indicator}.
 */
@RestController
@RequestMapping("/api")
public class IndicatorResource {

    private final Logger log = LoggerFactory.getLogger(IndicatorResource.class);

    private static final String ENTITY_NAME = "indicator";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IndicatorService indicatorService;

    private final IndicatorQueryService indicatorQueryService;

    public IndicatorResource(IndicatorService indicatorService, IndicatorQueryService indicatorQueryService) {
        this.indicatorService = indicatorService;
        this.indicatorQueryService = indicatorQueryService;
    }

    /**
     * {@code POST  /indicators} : Create a new indicator.
     *
     * @param indicator the indicator to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new indicator, or with status {@code 400 (Bad Request)} if the indicator has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/indicators")
    @PreAuthorize("@customPermissionEvalutor.hasPermission(\""+ENTITY_NAME+"\",'CREATE')")
    public ResponseEntity<Indicator> createIndicator(@Valid @RequestBody Indicator indicator) throws URISyntaxException {
        log.debug("REST request to save Indicator : {}", indicator);
        if (indicator.getId() != null) {
            throw new BadRequestAlertException("A new indicator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Indicator result = indicatorService.save(indicator);
        return ResponseEntity.created(new URI("/api/indicators/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /indicators} : Updates an existing indicator.
     *
     * @param indicator the indicator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated indicator,
     * or with status {@code 400 (Bad Request)} if the indicator is not valid,
     * or with status {@code 500 (Internal Server Error)} if the indicator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/indicators")
    public ResponseEntity<Indicator> updateIndicator(@Valid @RequestBody Indicator indicator) throws URISyntaxException {
        log.debug("REST request to update Indicator : {}", indicator);
        if (indicator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Indicator result = indicatorService.save(indicator);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, indicator.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /indicators} : get all the indicators.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of indicators in body.
     */
    @GetMapping("/indicators")
    public ResponseEntity<List<Indicator>> getAllIndicators(IndicatorCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Indicators by criteria: {}", criteria);
        Page<Indicator> page = indicatorQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /indicators/count} : count all the indicators.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/indicators/count")
    public ResponseEntity<Long> countIndicators(IndicatorCriteria criteria) {
        log.debug("REST request to count Indicators by criteria: {}", criteria);
        return ResponseEntity.ok().body(indicatorQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /indicators/:id} : get the "id" indicator.
     *
     * @param id the id of the indicator to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the indicator, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/indicators/{id}")
    public ResponseEntity<Indicator> getIndicator(@PathVariable Long id) {
        log.debug("REST request to get Indicator : {}", id);
        Optional<Indicator> indicator = indicatorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(indicator);
    }

    /**
     * {@code DELETE  /indicators/:id} : delete the "id" indicator.
     *
     * @param id the id of the indicator to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/indicators/{id}")
    @PreAuthorize("@customPermissionEvalutor.hasPermission(\""+ENTITY_NAME+"\",'DELETE')")
    public ResponseEntity<Void> deleteIndicator(@PathVariable Long id) {
        log.debug("REST request to delete Indicator : {}", id);
        indicatorService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    /**
     * 
     * @param employeeId
     * @param departmentId
     * @param fonctionId
     * @param startDate
     * @param endDate
     * @return List of Indicators
     */
    @GetMapping("/indicators/objectif-created-between-for-employee")
    public ResponseEntity<List<Indicator>> getEmployeeIndicatorsBetween(
        @RequestParam("employeeId") Long employeeId,  @RequestParam("departmentId") Long departmentId,
        @RequestParam("fonctionId") Long fonctionId,  @RequestParam("startDate") Instant startDate,  
        @RequestParam("endDate") Instant endDate){
        log.debug("REST request to get Indicators by employee id : {}", employeeId);
        List<Indicator> result = indicatorService.getEmployeesIndicatorsObjectifCreatedBetween(employeeId, departmentId, fonctionId, startDate, endDate);
        return ResponseEntity.ok().body(result);
    }
}
