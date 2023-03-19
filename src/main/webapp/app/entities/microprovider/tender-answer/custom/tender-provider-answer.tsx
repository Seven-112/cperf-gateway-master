import { ITenderAnswer } from "app/shared/model/microprovider/tender-answer.model";
import { ITender } from "app/shared/model/microprovider/tender.model";
import { API_URIS } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { useState } from "react";
import axios from 'axios'
import React from "react";
import { useEffect } from "react";
import { Box, Card, CardContent, CardHeader, List, ListItem, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { translate } from "react-jhipster";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import { IPartenerField } from "app/shared/model/micropartener/partener-field.model";

const useStyles = makeStyles(theme =>({
    
}))

const TenderProviderAnswerItem = (props: {answer:ITenderAnswer, onClick?: Function}) =>{
    const {answer } = props;
    const [provider, setProvider] = useState<IPartener>(null);
    const [loading, setLoading] = useState(false)

    const getProvider = () =>{
        if(answer){
            setLoading(true)
            axios.get<IPartener>(`${API_URIS.partenerApiUri}/${answer.providerId}`)
                .then(res =>{
                    setProvider(res.data)
                }).catch(e => console.log(e))
                  .finally(() => setLoading(false))
        }
    }
    useEffect(() =>{
        getProvider();
    }, [props.answer])

    const handleClick = () =>{
        if(props.onClick)
            props.onClick(answer);
    }

    return (
        <React.Fragment>
            {provider && 
                <ListItem button onClick={handleClick}>
                    <ListItemText primary={<Typography>{provider.name}</Typography>} />
                </ListItem>
            }
        </React.Fragment>
    )
}

interface TenderProviderAnswerProps{
    tender: ITender,
    onSelect?:Function,
}

export const TenderProviderAnswer = (props: TenderProviderAnswerProps) =>{
    const {tender} = props;
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState<ITenderAnswer[]>([])
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [toalItems, setTotalItems] = useState(0);
    const [activePage, setActivePage] = useState(0);
    
    const getAnswers = () =>{
        if(tender && tender.id){
            setLoading(true)
            let requestUri = `${API_URIS.tenderAnswerApiUir}/?tenderId.equals=${tender.id}`;
            requestUri = `${requestUri}&page=${activePage}&size=${itemsPerPage}`;
            axios.get<ITenderAnswer[]>(requestUri)
            .then(res => {
                setTotalItems(parseInt(res.headers['x-total-count'],10))
                setAnswers([...res.data])
            }).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }
    
    useEffect(() =>{
        getAnswers();
    }, [props.tender])

    const handleSelectAnswer = (selected: ITenderAnswer) =>{
        if(props.onSelect)
            props.onSelect(selected)
    }

    return (
        <React.Fragment>
            <Box width={1} display="flex" justifyContent="center" alignItems="center">
                {!loading ? (
                    <>
                        <List>
                            {answers.map((a, index) =>(
                                <TenderProviderAnswerItem key={index} answer={a} onClick={handleSelectAnswer}/>
                            ))}
                        </List>
                    </>
                ): (
                    <Typography>Loading...</Typography>
                )}
            </Box>
        </React.Fragment>
    )
}

export default TenderProviderAnswer;
