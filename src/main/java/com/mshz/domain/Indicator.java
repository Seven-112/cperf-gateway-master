package com.mshz.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A Indicator.
 */
@Entity
@Table(name = "indicator")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Indicator implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "expected_result_number")
    private Float expectedResultNumber;

    @Size(max = 100)
    @Column(name = "result_unity", length = 100)
    private String resultUnity;

    @NotNull
    @Column(name = "label", nullable = false)
    private String label;

    @Column(name = "question")
    private String question;

    @Column(name = "result_editable_by_actor")
    private Boolean resultEditableByActor;

    @Column(name = "number_result")
    private Float numberResult;

    @Column(name = "percent_result")
    private Float percentResult;

    @Size(max = 100)
    @Column(name = "result_appreciation", length = 100)
    private String resultAppreciation;

    @Column(name = "average_percentage")
    private Float averagePercentage;

    @Column(name = "ponderation")
    private Integer ponderation;

    @ManyToOne
    @JsonIgnoreProperties(value = "indicators", allowSetters = true)
    private Typeindicator typeindicator;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "indicators", allowSetters = true)
    private Objectif objectif;

    @ManyToOne
    @JsonIgnoreProperties(value = "indicators", allowSetters = true)
    private Indicator parent;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getExpectedResultNumber() {
        return expectedResultNumber;
    }

    public Indicator expectedResultNumber(Float expectedResultNumber) {
        this.expectedResultNumber = expectedResultNumber;
        return this;
    }

    public void setExpectedResultNumber(Float expectedResultNumber) {
        this.expectedResultNumber = expectedResultNumber;
    }

    public String getResultUnity() {
        return resultUnity;
    }

    public Indicator resultUnity(String resultUnity) {
        this.resultUnity = resultUnity;
        return this;
    }

    public void setResultUnity(String resultUnity) {
        this.resultUnity = resultUnity;
    }

    public String getLabel() {
        return label;
    }

    public Indicator label(String label) {
        this.label = label;
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getQuestion() {
        return question;
    }

    public Indicator question(String question) {
        this.question = question;
        return this;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Boolean isResultEditableByActor() {
        return resultEditableByActor;
    }

    public Indicator resultEditableByActor(Boolean resultEditableByActor) {
        this.resultEditableByActor = resultEditableByActor;
        return this;
    }

    public void setResultEditableByActor(Boolean resultEditableByActor) {
        this.resultEditableByActor = resultEditableByActor;
    }

    public Float getNumberResult() {
        return numberResult;
    }

    public Indicator numberResult(Float numberResult) {
        this.numberResult = numberResult;
        return this;
    }

    public void setNumberResult(Float numberResult) {
        this.numberResult = numberResult;
    }

    public Float getPercentResult() {
        return percentResult;
    }

    public Indicator percentResult(Float percentResult) {
        this.percentResult = percentResult;
        return this;
    }

    public void setPercentResult(Float percentResult) {
        this.percentResult = percentResult;
    }

    public String getResultAppreciation() {
        return resultAppreciation;
    }

    public Indicator resultAppreciation(String resultAppreciation) {
        this.resultAppreciation = resultAppreciation;
        return this;
    }

    public void setResultAppreciation(String resultAppreciation) {
        this.resultAppreciation = resultAppreciation;
    }

    public Float getAveragePercentage() {
        return averagePercentage;
    }

    public Indicator averagePercentage(Float averagePercentage) {
        this.averagePercentage = averagePercentage;
        return this;
    }

    public void setAveragePercentage(Float averagePercentage) {
        this.averagePercentage = averagePercentage;
    }

    public Integer getPonderation() {
        return ponderation;
    }

    public Indicator ponderation(Integer ponderation) {
        this.ponderation = ponderation;
        return this;
    }

    public void setPonderation(Integer ponderation) {
        this.ponderation = ponderation;
    }

    public Typeindicator getTypeindicator() {
        return typeindicator;
    }

    public Indicator typeindicator(Typeindicator typeindicator) {
        this.typeindicator = typeindicator;
        return this;
    }

    public void setTypeindicator(Typeindicator typeindicator) {
        this.typeindicator = typeindicator;
    }

    public Objectif getObjectif() {
        return objectif;
    }

    public Indicator objectif(Objectif objectif) {
        this.objectif = objectif;
        return this;
    }

    public void setObjectif(Objectif objectif) {
        this.objectif = objectif;
    }

    public Indicator getParent() {
        return parent;
    }

    public Indicator parent(Indicator indicator) {
        this.parent = indicator;
        return this;
    }

    public void setParent(Indicator indicator) {
        this.parent = indicator;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Indicator)) {
            return false;
        }
        return id != null && id.equals(((Indicator) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Indicator{" +
            "id=" + getId() +
            ", expectedResultNumber=" + getExpectedResultNumber() +
            ", resultUnity='" + getResultUnity() + "'" +
            ", label='" + getLabel() + "'" +
            ", question='" + getQuestion() + "'" +
            ", resultEditableByActor='" + isResultEditableByActor() + "'" +
            ", numberResult=" + getNumberResult() +
            ", percentResult=" + getPercentResult() +
            ", resultAppreciation='" + getResultAppreciation() + "'" +
            ", averagePercentage=" + getAveragePercentage() +
            ", ponderation=" + getPonderation() +
            "}";
    }
}
