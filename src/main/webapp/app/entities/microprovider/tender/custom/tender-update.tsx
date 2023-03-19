import { IRootState } from "app/shared/reducers"
import React from "react"
import { getSession } from 'app/shared/reducers/authentication'
import { connect } from "react-redux"
import { ITender } from "app/shared/model/microprovider/tender.model"
import { useState } from "react"
import { Backdrop, Box, makeStyles, Modal, Slide } from "@material-ui/core"
import { useEffect } from "react"
import { ITenderFile } from "app/shared/model/microprovider/tender-file.model"
import TenderUpdateForm from "./tender-update-form"
import TenderFieldUpdate from "./tender-field-update"

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
}))

interface TenderUpdateProps extends StateProps, DispatchProps{
    open?:boolean,
    tender?:ITender,
    locked?:boolean,
    onSave?:Function,
    onClose:Function,
}

export const TenderUpdate = (props: TenderUpdateProps) =>{
    const { open, account, locked } = props;
    const [tender, setTender] = useState<ITender>(props.tender || {});
    const [files, setFiles] = useState<ITenderFile[]>([]);
    const [step, setStep] = useState(0);

    const classes = useStyles();

    useEffect(() =>{
        if(!props.account)
            props.getSession();
    }, [])

    useEffect(() =>{
        setTender(props.tender || {});
    }, [props.tender])

    const handleClose = () => {
        setTender({});
        setStep(0);
        props.onClose();
    }

    const handleSave = (saved?:ITender, isNew?:boolean) =>{
        if(saved){
            setTender(saved)
            setStep(2);
            if(props.onSave)
                props.onSave(saved, isNew);
        }
    }

    const handleNext = () =>{
        setStep(2);
    }

    const handlePreview = () =>{
        setStep(1);
    }

    const handleChange = (newTender?: ITender) =>{
        if(newTender)
            setTender(newTender)
    }

    const handleCallFiels = (called?:ITenderFile[]) =>{
        setFiles([...called])
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
                                <TenderUpdateForm
                                    account={account}
                                    locked={locked}
                                    tender={tender}
                                    onClose={handleClose}
                                    onSave={handleSave}
                                    onNext={handleNext}
                                    onCallFiles={handleCallFiels}
                                    onChange={handleChange}
                                />
                        </Box>
                    </Slide>}
                {step > 1 && <Slide
                        in={open}
                        direction={step <=0 ? 'down' : 'left'}
                        timeout={1000}
                    >
                    <Box width={1} p={0} m={0} display="flex" justifyContent="center">
                       <TenderFieldUpdate
                            tenderId={tender.id}
                            locked={locked}
                            onClose={handleClose}
                            onPreview={handlePreview}
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

export default connect(mapStateToProps, mapDispatchToProps)(TenderUpdate);
