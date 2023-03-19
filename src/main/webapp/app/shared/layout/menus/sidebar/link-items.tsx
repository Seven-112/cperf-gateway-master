import React from 'react';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import DomainIcon from '@material-ui/icons/Domain';
import PeopleIcon from '@material-ui/icons/People';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faBoxes, faBullseye, faCalendarAlt, faChartPie, faCheckCircle, faChevronCircleUp, faCircleNotch, faDolly, faFileAlt, faFlag, faGlasses, faHandshake, faPen, faSitemap, faTachometerAlt, faTasks, faUser, faUsersCog, faUserShield } from '@fortawesome/free-solid-svg-icons';
import SettingsIcon from '@material-ui/icons/Settings';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { AssignmentInd, BugReport, Dashboard, Explore, NaturePeople, Update } from '@material-ui/icons';
import { IAuthPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { AUTHORITIES } from 'app/config/constants';
import { SetupService } from 'app/config/service-setup-config';

export const SIDEBAR_LINK_NAMES = {
    TENDER: "tender",
    PROVIDER_EXPEDITION: "ProviderExpedition",
    ProviderExecutionAverage: "ProviderExecutionAverage",
    AGENDA: "agenda"
}

export interface ILinkItem{
    name: string,
    path: string,
    label: string,
    icon ?: any,
    subitem ?: boolean,
    enable ?: boolean,
    active ?: boolean,
    translateLabelName?: string,
    hasAuthorities?:string[],
    hasPrivileges?: IAuthPrivileges,
    apiService?: SetupService,
    childs? : ILinkItem[],
    activePaths?: string[]

}

export const SIDEBAR_LINK_ITEMS: ILinkItem[] = [
   {
        name: "dashbord", 
        label : "Dashbord",
        path :"/",
        icon: <Dashboard fontSize="small"/>,
        active: true,
        translateLabelName: "global.dashbord",
    },
    {
        name: "rh", 
        label : "RH",
        path :"#RH",
        icon: <AccessibilityIcon fontSize="small"/>, 
        translateLabelName: "global.grh",
        hasPrivileges: {entities: ["Employee","Department"],actions: [PrivilegeAction.ALL]},
        childs: [
            { 
                name: "department", 
                label : "Department",
                path :"/department",
                icon: <DomainIcon fontSize="small"/>,
                translateLabelName: "microgatewayApp.micropeopleDepartment.home.title",
                hasPrivileges: {entities: ["Department"], actions: [PrivilegeAction.ALL]},
                activePaths: ["/department"]
            },
            {
                name: "peaple", 
                label : "Employe",
                path :"/employee",
                icon: <PeopleIcon fontSize="small"/>,
                translateLabelName: "global.menu.entities.micropeopleEmployee",
                hasPrivileges: {entities: ["Employee"], actions: [PrivilegeAction.ALL]},
                activePaths: ["/employee"] 
            },
            {
                name: "peopleorg", 
                label : "Organigram",
                path :"/employee/organigram",
                icon: <FontAwesomeIcon icon={faSitemap} fontSize="small"/>,
                translateLabelName: "_global.employeeOrg.menu.index",
                hasPrivileges: {entities: ["Organigram"],actions: [PrivilegeAction.ALL]}, 
                activePaths: ["/employee/organigram"]
            },
        ]
    },
    {
        name: "process", 
        label : "Process",
        path :"/process",
        icon: <FontAwesomeIcon icon={faSitemap} fontSize="small" />,
        translateLabelName: "microgatewayApp.microprocessProcess.home.title", 
        apiService: SetupService.PROCESS,
        activePaths: ["/process"],
    },
    {
        name: "audites", 
        label : "Audites",
        path :"#",
        icon: <FontAwesomeIcon icon={faCheckCircle} fontSize="small" />,
        translateLabelName: "microgatewayApp.microrisqueAudit.home.title", 
        apiService: SetupService.AUDIT,
        hasPrivileges: { entities: ['Audit'], actions: [PrivilegeAction.ALL]},
        childs: [
            {
                name: "audites-cycles", 
                label : "Cycles",
                path :"/audit-cycle",
                icon: <FontAwesomeIcon icon={faCircleNotch} fontSize="small" />,
                translateLabelName: "microgatewayApp.microrisqueAuditCycle.home.title",
                activePaths: ["/audit-cycle"]
            },
            {
                name: "audites-controls", 
                label : "Controls plan",
                path :"/audit",
                icon: <FontAwesomeIcon icon={faGlasses} fontSize="small" />,
                translateLabelName: "_global.label.controls.plan",
                activePaths: ['/audit'],
            }, 
            {
                name: "all-recommendations", 
                label : "All recommendations",
                path :"/audit-recommendation",
                icon: <FontAwesomeIcon icon={faFlag} fontSize="small" />,
                translateLabelName: "microgatewayApp.microrisqueAuditRecommendation.home.title",
                activePaths: ['/audit-recommendation'],
            },
        ]
    },
    /* {
        name: "procedure", 
        label : "Procédures",
        path :"/procedure",
        icon: <FontAwesomeIcon icon={faFileAlt}/>,
        translateLabelName: "microgatewayApp.microprocessProcedure.home.title",
        hasPrivileges: {entities: ["Procedure"],actions: [PrivilegeAction.ALL]},
        apiService: SetupService.PROCESS,
        activePaths: ["/procedure"] 
    }, */
    {
        name: "project", 
        label : "Projects",
        path :"/project",
        icon: <FontAwesomeIcon icon={faTasks} fontSize="small"/>,
        translateLabelName: "_global.label.projects",
        activePaths: ["/project"],
        apiService: SetupService.PROJECT,
    },
    {
        name: "ges-stock", 
        label : "GES-STOCK",
        path :"#ges-stock",
        icon: <AccessibilityIcon fontSize="small"/>, 
        translateLabelName: "_global.label.gStock",
        hasPrivileges: {entities: ["Equipement","Consommable","Changement"],actions: [PrivilegeAction.ALL]},
        apiService: SetupService.STOCK,
        childs: [
              
            {
                name: "equipement", 
                label : "Equipement",
                path :"/equipement",
                icon: <PeopleIcon fontSize="small"/>,
                translateLabelName: "microgatewayApp.microstockEquipement.home.title",
                hasPrivileges: {entities: ["Equipement"], actions: [PrivilegeAction.ALL]},
                activePaths: ["/equipement"],
                apiService: SetupService.STOCK,
            },
            {
                name: "consommable", 
                label : "Consommable",
                path :"/consommable",
                icon: <PeopleIcon fontSize="small"/>,
                translateLabelName: "microgatewayApp.microstockConsommable.home.title",
                hasPrivileges: {entities: ["Consommable"],actions: [PrivilegeAction.ALL]}, 
                activePaths: ["/consommable"],
                apiService: SetupService.STOCK,
            },

            {
                name: "changement", 
                label : "Changement",
                path :"/changement",
                icon: <PeopleIcon fontSize="small"/>,
                translateLabelName: "microgatewayApp.microstockChangement.home.title",
                hasPrivileges: {entities: ["Changement"],actions: [PrivilegeAction.ALL]}, 
                activePaths: ["/changement"],
                apiService: SetupService.STOCK,
            },

            // {
            //     name: "engeneering", 
            //     label : "Engeneering",
            //     path :"/engeneering",
            //     icon: <PeopleIcon fontSize="small"/>,
            //     translateLabelName: "global.menu.entities.micropeopleEngeneering",
            //     hasPrivileges: {entities: ["Engeneering"],actions: [PrivilegeAction.ALL]}, 
            //     activePaths: ["/engeneering"]
            // },
        ]
    },
    {
        name: "risks", 
        label : "Risks",
        path :"/risk",
        icon: <BugReport fontSize="small"/>,
        translateLabelName: "global.menu.entities.microrisqueRisk",
        hasPrivileges: {entities: ["Process", "Risk"],actions: [PrivilegeAction.ALL]},
        apiService: SetupService.RISK,
        activePaths: ["/risk"] 
    },
    {
        name: "objectifs", 
        label : "Objectifs",
        path :"#",
        icon: <FontAwesomeIcon icon={faBullseye}/>,
        translateLabelName: "microgatewayApp.objectif.home.title",
        apiService: SetupService.OBJECTIF,
        childs: [
            {
                name: "objectif-edition", 
                label : "Edition",
                path :"/objectif",
                icon: <FontAwesomeIcon icon={faPen}/>,
                translateLabelName: "_global.label.editing",
                hasPrivileges: {entities: ["Objectif"], actions: [PrivilegeAction.ALL]},
                activePaths: ["/objectif"]
            },
            {
                name: "objectif-dashbord", 
                label : "Indicators",
                path :"/objectif/indicator",
                icon: <FontAwesomeIcon icon={faChartPie}/>,
                translateLabelName: "microgatewayApp.indicator.home.title",
                activePaths: ["/objectif/indicator"]
            }
        ],
    },
    {
        name: "todoList", 
        label : "TodoList",
        path :"/todolist",
        icon: <FontAwesomeIcon icon={faTasks} fontSize="small"/>,
        translateLabelName: "_global.label.todoList",
        activePaths: ["/todolist"]
    },
    {
        name: "QueriesHistory", 
        label : "Queries History",
        path :"/query-instance",
        icon: <Update fontSize='small'/>,
        apiService: SetupService.QMANAGER,
        translateLabelName: "_global.label.queriesHistory",
        activePaths: ["/query-instance"]
    },
    /* {
        name: "tasks", 
        label : "Tasks",
        path :"/task",
        icon: <FontAwesomeIcon icon={faTasks} fontSize="small"/>,
        translateLabelName: "_global.label.yourTasks",
        apiService: SetupService.PROCESS,
        activePaths: ["/task"]
    },
    {
        name: "checkList", 
        label : "Checklist",
        path :"/task/check-list",
        icon: <FontAwesomeIcon icon={faTasks} fontSize="small"/>,
        translateLabelName: "_global.label.checkList",
        apiService: SetupService.PROCESS,
        activePaths: ["/task/check-list"]
    }, */
    {
        name: "employees-tasks", 
        label : "Employees Tasks",
        path :"/task/by-employee",
        icon: <AssignmentInd fontSize="small"/>,
        translateLabelName: "_global.label.tasksEmployees",
        hasPrivileges: {entities: ["Process"],actions: [PrivilegeAction.ALL]}, 
        apiService: SetupService.PROCESS,
        activePaths: ["/task/by-employee"]
    },
    {
        name: "partener", 
        label : "Parteners",
        path :"/partener-category",
        icon: <FontAwesomeIcon icon={faHandshake} fontSize="small"/>,
        translateLabelName: "microgatewayApp.micropartenerPartener.home.title",
        hasPrivileges: {entities: ["Partener"],actions: [PrivilegeAction.ALL]},
        apiService: SetupService.PARTENER,
        activePaths: ["/partener-category"]
    },
    {
        name: SIDEBAR_LINK_NAMES.TENDER, 
        label : "Tenders",
        path :"/tender",
        icon: <FontAwesomeIcon icon={faChevronCircleUp} fontSize="small"/>,
        translateLabelName: "_global.label.callTender",
        hasPrivileges: {entities: ["Tender"],actions: [PrivilegeAction.ALL]},
        hasAuthorities: [AUTHORITIES.PROVIDER, AUTHORITIES.EVALUATOR, AUTHORITIES.PROVIDER_VALIDATOR],
        apiService: SetupService.PROVIDER,
        activePaths: ["/tender"]
    },
    {
        name: SIDEBAR_LINK_NAMES.PROVIDER_EXPEDITION, 
        label : "Expédtion",
        path :"/provider-expedition",
        icon: <FontAwesomeIcon icon={faDolly} fontSize="small"/>,
        translateLabelName: "microgatewayApp.microproviderProviderExpedition.home.title",
        hasPrivileges: {entities: ["ProviderExpedition"],actions: [PrivilegeAction.ALL]},
        apiService: SetupService.PROVIDER,
        activePaths: ["/provider-expedition"]
    },
    {
        name: SIDEBAR_LINK_NAMES.ProviderExecutionAverage, 
        label : "Exeuction average",
        path :"/provider-execution-average",
        icon: <FontAwesomeIcon icon={faTachometerAlt} fontSize="small"/>,
        translateLabelName: "microgatewayApp.microproviderProviderExecutionAverage.home.title",
        hasPrivileges: {entities: ["Tender"],actions: [PrivilegeAction.ALL]},
        hasAuthorities: [AUTHORITIES.EVALUATOR, AUTHORITIES.PROVIDER_VALIDATOR],
        apiService: SetupService.PROVIDER,
        activePaths: ["/provider-execution-average"]
    },
    {
        name: SIDEBAR_LINK_NAMES.AGENDA, 
        label : "Agenda",
        path :"/agenda",
        icon: <FontAwesomeIcon icon={faCalendarAlt} fontSize="small"/>,
        translateLabelName: "_global.label.agenda",
        hasPrivileges: {entities: ["Agenda"],actions: [PrivilegeAction.ALL]},
        apiService: SetupService.AGENDA,
        activePaths: ["/agenda"]
    },
    {
        name: "appsettings", 
        label : "Settings",
        path :"#",
        icon: <SettingsIcon fontSize="small" />,
        translateLabelName: "_global.settings.title",
        hasAuthorities:[AUTHORITIES.ADMIN],
        hasPrivileges: {entities: ["Settings"],actions: [PrivilegeAction.ALL]}, 
        childs:[
            {
                name: "processes", 
                label : "Processes",
                path :"#",
                icon: <AccountTreeIcon fontSize="small"/>,
                translateLabelName: "microgatewayApp.microprocessProcess.home.title",
                hasPrivileges: {entities: ["Process"],actions: [PrivilegeAction.ALL]}, 
                apiService: SetupService.PROCESS,
                activePaths: ["/process"],
                childs:[
                    {
                        name: "workCalender", 
                        label : "Calender",
                        path :"/work-calender",
                        icon: <ScheduleIcon fontSize="small"/>,
                        translateLabelName: "microgatewayApp.workCalender.detail.title",
                        apiService: SetupService.PROCESS,
                        activePaths: ["/work-calender"]
                    },
                    {
                        name: "process-categs", 
                        label : "Categories",
                        path :"/process-category",
                        icon: <FontAwesomeIcon icon={faBoxes} fontSize="small" />,
                        translateLabelName: "microgatewayApp.microprocessProcessCategory.home.title",
                        hasPrivileges: {entities: ["Process"],actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE,PrivilegeAction.DELETE]}, 
                        apiService: SetupService.PROCESS,
                        activePaths: ["/process-category"],
                    }
                ]
                
            },
            {
                name: "projects", 
                label : "Projects Management",
                path :"#",
                icon: <FontAwesomeIcon icon={faTasks} fontSize="small"/>,
                translateLabelName: "_global.label.projects",
                apiService: SetupService.PROJECT,
                childs: [
                    {
                        name: "projectCalendar", 
                        label : "Projects Calendar",
                        path :"/project-calendar",
                        icon: <ScheduleIcon fontSize="small"/>,
                        translateLabelName: "microgatewayApp.workCalender.detail.title",
                        activePaths: ["/project-calendar"],
                        apiService: SetupService.PROJECT,
                    }
                ],
            },
            {
                name: "queryManagagement", 
                label : "Queries",
                path :"#",
                icon: <FontAwesomeIcon icon={faFileAlt}/>,
                translateLabelName: "microgatewayApp.qmanagerQuery.home.title",
                hasPrivileges: {entities: ["Query"],actions: [PrivilegeAction.ALL]},
                apiService: SetupService.QMANAGER,
                childs: [
                    {
                        name: "queryClientTypes", 
                        label : "Clients types",
                        path :"/query-client-type",
                        icon: <FontAwesomeIcon icon={faFileAlt}/>,
                        translateLabelName: "microgatewayApp.qmanagerQueryClientType.home.title",
                        activePaths: ["/query-client-type"],
                    },
                    {
                        name: "queryClients", 
                        label : "Clients",
                        path :"/query-client",
                        icon: <FontAwesomeIcon icon={faFileAlt}/>,
                        translateLabelName: "microgatewayApp.qmanagerQueryClient.home.title",
                        activePaths: ["/query-client"],
                    },
                    {
                        name: "qCategories", 
                        label : "Categories",
                        path :"/q-category",
                        icon: <FontAwesomeIcon icon={faFileAlt}/>,
                        translateLabelName: "microgatewayApp.qmanagerQCategory.home.title",
                        activePaths: ["/q-category"],
                    },
                ]
            },
            {
                name: "typeobjectif", 
                label : "Type Objectifs",
                path :"/type-objectif",
                icon: <Explore fontSize="small"/>,
                translateLabelName: "microgatewayApp.typeObjectif.home.title",
                hasAuthorities:[AUTHORITIES.ADMIN],
                apiService: SetupService.OBJECTIF,
                activePaths: ["/type-objectif"]
            },
            {
                name: "typeIndicator", 
                label : "Types Indicators",
                path :"/typeindicator",
                icon: <FontAwesomeIcon icon={faChartPie}/>,
                translateLabelName: "microgatewayApp.typeindicator.home.title",
                apiService: SetupService.OBJECTIF,
                activePaths: ["/typeindicator"]
            },
            {
                name: "fonction", 
                label : "Fonction",
                path :"/fonction",
                icon: <NaturePeople fontSize="small"/>,
                translateLabelName: "microgatewayApp.fonction.home.title",
                activePaths: ["/fonction"]
            },
            {
                name: "controle-type", 
                label : "Controle Type",
                path :"/control-type",
                icon: <NaturePeople fontSize="small"/>,
                apiService: SetupService.RISK,
                translateLabelName: "microgatewayApp.microrisqueControlType.home.title",
                activePaths: ["/control-type"]
            },
        ]
    },
    {
        name: "admin", 
        label : "Administration",
        path :"#",
        icon: <FontAwesomeIcon icon={faUser} />,
        translateLabelName: "global.menu.admin.main",
        hasAuthorities:[AUTHORITIES.ADMIN, AUTHORITIES.DEVELOPER],
        hasPrivileges: {entities: ["Privilege","User"], actions: [PrivilegeAction.ALL]}, 
        childs:[
            {
                name: "privilegeEntities", 
                label : "Privileges Entities",
                path :"/model-entity",
                icon: <FontAwesomeIcon icon={faAsterisk} fontSize="small"/>,
                translateLabelName: "microgatewayApp.modelEntity.home.title",
                hasAuthorities: [AUTHORITIES.DEVELOPER]
            },
            {
                name: "privileges", 
                label : "Privileges",
                path :"/privilege",
                icon: <FontAwesomeIcon icon={faUserShield} fontSize="small"/>,
                translateLabelName: "microgatewayApp.privilege.home.title",
                hasAuthorities:[AUTHORITIES.ADMIN],
                activePaths: ["/privilege"] 
            },
            {
                name: "user", 
                label : "Users Management",
                path :"/admin/user-management",
                icon: <FontAwesomeIcon icon={faUsersCog} fontSize="small"/>,
                translateLabelName: "userManagement.home.title",
                hasAuthorities:[AUTHORITIES.ADMIN],
                hasPrivileges: {entities: ["User"],actions: [PrivilegeAction.ALL]},
                activePaths: ["/admin/user-management"] 
            },
        ]
    }, 
];