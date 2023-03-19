import React, { useState, useEffect } from 'react';
import { TextFormat, translate } from 'react-jhipster';

import { Box, Chip, Divider, List, ListItem, ListItemText, makeStyles, Typography } from '@material-ui/core';
import axios from 'axios';
import { API_URIS, getUserExtraFullName } from 'app/shared/util/helpers';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader, faEye, faListAlt } from '@fortawesome/free-solid-svg-icons';
import TextContentManager from 'app/shared/component/text-content-manager';
import QueryFile from '../../query-file/custom/query-file';
import { IQueryInstance } from 'app/shared/model/qmanager/query-instance.model';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import QueryInstanceUpdate from './query-instance-update';
import QueryInstanceValidation from '../../query-instance-validation/custom/query-instance-validation';
import MyCustomModal from 'app/shared/component/my-custom-modal';
import MyCustomPureHtmlRender from 'app/shared/component/my-custom-pure-html-render';
import { VisibilityIconButton } from 'app/shared/component/custom-button';

const useStyles = makeStyles(theme =>({
    card:{
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
    },
    buttonBox:{
        borderRadius: 5,
    }
}))

const enum ContentTextTag{
    QUERY_DESC = 'Query description',
    PROCESS_DETAIL = 'process detail',
}
export interface IQueryInstanceDetailProps{
    instance: IQueryInstance,
    instanceId: any,
    open: boolean,
    onClose: Function
}

export const QueryInstanceDetail = (props: IQueryInstanceDetailProps) => {
    const { open, instance } = props;
    const [loading, setLoading] = useState(false);
    const [queryProcess, setQueryProcess] = useState<IProcess>(null);

    const [openText, setOpenText] = useState(false);

    const [textTag, setTextTag] = useState<ContentTextTag>(ContentTextTag.QUERY_DESC);

    const [openDocs, setOpenDocs] = useState(false);

    const [openForm, setOpenForm] = useState(false);

    const [userExtra, setUserExtra] = useState<IUserExtra>(null);

    const [openValidations, setOpenValidations] = useState(false);

    const classes = useStyles();

    const query = instance ? instance.query : null;
    

    const handleClose = () => props.onClose();


    const getLuncher = () =>{
            if(instance && instance.userId){
                axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${instance.userId}`)
                .then(res => setUserExtra(res.data))
                .catch(e => console.log(e))
                .finally(() => {});
            }
        }

    const getProcess = () =>{
        if(query && query.processId){
            setLoading(true);
            axios.get<IProcess>(`${API_URIS.processApiUri}/${query.processId}`)
                .then(res =>{
                    setQueryProcess(res.data);
                }).catch(e => console.log(e))
                .finally(() =>{
                    setLoading(false)
                })
        }
    }

    useEffect(() =>{
        getProcess();
        getLuncher();
    }, [props.instanceId])



    const client = instance && instance.client ? instance.client.name + `${instance.client.type ? ' ('+ instance.client.type.name +' )' : ''}` : '';

    const qProcess = queryProcess ? queryProcess.label + `${queryProcess.category ? ' ('+ queryProcess.category.name +' )' : ''}` : '';

    const categoryName = query && query.category && query.category.name ? query.category.name : translate("_global.label.uncategorized")

  return (
    <React.Fragment>
    {(instance && query) && <>
        <TextContentManager
            title={translate(`microgatewayApp.qmanagerQuery.${textTag === ContentTextTag.PROCESS_DETAIL ? 'processId' : 'description'}`)} 
            value={textTag === ContentTextTag.PROCESS_DETAIL ? qProcess : query.description}
            readonly
            open={openText}
            onClose={() => setOpenText(false)}
        />
        <QueryFile
            query={query}
            open={openDocs}
            readonly
            onClose={() => setOpenDocs(false)}
        />
        <QueryInstanceUpdate 
           open={openForm}
           instance={instance}
           locked
           onClose={() => setOpenForm(false)}
       />
       <QueryInstanceValidation 
        open={openValidations}
        istance={instance}
        onClose={() => setOpenValidations(false)}
       />
    </>}
    <MyCustomModal
        open={open}
        onClose={handleClose}
        title={translate("microgatewayApp.qmanagerQueryInstance.detail.title")}
        subheader={<Box 
            width={1}
            display="flex"
            justifyContent="center" 
            textAlign={"center"}
            flexWrap="wrap" alignItems={"center"}>
                {instance && <MyCustomPureHtmlRender body={instance.name} />}
         </Box>
        }
        rootCardClassName={classes.card}
        >
         <Box width={1}>
            {query &&<> 
                <Box width={1} mb={2} display="flex" justifyContent="center"
                    alignItems="center" flexWrap="wrap" alignContent="center">
                        <ListItemText 
                            className="w-100 text-center"
                            primary={instance.startAt ?
                                <Box width={1} display="flex" 
                                    justifyContent={"center"}
                                    alignItems="center" flexWrap={"wrap"}>
                                    <Typography className='mr-2'>{`${translate("microgatewayApp.qmanagerQueryInstance.startAt")} :`}</Typography>
                                    <TextFormat type="date"
                                        value={convertDateTimeToServer(instance.startAt)} 
                                        format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`}  />
                                </Box>
                                : <></> 
                            }
                            secondary={
                                <Box width={1} display="flex" justifyContent={"center"} alignItems="center"
                                    flexWrap={"wrap"} flexDirection="column" mt={2}>
                                    <Typography variant="h5" className='mb-2'>
                                        {translate("microgatewayApp.qmanagerQuery.detail.title")}
                                    </Typography>
                                    <Typography variant="h4" color="secondary">
                                        {query ? query.name : ""}
                                    </Typography>
                                </Box>
                            }
                        />
                </Box>
                <Divider />
                <Box width={1} display="flex" justifyContent="center" 
                    alignItems="center" flexWrap="wrap" m={0.5} p={1}
                    className={classes.buttonBox}>
                    <Chip 
                        label={translate("microgatewayApp.qmanagerQuery.description")}
                        icon={<FontAwesomeIcon icon={faEye}/>}
                        clickable
                        size="small"
                        color="primary"
                        onClick={() =>{
                            setTextTag(ContentTextTag.QUERY_DESC); 
                            setOpenText(true);
                        }}
                    />
                    <Chip 
                        label="Docs. Descriptifs"
                        icon={<FontAwesomeIcon icon={faBookReader}/>}
                        clickable
                        size="small"
                        color="primary"
                        className="ml-4"
                        onClick={() =>{setOpenDocs(true)}}
                    />
                    <Chip 
                        label={translate("_global.label.form")}
                        icon={<FontAwesomeIcon icon={faListAlt}/>}
                        clickable
                        size="small"
                        color="primary"
                        className="ml-4"
                        onClick={() =>{setOpenForm(true)}}
                    />
                    <Chip 
                        label={translate("microgatewayApp.qmanagerQueryInstanceValidation.home.title")}
                        icon={<FontAwesomeIcon icon={faEye}/>}
                        clickable
                        size="small"
                        color="primary"
                        className="ml-4"
                        onClick={() =>{setOpenValidations(true)}}
                    />
                </Box>
                <Divider />
                <List className="w-100">
                    <ListItem>
                        <ListItemText className="text-center"
                            primary={`${translate("microgatewayApp.qmanagerQuery.category")}`}
                            secondary={categoryName}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText className="text-center"
                            primary={`${translate("microgatewayApp.qmanagerQuery.processId")}`}
                            secondary={qProcess ? <VisibilityIconButton 
                                btnProps={{ className: 'p-0'}}
                                onClick={() =>{
                                    setTextTag(ContentTextTag.PROCESS_DETAIL); 
                                    setOpenText(true);
                                }} /> : ''}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText className="text-center"
                            primary={`${translate("microgatewayApp.qmanagerQueryInstance.userId")}`}
                            secondary={getUserExtraFullName(userExtra)}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText className="text-center"
                            primary={`${translate("microgatewayApp.qmanagerQueryInstance.client")}`}
                            secondary={client}
                        />
                    </ListItem>
                </List>
            </>}
        </Box>
    </MyCustomModal>
    </React.Fragment>
  );
};

export default QueryInstanceDetail;
