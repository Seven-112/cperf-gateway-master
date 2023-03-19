package com.mshz.service;

import com.mshz.domain.ModelEntity;
import com.mshz.repository.ModelEntityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link ModelEntity}.
 */
@Service
@Transactional
public class ModelEntityService {

    private final Logger log = LoggerFactory.getLogger(ModelEntityService.class);

    private final ModelEntityRepository modelEntityRepository;

    public ModelEntityService(ModelEntityRepository modelEntityRepository) {
        this.modelEntityRepository = modelEntityRepository;
    }

    /**
     * Save a modelEntity.
     *
     * @param modelEntity the entity to save.
     * @return the persisted entity.
     */
    public ModelEntity save(ModelEntity modelEntity) {
        log.debug("Request to save ModelEntity : {}", modelEntity);
        return modelEntityRepository.save(modelEntity);
    }

    /**
     * Get all the modelEntities.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ModelEntity> findAll(Pageable pageable) {
        log.debug("Request to get all ModelEntities");
        return modelEntityRepository.findAll(pageable);
    }


    /**
     * Get one modelEntity by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ModelEntity> findOne(Long id) {
        log.debug("Request to get ModelEntity : {}", id);
        return modelEntityRepository.findById(id);
    }

    /**
     * Delete the modelEntity by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ModelEntity : {}", id);
        modelEntityRepository.deleteById(id);
    }
}
