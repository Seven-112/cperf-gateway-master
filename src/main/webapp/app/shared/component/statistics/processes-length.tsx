import { API_URIS } from "app/shared/util/helpers";
import { useEffect, useState } from "react";
import axios from 'axios';
import { IProcess } from "app/shared/model/microprocess/process.model";
import React from "react";
import { Box, colors, makeStyles, Typography } from "@material-ui/core";
import { Translate } from "react-jhipster";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip, faSitemap } from "@fortawesome/free-solid-svg-icons";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";

const useStyles = makeStyles(theme =>({
    box:{
        borderLeft: '10px solid',
        borderRadius: '5px',
    },
    processBox:{
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
    },
    instanceProx:{
        borderColor: colors.deepPurple[500],
        color: colors.deepPurple[500],
    }
}));

interface ProcessesLengthProps{
    instances ?: boolean,
}
export const ProcessesLength = (props: ProcessesLengthProps) =>{
    const [size, setSize] = useState(0);
    const [loading, setLoading] = useState(false);

    const countProcesses = () =>{
        if(serviceIsOnline(SetupService.PROCESS)){
            const requestUri = `${API_URIS.processApiUri}/?page=${0}&size=${1}&modelId.specified=${props.instances ? 'true': 'false'}&valid.equals=${true}`;
            setLoading(true);
            axios.get<IProcess[]>(requestUri).then(res =>{
                if(res && res.headers){
                    setSize(parseInt(res.headers['x-total-count'], 10))
                }
            }).catch(() =>{}).finally(() => setLoading(false));
        }
    }

    useEffect(() =>{
        countProcesses();
    }, [])
    
    const classes = useStyles();
    return (
        <React.Fragment>
            {serviceIsOnline(SetupService.PROCESS) &&
            <Box width={1} boxShadow={3} p={3} display="flex" justifyContent="space-between"
                className={clsx(classes.box, {[classes.instanceProx]: props.instances, [classes.processBox]: !props.instances })}>
                {loading ? 'Loading...' : (
                    <React.Fragment>
                        <Typography variant="h5">
                            {size || 0}&nbsp;
                            {props.instances ? <Translate contentKey="_global.instance.home.title">Instances</Translate> :
                                            <Translate contentKey="microgatewayApp.microprocessProcess.home.title">Process</Translate>}
                        </Typography>
                        <FontAwesomeIcon icon={props.instances ? faSitemap : faMicrochip} className="text-muted" />
                    </React.Fragment>
                )}
            </Box>
            }
        </React.Fragment>
    )
}

export default ProcessesLength;