package com.mshz.web.rest;

import com.mshz.domain.UserFile;
import com.mshz.service.UserFileService;
import com.mshz.web.rest.errors.BadRequestAlertException;
import com.mshz.service.dto.UserFileCriteria;
import com.mshz.service.UserFileQueryService;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mshz.domain.UserFile}.
 */
@RestController
@RequestMapping("/api")
public class UserFileResource {

    private final Logger log = LoggerFactory.getLogger(UserFileResource.class);

    private static final String ENTITY_NAME = "userFile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserFileService userFileService;

    private final UserFileQueryService userFileQueryService;

    public UserFileResource(UserFileService userFileService, UserFileQueryService userFileQueryService) {
        this.userFileService = userFileService;
        this.userFileQueryService = userFileQueryService;
    }

    /**
     * {@code POST  /user-files} : Create a new userFile.
     *
     * @param userFile the userFile to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userFile, or with status {@code 400 (Bad Request)} if the userFile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-files")
    public ResponseEntity<UserFile> createUserFile(@RequestBody UserFile userFile) throws URISyntaxException {
        log.debug("REST request to save UserFile : {}", userFile);
        if (userFile.getId() != null) {
            throw new BadRequestAlertException("A new userFile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserFile result = userFileService.save(userFile);
        return ResponseEntity.created(new URI("/api/user-files/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-files} : Updates an existing userFile.
     *
     * @param userFile the userFile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userFile,
     * or with status {@code 400 (Bad Request)} if the userFile is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userFile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-files")
    public ResponseEntity<UserFile> updateUserFile(@RequestBody UserFile userFile) throws URISyntaxException {
        log.debug("REST request to update UserFile : {}", userFile);
        if (userFile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserFile result = userFileService.save(userFile);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userFile.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /user-files} : get all the userFiles.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userFiles in body.
     */
    @GetMapping("/user-files")
    public ResponseEntity<List<UserFile>> getAllUserFiles(UserFileCriteria criteria, Pageable pageable) {
        log.debug("REST request to get UserFiles by criteria: {}", criteria);
        Page<UserFile> page = userFileQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-files/count} : count all the userFiles.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/user-files/count")
    public ResponseEntity<Long> countUserFiles(UserFileCriteria criteria) {
        log.debug("REST request to count UserFiles by criteria: {}", criteria);
        return ResponseEntity.ok().body(userFileQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /user-files/:id} : get the "id" userFile.
     *
     * @param id the id of the userFile to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userFile, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-files/{id}")
    public ResponseEntity<UserFile> getUserFile(@PathVariable Long id) {
        log.debug("REST request to get UserFile : {}", id);
        Optional<UserFile> userFile = userFileService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userFile);
    }

    /**
     * {@code DELETE  /user-files/:id} : delete the "id" userFile.
     *
     * @param id the id of the userFile to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-files/{id}")
    public ResponseEntity<Void> deleteUserFile(@PathVariable Long id) {
        log.debug("REST request to delete UserFile : {}", id);
        userFileService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/user-files/getAllByUser/{userId}")
    public ResponseEntity<List<UserFile>> getAllByUser(
        @PathVariable Long userId,
        @RequestParam(name = "isEmploye", defaultValue = "true") Boolean isEmploye,
        @RequestParam(name = "folderId", defaultValue = "") String folderIdStr) {
        log.debug("REST request to get UserFiles by id {} and foloder {}: {}", userId, folderIdStr);
        Long folderId = folderIdStr != null && !folderIdStr.isEmpty() ? Long.valueOf(folderIdStr) : null;
        List<UserFile> result = userFileService.getAllByUser(userId, folderId, isEmploye);
        return ResponseEntity.ok().body(result);
    }


}
