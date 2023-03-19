import React, { useState, useEffect } from 'react';
import { translate, Translate } from 'react-jhipster';

import { Box, Card, CardContent, CardHeader, Chip, Divider, IconButton, List, ListItem, ListItemText, makeStyles, Modal, Slide, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import axios from 'axios';
import { API_URIS } from 'app/shared/util/helpers';
import { IQuery } from 'app/shared/model/qmanager/query.model';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader, faEye, faListAlt } from '@fortawesome/free-solid-svg-icons';
import TextContentManager from 'app/shared/component/text-content-manager';
import QueryFile from '../../query-file/custom/query-file';
import QueryFieldForm from '../../query-field/cutom/query-field-form';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';
import { VisibilityIconButton } from 'app/shared/component/custom-button';

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
    },
    cardHeader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '10px 10px 0 0',
    },
    cardContent:{
        background: 'white',
        minHeight: '10vh',
        maxHeight: '80vh',
        overflow: 'auto',
        borderRadius: '0 0 15px 15px', 
    },
    buttonBox:{
        borderRadius: 5,
    }
}))

export interface IQueryDetailProps extends StatePorps, DispatchProps {
    query: IQuery,
    open: boolean,
    onClose: Function
}

const enum ContentTextTag{
    QUERY_DESC = 'Query description',
    PROCESS_DETAIL = 'process detail',
}

export const QueryDetail = (props: IQueryDetailProps) => {
    const { open, account, query } = props;
    const [loading, setLoading] = useState(false);
    const [queryProcess, setQueryProcess] = useState<IProcess>(null);

    const [openText, setOpenText] = useState(false);

    const [textTag, setTextTag] = useState<ContentTextTag>(ContentTextTag.QUERY_DESC);

    const [openDocs, setOpenDocs] = useState(false);

    const [openForm, setOpenForm] = useState(false);

    const classes = useStyles();


    const handleClose = () => props.onClose();

    const getProcess = () =>{
        if(query && query.processId && serviceIsOnline(SetupService.PROCESS)){
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
        if(!props.account)
            props.getSession();
    }, [])

    useEffect(() =>{
        getProcess();
    }, [props.query])



    const clientType = query && query.clientType ? query.clientType.name : '...';

    const qProcess = queryProcess ? queryProcess.label + `${queryProcess.category ? ' ('+ queryProcess.category.name +' )' : ''}` : '';

    const categoryName = query && query.category && query.category.name ? query.category.name : translate("_global.label.uncategorized")

  return (
    <React.Fragment>
    {query && <>
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
        <QueryFieldForm 
           open={openForm}
           query={query}
           readonly
           onClose={() => setOpenForm(false)}
       />
    </>}
    <Modal
        aria-labelledby="query-detail-title"
        aria-describedby="query-modal-detaul"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        disableBackdropClick
        BackdropProps={{
            timeout: 500,
        }}>
        <Slide in={open} timeout={300} unmountOnExit>
            <Card className={classes.card}>
                <CardHeader classes={{root: classes.cardHeader}} 
                    title={
                        <Translate contentKey="microgatewayApp.qmanagerQuery.detail.title">Query</Translate>
                    }
                    titleTypographyProps={{ variant: 'h4'}}
                    action={
                        <IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>
                    }/>
                <CardContent className={classes.cardContent}>
                    {query &&<> 
                        <Box width={1} mb={2} display="flex" justifyContent="center"
                            alignItems="center" flexWrap="wrap">
                            <Typography variant="h4" color="secondary">
                                {query.name}
                            </Typography>
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
                                label="Documents"
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
                                    secondary={qProcess ? <VisibilityIconButton btnProps={{
                                            className: 'p-0'
                                        }}
                                        onClick={() =>{
                                            setTextTag(ContentTextTag.PROCESS_DETAIL); 
                                            setOpenText(true);
                                        }}
                                    /> : ''}
                                />
                            </ListItem>
                            {query.clientType &&
                                <ListItem>
                                    <ListItemText className="text-center"
                                        primary={`${translate("microgatewayApp.qmanagerQuery.clientType")}`}
                                        secondary={clientType}
                                    />
                                </ListItem>
                            }
                        </List>
                    </>}
                </CardContent>
            </Card>
        </Slide>
    </Modal>
    </React.Fragment>
  );
};

const mapStateProps = ({ authentication }: IRootState) =>({
    account: authentication.account,
})

const mapDispatchProps = {
    getSession
}

type StatePorps = ReturnType<typeof mapStateProps>;

type DispatchProps = typeof mapDispatchProps;

export default connect(mapStateProps, mapDispatchProps)(QueryDetail);
