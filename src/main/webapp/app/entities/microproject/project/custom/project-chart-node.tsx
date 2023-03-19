import { Box, Card, CardActions, CardContent, CardHeader, makeStyles, Typography } from "@material-ui/core";
import MyCustomPureHtmlRender from "app/shared/component/my-custom-pure-html-render";
import { IProject } from "app/shared/model/microproject/project.model";
import { IChronoUtil } from "app/shared/util/chrono-util.model";
import { API_URIS } from "app/shared/util/helpers";
import React, { useEffect, useState } from "react";
import ProjectButtonsControlPalette from "./project-buttons-control-palette";
import axios from 'axios';
import ChronoVisualizer from "app/shared/component/chrono-visualizer";
import clsx from "clsx";

const useStyles = makeStyles(theme =>({
    rootNodeCard:{
        border: `2px solid ${theme.palette.primary.dark}`,
        borderRadius: '7px',
    },
    card:{
        minWidth: 100,
        maxWidth:300,
        border: `2px solid ${theme.palette.primary.dark}`,
        borderRadius: '7px',
    },
    cardHeader:{
        maxHeight: 110,
        overflow: 'auto',
        borderBottom: `2px solid ${theme.palette.primary.dark}`,
        background: theme.palette.primary.main,
        color: 'white',
    },
    cardContent:{
        maxHeight: 110,
        overflow: 'auto',
    },
    cardAction:{
        borderTop: `2px solid ${theme.palette.primary.dark}`,
        marginTop: 7,
        background: theme.palette.primary.main,
        padding:0,
    },
}))

const RootNode = (props) =>{
    const title = props.title;
    const classes = useStyles();
    return (
        <React.Fragment>
            <Box>
                <Card className={classes.rootNodeCard}>
                    <CardHeader 
                        title={title}
                        titleTypographyProps={{
                            variant: 'h3',
                            color: 'primary',
                        }}
                    />
                </Card>
            </Box>
        </React.Fragment>
    )
}

export const ProjectChartNode = ({nodeData}) =>{
    const project: IProject = nodeData.project;
    const classes = useStyles();
    const [chronoUtil, setChronoUtil] = useState<IChronoUtil>(null);
    const [chrnonLoaing, setChronoLoading] = useState(false);
    const [projectProgress, setProjectProgress] = useState(0);
    const [projectProcessLoading, setProjectProgressLoading] = useState(false);

    const getChronoData = () =>{
        if(project && project.id){
            setChronoLoading(true)
            axios.get<IChronoUtil>(`${API_URIS.projectApiUri}/getChronoUtil/${project.id}`)
                .then(res =>{
                    setChronoUtil(res.data)
                }).catch((e) => console.log(e))
                .finally(() => setChronoLoading(false))
        }    
    }

    const getProgress = () =>{
        if(nodeData && nodeData.project && nodeData.project.id){
            setProjectProgressLoading(true)
            const projectId = nodeData.project.id;
            axios.get<number>(`${API_URIS.projectApiUri}/progress/${projectId}`)
                .then(res => setProjectProgress(res.data))
                .catch(e => console.log(e))
                .finally(() => setProjectProgressLoading(false))
        }
    }

    useEffect(() =>{
        getChronoData();
        getProgress();
    }, [nodeData])

    return (
        <React.Fragment>
            {nodeData && <>
                {!project ? (
                    <RootNode title={nodeData.title}/>
                ):(
                    <Box p={0} m={0} boxShadow={1}>
                        <Card className={classes.card}>
                            <CardHeader 
                                title={project ? project.label : nodeData.title}
                                titleTypographyProps={{  }}
                                className={classes.cardHeader}
                            />
                            <CardContent className={classes.cardContent}>
                                <Box display={"flex"} justifyContent="center" width={1} mb={2}>
                                    <span className={clsx('badge badge-pill', {
                                        'badge-secondary': !projectProgress,
                                        'badge-warning': projectProgress && projectProgress <50,
                                        'badge-info' : projectProgress && projectProgress >50 && projectProgress && projectProgress <=70,
                                        'badge-success' : projectProgress && projectProgress > 70,
                                    })}>
                                        {projectProcessLoading ? 'loading...': `${projectProgress || 0}%`}
                                    </span>
                                </Box>
                                <ChronoVisualizer chronoUtil={chronoUtil} loading={chrnonLoaing} />
                            </CardContent>
                            <CardActions className={classes.cardAction}>
                                <ProjectButtonsControlPalette 
                                    project={project}
                                    orientation="horizontal"
                                    readonly
                                    rootBoxProps={{
                                        width: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexWrap:'wrap',
                                        alignContent: 'center',
                                        color: 'white'
                                    }}
                                    buttonGroupProps={{
                                        color: 'inherit',
                                        variant: 'contained',
                                        size: 'small',
                                        fullWidth: true,
                                        style:{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }
                                    }}
                                />
                            </CardActions>
                        </Card>
                    </Box>
                )}
            </>}
        </React.Fragment>
    )
}

export default ProjectChartNode;