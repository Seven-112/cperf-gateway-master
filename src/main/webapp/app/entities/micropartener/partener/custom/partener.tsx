import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, makeStyles, MenuItem, Popover, Select, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import { IPartener } from "app/shared/model/micropartener/partener.model";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React, { useState } from "react"
import { useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import axios from 'axios';
import { IPartenerCategory } from "app/shared/model/micropartener/partener-category.model";
import { IField } from "app/shared/model/micropartener/field.model";
import { API_URIS, getMshzFileByEntityIdAndEntityTag, getTotalPages } from "app/shared/util/helpers";
import { Helmet } from 'react-helmet';
import { TextFormat, translate } from "react-jhipster";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Add, Attachment, Delete, Edit } from "@material-ui/icons";
import PartenerUpdate from "./partener-update";
import { IPartenerField } from "app/shared/model/micropartener/partener-field.model";
import { FieldType } from "app/shared/model/enumerations/field-type.model";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { IUser } from "app/shared/model/user.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";

const useStyles = makeStyles(theme =>({
    card:{
        marginTop: theme.spacing(2),
        boxShadow: '-1px -1px 10px',
    },
    cardHeader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: '15px 15px 0 0',
    },
    catSelect:{
        height:theme.spacing(3),
        color: theme.palette.primary.dark,
        fontSize:15,
        "&&&:before": {
          borderBottom: "none"
        },
        "&&:after": {
          borderBottom: "none"
        }
    },
    theadRow:{
      backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
      color: 'white',
      '&>th':{
        color: 'white',
      }
    },
    cardContent:{

    },
    textField:{
        maxWidth: 100,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    rootBox:{
        maxWidth:'70vh',
        maxHeight: '50vh',
    },
    typography: {
        padding: theme.spacing(2),
      },
      cardActions:{
        paddingTop:0,
        paddingBottom:0,
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
}))

export const PartenerFieldItem = (props: {partener: IPartener, field: IField}) =>{
    const { partener,field } = props;
    const [pField, setPField] = useState<IPartenerField>(null);
    const [files, setFiles] = useState<IMshzFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [openFile, setOpenFile] = useState(false);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    
      const open = Boolean(anchorEl);

      const id = open ? field.id : undefined;

      const getFiles = (pFieldId:any) =>{
        if(pFieldId){
                getMshzFileByEntityIdAndEntityTag(pFieldId, FileEntityTag.tenderPartenerField)
                .then(res =>{
                    if(res.data)
                        setFiles([...res.data])
                }).catch(e => console.log(e))
        }
    }
    
    const getPField = () =>{
        if(partener && partener.id && field && field.id){
            axios.get<IPartenerField[]>(`${API_URIS.partenerFiledApiUri}/?partenerId.equals=${partener.id}&fieldId.equals=${field.id}`)
                .then(res => {
                    if(res.data && res.data.length){
                        setPField(res.data[0])
                        getFiles(res.data[0].id)
                    }
                }).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getPField();
    }, [partener, field])

    const toggleVisibility = () =>{
        const entity: IPartenerField = {
            ...pField,
            visible: !pField.visible
        }
        if(entity && entity.id){
            setWaiting(true);
            axios.put<IPartenerField>(`${API_URIS.partenerFiledApiUri}`, cleanEntity(entity))
                .then(res => {
                    if(res.data){
                        setPField(res.data)
                    }
                }).catch(e => console.log(e)).finally(() => setWaiting(false))
        }
    }

    return (
        <React.Fragment>
            {pField && 
                <ModalFileManager 
                    open={openFile}
                    files={[...files]}
                    entityId={pField.id}
                    entityTagName={FileEntityTag.tenderPartenerField}
                    readonly
                    onClose={() => {
                        setOpenFile(false)
                    }}
                    title={translate("_global.label.files")}
                    />
            }
            {loading && <Typography variant="caption">loading...</Typography>}
            {!loading && pField && pField.val && <Box width={1} 
                display="flex" justifyContent="center" flexWrap="wrap" 
                alignItems="center" overflow="auto">
                {field.type === FieldType.NUMBER && <Typography>{pField.val}</Typography>}
                {field.type === FieldType.STRING ? (
                    <>
                    <Button  aria-describedby={field.id.toString()}
                         variant="text" color="inherit" 
                         onClick={handleClick} style={{ textTransform: 'none'}}>
                        <Typography className="text-truncate text-normal" style={{ maxWidth:150}}>{pField.val}</Typography>
                    </Button>
                    <Popover
                        id={field.id.toString()}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                        }}
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                        }}
                    >
                        <Box className={classes.rootBox} overflow="auto">
                             <Typography className={classes.typography}>{pField.val}</Typography>
                        </Box>
                    </Popover>
                    </>
                ):(
                    field.type === FieldType.BOOLEAN ? (
                        pField.val === "true" || pField.val === "1" ? (
                            <Typography>{translate("_global.label.yes")}</Typography>
                        ):(
                            <Typography>{translate("_global.label.no")}</Typography>
                        ) 
                    ):(
                        <>
                        {field.type === FieldType.DATE && <TextFormat type="date" format="DD/MM/YYYY" value={new Date(pField.val)} />}
                        {field.type === FieldType.DATETIME && <TextFormat type="date" format="DD/MM/YYYY HH:mm" value={new Date(pField.val)} />}
                        </>
                    )
                )}
                {((field && field.requestFiles) || [...files].length !==0) &&
                <IconButton 
                    title={translate("_global.label.files")}
                    color="default"
                    className="mr-2"
                    onClick={() => setOpenFile(true)}>
                    <Attachment />
                </IconButton>
                }
                {/* <IconButton 
                    title="change visibility"
                    color="primary"
                    className="mr-2"
                    onClick={toggleVisibility}>
                    {pField.visible ? <Visibility /> : <VisibilityOff />}
                </IconButton> */}
                {waiting && <CircularProgress color="secondary" style={{ width:15, height:15 }}/>}
            </Box>}
        </React.Fragment>
    )
}

type ParternerProps = RouteComponentProps<{categoryId?: string}>;

export const Partener = (props: ParternerProps) =>{
    const [categoryId, setCategoryId] = useState(props.match.params.categoryId ? Number(props.match.params.categoryId) : null);
    const classes = useStyles();

    const [parteners, setParteners] = useState<IPartener[]>([]);
    const [categories, setCategories] = useState<IPartenerCategory[]>([]);
    const [fields, setFields] =  useState<IField[]>([])
    const [loading, setLoading] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
    const [totalItems, setTotalItems] = useState(0)
    const [open, setOpen] = useState(false);
    const [partenerToUpdate, setPartenerToUpdate] = useState<IPartener>(null);
    const [partenerToDelete, setPartenerToDelete] = useState<IPartener>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const history = useHistory();

    const getCategories = () =>{
            setLoading(true)
            axios.get<IPartenerCategory[]>(`${API_URIS.partenerCategoryApiUri}`)
                .then(res =>{
                    setCategories(res.data)
                }).catch(e => console.log(e)).finally(() => setLoading(false))
    }

    const getFileds = () =>{
        if(categoryId){
            setLoading(true)
            axios.get<IField[]>(`${API_URIS.partenerFieldModelApiUri}/?categoryId.equals=${categoryId}`)
                .then(res =>{
                    setFields(res.data);
                }).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }

    const getParteners = (p?: number, size?: number) =>{
        setLoading(true);
        const page = p || p === 0 ? p : activePage;
        const rows = size || rowsPerPage;
        axios.get<IPartener[]>(`${API_URIS.partenerApiUri}/?categoryId.equals=${categoryId}&page=${page}&size=${rows}`)
          .then(res => {
            setTotalItems(parseInt(res.headers['x-total-count'], 10));
            setParteners(res.data)
          }).catch((e) =>{
            console.log(e);
          }).finally(() => setLoading(false))
        
    }

    useEffect(() =>{
        setCategoryId(props.match.params.categoryId ? Number(props.match.params.categoryId) : null);
        getCategories();
    }, [])

    useEffect(() =>{
        getFileds();
        getParteners();
    }, [categoryId])
  
    const handleChangePage = (event, newPage) =>{
      setActivePage(newPage);
      getParteners(newPage);
    }

    const handleChangeItemsPerpage = (event) =>{
      setRowsPerPage(parseInt(event.target.value, 10));
      getParteners(0, parseInt(event.target.value, 10))
    }

    const handleChange = (e) =>{
        const value = e.target.value;
        if(value === 0)
         setCategoryId(null)
        else
            setCategoryId(value)
    }

    const categoriesMenuItems = categories.sort((a, b) => b.id-a.id)
            .map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>);

    const handleOpenPartenerUpdate = (partener?: IPartener) =>{
        if(partener)
            setPartenerToUpdate(partener);
        else
            setPartenerToUpdate({category: categories.find(c => c.id === categoryId)})
        setOpen(true);
    }

    const handleSave = (saved?: IPartener, isNew?: boolean) =>{
        if(saved && saved.category){
            const finded = [...parteners].find(p => p.id === saved.id);
            if(saved.category.id === categoryId){
                if(finded)
                    setParteners(parteners.map(p => p.id === saved.id ? saved : p));
                else
                    setParteners([saved, ...parteners]);
            }else{
                setCategoryId(saved.category.id);
            }
            setOpen(false);
        }
    }

    const handleDelete = (p: IPartener) =>{
        setPartenerToDelete(p);
        if(p)
            setOpenDeleteModal(true);
    }
    
    const disablePartenerAccount = (login: string) =>{
        axios.get<IUser>(`${API_URIS.userApiUri}/toogle-activated-by-login/${false}/${login}`)
            .then(() =>{}).catch(e => console.log(e))
    }

    const onDeleted = (deletedId?: number) =>{
        if(deletedId){
            setParteners(parteners.filter(p => p.id !== deletedId));
            if(partenerToDelete)
                disablePartenerAccount(partenerToDelete.email);
            setPartenerToDelete(null);
        }
        setOpenDeleteModal(false)
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`C'perf | ${translate("microgatewayApp.micropartenerPartener.home.title")}`}</title>
            </Helmet>
            <PartenerUpdate open={open} 
                partener={partenerToUpdate} disableCategoryChange
                onClose={() => setOpen(false)} onSave={handleSave} />
            {partenerToDelete &&
                <EntityDeleterModal
                    entityId={partenerToDelete.id}
                    open={openDeleteModal}
                    urlWithoutEntityId={API_URIS.partenerApiUri}
                    onDelete={onDeleted}
                    onClose={() => setOpenDeleteModal(false)}
                    question={translate("microgatewayApp.micropartenerPartener.delete.question", {id: ""})}
                />
            }
            <Card className={classes.card}>
                <CardHeader
                    avatar={<IconButton onClick={() => history.goBack()}
                        style={{ padding:0, }} color="inherit">
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                    </IconButton>}
                    title={
                        <Box width={1} display="flex" justifyContent="space-between" alignItems="center">
                                <Box flexGrow={1} display="flex" alignItems="center">
                                    <Typography variant="h4">
                                        {translate("microgatewayApp.micropartenerPartener.home.title")}
                                    </Typography>
                                    <IconButton color="inherit" className="ml-2"
                                        title={translate("_global.label.add")}
                                        onClick={() =>handleOpenPartenerUpdate()}
                                        >
                                            <Add />
                                    </IconButton>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="body2" className="mr-2">
                                        {translate("microgatewayApp.micropartenerPartener.category")+ ': '}
                                    </Typography>
                                    <Select value={categoryId || 0} onChange={handleChange}
                                    fullWidth margin="none"
                                        variant="standard"
                                        classes={{
                                            icon: 'text-primary',
                                        }}
                                        className={classes.catSelect}
                                        >
                                        <MenuItem value={0}>----- Select----</MenuItem>
                                        {categoriesMenuItems}
                                    </Select>
                                </Box>
                        </Box>
                    }
                    className={classes.cardHeader}
                 />
                 <CardContent className={classes.cardContent}>
                     <Box width={1} display="flex" justifyContent="center" flexWrap="wrap" overflow="auto">
                         {loading && <Box width={1} textAlign="center"><Typography variant="h4" color="primary">Loading...</Typography></Box>}
                         {categoryId && <>
                            <Table>
                                <TableHead>
                                    <TableRow className={classes.theadRow}>
                                        <TableCell>{translate("microgatewayApp.micropartenerPartener.name")}</TableCell>
                                        <TableCell align="center">{translate("microgatewayApp.micropartenerPartener.email")}</TableCell>
                                        {fields && fields.map(f =><TableCell key={f.id} align="center">{f.label}</TableCell>)}
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={100} align="center">
                                            <Typography variant="h4" color="secondary">Loading...</Typography>
                                        </TableCell>
                                    </TableRow>
                                    ):(
                                        parteners && parteners.length !== 0 ? (
                                            parteners.map(p =>(
                                                <TableRow key={p.id}>
                                                    <TableCell>{p.name}</TableCell>
                                                    <TableCell align="center">{p.email}</TableCell>
                                                    {fields && fields.length !== 0 &&
                                                        <>
                                                            {fields.sort((a,b) =>b.id-a.id).map(f =>(
                                                                <TableCell key={f.id} align="center">
                                                                    <PartenerFieldItem partener={p} field={f} />
                                                                </TableCell>
                                                            ))}
                                                        </>
                                                    }
                                                    <TableCell align="center">
                                                        <IconButton color="primary" 
                                                            onClick={() =>handleOpenPartenerUpdate(p)}
                                                                title={translate("entity.action.edit")}>
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton color="secondary" 
                                                            onClick={() =>handleDelete(p)}
                                                                title={translate("entity.action.delete")}>
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ):(
                                            <TableRow>
                                                <TableCell colSpan={100} align="center">
                                                    <Typography variant="h4">
                                                    {translate("microgatewayApp.micropartenerPartener.home.notFound")}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                         </>}
                     </Box>
                 </CardContent>
                {totalItems > 0 &&
                    <CardActions className={classes.cardActions}>
                        <TablePagination 
                        component="div"
                        count={totalItems}
                        page={activePage}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onChangeRowsPerPage={handleChangeItemsPerpage}
                        rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                        labelRowsPerPage={translate("_global.label.rowsPerPage")}
                        labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,rowsPerPage)}`}
                        classes={{ 
                            root: classes.pagination,
                            input: classes.paginationInput,
                            selectIcon: classes.paginationSelectIcon,
                    }}/>
                    </CardActions>
                }
            </Card>
        </React.Fragment>
    )
}

export default Partener;