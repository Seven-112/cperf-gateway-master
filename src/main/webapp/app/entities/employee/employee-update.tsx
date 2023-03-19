import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getDepartments } from 'app/entities/department/department.reducer';
import { getEntities as getFonctions } from 'app/entities/fonction/fonction.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './employee.reducer';

export interface IEmployeeUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EmployeeUpdate = (props: IEmployeeUpdateProps) => {
  const [departmentId, setDepartmentId] = useState('0');
  const [fonctionId, setFonctionId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { employeeEntity, departments, fonctions, loading, updating } = props;

  const { path } = employeeEntity;

  const handleClose = () => {
    props.history.push('/employee' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getDepartments();
    props.getFonctions();
  }, []);



  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...employeeEntity,
        ...values,
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="microgatewayApp.employee.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.employee.home.createOrEditLabel">Create or edit a Employee</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : employeeEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="employee-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="employee-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="firstNameLabel" for="employee-firstName">
                  <Translate contentKey="microgatewayApp.employee.firstName">First Name</Translate>
                </Label>
                <AvField id="employee-firstName" type="text" name="firstName" />
              </AvGroup>
              <AvGroup>
                <Label id="lastNameLabel" for="employee-lastName">
                  <Translate contentKey="microgatewayApp.employee.lastName">Last Name</Translate>
                </Label>
                <AvField id="employee-lastName" type="text" name="lastName" />
              </AvGroup>
              <AvGroup>
                <Label id="emailLabel" for="employee-email">
                  <Translate contentKey="microgatewayApp.employee.email">Email</Translate>
                </Label>
                <AvField id="employee-email" type="text" name="email" />
              </AvGroup>
              <AvGroup>
                <Label id="phoneNumberLabel" for="employee-phoneNumber">
                  <Translate contentKey="microgatewayApp.employee.phoneNumber">Phone Number</Translate>
                </Label>
                <AvField
                  id="employee-phoneNumber"
                  type="text"
                  name="phoneNumber"
                  validate={{
                    maxLength: { value: 15, errorMessage: translate('entity.validation.maxlength', { max: 15 }) },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="salaryLabel" for="employee-salary">
                  <Translate contentKey="microgatewayApp.employee.salary">Salary</Translate>
                </Label>
                <AvField id="employee-salary" type="string" className="form-control" name="salary" />
              </AvGroup>
              <AvGroup>
                <Label id="hireDateLabel" for="employee-hireDate">
                  <Translate contentKey="microgatewayApp.employee.hireDate">Hire Date</Translate>
                </Label>
                <AvField id="employee-hireDate" type="date" className="form-control" name="hireDate" />
              </AvGroup>
              <AvGroup>
                <Label id="managerIdLabel" for="employee-managerId">
                  <Translate contentKey="microgatewayApp.employee.managerId">Manager Id</Translate>
                </Label>
                <AvField id="employee-managerId" type="string" className="form-control" name="managerId" />
              </AvGroup>
              <AvGroup>
                <Label id="pathLabel" for="employee-path">
                  <Translate contentKey="microgatewayApp.employee.path">Path</Translate>
                </Label>
                <AvInput id="employee-path" type="textarea" name="path" />
              </AvGroup>
              <AvGroup>
                <Label id="photoIdLabel" for="employee-photoId">
                  <Translate contentKey="microgatewayApp.employee.photoId">Photo Id</Translate>
                </Label>
                <AvField id="employee-photoId" type="string" className="form-control" name="photoId" />
              </AvGroup>
              <AvGroup>
                <Label id="photoNameLabel" for="employee-photoName">
                  <Translate contentKey="microgatewayApp.employee.photoName">Photo Name</Translate>
                </Label>
                <AvField id="employee-photoName" type="text" name="photoName" />
              </AvGroup>
              <AvGroup>
                <Label for="employee-department">
                  <Translate contentKey="microgatewayApp.employee.department">Department</Translate>
                </Label>
                <AvInput id="employee-department" type="select" className="form-control" name="department.id">
                  <option value="" key="0" />
                  {departments
                    ? departments.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="employee-fonction">
                  <Translate contentKey="microgatewayApp.employee.fonction">Fonction</Translate>
                </Label>
                <AvInput id="employee-fonction" type="select" className="form-control" name="fonction.id">
                  <option value="" key="0" />
                  {fonctions
                    ? fonctions.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/employee" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  departments: storeState.department.entities,
  fonctions: storeState.fonction.entities,
  employeeEntity: storeState.employee.entity,
  loading: storeState.employee.loading,
  updating: storeState.employee.updating,
  updateSuccess: storeState.employee.updateSuccess,
});

const mapDispatchToProps = {
  getDepartments,
  getFonctions,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeUpdate);
