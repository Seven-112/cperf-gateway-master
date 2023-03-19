package com.mshz.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import com.mshz.domain.enumeration.DynamicFieldType;
import com.mshz.domain.enumeration.DynamicFieldTag;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.mshz.domain.DynamicField} entity. This class is used
 * in {@link com.mshz.web.rest.DynamicFieldResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /dynamic-fields?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class DynamicFieldCriteria implements Serializable, Criteria {
    /**
     * Class for filtering DynamicFieldType
     */
    public static class DynamicFieldTypeFilter extends Filter<DynamicFieldType> {

        public DynamicFieldTypeFilter() {
        }

        public DynamicFieldTypeFilter(DynamicFieldTypeFilter filter) {
            super(filter);
        }

        @Override
        public DynamicFieldTypeFilter copy() {
            return new DynamicFieldTypeFilter(this);
        }

    }
    /**
     * Class for filtering DynamicFieldTag
     */
    public static class DynamicFieldTagFilter extends Filter<DynamicFieldTag> {

        public DynamicFieldTagFilter() {
        }

        public DynamicFieldTagFilter(DynamicFieldTagFilter filter) {
            super(filter);
        }

        @Override
        public DynamicFieldTagFilter copy() {
            return new DynamicFieldTagFilter(this);
        }

    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private DynamicFieldTypeFilter type;

    private BooleanFilter required;

    private LongFilter docId;

    private LongFilter entityId;

    private DynamicFieldTagFilter tag;

    public DynamicFieldCriteria() {
    }

    public DynamicFieldCriteria(DynamicFieldCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.type = other.type == null ? null : other.type.copy();
        this.required = other.required == null ? null : other.required.copy();
        this.docId = other.docId == null ? null : other.docId.copy();
        this.entityId = other.entityId == null ? null : other.entityId.copy();
        this.tag = other.tag == null ? null : other.tag.copy();
    }

    @Override
    public DynamicFieldCriteria copy() {
        return new DynamicFieldCriteria(this);
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

    public DynamicFieldTypeFilter getType() {
        return type;
    }

    public void setType(DynamicFieldTypeFilter type) {
        this.type = type;
    }

    public BooleanFilter getRequired() {
        return required;
    }

    public void setRequired(BooleanFilter required) {
        this.required = required;
    }

    public LongFilter getDocId() {
        return docId;
    }

    public void setDocId(LongFilter docId) {
        this.docId = docId;
    }

    public LongFilter getEntityId() {
        return entityId;
    }

    public void setEntityId(LongFilter entityId) {
        this.entityId = entityId;
    }

    public DynamicFieldTagFilter getTag() {
        return tag;
    }

    public void setTag(DynamicFieldTagFilter tag) {
        this.tag = tag;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final DynamicFieldCriteria that = (DynamicFieldCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(type, that.type) &&
            Objects.equals(required, that.required) &&
            Objects.equals(docId, that.docId) &&
            Objects.equals(entityId, that.entityId) &&
            Objects.equals(tag, that.tag);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        name,
        type,
        required,
        docId,
        entityId,
        tag
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DynamicFieldCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (name != null ? "name=" + name + ", " : "") +
                (type != null ? "type=" + type + ", " : "") +
                (required != null ? "required=" + required + ", " : "") +
                (docId != null ? "docId=" + docId + ", " : "") +
                (entityId != null ? "entityId=" + entityId + ", " : "") +
                (tag != null ? "tag=" + tag + ", " : "") +
            "}";
    }

}
