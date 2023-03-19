package com.mshz.service;

import com.mshz.domain.DynamicField;
import com.mshz.repository.DynamicFieldRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link DynamicField}.
 */
@Service
@Transactional
public class DynamicFieldService {

    private final Logger log = LoggerFactory.getLogger(DynamicFieldService.class);

    private final DynamicFieldRepository dynamicFieldRepository;

    public DynamicFieldService(DynamicFieldRepository dynamicFieldRepository) {
        this.dynamicFieldRepository = dynamicFieldRepository;
    }

    /**
     * Save a dynamicField.
     *
     * @param dynamicField the entity to save.
     * @return the persisted entity.
     */
    public DynamicField save(DynamicField dynamicField) {
        log.debug("Request to save DynamicField : {}", dynamicField);
        return dynamicFieldRepository.save(dynamicField);
    }

    /**
     * Get all the dynamicFields.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<DynamicField> findAll(Pageable pageable) {
        log.debug("Request to get all DynamicFields");
        return dynamicFieldRepository.findAll(pageable);
    }


    /**
     * Get one dynamicField by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<DynamicField> findOne(Long id) {
        log.debug("Request to get DynamicField : {}", id);
        return dynamicFieldRepository.findById(id);
    }

    /**
     * Delete the dynamicField by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete DynamicField : {}", id);
        dynamicFieldRepository.deleteById(id);
    }
}
