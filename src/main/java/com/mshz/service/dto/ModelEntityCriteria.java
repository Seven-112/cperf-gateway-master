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
 * Criteria class for the {@link com.mshz.domain.ModelEntity} entity. This class is used
 * in {@link com.mshz.web.rest.ModelEntityResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /model-entities?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ModelEntityCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter entity;

    private StringFilter name;

    public ModelEntityCriteria() {
    }

    public ModelEntityCriteria(ModelEntityCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.entity = other.entity == null ? null : other.entity.copy();
        this.name = other.name == null ? null : other.name.copy();
    }

    @Override
    public ModelEntityCriteria copy() {
        return new ModelEntityCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getEntity() {
        return entity;
    }

    public void setEntity(StringFilter entity) {
        this.entity = entity;
    }

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ModelEntityCriteria that = (ModelEntityCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(entity, that.entity) &&
            Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        entity,
        name
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ModelEntityCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (entity != null ? "entity=" + entity + ", " : "") +
                (name != null ? "name=" + name + ", " : "") +
            "}";
    }

}
