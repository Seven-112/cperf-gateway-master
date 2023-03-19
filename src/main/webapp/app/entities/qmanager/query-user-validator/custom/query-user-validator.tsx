import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Modal, TablePagination, Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, getTotalPages, getUserExtraFullName } from "app/shared/util/helpers";
import { Add, Close, Delete } from "@material-ui/icons";
import { Translate, translate } from "react-jhipster";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import { IQueryUser } from "app/shared/model/qmanager/query-user.model";
import UserExtraFinder2 from "app/entities/user-extra/custom/user-extra-finder2";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import { IQueryUserValidator } from "app/shared/model/qmanager/query-user-validator.model";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import QueryUserPreValidator from "./query-user-pre-validator";
import DeleyManager from "app/shared/component/delay-manager";
import { DeleyUnity } from "app/shared/model/enumerations/deley-unity.model";
import { QPeriodUnity } from "app/shared/model/enumerations/q-period-unity.model";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '35%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    searchBox:{
      flex: 1,
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(3),
      borderRadius: '10px',
      boxShadow:'none',
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      [theme.breakpoints.down('sm')]:{
       marginRight: theme.spacing(2),
       marginLeft: theme.spacing(2),
      },
      '&:hover':{
        border: '1px solid',
      }
    },
    cardcontent:{
      background: 'white',
      minHeight: '10vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
    cardActions:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        paddingTop: 3,
        paddingBottom: 3,
        textAlign: 'center',
        borderRadius: '0 0 15px 15px',
    },
    input: {
      flex: 1,
      paddingLeft: 20,
      paddingRight: 0,
      color: theme.palette.primary.dark,
      border: 'none',
      borderRadius: 15,
      '&:hover':{
        border: `1px solid ${theme.palette.primary.dark}`,
      }
    },
    fileIllustattionAvatar:{
        width: 50,
        height: 50,
        fontSize: theme.spacing(6),
    },
    fileIllustattionBox:{
        cursor: 'pointer',
        '&:hover':{
            border: `1px solid ${theme.palette.secondary.dark}`,
        }
    },
    pagination:{
      padding:0,
      color: theme.palette.primary.dark,
    },
    paginationInput:{
        color: theme.palette.primary.dark,
        width: theme.spacing(10),
        borderColor:theme.palette.primary.dark,
    },
    paginationSelectIcon:{
        color:theme.palette.primary.dark,
    },
    catSelect:{
        height:theme.spacing(3),
        fontSize:15,
        color: theme.palette.primary.dark,
        "&&&:before": {
          borderBottom: "none"
        },
        "&&:after": {
          borderBottom: "none"
        }
        // borderBottom: '1px solid white',
    },
}))

interface QueryUserValidatorProps{
    userId: number,
    queryId: number,
    open?: boolean,
    onClose: Function,
    onDeleted?: Function,
    onSaved?: Function,
}

const QueryUseralidatorListItem = (props: {
    validator: IQueryUserValidator,readonly?: boolean,
    onDelete?: Function, onUpdatePreValidator?:Function}) =>{
    const { readonly } = props;
    
    const [validator, setValidator] = useState<IQueryUserValidator>(props.validator);
    
    const [userValidator, setUserValidator] = useState<IUserExtra>(null);

    const [previewValidator, setPreviewValidator] = useState<IUserExtra>(null);

    const [openDeleyEditor, setOpenDeleyEditor] = useState(false);

    
    const [loading, setLoading] = useState(false);

    const getUserExra = (id, uv?:boolean) =>{
        if(id){
            setLoading(false);
            axios.get<IUserExtra>(`${API_URIS.userExtraApiUri}/${id}`)
                .then(res =>{
                    if(uv)
                        setUserValidator(res.data);
                    else
                        setPreviewValidator(res.data);
                })
        }
    }

    useEffect(() =>{
        if(validator){
            setValidator(props.validator);
            getUserExra(validator.validatorId, true); // get Validator
            getUserExra(validator.previewValidatorId, false); // get preview validator
        }
    }, [props.validator])

    const handleDelete = () =>{
        if(props.onDelete && !readonly)
            props.onDelete(validator);
    }

    const handleUpdatePreValidator = () =>{
        if(props.onUpdatePreValidator)
            props.onUpdatePreValidator(validator)
    }

    const handleSaveDeley = (deley?:number, unity?:DeleyUnity) =>{
        const qUnity = unity === DeleyUnity.DAY ? QPeriodUnity.DAY : 
                    unity === DeleyUnity.HOUR ? QPeriodUnity.HOUR : 
                    unity === DeleyUnity.MONTH ? QPeriodUnity.MONTH :
                    unity === DeleyUnity.YEAR ? QPeriodUnity.YEAR : QPeriodUnity.MINUTE;
        const entity:IQueryUserValidator = {
            ...validator,
            validationDeleyLimit: deley,
            validationDeleyLimitUnity: qUnity,
        }
        setValidator(entity);
        axios.put<IQueryUserValidator>(`${API_URIS.queryUserValidatorsApiUri}`, cleanEntity(entity))
            .then(res =>{
                if(res.data){
                    setValidator(res.data);
                }
            }).catch(e => console.log(e))
            .finally(() => setOpenDeleyEditor(false))
    }

    const unit = validator ? validator.validationDeleyLimitUnity : null;

    const formUnit = unit === QPeriodUnity.DAY ? DeleyUnity.DAY : 
                     unit === QPeriodUnity.HOUR ? DeleyUnity.HOUR : 
                     unit === QPeriodUnity.MONTH ? DeleyUnity.MONTH :
                     unit === QPeriodUnity.YEAR ? DeleyUnity.YEAR :   DeleyUnity.MINUTE;

    return (
        <React.Fragment>
            {userValidator &&
            <>
                <DeleyManager 
                    open={openDeleyEditor}
                    delay={validator.validationDeleyLimit}
                    unity={formUnit}
                    onSave={handleSaveDeley}
                    onClose={() => setOpenDeleyEditor(false)}
                />
                <ListItem button>
                    <ListItemText
                        primary={getUserExtraFullName(userValidator)}
                        secondary={validator.validationDeleyLimit ? 
                            `${validator.validationDeleyLimit} ${translate("microgatewayApp.QPeriodUnity."+validator.validationDeleyLimitUnity.toString())}` : ''}
                    />
                    <ListItemSecondaryAction>
                        <IconButton color="primary" onClick={handleUpdatePreValidator}>
                            <FontAwesomeIcon icon={faUserCheck} />
                        </IconButton>
                        <Tooltip title={translate("microgatewayApp.qmanagerQueryUserValidator.validationDeleyLimit")}>
                            <IconButton color="primary" onClick={() => setOpenDeleyEditor(true)}>
                                <FontAwesomeIcon icon={faClock} />
                            </IconButton>
                        </Tooltip>
                        <IconButton 
                            color="secondary" 
                            disabled={readonly}
                            onClick={handleDelete}>
                                <Delete />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </>
            }
        </React.Fragment>
    )
}

export const QueryUserValidator = (props: QueryUserValidatorProps) =>{
    const { open } = props;

    const [validators, setValidators] = useState<IQueryUserValidator[]>([]);

    const [qUserValidator, setQUserValidator] = useState<IQueryUser>(null);
    const [openDelete, setOpenDelete] = useState(false);

    const [qUserToUpdatePrevalidator, setQUserToUpdatePrevalidator] = useState<IQueryUserValidator>(null);
    const [openPreValidator, setOpenPreValidator] = useState(false);
    
    const [openUserFinder, setOpenUserFinder] = useState(false);

    const [loading, setLoading] = useState(false);

    const [totalItems, setTotalItems] = useState(0);

    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

    const [activePage, setActivePage] = useState(0);

    const classes = useStyles();

    const getAllEntities = (p?: number, rows?: number) => {
      setValidators([]);
      if(props.queryId && props.userId){
        setLoading(true);
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        let requestUri =`${API_URIS.queryUserValidatorsApiUri}/?userId.equals=${props.userId}`;
        requestUri = `${requestUri}&queryId.equals=${props.queryId}&page=${page}&size=${size}`
        axios.get<IQueryUserValidator[]>(requestUri)
          .then(res => {
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
            setValidators([...res.data])
          }).catch((e) =>{
            console.log(e);
          }).finally(() => setLoading(false));
      }
    }

  useEffect(() =>{
    getAllEntities();
  }, [props.userId, props.queryId])

  const handleClose = () => props.onClose();

  const onSelectChange = (ue?: IUserExtra, isSelecting?:boolean) => {
    if(ue){
          if(isSelecting){
            setLoading(false)
            const entity: IQueryUserValidator = {
                    validatorId: ue.id,
                    userId: props.userId,
                    queryId: props.queryId,
                }
            axios.post<IQueryUserValidator>(API_URIS.queryUserValidatorsApiUri, cleanEntity(entity))
                .then(res =>{
                    if(res.data){
                        setValidators([...validators, res.data])
                        if(props.onSaved)
                            props.onSaved(res.data, true); // true ; is new
                    }
                }).catch(e => console.log(e))
                .finally(() => {
                    setLoading(false)
            })
          }else{
              const unSelectedValidator = [...validators].find(v => v.validatorId === ue.id);
              setValidators([...validators].filter(v => v.validatorId !== ue.id));
              if(props.onSaved)
                  props.onSaved(unSelectedValidator, false);
          }
     }
    };
 
   const handleChangeItemsPerpage = (event) =>{
     setItemsPerPage(parseInt(event.target.value, 10));
     getAllEntities(0, parseInt(event.target.value, 10));
   }
 
   const handleChangePage = (event, newPage) =>{
     setActivePage(newPage);
     getAllEntities(newPage);
   }

   const onDelete = (deletdId?: any) =>{
        if(deletdId){
            setValidators([...validators].filter(v => v.id !== deletdId));
            setOpenDelete(false);
            if(props.onDeleted)
                props.onDeleted(deletdId);
        }
   }

   const handleDelete = (v?: IQueryUser) =>{
       if(v){
           setQUserValidator(v);
           setOpenDelete(true);
       }
   }

   const handleUpdatePrevalidator = (pv?: IQueryUserValidator) =>{
       if(pv){
           setQUserToUpdatePrevalidator(pv);
           setOpenPreValidator(true);
       }
   }


   const items = [...validators]
   .map((validator, index) => (
    <QueryUseralidatorListItem key={index}
        validator={validator}
        readonly={[...validators].some(v => validator.userId && validator.queryId && v.previewValidatorId === validator.validatorId)}
        onDelete={handleDelete}
        onUpdatePreValidator={handleUpdatePrevalidator}
    />
   ))

    return (
        <React.Fragment>
        {qUserValidator && <EntityDeleterModal 
            open={openDelete}
            entityId={qUserValidator.id}
            urlWithoutEntityId={API_URIS.queryUserValidatorsApiUri}
            onDelete={onDelete}
            onClose={() => setOpenDelete(false)}
            question={translate("microgatewayApp.qmanagerQueryUserValidator.delete.question", {id: ''})}
        />}
        {props.userId && <UserExtraFinder2
            unSelectableIds={[...[...validators].map(v => v.validatorId), props.userId]}
            multiple
            open={openUserFinder}
            onClose={() => setOpenUserFinder(false)}
            onSelectChange={onSelectChange}
         />}
         {qUserToUpdatePrevalidator && 
            <QueryUserPreValidator 
                userValidator={qUserToUpdatePrevalidator}
                validators={[...validators]}
                open={openPreValidator}
                onChange={(elements: IQueryUserValidator[]) => {
                    setValidators([...elements])
                }}
                onClose={() => setOpenPreValidator(false)}
            />
         }
        <Modal open={open} onClose={handleClose}
             closeAfterTransition
             BackdropComponent={Backdrop}
             BackdropProps={{
             timeout: 500,
         }}
         disableBackdropClick
         className={classes.modal}>
                <Card className={classes.card}>
                    <CardHeader
                        title={<Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                            <Typography variant="h4">
                                <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.home.title">Validators</Translate>
                            </Typography>
                            <IconButton color="primary" onClick={() => setOpenUserFinder(true)}>
                                <Add />
                            </IconButton>
                            <IconButton color="inherit" onClick={handleClose} className="ml-2"><Close /></IconButton>
                        </Box>}
                        className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            {loading && <Box width={1} display="flex" justifyContent="center" alignItems="center">
                                        <CircularProgress color="inherit" style={{ height: 30, width:30}}/>
                                        <Typography className="ml-2">loading...</Typography>
                            </Box>}
                            <List>
                                {items}
                                {(!loading && [...validators].length ===0 ) && <ListItem>
                                    <Box width={1} textAlign="center">
                                        <Typography variant="body1">
                                            <Translate contentKey="microgatewayApp.qmanagerQueryUserValidator.home.notFound">No qUsers found</Translate>
                                        </Typography>
                                    </Box>
                                </ListItem>}
                            </List>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        {totalItems > 0 &&
                            <TablePagination 
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={handleChangePage}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={handleChangeItemsPerpage}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelRowsPerPage={translate("_global.label.rowsPerPage")}
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    selectIcon: classes.paginationSelectIcon,
                            }}/>
                        }
                    </CardActions>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default QueryUserValidator;