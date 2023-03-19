package com.mshz.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

import com.mshz.domain.enumeration.ObjectifCategorie;

/**
 * A Objectif.
 */
@Entity
@Table(name = "objectif")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Objectif implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "delay")
    private Integer delay;

    @Column(name = "created_at")
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "categorie")
    private ObjectifCategorie categorie;

    @Column(name = "average_percentage")
    private Float averagePercentage;

    @Column(name = "ponderation")
    private Integer ponderation;

    @Column(name = "realized")
    private Boolean realized;

    @ManyToOne
    @JsonIgnoreProperties(value = "objectifs", allowSetters = true)
    private TypeObjectif typeObjectif;

    @ManyToOne
    @JsonIgnoreProperties(value = "objectifs", allowSetters = true)
    private Fonction fonction;

    @ManyToOne
    @JsonIgnoreProperties(value = "objectifs", allowSetters = true)
    private Department department;

    @ManyToOne
    @JsonIgnoreProperties(value = "objectifs", allowSetters = true)
    private Employee employee;

    @ManyToOne
    @JsonIgnoreProperties(value = "objectifs", allowSetters = true)
    private Objectif parent;

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

    public Objectif name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getDelay() {
        return delay;
    }

    public Objectif delay(Integer delay) {
        this.delay = delay;
        return this;
    }

    public void setDelay(Integer delay) {
        this.delay = delay;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Objectif createdAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public ObjectifCategorie getCategorie() {
        return categorie;
    }

    public Objectif categorie(ObjectifCategorie categorie) {
        this.categorie = categorie;
        return this;
    }

    public void setCategorie(ObjectifCategorie categorie) {
        this.categorie = categorie;
    }

    public Float getAveragePercentage() {
        return averagePercentage;
    }

    public Objectif averagePercentage(Float averagePercentage) {
        this.averagePercentage = averagePercentage;
        return this;
    }

    public void setAveragePercentage(Float averagePercentage) {
        this.averagePercentage = averagePercentage;
    }

    public Integer getPonderation() {
        return ponderation;
    }

    public Objectif ponderation(Integer ponderation) {
        this.ponderation = ponderation;
        return this;
    }

    public void setPonderation(Integer ponderation) {
        this.ponderation = ponderation;
    }

    public Boolean isRealized() {
        return realized;
    }

    public Objectif realized(Boolean realized) {
        this.realized = realized;
        return this;
    }

    public void setRealized(Boolean realized) {
        this.realized = realized;
    }

    public TypeObjectif getTypeObjectif() {
        return typeObjectif;
    }

    public Objectif typeObjectif(TypeObjectif typeObjectif) {
        this.typeObjectif = typeObjectif;
        return this;
    }

    public void setTypeObjectif(TypeObjectif typeObjectif) {
        this.typeObjectif = typeObjectif;
    }

    public Fonction getFonction() {
        return fonction;
    }

    public Objectif fonction(Fonction fonction) {
        this.fonction = fonction;
        return this;
    }

    public void setFonction(Fonction fonction) {
        this.fonction = fonction;
    }

    public Department getDepartment() {
        return department;
    }

    public Objectif department(Department department) {
        this.department = department;
        return this;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Employee getEmployee() {
        return employee;
    }

    public Objectif employee(Employee employee) {
        this.employee = employee;
        return this;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Objectif getParent() {
        return parent;
    }

    public Objectif parent(Objectif objectif) {
        this.parent = objectif;
        return this;
    }

    public void setParent(Objectif objectif) {
        this.parent = objectif;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Objectif)) {
            return false;
        }
        return id != null && id.equals(((Objectif) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Objectif{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", delay=" + getDelay() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", categorie='" + getCategorie() + "'" +
            ", averagePercentage=" + getAveragePercentage() +
            ", ponderation=" + getPonderation() +
            ", realized='" + isRealized() + "'" +
            "}";
    }
}
