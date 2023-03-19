import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITypeObjectif } from 'app/shared/model/type-objectif.model';
import { getEntities as getTypeObjectifs } from 'app/entities/type-objectif/type-objectif.reducer';
import { IFonction } from 'app/shared/model/fonction.model';
import { getEntities as getFonctions } from 'app/entities/fonction/fonction.reducer';
import { IDepartment } from 'app/shared/model/department.model';
import { getEntities as getDepartments } from 'app/entities/department/department.reducer';
import { IEmployee } from 'app/shared/model/employee.model';
import { getEntities as getEmployees } from 'app/entities/employee/employee.reducer';
import { getEntities as getObjectifs } from 'app/entities/objectif/objectif.reducer';
import { getEntity, updateEntity, createEntity, reset } from './objectif.reducer';
import { IObjectif } from 'app/shared/model/objectif.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IObjectifUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ObjectifUpdate = (props: IObjectifUpdateProps) => {
  const [typeObjectifId, setTypeObjectifId] = useState('0');
  const [fonctionId, setFonctionId] = useState('0');
  const [departmentId, setDepartmentId] = useState('0');
  const [employeeId, setEmployeeId] = useState('0');
  const [parentId, setParentId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { objectifEntity, typeObjectifs, fonctions, departments, employees, objectifs, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/objectif' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTypeObjectifs();
    props.getFonctions();
    props.getDepartments();
    props.getEmployees();
    props.getObjectifs();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.createdAt = convertDateTimeToServer(values.createdAt);

    if (errors.length === 0) {
      const entity = {
        ...objectifEntity,
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
          <h2 id="microgatewayApp.objectif.home.createOrEditLabel">
            <Translate contentKey="microgatewayApp.objectif.home.createOrEditLabel">Create or edit a Objectif</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : objectifEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="objectif-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="objectif-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="objectif-name">
                  <Translate contentKey="microgatewayApp.objectif.name">Name</Translate>
                </Label>
                <AvField
                  id="objectif-name"
                  type="text"
                  name="name"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="delayLabel" for="objectif-delay">
                  <Translate contentKey="microgatewayApp.objectif.delay">Delay</Translate>
                </Label>
                <AvField id="objectif-delay" type="string" className="form-control" name="delay" />
              </AvGroup>
              <AvGroup>
                <Label id="createdAtLabel" for="objectif-createdAt">
                  <Translate contentKey="microgatewayApp.objectif.createdAt">Created At</Translate>
                </Label>
                <AvInput
                  id="objectif-createdAt"
                  type="datetime-local"
                  className="form-control"
                  name="createdAt"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.objectifEntity.createdAt)}
                />
              </AvGroup>
              <AvGroup>
                <Label id="categorieLabel" for="objectif-categorie">
                  <Translate contentKey="microgatewayApp.objectif.categorie">Categorie</Translate>
                </Label>
                <AvInput
                  id="objectif-categorie"
                  type="select"
                  className="form-control"
                  name="categorie"
                  value={(!isNew && objectifEntity.categorie) || 'FONCTIONAL'}
                >
                  <option value="FONCTIONAL">{translate('microgatewayApp.ObjectifCategorie.FONCTIONAL')}</option>
                  <option value="COLLECTIVE">{translate('microgatewayApp.ObjectifCategorie.COLLECTIVE')}</option>
                  <option value="INDIVIDUAL">{translate('microgatewayApp.ObjectifCategorie.INDIVIDUAL')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="averagePercentageLabel" for="objectif-averagePercentage">
                  <Translate contentKey="microgatewayApp.objectif.averagePercentage">Average Percentage</Translate>
                </Label>
                <AvField id="objectif-averagePercentage" type="string" className="form-control" name="averagePercentage" />
              </AvGroup>
              <AvGroup>
                <Label id="ponderationLabel" for="objectif-ponderation">
                  <Translate contentKey="microgatewayApp.objectif.ponderation">Ponderation</Translate>
                </Label>
                <AvField id="objectif-ponderation" type="string" className="form-control" name="ponderation" />
              </AvGroup>
              <AvGroup check>
                <Label id="realizedLabel">
                  <AvInput id="objectif-realized" type="checkbox" className="form-check-input" name="realized" />
                  <Translate contentKey="microgatewayApp.objectif.realized">Realized</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="objectif-typeObjectif">
                  <Translate contentKey="microgatewayApp.objectif.typeObjectif">Type Objectif</Translate>
                </Label>
                <AvInput id="objectif-typeObjectif" type="select" className="form-control" name="typeObjectif.id">
                  <option value="" key="0" />
                  {typeObjectifs
                    ? typeObjectifs.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="objectif-fonction">
                  <Translate contentKey="microgatewayApp.objectif.fonction">Fonction</Translate>
                </Label>
                <AvInput id="objectif-fonction" type="select" className="form-control" name="fonction.id">
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
              <AvGroup>
                <Label for="objectif-department">
                  <Translate contentKey="microgatewayApp.objectif.department">Department</Translate>
                </Label>
                <AvInput id="objectif-department" type="select" className="form-control" name="department.id">
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
                <Label for="objectif-employee">
                  <Translate contentKey="microgatewayApp.objectif.employee">Employee</Translate>
                </Label>
                <AvInput id="objectif-employee" type="select" className="form-control" name="employee.id">
                  <option value="" key="0" />
                  {employees
                    ? employees.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="objectif-parent">
                  <Translate contentKey="microgatewayApp.objectif.parent">Parent</Translate>
                </Label>
                <AvInput id="objectif-parent" type="select" className="form-control" name="parent.id">
                  <option value="" key="0" />
                  {objectifs
                    ? objectifs.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/objectif" replace color="info">
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
  typeObjectifs: storeState.typeObjectif.entities,
  fonctions: storeState.fonction.entities,
  departments: storeState.department.entities,
  employees: storeState.employee.entities,
  objectifs: storeState.objectif.entities,
  objectifEntity: storeState.objectif.entity,
  loading: storeState.objectif.loading,
  updating: storeState.objectif.updating,
  updateSuccess: storeState.objectif.updateSuccess,
});

const mapDispatchToProps = {
  getTypeObjectifs,
  getFonctions,
  getDepartments,
  getEmployees,
  getObjectifs,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ObjectifUpdate);
