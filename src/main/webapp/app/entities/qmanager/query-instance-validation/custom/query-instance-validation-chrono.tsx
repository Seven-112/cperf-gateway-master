import { IQueryInstance } from "app/shared/model/qmanager/query-instance.model";
import React, { useEffect, useState } from "react";
import { IChronoUtil } from "app/shared/util/chrono-util.model";
import ChronoVisualizer from "app/shared/component/chrono-visualizer";
import axios from 'axios';
import { API_URIS } from "app/shared/util/helpers";

export interface IQueryInstanceValidationChronoProps{
    instance: IQueryInstance;
    userId: any,
}

export const QueryInstanceValidationChrono = (props: IQueryInstanceValidationChronoProps) =>{
    const [chronoUtil, setChronoUtil] = useState<IChronoUtil>(null);
    const [loading, setLoading] = useState(false);

    const getChronoUtil = () =>{
      if(props.instance && props.instance.id && props.userId){
        setLoading(true);
        let requestUri = `${API_URIS.queryInstanceApiUri}/getChronoUtilByInstanceAndValidator`;
          requestUri = `${requestUri}/${props.instance.id}/${props.userId}`
        axios.get<IChronoUtil>(requestUri)
          .then(res =>{
            setChronoUtil(res.data)
          }).catch(e => console.log(e))
          .finally(() => setLoading(false));
      }
    }

    useEffect(() =>{
      getChronoUtil();
    }, [props.instance, props.userId])
    
    return (
        <React.Fragment>
            <ChronoVisualizer chronoUtil={chronoUtil} loading={loading} />
        </React.Fragment>
    )
}

export default QueryInstanceValidationChrono;