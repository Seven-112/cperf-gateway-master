package com.mshz.service;

import com.mshz.domain.TypeObjectif;
import com.mshz.repository.TypeObjectifRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link TypeObjectif}.
 */
@Service
@Transactional
public class TypeObjectifService {

    private final Logger log = LoggerFactory.getLogger(TypeObjectifService.class);

    private final TypeObjectifRepository typeObjectifRepository;

    public TypeObjectifService(TypeObjectifRepository typeObjectifRepository) {
        this.typeObjectifRepository = typeObjectifRepository;
    }

    /**
     * Save a typeObjectif.
     *
     * @param typeObjectif the entity to save.
     * @return the persisted entity.
     */
    public TypeObjectif save(TypeObjectif typeObjectif) {
        log.debug("Request to save TypeObjectif : {}", typeObjectif);
        return typeObjectifRepository.save(typeObjectif);
    }

    /**
     * Get all the typeObjectifs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<TypeObjectif> findAll(Pageable pageable) {
        log.debug("Request to get all TypeObjectifs");
        return typeObjectifRepository.findAll(pageable);
    }


    /**
     * Get one typeObjectif by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TypeObjectif> findOne(Long id) {
        log.debug("Request to get TypeObjectif : {}", id);
        return typeObjectifRepository.findById(id);
    }

    /**
     * Delete the typeObjectif by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete TypeObjectif : {}", id);
        typeObjectifRepository.deleteById(id);
    }
}
