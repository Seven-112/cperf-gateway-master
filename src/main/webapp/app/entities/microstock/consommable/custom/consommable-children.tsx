import React, { useEffect, useState } from "react";
import { Box, List, makeStyles } from "@material-ui/core";
import ConsommableChildItem from "./consommable-child-item";
import { IConsommable } from "app/shared/model/microstock/consommable.model";

const useStyles = makeStyles(theme =>({
    truncate:{
      maxWidth: 100,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: 'ellipsis',
   },
}))

interface ConsommableChildrenProps{
    consommable: IConsommable,
    consommables: IConsommable[],
    onDelete?: Function,
    onUpdate?: Function,
    level: number,
}

export const ConsommableChildren = (props: ConsommableChildrenProps) =>{
    const { consommable, level } = props;
    const [consommables, setConsommables] = useState<IConsommable[]>([...props.consommables]);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setConsommables([...props.consommables]);
    }, [props.consommables])


    const onSave = (saved?: IConsommable, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setConsommables([...consommables, saved])
            else
                setConsommables([...consommables].map(c => c.id === saved.id ? saved : c));
            if(props.onUpdate)
                props.onUpdate(saved, isNew);
        }
    }

    const onDelete = (deletedId?: any) =>{
        if(deletedId){
            setConsommables([...consommables].filter(c => c.id !== deletedId));
            if(props.onDelete)
                props.onDelete(deletedId);
        }
    }

    const items = [...consommables].map((c, index) => (
        <ConsommableChildItem 
            key={index} 
            parent = {consommable}
            consommable={c}
            level={level}
            onUpdate={onSave}
            onDelete={onDelete} />
    ))

    return (
        <React.Fragment>
            {loading && <Box width={1} textAlign="center">loading...</Box>}
            {(!loading && consommable && consommables && consommables.length !==0) &&<>
                <List style={{ paddingLeft: level *7, width: '100%' }}>
                    {items}
                </List>
            </>}
        </React.Fragment>
    )
}

export default ConsommableChildren;
