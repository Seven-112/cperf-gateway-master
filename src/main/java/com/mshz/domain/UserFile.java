package com.mshz.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A UserFile.
 */
@Entity
@Table(name = "user_file")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserFile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "file_id")
    private Long fileId;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "is_folder")
    private Boolean isFolder;

    @Column(name = "is_employe")
    private Boolean isEmploye;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public UserFile userId(Long userId) {
        this.userId = userId;
        return this;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getFileId() {
        return fileId;
    }

    public UserFile fileId(Long fileId) {
        this.fileId = fileId;
        return this;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public UserFile fileName(String fileName) {
        this.fileName = fileName;
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getParentId() {
        return parentId;
    }

    public UserFile parentId(Long parentId) {
        this.parentId = parentId;
        return this;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Boolean isIsFolder() {
        return isFolder;
    }

    public UserFile isFolder(Boolean isFolder) {
        this.isFolder = isFolder;
        return this;
    }

    public void setIsFolder(Boolean isFolder) {
        this.isFolder = isFolder;
    }

    public Boolean isIsEmploye() {
        return isEmploye;
    }

    public UserFile isEmploye(Boolean isEmploye) {
        this.isEmploye = isEmploye;
        return this;
    }

    public void setIsEmploye(Boolean isEmploye) {
        this.isEmploye = isEmploye;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserFile)) {
            return false;
        }
        return id != null && id.equals(((UserFile) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserFile{" +
            "id=" + getId() +
            ", userId=" + getUserId() +
            ", fileId=" + getFileId() +
            ", fileName='" + getFileName() + "'" +
            ", parentId=" + getParentId() +
            ", isFolder='" + isIsFolder() + "'" +
            ", isEmploye='" + isIsEmploye() + "'" +
            "}";
    }
}
