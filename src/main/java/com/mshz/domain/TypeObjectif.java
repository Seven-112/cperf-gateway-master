package com.mshz.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

import com.mshz.domain.enumeration.ObjectifTypeEvaluationUnity;

/**
 * A TypeObjectif.
 */
@Entity
@Table(name = "type_objectif")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TypeObjectif implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "evalutation_unity")
    private ObjectifTypeEvaluationUnity evalutationUnity;

    @Column(name = "valid")
    private Boolean valid;

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

    public TypeObjectif name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ObjectifTypeEvaluationUnity getEvalutationUnity() {
        return evalutationUnity;
    }

    public TypeObjectif evalutationUnity(ObjectifTypeEvaluationUnity evalutationUnity) {
        this.evalutationUnity = evalutationUnity;
        return this;
    }

    public void setEvalutationUnity(ObjectifTypeEvaluationUnity evalutationUnity) {
        this.evalutationUnity = evalutationUnity;
    }

    public Boolean isValid() {
        return valid;
    }

    public TypeObjectif valid(Boolean valid) {
        this.valid = valid;
        return this;
    }

    public void setValid(Boolean valid) {
        this.valid = valid;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypeObjectif)) {
            return false;
        }
        return id != null && id.equals(((TypeObjectif) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeObjectif{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", evalutationUnity='" + getEvalutationUnity() + "'" +
            ", valid='" + isValid() + "'" +
            "}";
    }
}
