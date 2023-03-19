import { Backdrop, Box, Card, CardContent, CardHeader, Collapse, Divider, IconButton, makeStyles, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Close, Edit, Visibility, VisibilityOff } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useState } from "react";
import { translate } from "react-jhipster";
import { ITenderProviderSelectionValidation } from "app/shared/model/microprovider/tender-provider-selection-validation.model";
import { IPartenerCategoryValidator } from "app/shared/model/micropartener/partener-category-validator.model";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { ITender } from "app/shared/model/microprovider/tender.model";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { active } from "d3-transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import SelectionValidationUpdate from "./selection-validation-update";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        width: '45%',
        [theme.breakpoints.down("sm")]:{
            width: '95%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: theme.palette.grey[100],
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
        paddingTop: 7,
        paddingBottom:7,
    },
    cardcontent:{
      background: 'white',
      minHeight: '35vh',
      maxHeight: '80vh',
      overflow: 'auto',  
    },
}))

const SelectionEvaluationRow = (props: {validator: IUserExtra, 
        selection: ITenderProviderSelectionValidation,
        account: any, readonly?:boolean,
        onUpdateSelection?:Function}) =>{
    const { validator, selection, account, readonly} = props;
    const [validation, setValidation] = useState<ITenderProviderSelectionValidation>(null);
    const [loading, setLoading] = useState(false);
    const [openJustification, setOpenJustification] = useState(false);
    const [validationToUpdate, setValidationToUpdate] = useState<ITenderProviderSelectionValidation>({});
    const [open, setOpen] = useState(false);

    const getValidation = () =>{
        if(validator && selection){
            setLoading(true);
            axios.get<ITenderProviderSelectionValidation[]>(`${API_URIS.providerSelectionValidationApiUri}/?validatorId.equals=${validator.id}&selectionId.equals=${selection.id}`)
                .then(res =>{
                    if(res.data && res.data.length !== 0)
                        setValidation({...res.data[0]});
                    else
                        setValidation(null);
            }).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getValidation();
    }, [props.validator, props.selection])

    const handleUpdate = () =>{
        if(validation){
            setValidationToUpdate({...validation});
        }else{
            setValidationToUpdate({
                approved: false,
                justification: null,
                selection,
                validatorId: validator.id
            })
        }
        setOpen(true);
    }

    const handleSave = (saved?: ITenderProviderSelectionValidation) =>{
        if(saved){
            setValidation(saved)
            setOpen(false);
        }
    }

    const handleUpdateSelection = (selec) =>{
        if(selec && props.onUpdateSelection){
            props.onUpdateSelection(selec);
        }
    }

    const fullName = validator.employee ? `${validator.employee.firstName || ''} ${validator.employee.lastName || ''}` 
                     : validator.user ?  `${validator.user.firstName || ''} ${validator.user.lastName || ''}` : ''

    const canEdit = !readonly && account && validator && account.id && validator.user && account.id === validator.user.id

    return (
        <React.Fragment>
            {(validator && selection ) && <>
                <SelectionValidationUpdate 
                    validation={validationToUpdate} open={open} 
                    onSave={handleSave} onClose={() => setOpen(false)}
                    onUpdateSelection={handleUpdateSelection}/>
                <TableRow>
                    <TableCell>
                        <Typography className="text-capitalize">{fullName}</Typography>
                    </TableCell>
                    <TableCell>
                        <Typography align="center" className="">
                            {validation ? translate(`_global.label.${validation.approved ? 'yes': 'no'}`): 'N/A'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography align="center" className="">
                            {(validation  && validation.justification ) ? (
                                <IconButton color="primary" onClick={() => setOpenJustification(!openJustification)}>
                                    {openJustification ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ) : 'N/A'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography align="center" className="">
                            {canEdit ? (
                                <IconButton 
                                    color="primary" 
                                    title={translate("entity.action.edit")}
                                    onClick={handleUpdate}>
                                    <Edit />
                                </IconButton>
                            ) : (
                                <FontAwesomeIcon icon={faLock} />
                            )}
                        </Typography>
                    </TableCell>
                </TableRow>
                {validation && 
                    <TableRow>
                        <TableCell colSpan={10} className="border-0 m-0 p-0">
                            <Collapse in={openJustification}
                                unmountOnExit
                                timeout={300}>
                                        <Box width="98%" display="flex" flexDirection="column" 
                                            flexWrap="wrap" overflow="auto"
                                            boxShadow={5} borderRadius={7} m={1} p={3}>
                                            <Typography variant="h3" color="secondary">
                                                Justification
                                            </Typography>
                                            <Divider  className="mb-2"/>
                                            <Typography>{validation.justification}</Typography>
                                        </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                }
            </>}
        </React.Fragment>
    )
}

interface SelectionValidationProps{
    selection: ITenderProviderSelectionValidation,
    tender: ITender,
    open?:boolean,
    readonly?:boolean,
    account:any,
    onClose:Function,
    onUpdateSelection?: Function
}

export const SelectionValidation = (props: SelectionValidationProps) =>{
    const { open, selection, account, tender } = props;
    const [loading, setLoading] = useState(false);
    const [validators, setValidators] = useState<IUserExtra[]>([]);
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemPerPage] = useState(ITEMS_PER_PAGE);
    const [totalItems, setTotalItems] = useState(0);
    const classes = useStyles();

    const getValidators = () =>{
        if(selection && tender){
            setLoading(true);
            let requestUri = `${API_URIS.partenerCategoryValidatorApiUri}/?categoryId.equals=${tender.targetCategoryId}`;
            requestUri = `${requestUri}&page=${activePage}&size=${itemsPerPage}`;
            axios.get<IPartenerCategoryValidator[]>(requestUri).then(result =>{
                if(result.data && result.data.length !== 0){
                    setLoading(true)
                    axios.get<IUserExtra[]>(`${API_URIS.userExtraApiUri}/?id.in=${[...result.data].map(v => v.userId).join(',')}`)
                        .then(res =>{
                            setValidators([...res.data])
                        }).catch(e => console.log(e)).finally(() => setLoading(false))
                }
            }).catch(err => console.log(err)).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getValidators();
    }, [active])

    const handleClose = () => {
        props.onClose();
    }

    const handleUpdateSelection = (select) =>{
        if(select && props.onUpdateSelection)
            props.onUpdateSelection(select);
    }

    const items = [...validators].map(v => <SelectionEvaluationRow key={v.id} validator={v} account={account} 
                                                selection={selection} readonly={props.readonly}
                                                onUpdateSelection={handleUpdateSelection}/>)

    return (
        <React.Fragment>  
            <Modal
                open={open}
                onClose={handleClose}
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
                disableBackdropClick
                closeAfterTransition
                className={classes.modal}
            >
                <Card className={classes.card}>
                    <CardHeader 
                        title={<Box display="flex" flexWrap="wrap" overflow="hidden">
                                <Typography variant="h4" className="mr-5">
                                    {translate("microgatewayApp.microproviderTenderProviderSelectionValidation.home.title")}
                                </Typography>
                        </Box>}
                        action={<IconButton color="inherit" onClick={handleClose}>
                            <Close />
                        </IconButton>}
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <Box width={1} overflow="auto">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="text-capitalize">
                                            {translate("_global.label.validator")}
                                        </TableCell>
                                        <TableCell align="center" className="text-capitalize">
                                            {translate("microgatewayApp.microproviderTenderProviderSelectionValidation.approved")}
                                        </TableCell>
                                        <TableCell align="center" className="text-capitalize">
                                            {translate("microgatewayApp.microproviderTenderProviderSelectionValidation.justification")}
                                        </TableCell>
                                        <TableCell align="center" className="text-capitalize">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading && <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            <Typography variant="h4" className="text-primary">Loading...</Typography>
                                        </TableCell>
                                    </TableRow>}
                                    {items}
                                    {(!loading && (!validators || validators.length ===0)) && <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            <Typography>
                                                {translate("_global.label.noValidatorFound")}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                        {loading && <Box textAlign="center" width={1}>Loading...</Box>}
                    </CardContent>
                </Card>
            </Modal>
        </React.Fragment>
    )
}

export default SelectionValidation;