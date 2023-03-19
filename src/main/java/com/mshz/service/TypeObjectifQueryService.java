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

import com.mshz.domain.TypeObjectif;
import com.mshz.domain.*; // for static metamodels
import com.mshz.repository.TypeObjectifRepository;
import com.mshz.service.dto.TypeObjectifCriteria;

/**
 * Service for executing complex queries for {@link TypeObjectif} entities in the database.
 * The main input is a {@link TypeObjectifCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link TypeObjectif} or a {@link Page} of {@link TypeObjectif} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class TypeObjectifQueryService extends QueryService<TypeObjectif> {

    private final Logger log = LoggerFactory.getLogger(TypeObjectifQueryService.class);

    private final TypeObjectifRepository typeObjectifRepository;

    public TypeObjectifQueryService(TypeObjectifRepository typeObjectifRepository) {
        this.typeObjectifRepository = typeObjectifRepository;
    }

    /**
     * Return a {@link List} of {@link TypeObjectif} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<TypeObjectif> findByCriteria(TypeObjectifCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<TypeObjectif> specification = createSpecification(criteria);
        return typeObjectifRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link TypeObjectif} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<TypeObjectif> findByCriteria(TypeObjectifCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<TypeObjectif> specification = createSpecification(criteria);
        return typeObjectifRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(TypeObjectifCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<TypeObjectif> specification = createSpecification(criteria);
        return typeObjectifRepository.count(specification);
    }

    /**
     * Function to convert {@link TypeObjectifCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<TypeObjectif> createSpecification(TypeObjectifCriteria criteria) {
        Specification<TypeObjectif> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), TypeObjectif_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), TypeObjectif_.name));
            }
            if (criteria.getEvalutationUnity() != null) {
                specification = specification.and(buildSpecification(criteria.getEvalutationUnity(), TypeObjectif_.evalutationUnity));
            }
            if (criteria.getValid() != null) {
                specification = specification.and(buildSpecification(criteria.getValid(), TypeObjectif_.valid));
            }
        }
        return specification;
    }
}
