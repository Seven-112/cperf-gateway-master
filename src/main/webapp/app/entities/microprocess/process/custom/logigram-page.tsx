import { IProcess } from 'app/shared/model/microprocess/process.model';
import { ITask } from 'app/shared/model/microprocess/task.model';
import { IRootState } from 'app/shared/reducers';
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getEntity as getProcess } from '../../process/process.reducer';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Logigram from './logigram';
import { cleanEntity } from 'app/shared/util/entity-utils';

const taskApiUrl = 'services/microprocess/api/tasks';

export interface ILogigramPageProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}
export const LogigramPage = (props: ILogigramPageProps) =>{
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [loading, setLoading] = useState(false);
    
    const getTasks = () =>{
        if(props.match.params.id){
            axios.get<ITask[]>(`${taskApiUrl}/getByProcessId/${props.match.params.id}`)
            .then(res =>{
                if(res.data){
                    setTasks(res.data);
                    console.log('res_data_size '+res.data.length);
                }
                setLoading(false);
            }).catch(e => {
                setLoading(false);
            });
        }
    }

    useEffect(() =>{
        setLoading(true)
        props.getProcess(props.match.params.id);
        getTasks();
    }, [])
    

    return (
        <React.Fragment>
            <Helmet><title>Cperf | Process | Logigram</title></Helmet>
            {(props.loading && loading) && 'loading...'}
            {(!props.loading && !loading) &&
             <Logigram process={props.process} tasks={tasks}/>
             }
        </React.Fragment>
    );
}


const mapStateToProps = (storeState: IRootState) => ({
    process: storeState.process.entity,
    loading: storeState.process.loading,
  });
  
  const mapDispatchToProps = {
    getProcess,
  };
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(LogigramPage);