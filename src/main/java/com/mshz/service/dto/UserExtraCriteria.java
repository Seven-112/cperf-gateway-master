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
 * Criteria class for the {@link com.mshz.domain.UserExtra} entity. This class is used
 * in {@link com.mshz.web.rest.UserExtraResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /user-extras?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class UserExtraCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private LongFilter photoId;

    private LongFilter userId;

    private LongFilter employeeId;

    public UserExtraCriteria() {
    }

    public UserExtraCriteria(UserExtraCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.photoId = other.photoId == null ? null : other.photoId.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
        this.employeeId = other.employeeId == null ? null : other.employeeId.copy();
    }

    @Override
    public UserExtraCriteria copy() {
        return new UserExtraCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public LongFilter getPhotoId() {
        return photoId;
    }

    public void setPhotoId(LongFilter photoId) {
        this.photoId = photoId;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    public LongFilter getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(LongFilter employeeId) {
        this.employeeId = employeeId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final UserExtraCriteria that = (UserExtraCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(photoId, that.photoId) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(employeeId, that.employeeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        photoId,
        userId,
        employeeId
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserExtraCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (photoId != null ? "photoId=" + photoId + ", " : "") +
                (userId != null ? "userId=" + userId + ", " : "") +
                (employeeId != null ? "employeeId=" + employeeId + ", " : "") +
            "}";
    }

}
