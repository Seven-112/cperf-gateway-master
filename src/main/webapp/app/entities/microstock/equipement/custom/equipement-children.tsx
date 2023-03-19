import React, { useEffect, useState } from "react";
import { Box, List, makeStyles } from "@material-ui/core";
import EquipementChildItem from "./equipement-child-item";
import { IEquipement } from "app/shared/model/microstock/equipement.model";

const useStyles = makeStyles(theme =>({
    truncate:{
      maxWidth: 100,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: 'ellipsis',
   },
}))

interface EquipementChildrenProps{
    equipement: IEquipement,
    equipements: IEquipement[],
    onDelete?: Function,
    onUpdate?: Function,
    level: number,
}

export const EquipementChildren = (props: EquipementChildrenProps) =>{
    const { equipement, level } = props;
    const [equipements, setEquipements] = useState<IEquipement[]>([...props.equipements]);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setEquipements([...props.equipements]);
    }, [props.equipements])


    const onSave = (saved?: IEquipement, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setEquipements([...equipements, saved])
            else
                setEquipements([...equipements].map(c => c.id === saved.id ? saved : c));
            if(props.onUpdate)
                props.onUpdate(saved, isNew);
        }
    }

    const onDelete = (deletedId?: any) =>{
        if(deletedId){
            setEquipements([...equipements].filter(c => c.id !== deletedId));
            if(props.onDelete)
                props.onDelete(deletedId);
        }
    }

    const items = [...equipements].map((c, index) => (
        <EquipementChildItem 
            key={index} 
            parent = {equipement}
            equipement={c}
            level={level}
            onUpdate={onSave}
            onDelete={onDelete} />
    ))

    return (
        <React.Fragment>
            {loading && <Box width={1} textAlign="center">loading...</Box>}
            {(!loading && equipement && equipements && equipements.length !==0) &&<>
                <List style={{ paddingLeft: level *7, width: '100%' }}>
                    {items}
                </List>
            </>}
        </React.Fragment>
    )
}

export default EquipementChildren;
