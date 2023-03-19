package com.mshz.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

import com.mshz.domain.enumeration.DynamicFieldType;

import com.mshz.domain.enumeration.DynamicFieldTag;

/**
 * A DynamicField.
 */
@Entity
@Table(name = "dynamic_field")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DynamicField implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private DynamicFieldType type;

    @Column(name = "required")
    private Boolean required;

    @Column(name = "doc_id")
    private Long docId;

    @NotNull
    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    private DynamicFieldTag tag;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public DynamicField name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DynamicFieldType getType() {
        return type;
    }

    public DynamicField type(DynamicFieldType type) {
        this.type = type;
        return this;
    }

    public void setType(DynamicFieldType type) {
        this.type = type;
    }

    public Boolean isRequired() {
        return required;
    }

    public DynamicField required(Boolean required) {
        this.required = required;
        return this;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public Long getDocId() {
        return docId;
    }

    public DynamicField docId(Long docId) {
        this.docId = docId;
        return this;
    }

    public void setDocId(Long docId) {
        this.docId = docId;
    }

    public Long getEntityId() {
        return entityId;
    }

    public DynamicField entityId(Long entityId) {
        this.entityId = entityId;
        return this;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public DynamicFieldTag getTag() {
        return tag;
    }

    public DynamicField tag(DynamicFieldTag tag) {
        this.tag = tag;
        return this;
    }

    public void setTag(DynamicFieldTag tag) {
        this.tag = tag;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DynamicField)) {
            return false;
        }
        return id != null && id.equals(((DynamicField) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DynamicField{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", required='" + isRequired() + "'" +
            ", docId=" + getDocId() +
            ", entityId=" + getEntityId() +
            ", tag='" + getTag() + "'" +
            "}";
    }
}
