import { Box, LinearProgress, Typography } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab";
import React from "react"
import { translate } from "react-jhipster"

export const UploadingFilesOrSavingShortsFilesProgress = (props: {progress: number, saving?: boolean}) =>{
    const { progress, saving } = props;
    return (
        <React.Fragment>
            <Box width={1} display="flex" justifyContent="center" alignItems="center" flexWrap="wrap">
                <Typography variant="caption">{translate(`_global.label.${saving ? 'saving' : 'loading'}`)}</Typography>
                <Box width={'30%'} ml={2} mr={2}>
                        <LinearProgress 
                            color="primary"
                            variant="buffer" 
                            value={progress}
                            valueBuffer={(progress +1)}
                            style={{ height:10, borderRadius:5, }} 
                        />
                </Box>
                <Typography variant="caption">{`${progress.toFixed(0)} %`}</Typography>
            </Box>
        </React.Fragment>
    )
}

export const LargeFileUploadingAlterInfo = (props) =>{
    return (
        <React.Fragment>
            <Box width={1} display="flex" flexWrap={"wrap"}>
                <Alert severity="info" style={{ width: '100%' }}>
                    <AlertTitle>{translate("_global.label.fileSaveOnProgress")}</AlertTitle>
                    {translate("_global.label.largeFileSavingDesc")}
                </Alert>
            </Box>
        </React.Fragment>
    )
}