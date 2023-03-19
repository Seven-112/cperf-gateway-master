import { Backdrop, Box, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, Modal, Slide, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import { Add, Close, Delete, Edit, Error, Visibility } from "@material-ui/icons";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { IItemCheckJustification } from "app/shared/model/microprocess/item-check-justification.model";
import { ITaskItem } from "app/shared/model/microprocess/task-item.model";
import { formateDate } from "app/shared/util/date-utils";
import { API_URIS, getMshzFileByEntityIdAndEntityTag, getTotalPages } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import ItemCheckJustificationUpdate from "./item-check-justification-update";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        alignItems: "center",
    },
    card:{
        background: 'transparent',
        minWidth: '37%',
        maxWidth: '70%',
        [theme.breakpoints.down("sm")]:{
            minWidth: '50%',
            maxWidth: '90%',
        },
        boxShadow: 'none',
        border: 'none',
    },
    cardheader:{
        background: 'white',
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
    },
    cardcontent:{
      background: 'white',
      minHeight: '20vh',
      maxHeight: '70vh',
      overflow: 'auto', 
    },
    cardActions:{
     background: 'white',
      paddingTop:0,
      paddingBottom:0,
      borderRadius: '0 0 15px 15px', 
    },
    thead:{
      border:'none',
      color: 'white',
    },
    theadRow:{
      backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
      color: 'white',
      '&>th':{
        color: 'white',
      }
    },
    pagination:{
      padding:0,
      color: theme.palette.primary.dark,
    },
    paginationInput:{
        color: theme.palette.primary.dark,
        width: theme.spacing(10),
        borderColor:theme.palette.primary.dark,
    },
    paginationSelectIcon:{
        color:theme.palette.primary.dark,
    },
    truncate:{
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }
}))

const ItemCheckJustificationRow = (props: {
    entity?: IItemCheckJustification, 
    readonly?:boolean, isCurrent?: boolean,
    onUpdate?:Function, onDelete?: Function
}) =>{
    const { readonly, isCurrent, entity } = props;
    const [openFiles, setOpenFiles] = useState(false);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [openJustification, setOpenJustification] = useState(false);
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const getFiles = () =>{
        if(entity && entity.id){
            setLoading(true);
            getMshzFileByEntityIdAndEntityTag(entity.id, FileEntityTag.processCheckItemJustification)
                .then(res => {
                    setFiles([...res.data])
                })
                .catch(e => console.log(e))
                .finally(() => {
                    setLoading(false)
                    setOpenFiles(true)
                });
        }
    }

    const handleUpdate = () =>{
        if(props.onUpdate && !readonly)
            props.onUpdate(entity);
    }

    const handleDelete = () => {
        if(props.onDelete && !readonly)
            props.onDelete(entity);
    }

    const date = entity && entity.date ? new Date(entity.date) : null;

    return (
        <React.Fragment>
            {entity && <>
                <MyCustomPureHtmlRenderModal 
                    open={openJustification}
                    title={translate("microgatewayApp.microprocessItemCheckJustification.justification")}
                    body={entity.justification}
                    onClose={() => setOpenJustification(false)}
                />
                <ModalFileManager 
                    open={openFiles}
                    files={[...files]}
                    entityId={entity.id}
                    entityTagName={FileEntityTag.processCheckItemJustification}
                    readonly
                    title={translate("_global.label.files")}
                    onClose={() => setOpenFiles(false)}
                />
                <TableRow>
                    <TableCell>
                        {date ? `${translate(`_calendar.day.short.${date.getDay()}`)} ${formateDate(date, `DD/MM/YYYY ${translate("_global.label.to")}`)} ${date.getHours()}:${date.getMinutes()}` : '..'}
                    </TableCell>
                    <TableCell align="center">
                        {entity.justification ? (
                            <IconButton 
                                title={translate("entity.action.view")}
                                color="primary"
                                className="p-0"
                                onClick={() => setOpenJustification(true)}>
                                <Visibility />
                            </IconButton>
                        ): '...'}
                    </TableCell>
                    <TableCell align="center">
                        {loading ? 'loading...' : (
                            <IconButton 
                                title={translate("entity.action.view")}
                                color="primary"
                                className="p-0"
                                onClick={getFiles}>
                                <Visibility />
                            </IconButton>
                        )}
                    </TableCell>
                    <TableCell align="center">
                        {translate(`_global.label.${entity.checked ? 'yes' : 'no'}`)}
                    </TableCell>
                    <TableCell align="center">
                        {translate(`_global.label.${isCurrent ? 'yes' : 'no'}`)}
                    </TableCell>
                    <TableCell align="center">
                        {!readonly && <>
                            {props.onUpdate && 
                                <IconButton
                                    color="primary"
                                    title={translate("entity.action.edit")}
                                    className="p-0"
                                    onClick={handleUpdate}
                                >
                                    <Edit />
                                </IconButton>
                            }
                            {props.onDelete && 
                                <IconButton
                                    color="secondary"
                                    title={translate("entity.action.edit")}
                                    className="p-0 ml-2"
                                    onClick={handleDelete}
                                >
                                    <Delete />
                                </IconButton>
                            }
                        </>}
                    </TableCell>
                </TableRow>
            </>}
        </React.Fragment>
    )
}

interface IItemCheckJustificationProps{
    taskItem: ITaskItem,
    readonly?:boolean,
    open?: boolean,
    onClose: Function,
}

export const ItemCheckJustification = (props: IItemCheckJustificationProps) =>{
    const { open } = props;
    const [taskItem, setTaskItem] = useState(props.taskItem);
    const [justifications, setJustifications] = useState<IItemCheckJustification[]>([]);
    const [selectedJustification, setSelectedJustification] = useState<IItemCheckJustification>(null);
    const [currentJustification, setCurrentJustification] = useState<IItemCheckJustification>(null);
    const [openToUpdate, setOpenToUpdate] = useState(false);
    const [openToDelete, setOpenToDelete] = useState(false);

    const [totalItems, setTotalItems] = useState(0);
  
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
    const [activePage, setActivePage] = useState(0);
    
    const [loading, setLoading] = useState(false);

    const classes = useStyles();

    const readonly = props.readonly || !taskItem;

    const getCurrenJustification = () =>{
        if(props.taskItem){
            setLoading(true);
            let apiUri = `${API_URIS.taskItemCheckJustificationApiUri}/?taskItemId.equals=${props.taskItem.id}`;
            apiUri = `${apiUri}&checked.equals=${taskItem.checked}&page=${0}&size=${1}&sort=id,desc`;

            axios.get<IItemCheckJustification[]>(apiUri)
                .then(res => {
                    if(res.data && res.data.length !== 0)
                        setCurrentJustification(res.data[0]);
                    else
                        setCurrentJustification(null);
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }else{
            setCurrentJustification(null)
        }
    }

    const getJustifications = (p?: number, rows?:number) =>{
        if(props.taskItem){
            setLoading(true);
            const page = (p || p===0) ? p : activePage;
            const size = rows || itemsPerPage;
            let apiUri = `${API_URIS.taskItemCheckJustificationApiUri}/?taskItemId.equals=${props.taskItem.id}`;
            apiUri = `${apiUri}&page=${page}&size=${size}&sort=id,desc`;

            axios.get<IItemCheckJustification[]>(apiUri)
                .then(res => {
                    setJustifications([...res.data])
                    setTotalItems(parseInt(res.headers['x-total-count'], 10))
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }else{
            setJustifications([])
        }
    }

    useEffect(() =>{
        setTaskItem(props.taskItem);
        getCurrenJustification();
        getJustifications();
    }, [props.taskItem])


    const handleChangeItemsPerpage = (event) =>{
        setItemsPerPage(parseInt(event.target.value, 10));
    }

    const handleChangePage = (event, newPage) =>{
        setActivePage(newPage);
    }

    const handleClose = () => props.onClose();

    const handleUpdate = (justification?: IItemCheckJustification) =>{
        if(!readonly && taskItem){
            if(justification){
                setSelectedJustification(justification);
            }else{
                const date = new Date();
                setSelectedJustification({
                    checked: taskItem.checked,
                    date: date.toISOString(),
                    taskItemId: taskItem.id
                })
            }
    
            setOpenToUpdate(true);
        }
    }

    const handleDelete = (jst?:IItemCheckJustification) =>{
        if(jst){
            setSelectedJustification(jst);
            setOpenToDelete(true);
        }
    }

    const onSave = (saved?: IItemCheckJustification, isNew?:boolean) =>{
        if(saved){
            if(isNew){
                setJustifications([saved, ...justifications])
                setCurrentJustification(saved);
            }
            else{
                setJustifications(justifications.map(jst => jst.id === saved.id ? saved : jst))
                if(currentJustification && currentJustification.id === saved.id)
                    setCurrentJustification(saved);
            }
            setOpenToUpdate(false);
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setJustifications(justifications.filter(jst => jst.id !== deletedId))
            if(currentJustification  && currentJustification.id === deletedId)
                setCurrentJustification(null);
            setOpenToDelete(false)
            setSelectedJustification(null)
        }
    }
    
    const currentItemRow = currentJustification ? 
            <ItemCheckJustificationRow 
                entity={currentJustification} 
                isCurrent={true}
                readonly={readonly}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            /> : <></>

    const items = [...justifications]
        .filter(item => item.id !== {...currentJustification}.id)
        .map((item, index) =>(
        <ItemCheckJustificationRow 
            key={index}
            entity={item} 
            isCurrent={false}
            readonly={readonly}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
        />
    ))

    return (
        <React.Fragment>
        {selectedJustification && !readonly && <>
            <ItemCheckJustificationUpdate 
                open={openToUpdate}
                entity={selectedJustification}
                onSave={onSave}
                onClose={() => setOpenToUpdate(false)}
            />
            <EntityDeleterModal 
                open={openToDelete}
                entityId={selectedJustification.id}
                urlWithoutEntityId={API_URIS.taskItemCheckJustificationApiUri}
                onDelete={onDelete}
                onClose={() => setOpenToDelete(false)}
                question={translate("microgatewayApp.microprocessItemCheckJustification.delete.question", {id: ''})}
            />
        </>}
        <Modal
            open={open}
            onClose={handleClose}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 300,
            }}
            disableBackdropClick
            closeAfterTransition
            className={classes.modal}
        >
                <Slide
                        in={open}
                        direction="down"
                        timeout={300}
                    >
                    <Card className={classes.card}>
                        <CardHeader 
                            title={
                                <Box display="flex" alignItems="center">
                                    <Error />
                                    <Typography variant="h4" className="ml-3">
                                        {translate("microgatewayApp.microprocessItemCheckJustification.home.title")}
                                    </Typography>
                                </Box>
                            }
                            action={
                                <Box display="flex" alignItems="center">
                                {!readonly &&
                                    <IconButton 
                                        color="inherit"
                                        className="mr-3"
                                        onClick={() => handleUpdate(null)}>
                                        <Add />
                                    </IconButton>
                                }
                                <IconButton 
                                    color="inherit"
                                    onClick={handleClose}>
                                    <Close />
                                </IconButton>
                                </Box>
                            }
                            className={classes.cardheader}
                        />
                        <CardContent className={classes.cardcontent}>
                            <Table>
                                <TableHead className={classes.thead}>
                                    <TableRow className={classes.theadRow}>
                                        <TableCell align="left">{translate('microgatewayApp.microprocessItemCheckJustification.date')}</TableCell>
                                        <TableCell align="left">{translate('microgatewayApp.microprocessItemCheckJustification.justification')}</TableCell>
                                        <TableCell align="center">{translate('_global.label.files')}</TableCell>
                                        <TableCell align="center">{translate('microgatewayApp.microprocessItemCheckJustification.checked')}</TableCell>
                                        <TableCell align="center">{translate('_global.label.currentJustification')}</TableCell>
                                        <TableCell align="center">{'Actions'}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(loading || [...justifications].length <=0) && <TableRow>
                                    <TableCell align="center" colSpan={20}>
                                        {loading && <Box width={1} mt={1} mb={3} display="flex" 
                                                justifyContent="center" alignItems="center" flexWrap="wrap">
                                            <CircularProgress style={{ height:30, width:30}} color="secondary"/>
                                            <Typography className="ml-2" color="secondary">Loading...</Typography>    
                                        </Box>}
                                        {(!loading && [...justifications].length<=0) &&
                                        <Typography variant="body1">
                                            {translate("microgatewayApp.microprocessItemCheckJustification.home.notFound")}
                                        </Typography>
                                        }
                                    </TableCell>
                                    </TableRow>}
                                    {currentItemRow}
                                    {items}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <TablePagination 
                                component="div"
                                count={totalItems}
                                page={activePage}
                                onPageChange={handleChangePage}
                                rowsPerPage={itemsPerPage}
                                onChangeRowsPerPage={handleChangeItemsPerpage}
                                rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                                labelRowsPerPage={translate("_global.label.rowsPerPage")}
                                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,itemsPerPage)}`}
                                classes={{ 
                                    root: classes.pagination,
                                    input: classes.paginationInput,
                                    selectIcon: classes.paginationSelectIcon,
                            }}/>
                        </CardActions>
                    </Card>
                </Slide>
            </Modal>
        </React.Fragment>
    )
}
  
  export default ItemCheckJustification;
