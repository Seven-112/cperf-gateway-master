package com.mshz.service;

import com.mshz.domain.UserFile;
import com.mshz.repository.UserFileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link UserFile}.
 */
@Service
@Transactional
public class UserFileService {

    private final Logger log = LoggerFactory.getLogger(UserFileService.class);

    private final UserFileRepository userFileRepository;

    public UserFileService(UserFileRepository userFileRepository) {
        this.userFileRepository = userFileRepository;
    }

    /**
     * Save a userFile.
     *
     * @param userFile the entity to save.
     * @return the persisted entity.
     */
    public UserFile save(UserFile userFile) {
        log.debug("Request to save UserFile : {}", userFile);
        return userFileRepository.save(userFile);
    }

    /**
     * Get all the userFiles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<UserFile> findAll(Pageable pageable) {
        log.debug("Request to get all UserFiles");
        return userFileRepository.findAll(pageable);
    }


    /**
     * Get one userFile by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserFile> findOne(Long id) {
        log.debug("Request to get UserFile : {}", id);
        return userFileRepository.findById(id);
    }

    /**
     * Delete the userFile by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete UserFile : {}", id);
        userFileRepository.deleteById(id);
        userFileRepository.deleteByParentId(id);
    }

    public List<UserFile> getAllByUser(Long userId, Long folderId, Boolean isEmploye) {
        return userFileRepository.findByUserIdAndParentIdAndIsEmployeIs(userId, folderId, isEmploye);
    }
}
