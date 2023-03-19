import { IPartenerField } from "app/shared/model/micropartener/partener-field.model";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import { API_URIS } from "app/shared/util/helpers";
import React, { useEffect, useState } from "react"
import axios from 'axios';
import { Backdrop, Box, BoxProps, Card, CardContent, CardHeader, IconButton, makeStyles, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { Close, Visibility } from "@material-ui/icons";
import { IField } from "app/shared/model/micropartener/field.model";
import { translate } from "react-jhipster";
import { PartenerFieldItem } from "./partener";
import MyCustomModal from "app/shared/component/my-custom-modal";

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
      borderRadius: '0 0 15px 15px',  
    },
}))

interface PartenerVisualizerProps{
    id: any,
    rootBoxProps?: BoxProps,
}

interface PartenerVisualizerDetailPorps{
    partener: IPartener,
    open?: boolean,
    rootBoxProps?: BoxProps,
    onClose?: Function
}

export const PartenerVisualizerDetail = (props: PartenerVisualizerDetailPorps) =>{
    const { partener, open } = props;
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState<IField[]>([])
    const classes = useStyles();

    const getFields = () =>{
        if(partener && partener.category && partener.category.id){
            setLoading(true);
            axios.get<IField[]>(`${API_URIS.partenerFieldModelApiUri}/?categoryId.equals=${partener.category.id}`)
                .then(res =>{
                    setFields([...res.data]);
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }


    useEffect(() =>{
        getFields();
    }, [])

    const handleClose = () => props.onClose();

    return (
        <React.Fragment>
        <MyCustomModal
            open={open}
            onClose={handleClose}
            rootCardClassName={classes.card}
            title={partener ? partener.name || '' : ''}
        >   
            <Box width={1}>
              {partener && <>
                <Table>
                    <TableHead>
                            {partener ? (
                                <>
                                {loading && 
                                    <TableRow>
                                        <TableRow>
                                            <TableCell colSpan={100} align="center">
                                                <Typography variant="h4" color="secondary">Loading...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableRow>
                                }
                                <TableRow>
                                    <TableCell>
                                        <Typography className="font-weight-bold">
                                            {translate("microgatewayApp.micropartenerPartener.name")}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">{partener.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Typography className="font-weight-bold">
                                            {translate("microgatewayApp.micropartenerPartener.email")}
                                        </Typography>
                                        </TableCell>
                                    <TableCell align="center">{partener.email}</TableCell>
                                </TableRow>
                                {fields && fields.length !== 0 &&
                                    <>
                                        {fields.sort((a,b) =>b.id-a.id).map(f =>(
                                            <TableRow key={f.id}>
                                                <TableCell>
                                                    <Typography className="font-weight-bold">
                                                        {f.label}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <PartenerFieldItem partener={partener} field={f} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                }
                                </>
                            ):(
                                <TableRow>
                                    <TableCell colSpan={100} align="center">
                                        <Typography variant="h4">
                                            {translate("microgatewayApp.micropartenerPartener.home.notFound")}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableHead>
                </Table>
                </>}
            </Box>
        </MyCustomModal>
        </React.Fragment>
    )

}
export const PartenerVisualizer = (props: PartenerVisualizerProps) =>{
    const { rootBoxProps } = props;
    const [partener, setPartener] = useState<IPartener>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const getPartener = () =>{
        if(props.id){
            setLoading(true);
            axios.get<IPartener>(`${API_URIS.partenerApiUri}/${props.id}`)
                .then(res =>{
                    setPartener(res.data);
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getPartener();
    }, [props.id])
    
    return(
        <React.Fragment>
            {partener && <PartenerVisualizerDetail  open={open} partener={partener} onClose={() => setOpen(false)}/>}
            {loading && 'Loading...'}
            {(!loading && partener) && <Box display="flex" alignItems="center" {...rootBoxProps}>
                {partener.name || ''}
                <IconButton onClick={() => setOpen(true)}
                     color="inherit" className="ml-3 p-0">
                         <Visibility />
                </IconButton>
            </Box>}
        </React.Fragment>
    )
}

export default PartenerVisualizer;