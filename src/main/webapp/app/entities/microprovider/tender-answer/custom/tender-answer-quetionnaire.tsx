import React from "react"
import { useState } from "react"
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core"
import { translate } from "react-jhipster"
import { Close, KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons"
import { useEffect } from "react"
import axios from "axios";
import { API_URIS } from "app/shared/util/helpers"
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model"
import { ITenderAnswerField } from "app/shared/model/microprovider/tender-answer-field.model"
import { IDynamicField } from "app/shared/model/dynamic-field.model"
import { updateEntity, createEntity, deleteEntity, reset} from 'app/entities/microprovider/tender-answer-field/tender-answer-field.reducer'
import { connect } from "react-redux"
import { IRootState } from "app/shared/reducers"
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model"
import { DynamicFieldTag } from "app/shared/model/enumerations/dynamic-field-tag.model"
import DynamicFieldWrapper from "app/entities/dynamic-field/custom/fields/dynamic-field-wrapper"
import { DynamicFieldType } from "app/shared/model/enumerations/dynamic-field-type.model"
import { cleanEntity } from "app/shared/util/entity-utils"
import FieldNameVisualizer from "app/entities/dynamic-field/custom/fields/field-name-visualizer"

const useStyles = makeStyles(theme =>({
    card:{
        background: 'transparent',
        width: '47%',
        [theme.breakpoints.down("sm")]:{
            width: '97%',
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
    cardActions:{
        background: 'white',
        margin: 0,
    },
}))

interface TenderAnswerQuestionnaireProps extends StateProps, DispatchProps{
    answer:ITenderAnswer,
    locked?:boolean,
    onClose?: Function,
    onNext?: Function,
    onPreview?:Function,
}

export const TenderAnswerQuestionnaire = (props: TenderAnswerQuestionnaireProps) =>{
    const { account, locked, answer} = props;
    const [loading, setLoading] = useState(false);
    const [tenderFields, setTenderFields] = useState<IDynamicField[]>([]);
    const [answerFields, setAnswerFields] = useState<ITenderAnswerField[]>([]);
    const classes = useStyles();

    const getTenderFields = () =>{
        if(answer && answer.tender){
            setLoading(true);
            axios.get<IDynamicField[]>(`${API_URIS.dynamicFieldApiUri}/?entityId.equals=${answer.tender.id}&tag.equals=${DynamicFieldTag.TENDER}`)
                .then(res =>{
                    if(res.data)
                        setTenderFields([...res.data]);
                }).catch((e) => console.log(e)).finally(() =>setLoading(false))
        }
    }

    const getAnswerFields = () =>{
        if(answer && answer.tender){
            setLoading(true);
            axios.get<ITenderAnswerField[]>(`${API_URIS.tenderAnswerFieldApiUri}/?answerId.equals=${answer.id}`)
                .then(res =>{
                    if(res.data)
                        setAnswerFields([...res.data]);
                }).catch((e) => console.log(e))
                .finally(() =>{
                    getTenderFields();
                })
        }
    }

    useEffect(() =>{
        getAnswerFields();
    }, [])

    useEffect(() =>{
        if(props.updateSuccess && props.answerField && ![...answerFields].some(af => af.id === props.answerField.id)){
            setAnswerFields([props.answerField, ...answerFields]);
            props.reset();
        }
    }, [props.updateSuccess])

    const saveFiles = (files: IMshzFile[], f:IDynamicField) =>{
        if(f && files){
            files.map(sf =>{
              const entity:ITenderAnswerField = {
                answer,
                fieldId: f.id,
                val: null,
                fileId: sf.id,
                fileName: sf.name
            }
            axios.post<ITenderAnswer>(`${API_URIS.tenderAnswerFieldApiUri}`, cleanEntity(entity))
                .then(res =>{
                    if(res.data)
                        setAnswerFields([res.data, ...answerFields])
                }).catch(e => console.log(e))
          })
        } 
    }

    const handleSave = (saved: any, f:IDynamicField) =>{
        if(saved && f){
            if(f.type !== DynamicFieldType.FILE){
                const finded = [...answerFields].find(af => af.fieldId === f.id) || {};
                const entity:ITenderAnswerField = {
                    ...finded,
                    answer,
                    fieldId: f.id,
                    val: saved,
                    fileId: null
                }
                entity.id ? props.updateEntity(entity) : props.createEntity(entity);
            }else{
                saveFiles([...saved], f);
            }
        } 
    }

    const handleDeleteFile = (deletedId: any, field?: IDynamicField) =>{
         if(deletedId && field){
            [...answerFields].filter(af => af.fieldId === field.id && af.fileId === deletedId)
                .map(af =>{
                    axios.delete(`${API_URIS.tenderAnswerFieldApiUri}/${af.id}`)
                        .then(res =>{
                            if(res.data)
                                setAnswerFields(answerFields.filter(item => item.id !== af.id))
                        }).catch(e => console.log(e))
                })
        }
    }

    const rowItems = [...tenderFields].map((tf, index) =>{
        const answerField = [...answerFields].find(af => af.fieldId===tf.id);
        return <TableRow key={index}>
                <TableCell>
                    <FieldNameVisualizer field={tf} />
                </TableCell>
                <TableCell align="center">
                    <DynamicFieldWrapper dynamicField={tf} 
                        value={answerField ? answerField.val : null}
                        readonly={locked} onSave={handleSave}
                        />
                </TableCell>
            </TableRow>
    })

    return (
        <React.Fragment>  
                <Card className={classes.card}>
                    <CardHeader 
                        title="Questionnaire"
                        titleTypographyProps={{
                            variant: 'h4',
                        }}
                        action={
                            props.onClose ?(
                                <IconButton 
                                    color="inherit"
                                    onClick={() => props.onClose()}>
                                    <Close />
                                </IconButton>
                            ): ''
                        }
                        className={classes.cardheader}
                    />
                    <CardContent className={classes.cardcontent}>
                        <Box width={1} overflow="auto">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            question
                                        </TableCell>
                                        <TableCell align="center">
                                            {translate("_global.label.response")}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading && <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>}
                                     {rowItems}
                                    {(!loading && [...tenderFields].length === 0) && <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            {translate("_global.label.noQuestion")}
                                        </TableCell>
                                    </TableRow>}
                                </TableBody>
                            </Table>
                        </Box>
                    </CardContent>
                    {(props.onPreview || props.onNext) && <CardActions className={classes.cardActions}>
                        <Box width={1} m={0} p={0} display="flex" justifyContent="space-between" alignItems="center">
                            {props.onPreview && 
                                <IconButton color="primary"  onClick={() => props.onPreview()} size="small">
                                    <KeyboardArrowLeft />
                                    <Typography className="ml-2">{translate("_global.label.back")}</Typography>
                                </IconButton>
                            }
                            {props.onNext &&
                                <IconButton color="primary" size="small" onClick={() => props.onNext()}>
                                    <Typography className="mr-2">{translate("_global.label.next")}</Typography>
                                    <KeyboardArrowRight />
                                </IconButton>
                            }
                        </Box>
                    </CardActions>}
                </Card>
        </React.Fragment>
    )
}

const mapStateProps = ({ authentication, tenderAnswerField }: IRootState) =>({
    account: authentication.account,
    updateSuccess: tenderAnswerField.updateSuccess,
    answerField: tenderAnswerField.entity,
})

const mapDispatchToProps={
    createEntity,
    updateEntity,
    deleteEntity,
    reset,
}

type StateProps = ReturnType<typeof mapStateProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateProps, mapDispatchToProps)(TenderAnswerQuestionnaire);