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

import com.mshz.domain.UserFile;
import com.mshz.domain.*; // for static metamodels
import com.mshz.repository.UserFileRepository;
import com.mshz.service.dto.UserFileCriteria;

/**
 * Service for executing complex queries for {@link UserFile} entities in the database.
 * The main input is a {@link UserFileCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link UserFile} or a {@link Page} of {@link UserFile} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class UserFileQueryService extends QueryService<UserFile> {

    private final Logger log = LoggerFactory.getLogger(UserFileQueryService.class);

    private final UserFileRepository userFileRepository;

    public UserFileQueryService(UserFileRepository userFileRepository) {
        this.userFileRepository = userFileRepository;
    }

    /**
     * Return a {@link List} of {@link UserFile} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<UserFile> findByCriteria(UserFileCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<UserFile> specification = createSpecification(criteria);
        return userFileRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link UserFile} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<UserFile> findByCriteria(UserFileCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<UserFile> specification = createSpecification(criteria);
        return userFileRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(UserFileCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<UserFile> specification = createSpecification(criteria);
        return userFileRepository.count(specification);
    }

    /**
     * Function to convert {@link UserFileCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<UserFile> createSpecification(UserFileCriteria criteria) {
        Specification<UserFile> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), UserFile_.id));
            }
            if (criteria.getUserId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getUserId(), UserFile_.userId));
            }
            if (criteria.getFileId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getFileId(), UserFile_.fileId));
            }
            if (criteria.getFileName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getFileName(), UserFile_.fileName));
            }
            if (criteria.getParentId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getParentId(), UserFile_.parentId));
            }
            if (criteria.getIsFolder() != null) {
                specification = specification.and(buildSpecification(criteria.getIsFolder(), UserFile_.isFolder));
            }
            if (criteria.getIsEmploye() != null) {
                specification = specification.and(buildSpecification(criteria.getIsEmploye(), UserFile_.isEmploye));
            }
        }
        return specification;
    }
}
