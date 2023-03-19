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

import com.mshz.domain.Objectif;
import com.mshz.domain.*; // for static metamodels
import com.mshz.repository.ObjectifRepository;
import com.mshz.service.dto.ObjectifCriteria;

/**
 * Service for executing complex queries for {@link Objectif} entities in the database.
 * The main input is a {@link ObjectifCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Objectif} or a {@link Page} of {@link Objectif} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ObjectifQueryService extends QueryService<Objectif> {

    private final Logger log = LoggerFactory.getLogger(ObjectifQueryService.class);

    private final ObjectifRepository objectifRepository;

    public ObjectifQueryService(ObjectifRepository objectifRepository) {
        this.objectifRepository = objectifRepository;
    }

    /**
     * Return a {@link List} of {@link Objectif} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Objectif> findByCriteria(ObjectifCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Objectif> specification = createSpecification(criteria);
        return objectifRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Objectif} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Objectif> findByCriteria(ObjectifCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Objectif> specification = createSpecification(criteria);
        return objectifRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ObjectifCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Objectif> specification = createSpecification(criteria);
        return objectifRepository.count(specification);
    }

    /**
     * Function to convert {@link ObjectifCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Objectif> createSpecification(ObjectifCriteria criteria) {
        Specification<Objectif> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Objectif_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), Objectif_.name));
            }
            if (criteria.getDelay() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getDelay(), Objectif_.delay));
            }
            if (criteria.getCreatedAt() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedAt(), Objectif_.createdAt));
            }
            if (criteria.getCategorie() != null) {
                specification = specification.and(buildSpecification(criteria.getCategorie(), Objectif_.categorie));
            }
            if (criteria.getAveragePercentage() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getAveragePercentage(), Objectif_.averagePercentage));
            }
            if (criteria.getPonderation() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getPonderation(), Objectif_.ponderation));
            }
            if (criteria.getRealized() != null) {
                specification = specification.and(buildSpecification(criteria.getRealized(), Objectif_.realized));
            }
            if (criteria.getTypeObjectifId() != null) {
                specification = specification.and(buildSpecification(criteria.getTypeObjectifId(),
                    root -> root.join(Objectif_.typeObjectif, JoinType.LEFT).get(TypeObjectif_.id)));
            }
            if (criteria.getFonctionId() != null) {
                specification = specification.and(buildSpecification(criteria.getFonctionId(),
                    root -> root.join(Objectif_.fonction, JoinType.LEFT).get(Fonction_.id)));
            }
            if (criteria.getDepartmentId() != null) {
                specification = specification.and(buildSpecification(criteria.getDepartmentId(),
                    root -> root.join(Objectif_.department, JoinType.LEFT).get(Department_.id)));
            }
            if (criteria.getEmployeeId() != null) {
                specification = specification.and(buildSpecification(criteria.getEmployeeId(),
                    root -> root.join(Objectif_.employee, JoinType.LEFT).get(Employee_.id)));
            }
            if (criteria.getParentId() != null) {
                specification = specification.and(buildSpecification(criteria.getParentId(),
                    root -> root.join(Objectif_.parent, JoinType.LEFT).get(Objectif_.id)));
            }
        }
        return specification;
    }
}
