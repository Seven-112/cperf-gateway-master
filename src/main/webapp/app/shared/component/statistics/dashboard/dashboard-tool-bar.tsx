import { Box, BoxProps, Divider, makeStyles, MenuItem, Select, Typography } from "@material-ui/core"
import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import { AUTHORITIES } from "app/config/constants";
import { DepartementFinder, DepartementFinderButton } from "app/entities/department/custom/departement-finder";
import TodoUserFinderBtn from "app/entities/user-extra/custom/todo-user-finder-btn";
import { hasAuthorities, hasPrivileges } from "app/shared/auth/helper";
import { IDepartment } from "app/shared/model/department.model";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { PerfIndicatorUnity } from "app/shared/model/perf-indicator.model";
import { IRootState } from "app/shared/reducers";
import theme from "app/theme";
import React, { useEffect, useState } from "react"
import { translate } from "react-jhipster";
import { connect } from "react-redux";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";


const useStyles = makeStyles({
    box:{
        background: `linear-gradient(45deg, ${theme.palette.info.main} 45%, ${theme.palette.success.light} 90%)`,
        color: theme.palette.common.white,
        minHeight: 43,
    },
    dateInputField:{
        color: 'white',
        maxWidth: 120,
        textAlign: 'center',
        cursor: 'pointer',
    },
    select:{
        fontSize:12,
        marginLeft: 5,
        color: theme.palette.background.paper,
        background: 'transparent',
        height: 3,
        marginRight: 1,
        "&&&:before": {
          borderBottom: "none"
        },
        "&&:after": {
          borderBottom: "none"
        }
        // borderBottom: '1px solid white',
    },
    selectMenuItemList:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        boxShadow: `1px 1px 5px grey`,
    },
    icon:{
      color: theme.palette.background.paper,
      '&:hover':{
        color: theme.palette.grey[300],
      }
    },
});

interface DashBoardToolBarProps extends StateProps{
    rootBoxProps?: BoxProps;
    handleChangeUserIds?: Function;
    account?: any,
}

enum FindCriteria{
    USER = 'USER',
    ENTITY = 'ENTITY',
    NONE = 'NONE',
}

export const DashBoardToolBar = (props: DashBoardToolBarProps) =>{

    const [findCriteria, setFindCriteria] = useState<FindCriteria>(FindCriteria.USER);

    const [openDeptsFinder, setOpenDeptsFinder] = useState(false);

    const [selectedDept, setSelectedDept] = useState<IDepartment>(null);

    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const loggedIsAdmin = props.account && (hasAuthorities([AUTHORITIES.ADMIN], props.account.authorities) 
            || hasPrivileges({entities: ["Application"], actions: [PrivilegeAction.ALL]}, props.account.authorities));
    
    const setDashBoardUserIdToTodoUserId = (criteria?: FindCriteria.USER) =>{
        if((findCriteria === FindCriteria.USER || criteria === FindCriteria.USER) && props.handleChangeUserIds){
            const userId = props.todoUserId ? props.todoUserId : props.account ? props.account.id : null;
            props.handleChangeUserIds([userId]);
        }
    }

    const getUserIdByDeptId = (criteria?: FindCriteria) =>{
        if((findCriteria === FindCriteria.ENTITY || criteria === FindCriteria.ENTITY) && props.handleChangeUserIds){
            if(selectedDept && selectedDept.id){
                setLoading(true)
                const apiUri = `${API_URIS.userExtraApiUri}/getUserIdsByDept/${selectedDept.id}`
                axios.get<any[]>(apiUri)
                    .then(res =>{
                        props.handleChangeUserIds([...res.data, 0]) 
                        // le zero assure qu'on cherche avec au moins un utilisateur
                        // il permet de rénitialier les stats existants au préalable
                    }).catch(e => console.log(e))
                    .finally(() => setLoading(false));
            }else{
                props.handleChangeUserIds([0]) 
            }
        }
    }

    const handleChangeCriteria = (event) =>{
        const newCriteria = event.target.value;
        setFindCriteria(newCriteria);
        if(newCriteria !== FindCriteria.ENTITY){
            setSelectedDept(null);
            if(newCriteria === FindCriteria.NONE && props.handleChangeUserIds)
                props.handleChangeUserIds([]);
            else
                setDashBoardUserIdToTodoUserId(newCriteria);
        }else{
            getUserIdByDeptId(newCriteria)
        }
    }

    const handleFindedDept = (dept: IDepartment) =>{
        if(dept){
            setSelectedDept({...dept})
        }else{
            setSelectedDept(null);
        }

        setOpenDeptsFinder(false);
    }

    useEffect(() =>{
        if(props.todoUserId)
            setDashBoardUserIdToTodoUserId();
    }, [props.todoUserId])

    useEffect(() =>{
        getUserIdByDeptId();
    }, [selectedDept])
    

    return (
        <React.Fragment>
            <DepartementFinder 
                open={openDeptsFinder}
                selected={selectedDept}
                onFinded={handleFindedDept}
                onClose={() => setOpenDeptsFinder(false)}
            />
            <Box 
             width={1} 
             display="flex"
             justifyContent="center"
             alignItems="center"
             flexWrap="wrap"
             boxShadow={1}
             mb={2}
             borderRadius={3}
             className={classes.box}
             {...props.rootBoxProps}>
             {/* <Box m={1}>
                <DatePicker 
                    value={startDate}
                    onChange={handleChangeStartDate}
                    autoOk
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    InputProps={{
                        disableUnderline: true,
                    }}
                    inputProps={{
                        className: classes.dateInputField,
                    }}
                    DialogProps={{
                        title: 'End time',
                    }}
                    />
                </Box>
                <Box m={1}><Typography variant="h4">-</Typography></Box>
                <Box m={1}>
                    <DatePicker 
                        value={endDate}
                        onChange={handleChangeEndDate}
                        autoOk
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        InputProps={{
                            disableUnderline: true,
                        }}
                        inputProps={{
                            className: classes.dateInputField,
                        }}
                        DialogProps={{
                            title: 'End time',
                        }}
                     />
                </Box> */}
                {loggedIsAdmin && <>
                    <Box display={"flex"} 
                        justifyContent="center" 
                        alignItems="center" flexWrap="wrap"
                        mr={findCriteria !== FindCriteria.NONE ? 2 : 0}>
                        <Typography>{translate("_global.label.filter")} : </Typography>&nbsp;
                        <Select
                            style={{fontSize: '12px',}}
                            value={findCriteria}
                            onChange={handleChangeCriteria}
                            MenuProps={{
                                classes: {
                                    list: classes.selectMenuItemList,
                                }
                            }}
                            classes={{
                                icon: classes.icon,
                            }}
                            className={classes.select}
                            displayEmpty
                            >
                            <MenuItem value={FindCriteria.USER}>
                                {translate("userManagement.detail.title")}
                            </MenuItem>
                            <MenuItem value={FindCriteria.ENTITY}>
                                {translate("microgatewayApp.department.detail.title")}
                            </MenuItem>
                            <MenuItem value={FindCriteria.NONE}>{translate("_global.label.noSelect")}</MenuItem>
                        </Select>
                    </Box> 
                </>}

                {(findCriteria === FindCriteria.USER || findCriteria === FindCriteria.ENTITY) &&
                    <>
                        <Box>
                            {findCriteria === FindCriteria.USER ?
                                <TodoUserFinderBtn btnLabelClassName="text-white" />
                                : 
                                <DepartementFinderButton 
                                    btnLabelClassName="text-white"
                                    onClick={() => setOpenDeptsFinder(true)}
                                    selected={selectedDept}
                                /> 
                            }
                        </Box>
                    </> 
                }
                {loading && <Typography className="ml-2">loading...</Typography>}
            </Box>
        </React.Fragment>
    )
}

const mapStateToProps = ({ appUtils } : IRootState) =>({
    todoUserId: appUtils.todoUserId,
})

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, null)(DashBoardToolBar);
