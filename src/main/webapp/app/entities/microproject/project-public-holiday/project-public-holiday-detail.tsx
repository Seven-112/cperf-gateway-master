import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './project-public-holiday.reducer';
import { IProjectPublicHoliday } from 'app/shared/model/microproject/project-public-holiday.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IProjectPublicHolidayDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ProjectPublicHolidayDetail = (props: IProjectPublicHolidayDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { projectPublicHolidayEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.detail.title">ProjectPublicHoliday</Translate> [
          <b>{projectPublicHolidayEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.name">Name</Translate>
            </span>
          </dt>
          <dd>{projectPublicHolidayEntity.name}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.date">Date</Translate>
            </span>
          </dt>
          <dd>
            {projectPublicHolidayEntity.date ? (
              <TextFormat value={projectPublicHolidayEntity.date} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="levelId">
              <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.levelId">Level Id</Translate>
            </span>
          </dt>
          <dd>{projectPublicHolidayEntity.levelId}</dd>
          <dt>
            <span id="processId">
              <Translate contentKey="microgatewayApp.microprojectProjectPublicHoliday.processId">Process Id</Translate>
            </span>
          </dt>
          <dd>{projectPublicHolidayEntity.processId}</dd>
        </dl>
        <Button tag={Link} to="/project-public-holiday" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/project-public-holiday/${projectPublicHolidayEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ projectPublicHoliday }: IRootState) => ({
  projectPublicHolidayEntity: projectPublicHoliday.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPublicHolidayDetail);
