package com.mshz.service;

import com.mshz.domain.Employee;
import com.mshz.domain.User;
import com.mshz.domain.UserExtra;
import com.mshz.domain.projection.UserExtraIdOnly;
import com.mshz.repository.EmployeeRepository;
import com.mshz.repository.UserExtraRepository;
import com.mshz.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

/**
 * Service Implementation for managing {@link UserExtra}.
 */
@Service
@Transactional
public class UserExtraService {

    private final Logger log = LoggerFactory.getLogger(UserExtraService.class);

    private final UserExtraRepository userExtraRepository;

    private final UserRepository userRepository;

    public UserExtraService(UserExtraRepository userExtraRepository, 
        UserRepository userRepository, EmployeeRepository employeeRepository) {
        this.userExtraRepository = userExtraRepository;
        this.userRepository = userRepository;

    }

    /**
     * Save a userExtra.
     *
     * @param userExtra the entity to save.
     * @return the persisted entity.
     */
    public UserExtra save(UserExtra userExtra) {
        log.debug("Request to save UserExtra : {}", userExtra);
        Long userId = userExtra.getUser().getId();
        userRepository.findById(userId).ifPresent(userExtra::user);
        return userExtraRepository.save(userExtra);
    }

    /**
     * Get all the userExtras.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<UserExtra> findAll() {
        log.debug("Request to get all UserExtras");
        return userExtraRepository.findAll();
    }


    /**
     * Get one userExtra by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserExtra> findOne(Long id) {
        log.debug("Request to get UserExtra : {}", id);
        return userExtraRepository.findById(id);
    }

    /**
     * Delete the userExtra by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete UserExtra : {}", id);
        userExtraRepository.deleteById(id);
    }
    
    /**
     * Get one userExtra by id.
     *
     * @param id the id of the employee.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserExtra> findByEmployeeId(Long employeeId) {
        log.debug("Request to get UserExtra by employee id: {}", employeeId);
        return userExtraRepository.getUserExtratByEmployeeId(employeeId);
    }
    
    /**
     * Get one userExtra by id.
     *
     * @param userExtra the  useExtra entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<User> findUserByUserExtra(UserExtra userExtra) {
        log.debug("Request to get use by userExtra : {}", userExtra);
        if(userExtra != null)
            return userRepository.findById(userExtra.getId());
        return null;
    }

    /**
     * Get one user by use extra employee id.
     *
     * @param employeeId the id of the employee entity.
     * @return the user entity.
     */
    @Transactional(readOnly = true)
    public Optional<User> findUserByEmployeeId(Long employeeId) {
        log.debug("Request to get user by userExtra employee : {}", employeeId);
        UserExtra userExtra = findByEmployeeId(employeeId).orElse(null);
        if(userExtra != null && userExtra.getUser() != null)
            return userRepository.findOneWithAuthoritiesByLogin(userExtra.getUser().getLogin());
        return null;
    }

    public Page<UserExtra> finByEmployeeIdsNotIn(List<Long> empIds,int page, int size) {
        return userExtraRepository.findByEmployee_IdNotInAndEmployee_IdNotNull(empIds, PageRequest.of(page, size));
    }

    public List<UserExtra> getByDeparementId(Long groupId) {
        return userExtraRepository.getByDeparementId(groupId);
    }

    public Page<UserExtra> findByIdNotIn(List<Long> ids, Pageable pageable) {
        if(ids == null || ids.isEmpty())
            return userExtraRepository.findAll(pageable);
        return userExtraRepository.findByIdNotIn(ids, pageable);
    }

    public Page<UserExtra> searchByFirstOrLastName(String term, Pageable pageable) {
        if(term == null)
            return userExtraRepository.findAll(pageable);
        return userExtraRepository.searchByFirstOrLastName(term.toLowerCase(), pageable);
    }

    public Page<UserExtra> findByUserStatus(Boolean status, Pageable pageable) {
        return userExtraRepository.findByUserNotNullAndUser_activated(status, pageable);
    }

    public Page<UserExtra> getByUserStatusAndIdNotIn(Boolean status, List<Long> ids, Pageable pageable) {
        return userExtraRepository.findByUserNotNullAndUser_activatedAndIdNotIn(status, ids, pageable);
    }

    public Page<UserExtra> findUserByStatusAndDepartement(Boolean status, Long departmentId, Pageable pageable) {
        if(departmentId == null)
            return userExtraRepository.findByUserNotNullAndUser_activated(status, pageable);
        return userExtraRepository.findByStatusAndDepartement(status, departmentId, pageable);
    }

    public Optional<UserExtra> getByEmployeeIdAndUserNotNull(Long id) {
        return userExtraRepository.findFirstByEmployee_IdAndUserNotNull(id);
    }

    public List<UserExtra> findByIdIn(List<Long> ids) {
        return userExtraRepository.findByIdIn(ids);
    }

    public Page<UserExtra> getOrgChildren(Long managerId, Pageable pageable) {
        if(managerId != null){
            UserExtra manager = userExtraRepository.findById(managerId).orElse(null);
            if(manager != null){
                Employee emp = manager.getEmployee();
                if(emp != null && emp.getId() != null)
                    return userExtraRepository
                        .findDistinctByEmployeeNotNullAndIdNotAndEmployee_pathContaining(managerId, emp.getId().toString(),pageable);
            }
        }
        return new PageImpl<>(new ArrayList<>(), pageable, 0);
    }

    public List<Long> getUserIdByDeptId(Long deptId) {
       return userExtraRepository.findIdOnlyByDepartementId(deptId)
            .stream()
            .filter(item -> item.getId() != null)
            .map(item -> item.getId())
            .collect(Collectors.toList());
    }
}
