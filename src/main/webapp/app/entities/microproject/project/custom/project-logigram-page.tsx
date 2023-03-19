import { IRootState } from 'app/shared/reducers';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getEntity as getProject } from '../project.reducer'
import { Helmet } from 'react-helmet';
import axios from 'axios';
import ProjectLogigram from './project-logigram';
import { API_URIS } from 'app/shared/util/helpers';
import { IProjectTask } from 'app/shared/model/microproject/project-task.model';

const taskApiUrl = API_URIS.projectTaskApiUri;

export interface ILogigramPageProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}
export const ProjectLogigramPage = (props: ILogigramPageProps) =>{
    const [tasks, setTasks] = useState<IProjectTask[]>([]);
    const [loading, setLoading] = useState(false);
    
    const getTasks = () =>{
        axios.get<IProjectTask[]>(`${taskApiUrl}/?processId.equals=${props.match.params.id}`).then(res =>{
            if(res.data){
                setTasks([...res.data]);
            }
            setLoading(false);
        }).catch(e => {
            setLoading(false);
        });
    }

    useEffect(() =>{
        setLoading(true)
        props.getProject(props.match.params.id);
        getTasks();
    }, [])

    return (
        <React.Fragment>
            <Helmet><title>Cperf | Project | Logigram</title></Helmet>
            {(props.loading && loading) && 'loading...'}
            {(!props.loading && !loading) &&
             <ProjectLogigram project={props.project} tasks={tasks}/>
             }
        </React.Fragment>
    );
}


const mapStateToProps = (storeState: IRootState) => ({
    project: storeState.project.entity,
    loading: storeState.project.loading,
  });
  
  const mapDispatchToProps = {
    getProject,
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(ProjectLogigramPage);