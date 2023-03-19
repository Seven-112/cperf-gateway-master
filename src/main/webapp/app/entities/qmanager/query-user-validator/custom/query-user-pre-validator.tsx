import { Backdrop, Box, Card, CardContent, CardHeader, CircularProgress, FormControlLabel, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Modal, Switch, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { API_URIS, getUserExtraFullName } from "app/shared/util/helpers";
import { Close, Delete } from "@material-ui/icons";
import { translate, Translate } from "react-jhipster";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { IQueryUserValidator } from "app/shared/model/qmanager/query-user-validator.model";
import { cleanEntity } from "app/shared/util/entity-utils";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '32%',
        [theme.breakpoints.down("sm")]:{
            width: '92%',
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
    userValidator: IQueryUserValidator,
    validators: IQueryUserValidator[],
    open?: boolean,
    onChange?: Function,
    onClose: Function,
}

const QueryUserPreValidatorListItem = (props: {userExtra: IUserExtra, 
    userValidator: IQueryUserValidator, onChange?: Function}) =>{
    const {userExtra, userValidator} = props;
    const isPrevalidator = userExtra && userValidator && userValidator.previewValidatorId === userExtra.id

    const handleChange = () =>{
        if(props.onChange)
            props.onChange(props.onChange(isPrevalidator ? null : userExtra.id));
    }

    const isCurrentValidator = userExtra && userValidator && userValidator.validatorId === userExtra.id;
   
    return (
        <React.Fragment>
            {(userExtra && userValidator) &&
            <>
                <ListItem button>
                    <ListItemText
                        primary={getUserExtraFullName(userExtra)}
                        secondary={isCurrentValidator ? (
                            <Typography variant="caption" color="secondary">
                                {translate("microgatewayApp.qmanagerQueryUserValidator.detail.title")}
                            </Typography>
                        ) : ''}
                    />
                    {!isCurrentValidator && 
                        <ListItemSecondaryAction>
                            <FormControlLabel 
                                label={<Typography variant="caption" color="secondary">
                                    {isPrevalidator ?
                                     translate("microgatewayApp.qmanagerQueryUserValidator.previewValidatorId")
                                     : ''
                                    }
                                </Typography>}
                                control={<Switch checked={isPrevalidator} onChange={handleChange}/>}
                                labelPlacement="start"
                            />
                        </ListItemSecondaryAction>
                    }
                </ListItem>
            </>
            }
        </React.Fragment>
    )
}

export const QueryUserPreValidator = (props: QueryUserValidatorProps) =>{
    const { open} = props;

    const [userValidator, setUserValidator] = useState(props.userValidator);

    const [validators, setValidators] = useState<IQueryUserValidator[]>([...props.validators]);

    const [users, setUsers] = useState<IUserExtra[]>([]);

    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const getUsers = () =>{
        if(props.validators && props.validators.length !== 0){
            const ids = [...props.validators].map(v => v.validatorId);
            setLoading(true)
            axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/?id.in=${ids.join(",")}`)
                .then(res =>{
                    setUsers([...res.data])
                }).catch((e) =>{
                    console.log(e);
                }).finally(() =>{
                    setLoading(false);
                })
        }
    }

  useEffect(() =>{
    setUserValidator(props.userValidator);
  }, [props.userValidator])

  useEffect(() =>{
    setValidators([...props.validators]);
    getUsers();
  }, [props.validators])

  const handleClose = () => {
    props.onClose();
  };

  const handlePreValidatorSchange = (prevValidatorId?:any) =>{
      if(prevValidatorId !== undefined){
        console.log(prevValidatorId)
        const entity: IQueryUserValidator = {
            ...userValidator,
            previewValidatorId: prevValidatorId,
        }
        setLoading(true)
        axios.put<IQueryUserValidator>(`${API_URIS.queryUserValidatorsApiUri}`, cleanEntity(entity))
          .then(res =>{
              if(res.data){
                  setUserValidator(res.data);
                  const _validators = [...validators].map(v => {
                        if(v.id === res.data.id)
                            return res.data;
                        else if (v.validatorId === res.data.previewValidatorId && v.previewValidatorId === res.data.validatorId)
                            return {...v, previewValidatorId: null}
                        else
                            return v;
                  });
                  setValidators([..._validators])
                  if(props.onChange)
                    props.onChange([..._validators])
              }
          }).catch(e => console.log(e))
            .finally(() => setLoading(false))
      }
  }

   const usersSorted = !userValidator ? [...users] :
        [[...users].find(ue => ue.id === userValidator.validatorId), ...[...users].filter(ue => ue.id !== userValidator.validatorId)]
   const items = [...usersSorted]
   .map((ue, index) => (
    <QueryUserPreValidatorListItem key={index} 
        userExtra={ue} userValidator={userValidator}
        onChange={handlePreValidatorSchange}/>
   ))

    return (
        <React.Fragment>
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
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default QueryUserPreValidator;