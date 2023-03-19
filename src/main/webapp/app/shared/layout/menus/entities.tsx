import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate, translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="asterisk" to="/notification">
      <Translate contentKey="global.menu.entities.microstreamNotification" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/model-entity">
      <Translate contentKey="global.menu.entities.modelEntity" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/privilege">
      <Translate contentKey="global.menu.entities.privilege" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/taskfile">
      <Translate contentKey="global.menu.entities.microprocessTaskfile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/task-user">
      <Translate contentKey="global.menu.entities.microprocessTaskUser" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/task-validation-control">
      <Translate contentKey="global.menu.entities.microprocessTaskValidationControl" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/risk">
      <Translate contentKey="global.menu.entities.microrisqueRisk" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/risk-type">
      <Translate contentKey="global.menu.entities.microrisqueRiskType" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/control-type">
      <Translate contentKey="global.menu.entities.microrisqueControlType" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/control-maturity">
      <Translate contentKey="global.menu.entities.microrisqueControlMaturity" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/control">
      <Translate contentKey="global.menu.entities.microrisqueControl" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/notification">
      <Translate contentKey="global.menu.entities.notification" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/partener-category">
      <Translate contentKey="global.menu.entities.micropartenerPartenerCategory" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/field">
      <Translate contentKey="global.menu.entities.micropartenerField" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/partener">
      <Translate contentKey="global.menu.entities.micropartenerPartener" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/partener-field">
      <Translate contentKey="global.menu.entities.micropartenerPartenerField" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender">
      <Translate contentKey="global.menu.entities.microproviderTender" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-doc">
      <Translate contentKey="global.menu.entities.microproviderTenderDoc" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-answer">
      <Translate contentKey="global.menu.entities.microproviderTenderAnswer" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-file">
      <Translate contentKey="global.menu.entities.microproviderTenderFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-answer-doc">
      <Translate contentKey="global.menu.entities.microproviderTenderAnswerDoc" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/evaluation-criteria">
      <Translate contentKey="global.menu.entities.micropartenerEvaluationCriteria" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/partener-category-evaluator">
      <Translate contentKey="global.menu.entities.micropartenerPartenerCategoryEvaluator" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/provider-evaluation">
      <Translate contentKey="global.menu.entities.microproviderProviderEvaluation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/user-extra">
      <Translate contentKey="global.menu.entities.userExtra" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/partener-category-validator">
      <Translate contentKey="global.menu.entities.micropartenerPartenerCategoryValidator" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-answer-validation">
      <Translate contentKey="global.menu.entities.microproviderTenderAnswerValidation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-provider-selection">
      <Translate contentKey="global.menu.entities.microproviderTenderProviderSelection" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-provider-selection-validation">
      <Translate contentKey="global.menu.entities.microproviderTenderProviderSelectionValidation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-answer-execution">
      <Translate contentKey="global.menu.entities.microproviderTenderAnswerExecution" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/execution-validation">
      <Translate contentKey="global.menu.entities.microproviderExecutionValidation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/execution-validation-file">
      <Translate contentKey="global.menu.entities.microproviderExecutionValidationFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-answer-execution-file">
      <Translate contentKey="global.menu.entities.microproviderTenderAnswerExecutionFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-execution-evaluation">
      <Translate contentKey="global.menu.entities.microproviderTenderExecutionEvaluation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/field-file">
      <Translate contentKey="global.menu.entities.micropartenerFieldFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/partener-field-file">
      <Translate contentKey="global.menu.entities.micropartenerPartenerFieldFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/provider-expedition">
      <Translate contentKey="global.menu.entities.microproviderProviderExpedition" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/dynamic-field">
      <Translate contentKey="global.menu.entities.dynamicField" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-field">
      <Translate contentKey="global.menu.entities.microproviderTenderField" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-answer-field">
      <Translate contentKey="global.menu.entities.microproviderTenderAnswerField" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/provider-execution-average">
      <Translate contentKey="global.menu.entities.microproviderProviderExecutionAverage" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/cond-node">
      <Translate contentKey="global.menu.entities.microprocessCondNode" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/task-status-traking">
      <Translate contentKey="global.menu.entities.microprocessTaskStatusTraking" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/task-status-traking-file">
      <Translate contentKey="global.menu.entities.microprocessTaskStatusTrakingFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/process-category">
      <Translate contentKey="global.menu.entities.microprocessProcessCategory" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query">
      <Translate contentKey="global.menu.entities.qmanagerQuery" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-user">
      <Translate contentKey="global.menu.entities.qmanagerQueryUser" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-field">
      <Translate contentKey="global.menu.entities.qmanagerQueryField" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-field-response">
      <Translate contentKey="global.menu.entities.qmanagerQueryFieldResponse" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-field-response-file">
      <Translate contentKey="global.menu.entities.qmanagerQueryFieldResponseFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-user-validator">
      <Translate contentKey="global.menu.entities.qmanagerQueryUserValidator" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-client-type">
      <Translate contentKey="global.menu.entities.qmanagerQueryClientType" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-client">
      <Translate contentKey="global.menu.entities.qmanagerQueryClient" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/q-category">
      <Translate contentKey="global.menu.entities.qmanagerQCategory" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-file">
      <Translate contentKey="global.menu.entities.qmanagerQueryFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-instance">
      <Translate contentKey="global.menu.entities.qmanagerQueryInstance" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-instance-validation">
      <Translate contentKey="global.menu.entities.qmanagerQueryInstanceValidation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/query-instance-validation-file">
      <Translate contentKey="global.menu.entities.qmanagerQueryInstanceValidationFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/agenda-event">
      <Translate contentKey="global.menu.entities.microagendaAgendaEvent" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/event-file">
      <Translate contentKey="global.menu.entities.microagendaEventFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/event-participant">
      <Translate contentKey="global.menu.entities.microagendaEventParticipant" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/event-exeption">
      <Translate contentKey="global.menu.entities.microagendaEventExeption" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/event-trigger">
      <Translate contentKey="global.menu.entities.microprocessEventTrigger" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/task-item">
      <Translate contentKey="global.menu.entities.microprocessTaskItem" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/item-check-justification-file">
      <Translate contentKey="global.menu.entities.microprocessItemCheckJustificationFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/item-check-justification">
      <Translate contentKey="global.menu.entities.microprocessItemCheckJustification" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/level">
      <Translate contentKey="global.menu.entities.microprojectLevel" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-edge-info">
      <Translate contentKey="global.menu.entities.microprojectProjectEdgeInfo" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-event-trigger">
      <Translate contentKey="global.menu.entities.microprojectProjectEventTrigger" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-item-check-justification">
      <Translate contentKey="global.menu.entities.microprojectProjectItemCheckJustification" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-item-check-justification-file">
      <Translate contentKey="global.menu.entities.microprojectProjectItemCheckJustificationFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-process">
      <Translate contentKey="global.menu.entities.microprojectProjectProcess" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-public-holiday">
      <Translate contentKey="global.menu.entities.microprojectProjectPublicHoliday" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-task">
      <Translate contentKey="global.menu.entities.microprojectProjectTask" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-task-file">
      <Translate contentKey="global.menu.entities.microprojectProjectTaskFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-task-item">
      <Translate contentKey="global.menu.entities.microprojectProjectTaskItem" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-task-status-traking">
      <Translate contentKey="global.menu.entities.microprojectProjectTaskStatusTraking" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-task-status-traking-file">
      <Translate contentKey="global.menu.entities.microprojectProjectTaskStatusTrakingFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-task-submission">
      <Translate contentKey="global.menu.entities.microprojectProjectTaskSubmission" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-task-user">
      <Translate contentKey="global.menu.entities.microprojectProjectTaskUser" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-task-validation-control">
      <Translate contentKey="global.menu.entities.microprojectProjectTaskValidationControl" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project">
      <Translate contentKey="global.menu.entities.microprojectProject" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-category">
      <Translate contentKey="global.menu.entities.microprojectProjectCategory" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-calendar">
      <Translate contentKey="global.menu.entities.microprojectProjectCalendar" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-cond-node">
      <Translate contentKey="global.menu.entities.microprojectProjectCondNode" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-file">
      <Translate contentKey="global.menu.entities.microprojectProjectFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-comment">
      <Translate contentKey="global.menu.entities.microprojectProjectComment" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-comment-file">
      <Translate contentKey="global.menu.entities.microprojectProjectCommentFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/tender-provider">
      <Translate contentKey="global.menu.entities.microproviderTenderProvider" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/equipement">
      <Translate contentKey="global.menu.entities.microstockEquipement" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/engeneering">
      <Translate contentKey="global.menu.entities.microstockEngeneering" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/consommable">
      <Translate contentKey="global.menu.entities.microstockConsommable" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/changement">
      <Translate contentKey="global.menu.entities.microstockChangement" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/approvisionnement">
      <Translate contentKey="global.menu.entities.microstockApprovisionnement" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/process-category-user">
      <Translate contentKey="global.menu.entities.microprocessProcessCategoryUser" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/user-file">
      <Translate contentKey="global.menu.entities.userFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/audit">
      <Translate contentKey="global.menu.entities.microrisqueAudit" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/audit-user">
      <Translate contentKey="global.menu.entities.microrisqueAuditUser" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/audit-status-traking">
      <Translate contentKey="global.menu.entities.microrisqueAuditStatusTraking" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/audit-status-traking-file">
      <Translate contentKey="global.menu.entities.microrisqueAuditStatusTrakingFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/audit-recommendation-file">
      <Translate contentKey="global.menu.entities.microrisqueAuditRecommendationFile" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/audit-recommendation">
      <Translate contentKey="global.menu.entities.microrisqueAuditRecommendation" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/audit-cycle">
      <Translate contentKey="global.menu.entities.microrisqueAuditCycle" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/audit-recom-user">
      <Translate contentKey="global.menu.entities.microrisqueAuditRecomUser" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/project-startable-task">
      <Translate contentKey="global.menu.entities.microprojectProjectStartableTask" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/q-ponctual-task-info">
      <Translate contentKey="global.menu.entities.qmanagerQPonctualTaskInfo" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/audit-event-trigger">
      <Translate contentKey="global.menu.entities.microrisqueAuditEventTrigger" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/kpi">
      <Translate contentKey="global.menu.entities.microprocessKpi" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
