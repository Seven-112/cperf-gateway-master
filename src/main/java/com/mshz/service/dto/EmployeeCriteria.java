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
import io.github.jhipster.service.filter.LocalDateFilter;

/**
 * Criteria class for the {@link com.mshz.domain.Employee} entity. This class is used
 * in {@link com.mshz.web.rest.EmployeeResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /employees?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class EmployeeCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter firstName;

    private StringFilter lastName;

    private StringFilter email;

    private StringFilter phoneNumber;

    private FloatFilter salary;

    private LocalDateFilter hireDate;

    private LongFilter managerId;

    private LongFilter photoId;

    private StringFilter photoName;

    private LongFilter departmentId;

    private LongFilter fonctionId;

    public EmployeeCriteria() {
    }

    public EmployeeCriteria(EmployeeCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.firstName = other.firstName == null ? null : other.firstName.copy();
        this.lastName = other.lastName == null ? null : other.lastName.copy();
        this.email = other.email == null ? null : other.email.copy();
        this.phoneNumber = other.phoneNumber == null ? null : other.phoneNumber.copy();
        this.salary = other.salary == null ? null : other.salary.copy();
        this.hireDate = other.hireDate == null ? null : other.hireDate.copy();
        this.managerId = other.managerId == null ? null : other.managerId.copy();
        this.photoId = other.photoId == null ? null : other.photoId.copy();
        this.photoName = other.photoName == null ? null : other.photoName.copy();
        this.departmentId = other.departmentId == null ? null : other.departmentId.copy();
        this.fonctionId = other.fonctionId == null ? null : other.fonctionId.copy();
    }

    @Override
    public EmployeeCriteria copy() {
        return new EmployeeCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getFirstName() {
        return firstName;
    }

    public void setFirstName(StringFilter firstName) {
        this.firstName = firstName;
    }

    public StringFilter getLastName() {
        return lastName;
    }

    public void setLastName(StringFilter lastName) {
        this.lastName = lastName;
    }

    public StringFilter getEmail() {
        return email;
    }

    public void setEmail(StringFilter email) {
        this.email = email;
    }

    public StringFilter getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(StringFilter phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public FloatFilter getSalary() {
        return salary;
    }

    public void setSalary(FloatFilter salary) {
        this.salary = salary;
    }

    public LocalDateFilter getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDateFilter hireDate) {
        this.hireDate = hireDate;
    }

    public LongFilter getManagerId() {
        return managerId;
    }

    public void setManagerId(LongFilter managerId) {
        this.managerId = managerId;
    }

    public LongFilter getPhotoId() {
        return photoId;
    }

    public void setPhotoId(LongFilter photoId) {
        this.photoId = photoId;
    }

    public StringFilter getPhotoName() {
        return photoName;
    }

    public void setPhotoName(StringFilter photoName) {
        this.photoName = photoName;
    }

    public LongFilter getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(LongFilter departmentId) {
        this.departmentId = departmentId;
    }

    public LongFilter getFonctionId() {
        return fonctionId;
    }

    public void setFonctionId(LongFilter fonctionId) {
        this.fonctionId = fonctionId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final EmployeeCriteria that = (EmployeeCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(firstName, that.firstName) &&
            Objects.equals(lastName, that.lastName) &&
            Objects.equals(email, that.email) &&
            Objects.equals(phoneNumber, that.phoneNumber) &&
            Objects.equals(salary, that.salary) &&
            Objects.equals(hireDate, that.hireDate) &&
            Objects.equals(managerId, that.managerId) &&
            Objects.equals(photoId, that.photoId) &&
            Objects.equals(photoName, that.photoName) &&
            Objects.equals(departmentId, that.departmentId) &&
            Objects.equals(fonctionId, that.fonctionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        firstName,
        lastName,
        email,
        phoneNumber,
        salary,
        hireDate,
        managerId,
        photoId,
        photoName,
        departmentId,
        fonctionId
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EmployeeCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (firstName != null ? "firstName=" + firstName + ", " : "") +
                (lastName != null ? "lastName=" + lastName + ", " : "") +
                (email != null ? "email=" + email + ", " : "") +
                (phoneNumber != null ? "phoneNumber=" + phoneNumber + ", " : "") +
                (salary != null ? "salary=" + salary + ", " : "") +
                (hireDate != null ? "hireDate=" + hireDate + ", " : "") +
                (managerId != null ? "managerId=" + managerId + ", " : "") +
                (photoId != null ? "photoId=" + photoId + ", " : "") +
                (photoName != null ? "photoName=" + photoName + ", " : "") +
                (departmentId != null ? "departmentId=" + departmentId + ", " : "") +
                (fonctionId != null ? "fonctionId=" + fonctionId + ", " : "") +
            "}";
    }

}
