import { Avatar, Button, Card, CardContent, CardHeader, Fab, IconButton, Box, Table, TableHead, TableRow, TableCell, TableBody, makeStyles, Typography, colors } from "@material-ui/core"
import { AcUnit, Add } from "@material-ui/icons"
import Delete from "@material-ui/icons/Delete"
import Edit from "@material-ui/icons/Edit"
import EntityDeleterModal from "app/shared/component/entity-deleter-modal"
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar"
import { IControlType } from "app/shared/model/microrisque/control-type.model"
import { API_URIS } from "app/shared/util/helpers"
import axios from "axios"
import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Translate, translate } from "react-jhipster"
import ControlTypeUpdate from "./control-type-update"

const useStyles = makeStyles(theme =>({
    cardheader:{
        background: theme.palette.primary.main,
        paddingTop: 2,
        paddingBottom:2,
        color: theme.palette.background.paper,
        borderRadius:"15px 15px 0 0",
    },
}))

export const ControlType = (props) => {
    const [types, setType] = useState<IControlType[]>([])
    const [searchValue,setSearchValue] = useState('')
    const [typeToUpdate, setTypeToUpdate] = useState<IControlType>({})
    const [idToDeleted, setIdToDeleted] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const [open, setOpen] = useState(false)
    const getTypes = () => {
        axios.get<IControlType[]>(API_URIS.riskControlTypeApiUri).then((res)=>{
            setType([...res.data])
        })
    }

    useEffect(()=>{
        getTypes()
    }, [])
    
    const handleChange = (event) => setSearchValue(event.target.value || '')

    const handleClose = () => setOpen(false)

    const handleOpen = (type?:IControlType) => {
            setTypeToUpdate(type || {})
            setOpen(true)
    }
    const handleSave = (saved?: IControlType, isNew?:boolean) => {
        if(saved){
            if(isNew){
                setType([saved, ...types])
            }else{
                setType([...types.map(t => t.id === saved.id ? saved : t)])
            }
            handleClose()
        }
    }

    const handleDelete = (id?:number) =>{
        if(id){
            setIdToDeleted(id);
            setOpenDeleteModal(true);
        }
    }

    const handleDeleted = (id?:number) =>{
        if(id){
            setType([...types.filter(t => t.id !==id)]);
        }
        setOpenDeleteModal(false);
    }

    const classes = useStyles()
    return (
        <React.Fragment>
            <ControlTypeUpdate open={open} onClose={handleClose} onSave={handleSave} type={typeToUpdate}/>
            {idToDeleted && <EntityDeleterModal open={openDeleteModal} 
                entityId={idToDeleted} urlWithoutEntityId={API_URIS.riskControlTypeApiUri}
                onClose={() => setOpenDeleteModal(false)} onDelete={handleDeleted}
                question={
                    <Translate contentKey="microgatewayApp.microrisqueControlType.delete.question" interpolate={{ id: "" }}>
                      Are you sure you want to delete this ControlType?
                    </Translate>
                    }
                /> }
            <Card>
                <CardHeader
                    title={
                        <Box display="flex" flexWrap="wrap">
                            <Typography variant="h4" className="mr-3">
                                {translate("microgatewayApp.microrisqueControlType.home.title")}
                            </Typography>
                            <CardSubHeaderInlineSearchBar 
                                onChange={handleChange}
                            />
                        </Box>
                    }
                    avatar = {
                        <Avatar>
                            <AcUnit/>
                        </Avatar>
                    }
                    action = {
                        <IconButton color="inherit" onClick={() => handleOpen()}>
                            <Add/>
                        </IconButton>
                    }
                    className={classes.cardheader}
                />
                <CardContent>
                    <Box width={1} overflow="auto">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                      <Translate contentKey="microgatewayApp.microrisqueControlType.type">type</Translate>  
                                    </TableCell>
                                    <TableCell align="right">
                                      Actions  
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {types.length<=0 && 
                                    <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        <Translate contentKey="microgatewayApp.microrisqueControlType.home.notFound">not found</Translate> 
                                    </TableCell>
                                </TableRow>
                                }
                                {types.length !== 0 && 
                                    types.filter(t => t.type && t.type.toLowerCase().includes(searchValue.toLowerCase())).map((t, index) => (
                                        <TableRow key = {index}>
                                            <TableCell>
                                                {t.type} 
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton color="primary" onClick={() => handleOpen(t)}>
                                                    <Edit/>
                                                </IconButton>
                                                <IconButton color="secondary"
                                                    onClick={() => handleDelete(t.id)}>
                                                    <Delete/>
                                                </IconButton>  
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Box>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}

export default ControlType

