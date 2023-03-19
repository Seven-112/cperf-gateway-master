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

import com.mshz.domain.Indicator;
import com.mshz.domain.*; // for static metamodels
import com.mshz.repository.IndicatorRepository;
import com.mshz.service.dto.IndicatorCriteria;

/**
 * Service for executing complex queries for {@link Indicator} entities in the database.
 * The main input is a {@link IndicatorCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Indicator} or a {@link Page} of {@link Indicator} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class IndicatorQueryService extends QueryService<Indicator> {

    private final Logger log = LoggerFactory.getLogger(IndicatorQueryService.class);

    private final IndicatorRepository indicatorRepository;

    public IndicatorQueryService(IndicatorRepository indicatorRepository) {
        this.indicatorRepository = indicatorRepository;
    }

    /**
     * Return a {@link List} of {@link Indicator} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Indicator> findByCriteria(IndicatorCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Indicator> specification = createSpecification(criteria);
        return indicatorRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Indicator} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Indicator> findByCriteria(IndicatorCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Indicator> specification = createSpecification(criteria);
        return indicatorRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(IndicatorCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Indicator> specification = createSpecification(criteria);
        return indicatorRepository.count(specification);
    }

    /**
     * Function to convert {@link IndicatorCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Indicator> createSpecification(IndicatorCriteria criteria) {
        Specification<Indicator> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Indicator_.id));
            }
            if (criteria.getExpectedResultNumber() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getExpectedResultNumber(), Indicator_.expectedResultNumber));
            }
            if (criteria.getResultUnity() != null) {
                specification = specification.and(buildStringSpecification(criteria.getResultUnity(), Indicator_.resultUnity));
            }
            if (criteria.getLabel() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLabel(), Indicator_.label));
            }
            if (criteria.getQuestion() != null) {
                specification = specification.and(buildStringSpecification(criteria.getQuestion(), Indicator_.question));
            }
            if (criteria.getResultEditableByActor() != null) {
                specification = specification.and(buildSpecification(criteria.getResultEditableByActor(), Indicator_.resultEditableByActor));
            }
            if (criteria.getNumberResult() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getNumberResult(), Indicator_.numberResult));
            }
            if (criteria.getPercentResult() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getPercentResult(), Indicator_.percentResult));
            }
            if (criteria.getResultAppreciation() != null) {
                specification = specification.and(buildStringSpecification(criteria.getResultAppreciation(), Indicator_.resultAppreciation));
            }
            if (criteria.getAveragePercentage() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getAveragePercentage(), Indicator_.averagePercentage));
            }
            if (criteria.getPonderation() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getPonderation(), Indicator_.ponderation));
            }
            if (criteria.getTypeindicatorId() != null) {
                specification = specification.and(buildSpecification(criteria.getTypeindicatorId(),
                    root -> root.join(Indicator_.typeindicator, JoinType.LEFT).get(Typeindicator_.id)));
            }
            if (criteria.getObjectifId() != null) {
                specification = specification.and(buildSpecification(criteria.getObjectifId(),
                    root -> root.join(Indicator_.objectif, JoinType.LEFT).get(Objectif_.id)));
            }
            if (criteria.getParentId() != null) {
                specification = specification.and(buildSpecification(criteria.getParentId(),
                    root -> root.join(Indicator_.parent, JoinType.LEFT).get(Indicator_.id)));
            }
        }
        return specification;
    }
}
