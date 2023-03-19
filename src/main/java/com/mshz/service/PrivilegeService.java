package com.mshz.service;

import com.mshz.domain.Privilege;
import com.mshz.repository.PrivilegeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service Implementation for managing {@link Privilege}.
 */
@Service
@Transactional
public class PrivilegeService {

    private final Logger log = LoggerFactory.getLogger(PrivilegeService.class);

    private final PrivilegeRepository privilegeRepository;

    public PrivilegeService(PrivilegeRepository privilegeRepository) {
        this.privilegeRepository = privilegeRepository;
    }

    /**
     * Save a privilege.
     *
     * @param privilege the entity to save.
     * @return the persisted entity.
     */
    public Privilege save(Privilege privilege) {
        log.debug("Request to save Privilege : {}", privilege);
        return privilegeRepository.save(privilege);
    }

    /**
     * Get all the privileges.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Privilege> findAll(Pageable pageable) {
        log.debug("Request to get all Privileges");
        return privilegeRepository.findAll(pageable);
    }


    /**
     * Get one privilege by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Privilege> findOne(Long id) {
        log.debug("Request to get Privilege : {}", id);
        return privilegeRepository.findById(id);
    }

    /**
     * Delete the privilege by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Privilege : {}", id);
        privilegeRepository.deleteById(id);
    }
}
