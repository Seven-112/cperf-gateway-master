import { Card, CardContent, CardHeader, Fab, Grid, IconButton, makeStyles, TextField } from "@material-ui/core";
import React from "react";2
import CloseIcon from '@material-ui/icons/Close';
import { Close } from "@material-ui/icons";
import { Translate } from "react-jhipster";

const useStyles = makeStyles(theme =>({
    root:{
        height: '100%',
        background: "transparent",
    },
    cardHeader:{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.background.paper,
    }
}));

interface ILogigramSidebarProps{
   element: {id: string, type?: string, position?: {x: number, y: number}, data?:{label?:string}, source?:string, target?: string},
   onClose: Function,
   onDeleteLinks: Function,
}
export const LogigramSidebar = (props: ILogigramSidebarProps) =>{
    const classes = useStyles();

    const elementLabel = () =>{
        if(props.element && props.element.data && props.element.data.label)
            return props.element.data.label;
        return "";
    }

    const elementCategorie = () : "task" | "edge" | "cond" =>{
        if(props.element.source || props.element.target){
            return "edge";
        }else{
            if(props.element.type==="cond")
            return "cond";
        }
        return "task";
    }

    return (
        <React.Fragment>
            {JSON.stringify(elementCategorie())}
            <Card className={classes.root}>
                <CardHeader className={classes.cardHeader}
                    title={<Translate contentKey="_global.logigram.controlPanel">Control Panel</Translate>}
                    action={ <IconButton color="inherit" onClick={() => props.onClose()}><Close color="inherit" /></IconButton> }
                />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} className="text-center">
                            {elementCategorie() !== 'edge' && <TextField label="Clicked element :" fullWidth
                                value={elementLabel()}
                            /> }
                            {elementCategorie() ==='task' &&
                                <div className="mt-3">
                                    <Fab color="primary" variant="extended" className="mt-3">
                                        <Translate contentKey="_global.logigram.viewTaskDetails">Detétail de la tâche</Translate>
                                    </Fab>
                                </div>
                            }
                            {elementCategorie() !== 'edge' &&
                            <div className="mt-3">
                                <Fab variant="extended" className="mt-3 bg-warning text-white" onClick={() =>props.onDeleteLinks()}>
                                    <Translate contentKey="_global.logigram.deleteLinks">Supprimer les liens</Translate>
                                </Fab>
                            </div>
                            }
                            {/* elementCategorie() !=='task' &&
                                <div className="mt-3">
                                    <Fab variant="extended" className="mt-3 bg-danger text-white" >
                                        <Translate contentKey="_global.logigram.deleteElement">Delete element</Translate>
                                    </Fab>
                                </div>
                        */}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </React.Fragment>
    );
}