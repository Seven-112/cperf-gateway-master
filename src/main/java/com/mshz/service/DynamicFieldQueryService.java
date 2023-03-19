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

import com.mshz.domain.DynamicField;
import com.mshz.domain.*; // for static metamodels
import com.mshz.repository.DynamicFieldRepository;
import com.mshz.service.dto.DynamicFieldCriteria;

/**
 * Service for executing complex queries for {@link DynamicField} entities in the database.
 * The main input is a {@link DynamicFieldCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link DynamicField} or a {@link Page} of {@link DynamicField} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class DynamicFieldQueryService extends QueryService<DynamicField> {

    private final Logger log = LoggerFactory.getLogger(DynamicFieldQueryService.class);

    private final DynamicFieldRepository dynamicFieldRepository;

    public DynamicFieldQueryService(DynamicFieldRepository dynamicFieldRepository) {
        this.dynamicFieldRepository = dynamicFieldRepository;
    }

    /**
     * Return a {@link List} of {@link DynamicField} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<DynamicField> findByCriteria(DynamicFieldCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<DynamicField> specification = createSpecification(criteria);
        return dynamicFieldRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link DynamicField} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<DynamicField> findByCriteria(DynamicFieldCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<DynamicField> specification = createSpecification(criteria);
        return dynamicFieldRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(DynamicFieldCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<DynamicField> specification = createSpecification(criteria);
        return dynamicFieldRepository.count(specification);
    }

    /**
     * Function to convert {@link DynamicFieldCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<DynamicField> createSpecification(DynamicFieldCriteria criteria) {
        Specification<DynamicField> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), DynamicField_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), DynamicField_.name));
            }
            if (criteria.getType() != null) {
                specification = specification.and(buildSpecification(criteria.getType(), DynamicField_.type));
            }
            if (criteria.getRequired() != null) {
                specification = specification.and(buildSpecification(criteria.getRequired(), DynamicField_.required));
            }
            if (criteria.getDocId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getDocId(), DynamicField_.docId));
            }
            if (criteria.getEntityId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getEntityId(), DynamicField_.entityId));
            }
            if (criteria.getTag() != null) {
                specification = specification.and(buildSpecification(criteria.getTag(), DynamicField_.tag));
            }
        }
        return specification;
    }
}
