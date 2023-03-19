package com.mshz.service;

import com.mshz.domain.Employee;
import com.mshz.domain.Objectif;
import com.mshz.repository.ObjectifRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Objectif}.
 */
@Service
@Transactional
public class ObjectifService {

    private final Logger log = LoggerFactory.getLogger(ObjectifService.class);

    private final ObjectifRepository objectifRepository;

    public ObjectifService(ObjectifRepository objectifRepository) {
        this.objectifRepository = objectifRepository;
    }

    /**
     * Save a objectif.
     *
     * @param objectif the entity to save.
     * @return the persisted entity.
     */
    public Objectif save(Objectif objectif) {
        log.debug("Request to save Objectif : {}", objectif);
        return objectifRepository.save(objectif);
    }

    /**
     * Get all the objectifs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Objectif> findAll(Pageable pageable) {
        log.debug("Request to get all Objectifs");
        return objectifRepository.findAll(pageable);
    }


    /**
     * Get one objectif by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Objectif> findOne(Long id) {
        log.debug("Request to get Objectif : {}", id);
        return objectifRepository.findById(id);
    }

    /**
     * Delete the objectif by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Objectif : {}", id);
        objectifRepository.deleteById(id);
    }
    
    /**
     * 
     * @param employeeId
     * @param departmentId
     * @param fonctionId
     * @param startDate
     * @param endDate
     * @return List of indicators
     */
    public List<Objectif> getEmployeeObjectifBetween(Long employeeId, Long departmentId, Long fonctionId, Instant startDate, Instant endDate){
        return objectifRepository.getEmployeeObjectifBetween(employeeId,departmentId, fonctionId, startDate, endDate);
    }
}
