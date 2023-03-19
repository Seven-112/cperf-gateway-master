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

import com.mshz.domain.UserExtra;
import com.mshz.domain.*; // for static metamodels
import com.mshz.repository.UserExtraRepository;
import com.mshz.service.dto.UserExtraCriteria;

/**
 * Service for executing complex queries for {@link UserExtra} entities in the database.
 * The main input is a {@link UserExtraCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link UserExtra} or a {@link Page} of {@link UserExtra} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class UserExtraQueryService extends QueryService<UserExtra> {

    private final Logger log = LoggerFactory.getLogger(UserExtraQueryService.class);

    private final UserExtraRepository userExtraRepository;

    public UserExtraQueryService(UserExtraRepository userExtraRepository) {
        this.userExtraRepository = userExtraRepository;
    }

    /**
     * Return a {@link List} of {@link UserExtra} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<UserExtra> findByCriteria(UserExtraCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<UserExtra> specification = createSpecification(criteria);
        return userExtraRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link UserExtra} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<UserExtra> findByCriteria(UserExtraCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<UserExtra> specification = createSpecification(criteria);
        return userExtraRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(UserExtraCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<UserExtra> specification = createSpecification(criteria);
        return userExtraRepository.count(specification);
    }

    /**
     * Function to convert {@link UserExtraCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<UserExtra> createSpecification(UserExtraCriteria criteria) {
        Specification<UserExtra> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), UserExtra_.id));
            }
            if (criteria.getPhotoId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getPhotoId(), UserExtra_.photoId));
            }
            if (criteria.getUserId() != null) {
                specification = specification.and(buildSpecification(criteria.getUserId(),
                    root -> root.join(UserExtra_.user, JoinType.LEFT).get(User_.id)));
            }
            if (criteria.getEmployeeId() != null) {
                specification = specification.and(buildSpecification(criteria.getEmployeeId(),
                    root -> root.join(UserExtra_.employee, JoinType.LEFT).get(Employee_.id)));
            }
        }
        return specification;
    }
}
