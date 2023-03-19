package com.mshz.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.mshz.domain.UserFile} entity. This class is used
 * in {@link com.mshz.web.rest.UserFileResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /user-files?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class UserFileCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private LongFilter userId;

    private LongFilter fileId;

    private StringFilter fileName;

    private LongFilter parentId;

    private BooleanFilter isFolder;

    private BooleanFilter isEmploye;

    public UserFileCriteria() {
    }

    public UserFileCriteria(UserFileCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
        this.fileId = other.fileId == null ? null : other.fileId.copy();
        this.fileName = other.fileName == null ? null : other.fileName.copy();
        this.parentId = other.parentId == null ? null : other.parentId.copy();
        this.isFolder = other.isFolder == null ? null : other.isFolder.copy();
        this.isEmploye = other.isEmploye == null ? null : other.isEmploye.copy();
    }

    @Override
    public UserFileCriteria copy() {
        return new UserFileCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    public LongFilter getFileId() {
        return fileId;
    }

    public void setFileId(LongFilter fileId) {
        this.fileId = fileId;
    }

    public StringFilter getFileName() {
        return fileName;
    }

    public void setFileName(StringFilter fileName) {
        this.fileName = fileName;
    }

    public LongFilter getParentId() {
        return parentId;
    }

    public void setParentId(LongFilter parentId) {
        this.parentId = parentId;
    }

    public BooleanFilter getIsFolder() {
        return isFolder;
    }

    public void setIsFolder(BooleanFilter isFolder) {
        this.isFolder = isFolder;
    }

    public BooleanFilter getIsEmploye() {
        return isEmploye;
    }

    public void setIsEmploye(BooleanFilter isEmploye) {
        this.isEmploye = isEmploye;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final UserFileCriteria that = (UserFileCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(fileId, that.fileId) &&
            Objects.equals(fileName, that.fileName) &&
            Objects.equals(parentId, that.parentId) &&
            Objects.equals(isFolder, that.isFolder) &&
            Objects.equals(isEmploye, that.isEmploye);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        userId,
        fileId,
        fileName,
        parentId,
        isFolder,
        isEmploye
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserFileCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (userId != null ? "userId=" + userId + ", " : "") +
                (fileId != null ? "fileId=" + fileId + ", " : "") +
                (fileName != null ? "fileName=" + fileName + ", " : "") +
                (parentId != null ? "parentId=" + parentId + ", " : "") +
                (isFolder != null ? "isFolder=" + isFolder + ", " : "") +
                (isEmploye != null ? "isEmploye=" + isEmploye + ", " : "") +
            "}";
    }

}
