import { Box, makeStyles } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab";
import React, { useState } from "react"

const useStyles = makeStyles(theme =>({

}))

export const AgendaMainSkeleton = (props) =>{
    const classes = useState();
    return (
        <React.Fragment>
            <Box width={1} height="13vh">
                <Skeleton animation="pulse" height="100%"/>
            </Box>
            <Box width={1} height="75vh">
                <Skeleton animation="wave" height={100} />
            </Box>
        </React.Fragment>
    )
}

export default AgendaMainSkeleton;