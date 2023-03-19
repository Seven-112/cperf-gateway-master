import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './employee.reducer';
import { IEmployee } from 'app/shared/model/employee.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IEmployeeDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const EmployeeDetail = (props: IEmployeeDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { employeeEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.employee.detail.title">Employee</Translate> [<b>{employeeEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="firstName">
              <Translate contentKey="microgatewayApp.employee.firstName">First Name</Translate>
            </span>
          </dt>
          <dd>{employeeEntity.firstName}</dd>
          <dt>
            <span id="lastName">
              <Translate contentKey="microgatewayApp.employee.lastName">Last Name</Translate>
            </span>
          </dt>
          <dd>{employeeEntity.lastName}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="microgatewayApp.employee.email">Email</Translate>
            </span>
          </dt>
          <dd>{employeeEntity.email}</dd>
          <dt>
            <span id="phoneNumber">
              <Translate contentKey="microgatewayApp.employee.phoneNumber">Phone Number</Translate>
            </span>
          </dt>
          <dd>{employeeEntity.phoneNumber}</dd>
          <dt>
            <span id="salary">
              <Translate contentKey="microgatewayApp.employee.salary">Salary</Translate>
            </span>
          </dt>
          <dd>{employeeEntity.salary}</dd>
          <dt>
            <span id="hireDate">
              <Translate contentKey="microgatewayApp.employee.hireDate">Hire Date</Translate>
            </span>
          </dt>
          <dd>
            {employeeEntity.hireDate ? <TextFormat value={employeeEntity.hireDate} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="managerId">
              <Translate contentKey="microgatewayApp.employee.managerId">Manager Id</Translate>
            </span>
          </dt>
          <dd>{employeeEntity.managerId}</dd>
          <dt>
            <span id="path">
              <Translate contentKey="microgatewayApp.employee.path">Path</Translate>
            </span>
          </dt>
          <dd>{employeeEntity.path}</dd>
          <dt>
            <span id="photoId">
              <Translate contentKey="microgatewayApp.employee.photoId">Photo Id</Translate>
            </span>
          </dt>
          <dd>{employeeEntity.photoId}</dd>
          <dt>
            <span id="photoName">
              <Translate contentKey="microgatewayApp.employee.photoName">Photo Name</Translate>
            </span>
          </dt>
          <dd>{employeeEntity.photoName}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.employee.department">Department</Translate>
          </dt>
          <dd>{employeeEntity.department ? employeeEntity.department.id : ''}</dd>
          <dt>
            <Translate contentKey="microgatewayApp.employee.fonction">Fonction</Translate>
          </dt>
          <dd>{employeeEntity.fonction ? employeeEntity.fonction.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/employee" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/employee/${employeeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ employee }: IRootState) => ({
  employeeEntity: employee.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetail);
