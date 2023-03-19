import { IPartenerCategoryEvaluator } from "app/shared/model/micropartener/partener-category-evaluator.model"
import { IUserExtra } from "app/shared/model/user-extra.model";
import { API_URIS } from "app/shared/util/helpers";
import React from "react"
import { useState } from "react"
import axios from 'axios';
import { useEffect } from "react";
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTh } from "@fortawesome/free-solid-svg-icons";


const EvaluatoItem = (props: {evaluator?: IUserExtra}) =>{
    const { evaluator } = props;
    
    const {user, employee} = evaluator;

    const fullName = employee ? employee.firstName + ' ' + employee.lastName : user ? user.firstName  + ' ' +user.lastName : '';

    return (
        <React.Fragment>
            <ListItem button>
                <ListItemText primary={fullName} />
                <ListItemSecondaryAction>
                    <IconButton>
                        <FontAwesomeIcon icon={faTh} />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </React.Fragment>
    )
}

interface EvaluatorListProps{
    categoryId: any
}

export const EvaluatorList = (props: EvaluatorListProps) =>{
    const {categoryId} = props;
    const [evaluators, setEvaluators] = useState<IUserExtra[]>([]);
    const [loading, setLoading] = useState(false);

    const getUserExtras = (userIds: number[]) =>{
        console.log(userIds)
        if(userIds && userIds.length !== 0){
            setLoading(true)
            const requestUri = `${API_URIS.userExtraApiUri}/?userId.in=${userIds.join(',')}`;
            axios.get<IUserExtra[]>(requestUri)
            .then(res =>{
                setEvaluators([...res.data])
            }).catch((e) =>{
                console.log(e);
            }).finally(() => setLoading(false))
        }else{
            setEvaluators([]);
        }
    }

    const getEvaluators = () =>{
        if(categoryId){
            setLoading(true);
            const requestUri = `${API_URIS.partenerCategoryEvaluatorApiUri}/?categoryId.equals=${categoryId}`;
            axios.get<IPartenerCategoryEvaluator[]>(requestUri)
                .then(res =>{
                    console.log(res.data)
                    const userIds = res.data.map(pce => pce.userId)
                    getUserExtras(userIds);
                }).catch((e) =>{
                    console.log(e);
                }).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getEvaluators();
    }, [])

    const items = [...evaluators].map(ev =>(
        <EvaluatoItem key={ev.id} evaluator={ev} />
    ))
    return (
        <React.Fragment>
            {loading && <Typography>Loading ...</Typography>}
            <List>
                {items}
            </List>
            {(!loading && items.length === 0) && <Typography>
                {translate("microgatewayApp.micropartenerPartenerCategoryEvaluator.home.notFound")}
            </Typography>}
        </React.Fragment>
    )
}