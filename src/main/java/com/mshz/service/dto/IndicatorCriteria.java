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
 * Criteria class for the {@link com.mshz.domain.Indicator} entity. This class is used
 * in {@link com.mshz.web.rest.IndicatorResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /indicators?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class IndicatorCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private FloatFilter expectedResultNumber;

    private StringFilter resultUnity;

    private StringFilter label;

    private StringFilter question;

    private BooleanFilter resultEditableByActor;

    private FloatFilter numberResult;

    private FloatFilter percentResult;

    private StringFilter resultAppreciation;

    private FloatFilter averagePercentage;

    private IntegerFilter ponderation;

    private LongFilter typeindicatorId;

    private LongFilter objectifId;

    private LongFilter parentId;

    public IndicatorCriteria() {
    }

    public IndicatorCriteria(IndicatorCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.expectedResultNumber = other.expectedResultNumber == null ? null : other.expectedResultNumber.copy();
        this.resultUnity = other.resultUnity == null ? null : other.resultUnity.copy();
        this.label = other.label == null ? null : other.label.copy();
        this.question = other.question == null ? null : other.question.copy();
        this.resultEditableByActor = other.resultEditableByActor == null ? null : other.resultEditableByActor.copy();
        this.numberResult = other.numberResult == null ? null : other.numberResult.copy();
        this.percentResult = other.percentResult == null ? null : other.percentResult.copy();
        this.resultAppreciation = other.resultAppreciation == null ? null : other.resultAppreciation.copy();
        this.averagePercentage = other.averagePercentage == null ? null : other.averagePercentage.copy();
        this.ponderation = other.ponderation == null ? null : other.ponderation.copy();
        this.typeindicatorId = other.typeindicatorId == null ? null : other.typeindicatorId.copy();
        this.objectifId = other.objectifId == null ? null : other.objectifId.copy();
        this.parentId = other.parentId == null ? null : other.parentId.copy();
    }

    @Override
    public IndicatorCriteria copy() {
        return new IndicatorCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public FloatFilter getExpectedResultNumber() {
        return expectedResultNumber;
    }

    public void setExpectedResultNumber(FloatFilter expectedResultNumber) {
        this.expectedResultNumber = expectedResultNumber;
    }

    public StringFilter getResultUnity() {
        return resultUnity;
    }

    public void setResultUnity(StringFilter resultUnity) {
        this.resultUnity = resultUnity;
    }

    public StringFilter getLabel() {
        return label;
    }

    public void setLabel(StringFilter label) {
        this.label = label;
    }

    public StringFilter getQuestion() {
        return question;
    }

    public void setQuestion(StringFilter question) {
        this.question = question;
    }

    public BooleanFilter getResultEditableByActor() {
        return resultEditableByActor;
    }

    public void setResultEditableByActor(BooleanFilter resultEditableByActor) {
        this.resultEditableByActor = resultEditableByActor;
    }

    public FloatFilter getNumberResult() {
        return numberResult;
    }

    public void setNumberResult(FloatFilter numberResult) {
        this.numberResult = numberResult;
    }

    public FloatFilter getPercentResult() {
        return percentResult;
    }

    public void setPercentResult(FloatFilter percentResult) {
        this.percentResult = percentResult;
    }

    public StringFilter getResultAppreciation() {
        return resultAppreciation;
    }

    public void setResultAppreciation(StringFilter resultAppreciation) {
        this.resultAppreciation = resultAppreciation;
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

    public LongFilter getTypeindicatorId() {
        return typeindicatorId;
    }

    public void setTypeindicatorId(LongFilter typeindicatorId) {
        this.typeindicatorId = typeindicatorId;
    }

    public LongFilter getObjectifId() {
        return objectifId;
    }

    public void setObjectifId(LongFilter objectifId) {
        this.objectifId = objectifId;
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
        final IndicatorCriteria that = (IndicatorCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(expectedResultNumber, that.expectedResultNumber) &&
            Objects.equals(resultUnity, that.resultUnity) &&
            Objects.equals(label, that.label) &&
            Objects.equals(question, that.question) &&
            Objects.equals(resultEditableByActor, that.resultEditableByActor) &&
            Objects.equals(numberResult, that.numberResult) &&
            Objects.equals(percentResult, that.percentResult) &&
            Objects.equals(resultAppreciation, that.resultAppreciation) &&
            Objects.equals(averagePercentage, that.averagePercentage) &&
            Objects.equals(ponderation, that.ponderation) &&
            Objects.equals(typeindicatorId, that.typeindicatorId) &&
            Objects.equals(objectifId, that.objectifId) &&
            Objects.equals(parentId, that.parentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        expectedResultNumber,
        resultUnity,
        label,
        question,
        resultEditableByActor,
        numberResult,
        percentResult,
        resultAppreciation,
        averagePercentage,
        ponderation,
        typeindicatorId,
        objectifId,
        parentId
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "IndicatorCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (expectedResultNumber != null ? "expectedResultNumber=" + expectedResultNumber + ", " : "") +
                (resultUnity != null ? "resultUnity=" + resultUnity + ", " : "") +
                (label != null ? "label=" + label + ", " : "") +
                (question != null ? "question=" + question + ", " : "") +
                (resultEditableByActor != null ? "resultEditableByActor=" + resultEditableByActor + ", " : "") +
                (numberResult != null ? "numberResult=" + numberResult + ", " : "") +
                (percentResult != null ? "percentResult=" + percentResult + ", " : "") +
                (resultAppreciation != null ? "resultAppreciation=" + resultAppreciation + ", " : "") +
                (averagePercentage != null ? "averagePercentage=" + averagePercentage + ", " : "") +
                (ponderation != null ? "ponderation=" + ponderation + ", " : "") +
                (typeindicatorId != null ? "typeindicatorId=" + typeindicatorId + ", " : "") +
                (objectifId != null ? "objectifId=" + objectifId + ", " : "") +
                (parentId != null ? "parentId=" + parentId + ", " : "") +
            "}";
    }

}
