import { Box, Card, CardContent, CardHeader, Collapse, Divider, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { IEvaluationCriteria } from "app/shared/model/micropartener/evaluation-criteria.model";
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { IUserExtra } from "app/shared/model/user-extra.model";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";
import { IProviderEvaluation } from "app/shared/model/microprovider/provider-evaluation.model";
import { translate } from "react-jhipster";
import { Edit, Visibility, VisibilityOff } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import EvaluationUpdate from "./evaluation-update";

const useStyles = makeStyles(theme =>({
    card:{
        width: '100%',
        marginBottom: theme.spacing(1),
    },
    cardheader:{
        background: theme.palette.primary.dark,
        color: 'white',
        borderRadius: '15px 15px 0 0',
        paddingTop: 5,
        paddingBottom: 5,
    },
    cardcontent:{
    },
}))

interface UserEvaluationProps{
    evaluator: IUserExtra,
    answer: ITenderAnswer,
    providerId?:any,
    account:any,
    readonly?: boolean,
    onSave?:Function
}


const UserEvaluationRow = (props: { c: IEvaluationCriteria, ev: IProviderEvaluation, readonly?:boolean,
             onEdit?:Function, account:any, evaluator: IUserExtra}) =>{
    const {c, ev, readonly, evaluator, account} = props;
    const [open, setOpen] = useState(false);

    const handleEdit = () =>{
        if(!readonly && props.onEdit)
            props.onEdit(ev,c);
    }



    const canEdit = (evaluator && evaluator.user && account && account.id && account.id === evaluator.id)

    return (
        <>
        <TableRow >
            <TableCell>{c.name}</TableCell>
            <TableCell align="center">{c.ponderation}</TableCell>
            <TableCell align="center">
                {(ev.note  || ev.note === 0) ? `${ev.note}/${ev.scale}` : '...'}
            </TableCell>
            <TableCell align="center">
                {ev.justification ? (
                    <IconButton onClick={() => setOpen(!open)}>
                        {open ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                ):'...'}
            </TableCell>
            <TableCell align="center">
                {(!readonly && canEdit) ? (
                    <IconButton 
                        color="primary"
                        title={translate("entity.action.edit")}
                        onClick={handleEdit}
                        >
                        <Edit />
                    </IconButton>
                )
                :(
                    <FontAwesomeIcon icon={faLock} />
                )}
            </TableCell>
        </TableRow>
        {ev.justification && <TableRow>
        <TableCell colSpan={10} className="border-0 m-0 p-0">
                <Collapse in={open}
                    unmountOnExit
                    timeout={300}>
                            <Box width="98%" display="flex" flexDirection="column" 
                                flexWrap="wrap" overflow="auto"
                                boxShadow={5} borderRadius={7} m={1} p={3}>
                                <Typography variant="h3" color="secondary">
                                    {translate("microgatewayApp.microproviderProviderEvaluation.justification")}
                                </Typography>
                                <Divider  className="mb-2"/>
                                <Typography>{ev.justification}</Typography>
                            </Box>
                </Collapse>
            </TableCell>
        </TableRow>}
        </>
    )
}

export const UserEvaluation = (props: UserEvaluationProps) =>{
    const {evaluator, answer, readonly} = props;
    const [criterias, setCriterias] = useState<IEvaluationCriteria[]>([]);
    const [evaluations, setEvaluations] = useState<IProviderEvaluation[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openEditor, setOpenEditor] = useState(false);
    const [evaluation, setEvaluation] = useState<IProviderEvaluation>(null);
    const [criteria, setCriteria] = useState<IEvaluationCriteria>(null);
    const [moy, setMoy] = useState(0.0);
    const [recalculMoy, setRecalCulMoye] = useState(true);
    const classes = useStyles();

    const getEvCriterias = () =>{
        if(answer && answer.tender && answer.tender.targetCategoryId){
            setLoading(false);
            axios.get<IEvaluationCriteria[]>(`${API_URIS.partenerCategoryEvaluationCriteriaApiUri}/?categoryId.equals=${answer.tender.targetCategoryId}`)
                .then(res =>{
                    setCriterias([...res.data])
                }).catch(e => console.log(e))
                  .finally(() => setLoading(false))
        }else{
            setCriterias([])
        }
    }

    const getEvaluations = () =>{
        if(answer){
            setLoading(false);
            axios.get<IProviderEvaluation[]>(`${API_URIS.providerEvaluationApiUri}/?answerId.equals=${answer.id}&userId.equals=${evaluator.user.id}`)
                .then(res =>{
                    setEvaluations([...res.data])
                    setRecalCulMoye(!recalculMoy);
                }).catch(e => console.log(e))
                  .finally(() => setLoading(false))

        }else{
            setEvaluations([])
        }
    }

    const calculMoy = () =>{
        let sommeNotePondere = 0;
        let sommePonds = 0;
        const evs = [...evaluations].filter(e => e.note || e.note === 0);
        for(let i=0; i< evs.length; i++){
            const pond  = evs[i].ponderation || 1;
            sommeNotePondere = sommeNotePondere + (evs[i].note * pond);
            sommePonds = sommePonds + pond;
        }
        if(sommePonds === 0)
            sommePonds = 1;
        const tMoy =  sommeNotePondere / sommePonds;
        setMoy(Number(tMoy.toFixed(2)));
    }

    useEffect(() =>{
        getEvCriterias();
        getEvaluations();
    }, [props.answer])

    useEffect(() =>{
        calculMoy();
    }, [recalculMoy])

    const handleEdit = (ev: IProviderEvaluation, c: IEvaluationCriteria) =>{
        if(ev && c){
            setEvaluation(ev);
            setCriteria(c);
            setOpenEditor(true);
        }
    }

    const handleSave = (saved: IProviderEvaluation, isNew?:boolean) =>{
        if(saved){
            if(props.onSave)
                props.onSave(saved);
            if(isNew){
                setEvaluations([...evaluations, saved]);
                setOpenEditor(false);
            }else{
                setEvaluations([...evaluations.map(ev => ev.id === saved.id ? saved : ev)])
            }
            setRecalCulMoye(!recalculMoy)
        }
    }
    
   const fullName = evaluator.employee ? `${evaluator.employee.firstName || ''} ${evaluator.employee.lastName || ''}` 
                    : evaluator.user ?  `${evaluator.user.firstName || ''} ${evaluator.user.lastName || ''}` : ''
    return (
        <React.Fragment>
            {(evaluation && criteria) && <EvaluationUpdate 
                evaluation={evaluation} 
                onClose={() => setOpenEditor(false)}
                open={openEditor}
                criteria={criteria}
                providerId={props.providerId}
                userFullName={fullName}
                onSave={handleSave}
             />}
            <Card className={classes.card}>
                <CardHeader 
                    title={<Box display="flex" alignItems="center" flexWrap="wrap">
                        <Typography className="text-capitalize mr-5">{translate("_global.label.evaluator")}</Typography>
                        <Typography className="text-capitalize">{fullName}</Typography>
                    </Box>}
                    action={<IconButton onClick={() => setOpen(!open)} color="inherit">
                        {open ? <Visibility /> : <VisibilityOff />}
                    </IconButton>}
                    subheader={
                        <Box width={1} textAlign="center">
                            <Typography className="text-white">
                                {[...evaluations].filter(e => e.note || e.note === 0).length !== 0 ? (
                                    <>
                                    {`${translate("_global.label.average")} = ${moy}/${[...evaluations].length !== 0 ? evaluations[0].scale || 20 : 20}`}
                                    </>
                                ): 'N/A'}
                            </Typography>
                        </Box>
                    }
                    className={classes.cardheader}
                />
               {open &&
                <CardContent className={classes.cardcontent}>
                    <Collapse in={open} timeout={500} className="m-0 p-0">
                        <Box width={1} overflow="auto">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{translate("microgatewayApp.micropartenerEvaluationCriteria.detail.title")}</TableCell>
                                        <TableCell align="center">{translate("microgatewayApp.micropartenerEvaluationCriteria.ponderation")}</TableCell>
                                        <TableCell align="center">{translate("microgatewayApp.microproviderProviderEvaluation.note")}</TableCell>
                                        <TableCell align="center">{translate("microgatewayApp.microproviderProviderEvaluation.justification")}</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell align="center" colSpan={10}>
                                                <Typography variant="caption">Loading...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ):(
                                        [...criterias].length !== 0 ? (
                                            [...criterias].map(c =>{
                                                const ev = [...evaluations].find(e => e.criteriaId === c.id) || {
                                                    answer,
                                                    criteriaId: c.id,
                                                    userId: evaluator.user.id,
                                                };
                                                return <UserEvaluationRow key={c.id} c={c} ev={ev} readonly={readonly}
                                                        onEdit={handleEdit} account={props.account} evaluator={evaluator}/>
                                            })
                                        ):(
                                            <TableRow>
                                                <TableCell align="center" colSpan={10}>
                                                    <Typography variant="caption">
                                                        {translate("microgatewayApp.micropartenerEvaluationCriteria.home.notFound")}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </CardContent>}
            </Card>
        </React.Fragment>
    )
}

export default UserEvaluation;