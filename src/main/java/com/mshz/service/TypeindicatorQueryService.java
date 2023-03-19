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

import com.mshz.domain.Typeindicator;
import com.mshz.domain.*; // for static metamodels
import com.mshz.repository.TypeindicatorRepository;
import com.mshz.service.dto.TypeindicatorCriteria;

/**
 * Service for executing complex queries for {@link Typeindicator} entities in the database.
 * The main input is a {@link TypeindicatorCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Typeindicator} or a {@link Page} of {@link Typeindicator} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class TypeindicatorQueryService extends QueryService<Typeindicator> {

    private final Logger log = LoggerFactory.getLogger(TypeindicatorQueryService.class);

    private final TypeindicatorRepository typeindicatorRepository;

    public TypeindicatorQueryService(TypeindicatorRepository typeindicatorRepository) {
        this.typeindicatorRepository = typeindicatorRepository;
    }

    /**
     * Return a {@link List} of {@link Typeindicator} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Typeindicator> findByCriteria(TypeindicatorCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Typeindicator> specification = createSpecification(criteria);
        return typeindicatorRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Typeindicator} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Typeindicator> findByCriteria(TypeindicatorCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Typeindicator> specification = createSpecification(criteria);
        return typeindicatorRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(TypeindicatorCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Typeindicator> specification = createSpecification(criteria);
        return typeindicatorRepository.count(specification);
    }

    /**
     * Function to convert {@link TypeindicatorCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Typeindicator> createSpecification(TypeindicatorCriteria criteria) {
        Specification<Typeindicator> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Typeindicator_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), Typeindicator_.name));
            }
            if (criteria.getMeasurable() != null) {
                specification = specification.and(buildSpecification(criteria.getMeasurable(), Typeindicator_.measurable));
            }
            if (criteria.getValid() != null) {
                specification = specification.and(buildSpecification(criteria.getValid(), Typeindicator_.valid));
            }
        }
        return specification;
    }
}
