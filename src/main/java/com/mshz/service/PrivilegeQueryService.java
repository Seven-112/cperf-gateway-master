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

import com.mshz.domain.Privilege;
import com.mshz.domain.*; // for static metamodels
import com.mshz.repository.PrivilegeRepository;
import com.mshz.service.dto.PrivilegeCriteria;

/**
 * Service for executing complex queries for {@link Privilege} entities in the database.
 * The main input is a {@link PrivilegeCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Privilege} or a {@link Page} of {@link Privilege} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class PrivilegeQueryService extends QueryService<Privilege> {

    private final Logger log = LoggerFactory.getLogger(PrivilegeQueryService.class);

    private final PrivilegeRepository privilegeRepository;

    public PrivilegeQueryService(PrivilegeRepository privilegeRepository) {
        this.privilegeRepository = privilegeRepository;
    }

    /**
     * Return a {@link List} of {@link Privilege} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Privilege> findByCriteria(PrivilegeCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Privilege> specification = createSpecification(criteria);
        return privilegeRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Privilege} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Privilege> findByCriteria(PrivilegeCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Privilege> specification = createSpecification(criteria);
        return privilegeRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(PrivilegeCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Privilege> specification = createSpecification(criteria);
        return privilegeRepository.count(specification);
    }

    /**
     * Function to convert {@link PrivilegeCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Privilege> createSpecification(PrivilegeCriteria criteria) {
        Specification<Privilege> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Privilege_.id));
            }
            if (criteria.getConstrained() != null) {
                specification = specification.and(buildSpecification(criteria.getConstrained(), Privilege_.constrained));
            }
            if (criteria.getAuthority() != null) {
                specification = specification.and(buildStringSpecification(criteria.getAuthority(), Privilege_.authority));
            }
            if (criteria.getEntity() != null) {
                specification = specification.and(buildStringSpecification(criteria.getEntity(), Privilege_.entity));
            }
            if (criteria.getAction() != null) {
                specification = specification.and(buildStringSpecification(criteria.getAction(), Privilege_.action));
            }
        }
        return specification;
    }
}
