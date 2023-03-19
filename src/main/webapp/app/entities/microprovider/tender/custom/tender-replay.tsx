import { IRootState } from "app/shared/reducers"
import React from "react"
import { getSession } from 'app/shared/reducers/authentication'
import { connect } from "react-redux"
import { useState } from "react"
import { Backdrop, Box, makeStyles, Modal, Slide } from "@material-ui/core"
import { useEffect } from "react"
import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model"
import { TenderAnswerUpdate } from "../../tender-answer/custom/tender-answer-update"
import TenderAnswerQuestionnaire from "../../tender-answer/custom/tender-answer-quetionnaire"

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
        background: theme.palette.background.paper,
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

interface TenderReplayProps extends StateProps, DispatchProps{
    open?:boolean,
    answer:ITenderAnswer,
    locked?:boolean,
    onSave?:Function,
    onClose:Function,
}

export const TenderReplay = (props: TenderReplayProps) =>{
    const { open, account, locked } = props;
    const [step, setStep] = useState(0);
    const [answer, setAnswer] = useState(props.answer);

    const classes = useStyles();


    useEffect(() =>{
        setAnswer(props.answer)
        if(!props.account)
            props.getSession();
    }, [])

    const handleClose = () => props.onClose();

    const handleSave = (saved?: ITenderAnswer, isNew?:boolean) =>{
        if(saved){
            setAnswer(saved);
            if(props.onSave)
                props.onSave(saved, isNew);
        }
    }

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
            <React.Fragment>
            {step <=1 && 
                <Slide
                        in={open}
                        direction={step <=0 ? 'down' : 'right'}
                        timeout={step === 1 ? 1000 : 300}
                    >
                    <Box width={1} p={0} m={0} display="flex" justifyContent="center">
                            <TenderAnswerUpdate 
                                account={account}
                                answer={answer} 
                                locked={locked}
                                onClose={handleClose}
                                onSave={handleSave}
                                onNext={() => setStep(2)}/>
                    </Box>
                </Slide>}
                {step > 1 && <Slide
                        in={open}
                        direction={step <=0 ? 'down' : 'left'}
                        timeout={1000}
                    >
                    <Box width={1} p={0} m={0} display="flex" justifyContent="center">
                        <TenderAnswerQuestionnaire 
                            answer={answer}
                            locked={locked}
                            onPreview={() => setStep(1)}
                            onClose={handleClose}
                        />
                    </Box>
                </Slide>}
            </React.Fragment>
            </Modal>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication }:IRootState) =>({
    account: authentication.account,
})

const mapDispatchToProps = {
    getSession
}

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TenderReplay);