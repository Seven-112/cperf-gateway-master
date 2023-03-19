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
 * Criteria class for the {@link com.mshz.domain.Typeindicator} entity. This class is used
 * in {@link com.mshz.web.rest.TypeindicatorResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /typeindicators?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class TypeindicatorCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private BooleanFilter measurable;

    private BooleanFilter valid;

    public TypeindicatorCriteria() {
    }

    public TypeindicatorCriteria(TypeindicatorCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.measurable = other.measurable == null ? null : other.measurable.copy();
        this.valid = other.valid == null ? null : other.valid.copy();
    }

    @Override
    public TypeindicatorCriteria copy() {
        return new TypeindicatorCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public BooleanFilter getMeasurable() {
        return measurable;
    }

    public void setMeasurable(BooleanFilter measurable) {
        this.measurable = measurable;
    }

    public BooleanFilter getValid() {
        return valid;
    }

    public void setValid(BooleanFilter valid) {
        this.valid = valid;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final TypeindicatorCriteria that = (TypeindicatorCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(measurable, that.measurable) &&
            Objects.equals(valid, that.valid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        name,
        measurable,
        valid
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeindicatorCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (name != null ? "name=" + name + ", " : "") +
                (measurable != null ? "measurable=" + measurable + ", " : "") +
                (valid != null ? "valid=" + valid + ", " : "") +
            "}";
    }

}
