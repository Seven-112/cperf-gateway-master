package com.mshz.service;

import com.mshz.domain.Typeindicator;
import com.mshz.repository.TypeindicatorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Typeindicator}.
 */
@Service
@Transactional
public class TypeindicatorService {

    private final Logger log = LoggerFactory.getLogger(TypeindicatorService.class);

    private final TypeindicatorRepository typeindicatorRepository;

    public TypeindicatorService(TypeindicatorRepository typeindicatorRepository) {
        this.typeindicatorRepository = typeindicatorRepository;
    }

    /**
     * Save a typeindicator.
     *
     * @param typeindicator the entity to save.
     * @return the persisted entity.
     */
    public Typeindicator save(Typeindicator typeindicator) {
        log.debug("Request to save Typeindicator : {}", typeindicator);
        return typeindicatorRepository.save(typeindicator);
    }

    /**
     * Get all the typeindicators.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Typeindicator> findAll(Pageable pageable) {
        log.debug("Request to get all Typeindicators");
        return typeindicatorRepository.findAll(pageable);
    }


    /**
     * Get one typeindicator by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Typeindicator> findOne(Long id) {
        log.debug("Request to get Typeindicator : {}", id);
        return typeindicatorRepository.findById(id);
    }

    /**
     * Delete the typeindicator by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Typeindicator : {}", id);
        typeindicatorRepository.deleteById(id);
    }
}
