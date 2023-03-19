import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, Typography } from "@material-ui/core"
import React from "react"
import { translate } from "react-jhipster"

export const ServiceUnavailable = (props) =>{
    return (
        <React.Fragment>
            <Box width={1} display="flex" justifyContent="center" flexWrap="wrap"
                alignItems="flex-end" mt={5} mb={5}>
                <FontAwesomeIcon  icon={faExclamationTriangle} size="3x" className="text-warning"/>
                <Typography variant="h3" className="ml-3 mr-3 text-warning">
                    {translate("_global.label.nnavailableService")+' !'}
                </Typography>
            </Box> 
        </React.Fragment>
    )
}