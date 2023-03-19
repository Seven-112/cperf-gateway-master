package com.mshz.service;

import java.util.List;

import javax.persistence.criteria.JoinType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.jhipster.service.QueryService;

import com.mshz.domain.ModelEntity;
import com.mshz.domain.*; // for static metamodels
import com.mshz.repository.ModelEntityRepository;
import com.mshz.service.dto.ModelEntityCriteria;

/**
 * Service for executing complex queries for {@link ModelEntity} entities in the database.
 * The main input is a {@link ModelEntityCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link ModelEntity} or a {@link Page} of {@link ModelEntity} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ModelEntityQueryService extends QueryService<ModelEntity> {

    private final Logger log = LoggerFactory.getLogger(ModelEntityQueryService.class);

    private final ModelEntityRepository modelEntityRepository;

    public ModelEntityQueryService(ModelEntityRepository modelEntityRepository) {
        this.modelEntityRepository = modelEntityRepository;
    }

    /**
     * Return a {@link List} of {@link ModelEntity} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<ModelEntity> findByCriteria(ModelEntityCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<ModelEntity> specification = createSpecification(criteria);
        return modelEntityRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link ModelEntity} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ModelEntity> findByCriteria(ModelEntityCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<ModelEntity> specification = createSpecification(criteria);
        return modelEntityRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ModelEntityCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<ModelEntity> specification = createSpecification(criteria);
        return modelEntityRepository.count(specification);
    }

    /**
     * Function to convert {@link ModelEntityCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<ModelEntity> createSpecification(ModelEntityCriteria criteria) {
        Specification<ModelEntity> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), ModelEntity_.id));
            }
            if (criteria.getEntity() != null) {
                specification = specification.and(buildStringSpecification(criteria.getEntity(), ModelEntity_.entity));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), ModelEntity_.name));
            }
        }
        return specification;
    }
}
