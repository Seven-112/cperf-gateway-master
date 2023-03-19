package com.mshz.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import com.mshz.domain.enumeration.ObjectifTypeEvaluationUnity;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.mshz.domain.TypeObjectif} entity. This class is used
 * in {@link com.mshz.web.rest.TypeObjectifResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /type-objectifs?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class TypeObjectifCriteria implements Serializable, Criteria {
    /**
     * Class for filtering ObjectifTypeEvaluationUnity
     */
    public static class ObjectifTypeEvaluationUnityFilter extends Filter<ObjectifTypeEvaluationUnity> {

        public ObjectifTypeEvaluationUnityFilter() {
        }

        public ObjectifTypeEvaluationUnityFilter(ObjectifTypeEvaluationUnityFilter filter) {
            super(filter);
        }

        @Override
        public ObjectifTypeEvaluationUnityFilter copy() {
            return new ObjectifTypeEvaluationUnityFilter(this);
        }

    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private ObjectifTypeEvaluationUnityFilter evalutationUnity;

    private BooleanFilter valid;

    public TypeObjectifCriteria() {
    }

    public TypeObjectifCriteria(TypeObjectifCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.evalutationUnity = other.evalutationUnity == null ? null : other.evalutationUnity.copy();
        this.valid = other.valid == null ? null : other.valid.copy();
    }

    @Override
    public TypeObjectifCriteria copy() {
        return new TypeObjectifCriteria(this);
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

    public ObjectifTypeEvaluationUnityFilter getEvalutationUnity() {
        return evalutationUnity;
    }

    public void setEvalutationUnity(ObjectifTypeEvaluationUnityFilter evalutationUnity) {
        this.evalutationUnity = evalutationUnity;
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
        final TypeObjectifCriteria that = (TypeObjectifCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(evalutationUnity, that.evalutationUnity) &&
            Objects.equals(valid, that.valid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        name,
        evalutationUnity,
        valid
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeObjectifCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (name != null ? "name=" + name + ", " : "") +
                (evalutationUnity != null ? "evalutationUnity=" + evalutationUnity + ", " : "") +
                (valid != null ? "valid=" + valid + ", " : "") +
            "}";
    }

}
