import { Box, colors, makeStyles, Typography } from "@material-ui/core"
import { useEffect, useState } from "react";
import axios from 'axios';
import { IUser } from "app/shared/model/user.model";
import { API_URIS } from "app/shared/util/helpers";
import React from "react";
import clsx from "clsx";
import { Translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPeopleArrows, faUsersCog, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { People } from "@material-ui/icons";

const useStyles = makeStyles(theme =>({
    box:{
        borderLeft: '10px solid',
        borderRadius: '5px',
    },
    userBox:{
        borderColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.dark
    },
    employeeBox:{
        borderColor: theme.palette.success.dark,
        color: theme.palette.success.dark
    }
}));

export const UserLength = (props) =>{
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    const countUsers = () =>{
        setLoading(true);
        axios.get<IUser[]>(`${API_URIS.userApiUri}/?page=${0}&size=${1}`)
        .then(res => setTotalItems(parseInt(res.headers['x-total-count'], 10)))
        .catch(() =>{}).finally(() => setLoading(false));
    }

    useEffect(() =>{
        countUsers();
    }, [])
    
    const classes = useStyles();
    return (
        <React.Fragment>
            <Box width={1} boxShadow={3} p={3} display="flex" justifyContent="space-between"
                className={clsx(classes.box, classes.userBox)}>
                {loading ? 'Loading...' : (
                    <React.Fragment>
                        <Typography variant="h5">
                            {totalItems}&nbsp;<Translate contentKey="userManagement.home.title">Users</Translate>
                        </Typography>
                        <FontAwesomeIcon icon={faUsersCog} className="text-muted"/>
                    </React.Fragment>
                )}
            </Box>
        </React.Fragment>
    )
}

export const EmployeeLength = (props) =>{
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    const countUsers = () =>{
        setLoading(true);
        axios.get<IUser[]>(`${API_URIS.employeeApiUri}/?page=${0}&size=${1}`)
        .then(res => setTotalItems(parseInt(res.headers['x-total-count'], 10)))
        .catch(() =>{}).finally(() => setLoading(false));
    }

    useEffect(() =>{
        countUsers();
    }, [])
    
    const classes = useStyles();
    return (
        <React.Fragment>
            <Box width={1} boxShadow={3} p={3} display="flex" justifyContent="space-between"
                className={clsx(classes.box, classes.employeeBox)}>
                {loading ? 'Loading...' : (
                    <React.Fragment>
                        <Typography variant="h5">
                            {totalItems}&nbsp;<Translate contentKey="microgatewayApp.employee.home.title">Employees</Translate>
                        </Typography>
                        <FontAwesomeIcon icon={faUserTie} className="text-muted"/>
                    </React.Fragment>
                )}
            </Box>
        </React.Fragment>
    )
}