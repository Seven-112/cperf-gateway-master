import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { makeStyles } from "@material-ui/core"
import MyCustomModal from "app/shared/component/my-custom-modal"
import { IAuditCycle } from "app/shared/model/microrisque/audit-cycle.model"
import theme from "app/theme"
import React from "react"
import { translate } from "react-jhipster"
import AuditCycle from "./audit-cycle"

const useStyles = makeStyles({
    modal: {
        width: '35%',
        [theme.breakpoints.down('sm')] : {
            width: '80%',
        }
    }
})

interface AduitCycleSelectorProps{
    open: boolean,
    onClose: Function,
    onSelect: Function,
}

export const AuditCycleSelector = (props: AduitCycleSelectorProps) =>{

    const { open } = props;

    const classes = useStyles();

    const handleSelect = (selected: IAuditCycle) => props.onSelect(selected);
    const handleClose = () =>props.onClose();

    return (
        <React.Fragment>
            <MyCustomModal
                open={open}
                onClose={handleClose}
                avatarIcon={<FontAwesomeIcon icon={faCircleNotch} />}
                title= {translate("microgatewayApp.microrisqueAuditCycle.home.title")}
                rootCardClassName={classes.modal}
            >
                <AuditCycle 
                    selectOnly
                    onSelect={handleSelect}
                />
            </MyCustomModal>
        </React.Fragment>
    )
}

export default AuditCycleSelector;
