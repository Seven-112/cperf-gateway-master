package com.mshz.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A Privilege.
 */
@Entity
@Table(name = "privilege")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Privilege implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "constrained")
    private Boolean constrained;

    @Size(max = 50)
    @Column(name = "authority", length = 50)
    private String authority;

    @NotNull
    @Size(max = 40)
    @Column(name = "entity", length = 40, nullable = false)
    private String entity;

    @NotNull
    @Column(name = "action", nullable = false)
    private String action;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isConstrained() {
        return constrained;
    }

    public Privilege constrained(Boolean constrained) {
        this.constrained = constrained;
        return this;
    }

    public void setConstrained(Boolean constrained) {
        this.constrained = constrained;
    }

    public String getAuthority() {
        return authority;
    }

    public Privilege authority(String authority) {
        this.authority = authority;
        return this;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    public String getEntity() {
        return entity;
    }

    public Privilege entity(String entity) {
        this.entity = entity;
        return this;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getAction() {
        return action;
    }

    public Privilege action(String action) {
        this.action = action;
        return this;
    }

    public void setAction(String action) {
        this.action = action;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Privilege)) {
            return false;
        }
        return id != null && id.equals(((Privilege) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "{" +
            "id:" + getId() +
            ", constrained:'" + isConstrained() + "'" +
            ", authority:'" + getAuthority() + "'" +
            ", entity:'" + getEntity() + "'" +
            ", action:'" + getAction() + "'" +
            "}";
    }
}
