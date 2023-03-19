import { IQCategory } from "app/shared/model/qmanager/q-category.model";
import React, { useEffect, useState } from "react";
import { Box, List, makeStyles } from "@material-ui/core";
import QCategoryChildItem from "./q-category-child-item";

const useStyles = makeStyles(theme =>({
    truncate:{
      maxWidth: 100,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: 'ellipsis',
   },
}))

interface QCategoryChildrenProps{
    parent: IQCategory,
    subCats: IQCategory[],
    onDelete?: Function,
    onUpdate?: Function,
    level: number,
}

export const QCategoryChildren = (props: QCategoryChildrenProps) =>{
    const { parent, level } = props;
    const [cats, setCats] = useState<IQCategory[]>([...props.subCats]);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    useEffect(() =>{
        setCats([...props.subCats]);
    }, [props.subCats])


    const onSave = (saved?: IQCategory, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setCats([...cats, saved])
            else
                setCats([...cats].map(c => c.id === saved.id ? saved : c));
            if(props.onUpdate)
                props.onUpdate(saved, isNew);
        }
    }

    const onDelete = (deletedId?: any) =>{
        if(deletedId){
            setCats([...cats].filter(c => c.id !== deletedId));
            if(props.onDelete)
                props.onDelete(deletedId);
        }
    }

    const items = [...cats].map((c, index) => (
        <QCategoryChildItem 
            key={index} 
            category={c}
            level={level}
            onUpdate={onSave}
            onDelete={onDelete} />
    ))

    return (
        <React.Fragment>
            {loading && <Box width={1} textAlign="center">loading...</Box>}
            {(!loading && parent && cats && cats.length !==0) &&<>
                <List style={{ paddingLeft: level *7, width: '100%' }}>
                    {items}
                </List>
            </>}
        </React.Fragment>
    )
}

export default QCategoryChildren;
