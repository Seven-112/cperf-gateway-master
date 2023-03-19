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
 * Criteria class for the {@link com.mshz.domain.Privilege} entity. This class is used
 * in {@link com.mshz.web.rest.PrivilegeResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /privileges?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class PrivilegeCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private BooleanFilter constrained;

    private StringFilter authority;

    private StringFilter entity;

    private StringFilter action;

    public PrivilegeCriteria() {
    }

    public PrivilegeCriteria(PrivilegeCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.constrained = other.constrained == null ? null : other.constrained.copy();
        this.authority = other.authority == null ? null : other.authority.copy();
        this.entity = other.entity == null ? null : other.entity.copy();
        this.action = other.action == null ? null : other.action.copy();
    }

    @Override
    public PrivilegeCriteria copy() {
        return new PrivilegeCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public BooleanFilter getConstrained() {
        return constrained;
    }

    public void setConstrained(BooleanFilter constrained) {
        this.constrained = constrained;
    }

    public StringFilter getAuthority() {
        return authority;
    }

    public void setAuthority(StringFilter authority) {
        this.authority = authority;
    }

    public StringFilter getEntity() {
        return entity;
    }

    public void setEntity(StringFilter entity) {
        this.entity = entity;
    }

    public StringFilter getAction() {
        return action;
    }

    public void setAction(StringFilter action) {
        this.action = action;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final PrivilegeCriteria that = (PrivilegeCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(constrained, that.constrained) &&
            Objects.equals(authority, that.authority) &&
            Objects.equals(entity, that.entity) &&
            Objects.equals(action, that.action);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        constrained,
        authority,
        entity,
        action
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PrivilegeCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (constrained != null ? "constrained=" + constrained + ", " : "") +
                (authority != null ? "authority=" + authority + ", " : "") +
                (entity != null ? "entity=" + entity + ", " : "") +
                (action != null ? "action=" + action + ", " : "") +
            "}";
    }

}
