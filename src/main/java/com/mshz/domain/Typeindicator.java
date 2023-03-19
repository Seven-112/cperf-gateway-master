package com.mshz.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A Typeindicator.
 */
@Entity
@Table(name = "typeindicator")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Typeindicator implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "measurable")
    private Boolean measurable;

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

    public Typeindicator name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean isMeasurable() {
        return measurable;
    }

    public Typeindicator measurable(Boolean measurable) {
        this.measurable = measurable;
        return this;
    }

    public void setMeasurable(Boolean measurable) {
        this.measurable = measurable;
    }

    public Boolean isValid() {
        return valid;
    }

    public Typeindicator valid(Boolean valid) {
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
        if (!(o instanceof Typeindicator)) {
            return false;
        }
        return id != null && id.equals(((Typeindicator) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Typeindicator{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", measurable='" + isMeasurable() + "'" +
            ", valid='" + isValid() + "'" +
            "}";
    }
}
