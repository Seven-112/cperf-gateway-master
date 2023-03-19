package com.mshz.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import com.mshz.domain.enumeration.ObjectifCategorie;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;
import io.github.jhipster.service.filter.InstantFilter;

/**
 * Criteria class for the {@link com.mshz.domain.Objectif} entity. This class is used
 * in {@link com.mshz.web.rest.ObjectifResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /objectifs?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ObjectifCriteria implements Serializable, Criteria {
    /**
     * Class for filtering ObjectifCategorie
     */
    public static class ObjectifCategorieFilter extends Filter<ObjectifCategorie> {

        public ObjectifCategorieFilter() {
        }

        public ObjectifCategorieFilter(ObjectifCategorieFilter filter) {
            super(filter);
        }

        @Override
        public ObjectifCategorieFilter copy() {
            return new ObjectifCategorieFilter(this);
        }

    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private IntegerFilter delay;

    private InstantFilter createdAt;

    private ObjectifCategorieFilter categorie;

    private FloatFilter averagePercentage;

    private IntegerFilter ponderation;

    private BooleanFilter realized;

    private LongFilter typeObjectifId;

    private LongFilter fonctionId;

    private LongFilter departmentId;

    private LongFilter employeeId;

    private LongFilter parentId;

    public ObjectifCriteria() {
    }

    public ObjectifCriteria(ObjectifCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.delay = other.delay == null ? null : other.delay.copy();
        this.createdAt = other.createdAt == null ? null : other.createdAt.copy();
        this.categorie = other.categorie == null ? null : other.categorie.copy();
        this.averagePercentage = other.averagePercentage == null ? null : other.averagePercentage.copy();
        this.ponderation = other.ponderation == null ? null : other.ponderation.copy();
        this.realized = other.realized == null ? null : other.realized.copy();
        this.typeObjectifId = other.typeObjectifId == null ? null : other.typeObjectifId.copy();
        this.fonctionId = other.fonctionId == null ? null : other.fonctionId.copy();
        this.departmentId = other.departmentId == null ? null : other.departmentId.copy();
        this.employeeId = other.employeeId == null ? null : other.employeeId.copy();
        this.parentId = other.parentId == null ? null : other.parentId.copy();
    }

    @Override
    public ObjectifCriteria copy() {
        return new ObjectifCriteria(this);
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

    public IntegerFilter getDelay() {
        return delay;
    }

    public void setDelay(IntegerFilter delay) {
        this.delay = delay;
    }

    public InstantFilter getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(InstantFilter createdAt) {
        this.createdAt = createdAt;
    }

    public ObjectifCategorieFilter getCategorie() {
        return categorie;
    }

    public void setCategorie(ObjectifCategorieFilter categorie) {
        this.categorie = categorie;
    }

    public FloatFilter getAveragePercentage() {
        return averagePercentage;
    }

    public void setAveragePercentage(FloatFilter averagePercentage) {
        this.averagePercentage = averagePercentage;
    }

    public IntegerFilter getPonderation() {
        return ponderation;
    }

    public void setPonderation(IntegerFilter ponderation) {
        this.ponderation = ponderation;
    }

    public BooleanFilter getRealized() {
        return realized;
    }

    public void setRealized(BooleanFilter realized) {
        this.realized = realized;
    }

    public LongFilter getTypeObjectifId() {
        return typeObjectifId;
    }

    public void setTypeObjectifId(LongFilter typeObjectifId) {
        this.typeObjectifId = typeObjectifId;
    }

    public LongFilter getFonctionId() {
        return fonctionId;
    }

    public void setFonctionId(LongFilter fonctionId) {
        this.fonctionId = fonctionId;
    }

    public LongFilter getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(LongFilter departmentId) {
        this.departmentId = departmentId;
    }

    public LongFilter getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(LongFilter employeeId) {
        this.employeeId = employeeId;
    }

    public LongFilter getParentId() {
        return parentId;
    }

    public void setParentId(LongFilter parentId) {
        this.parentId = parentId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ObjectifCriteria that = (ObjectifCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(delay, that.delay) &&
            Objects.equals(createdAt, that.createdAt) &&
            Objects.equals(categorie, that.categorie) &&
            Objects.equals(averagePercentage, that.averagePercentage) &&
            Objects.equals(ponderation, that.ponderation) &&
            Objects.equals(realized, that.realized) &&
            Objects.equals(typeObjectifId, that.typeObjectifId) &&
            Objects.equals(fonctionId, that.fonctionId) &&
            Objects.equals(departmentId, that.departmentId) &&
            Objects.equals(employeeId, that.employeeId) &&
            Objects.equals(parentId, that.parentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        name,
        delay,
        createdAt,
        categorie,
        averagePercentage,
        ponderation,
        realized,
        typeObjectifId,
        fonctionId,
        departmentId,
        employeeId,
        parentId
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ObjectifCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (name != null ? "name=" + name + ", " : "") +
                (delay != null ? "delay=" + delay + ", " : "") +
                (createdAt != null ? "createdAt=" + createdAt + ", " : "") +
                (categorie != null ? "categorie=" + categorie + ", " : "") +
                (averagePercentage != null ? "averagePercentage=" + averagePercentage + ", " : "") +
                (ponderation != null ? "ponderation=" + ponderation + ", " : "") +
                (realized != null ? "realized=" + realized + ", " : "") +
                (typeObjectifId != null ? "typeObjectifId=" + typeObjectifId + ", " : "") +
                (fonctionId != null ? "fonctionId=" + fonctionId + ", " : "") +
                (departmentId != null ? "departmentId=" + departmentId + ", " : "") +
                (employeeId != null ? "employeeId=" + employeeId + ", " : "") +
                (parentId != null ? "parentId=" + parentId + ", " : "") +
            "}";
    }

}
