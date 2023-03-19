import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'reactstrap';
import { Translate, getSortState, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities, updateEntity } from 'app/entities/microprocess/procedure/procedure.reducer';
import { IProcedure } from 'app/shared/model/microprocess/procedure.model';
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from 'app/shared/util/pagination.constants';
import { cleanEntity, overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@material-ui/core';
import { IMshzFile } from 'app/shared/model/microfilemanager/mshz-file.model';
import axios from 'axios';
import { API_URIS, getTotalPages, openMshzFile } from 'app/shared/util/helpers';
import { IProcess } from 'app/shared/model/microprocess/process.model';
import { FileIllustration } from 'app/shared/component/file-previewer';
import { Add, Attachment, Delete, Edit, RemoveCircle } from '@material-ui/icons';
import { Helmet } from 'react-helmet';
import CardSubHeaderInlineSearchBar from 'app/shared/layout/search-forms/card-subheader-inline-searchbar';
import ProcedureUpdate from 'app/entities/microprocess/procedure/custom/procedure-update';
import EditFileModal from 'app/shared/component/edit-file-modal';
import ProcedureDeleteDialog from './procedure.delete';
import ProcedureBindProcess from './procedure-bind-process.';
import { faFileAlt, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { LogigramModal } from '../../process/custom/logigram-modal';
import { hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import EntityDeleterModal from 'app/shared/component/entity-deleter-modal';
import { FileEntityTag } from 'app/shared/model/file-chunk.model';
import { serviceIsOnline, SetupService } from 'app/config/service-setup-config';

const useStyles = makeStyles(theme =>({
    card:{
     border: '1px solid '+ theme.palette.primary.main,
     boxShadow: '0 0 7px '+theme.palette.grey[900],
   },
   container: {
     maxHeight: 650,
     padding:0,
   },
   cardHeader: {
     paddingTop:2,
     paddingBottom:2,
     color: theme.palette.primary.dark,
     backgroundColor: theme.palette.common.white,
   },
   theadRow:{
     backgroundColor: theme.palette.primary.dark, // colors.lightBlue[100],
     color: 'white',
     '&>th':{
       color: 'white',
     }
   },
   fileIllustation:{
     width: theme.spacing(4),
     height: theme.spacing(4),
     fontSize: theme.spacing(10),
     marginRight: theme.spacing(1),
     cursor: 'pointer',
     '&:hover':{
     }
   },
   pagination:{
    padding:0,
    color: theme.palette.primary.dark,
  },
  input:{
      width: theme.spacing(10),
      display: 'none',
  },
  selectIcon:{
      color: theme.palette.primary.dark,
      display: 'none',
  },
}))

const RowItem = (props: {procedure: IProcedure, handleUpdate: Function, onDisplayLogigram: Function
     handleDelete: Function, handleAttachFile: Function; handleDetachFile: Function}) =>{
   const procedure = props.procedure;

   const [file, setFile] = useState<IMshzFile>(null);

   const [process, setProcess] = useState<IProcess>(null);

   const [open, setOpen] = useState(false);

   const classes = useStyles();

   const getFile = () =>{
    if(props.procedure.fileId && serviceIsOnline(SetupService.FILEMANAGER)){
      // loading file
      axios.get<IMshzFile>(`${API_URIS.mshzFileApiUri}/${props.procedure.fileId}`).then(resp =>{
          if(resp.data)
              setFile(resp.data);
      }).catch(() =>{});
    }
   }

   const getProcess = () =>{
     setOpen(false);
      if(props.procedure){
        // loading process
        axios.get<IProcess[]>(`${API_URIS.processApiUri}/?procedureId.equals=${props.procedure.id}&modelId.specified=false`).then(resp =>{
            if(resp.data && resp.data.length)
                setProcess(resp.data[0]);
        }).catch(() =>{});
      }
   }

   useEffect(() =>{
       getFile();
       getProcess();
   },[props.procedure])

  const handleDettacheFile = () =>{
    if(file){
        const fileId = file.id;
        setFile(null);
        props.handleDetachFile(procedure,fileId);
    }
  }

 const handleProcessAttahed = (attachedProcess?: IProcess) =>{
     if(attachedProcess){
         setProcess(attachedProcess)
     }
 }

 const onDetachProcess = () =>{
    if(process && process.id){
      axios.get<IProcess[]>(`${API_URIS.processApiUri}/${process.id}/bind-or-detach-precedure`).then(res =>{
        setProcess(null);
      }).catch((e) =>{
        /* eslint-disable no-console */
        console.log(e);
      })
    }
 }

  return (
    <React.Fragment>
        <ProcedureBindProcess open={open} procedure={procedure} onClose={() => setOpen(false)} onSaved={handleProcessAttahed}/>
        <TableRow>
            <TableCell align="left">{procedure.name}</TableCell>
            <TableCell align="center">
                {file && <React.Fragment>
                    <FileIllustration file={file} className={classes.fileIllustation} title="Description file"
                      onClick={() =>openMshzFile(file)}/>
                    { hasPrivileges({ entities: ['Procedure'], actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE] }) &&
                    <IconButton title="Dettach file" className="mr-2 text-warning"
                         onClick={handleDettacheFile}>
                        <RemoveCircle fontSize="small"/>
                    </IconButton>}
                 </React.Fragment>}
                {!file &&  hasPrivileges({ entities: ['Procedure'], actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE] }) &&
                   <React.Fragment>
                        ...
                        <IconButton onClick={() => props.handleAttachFile(procedure)} title="attach description file">
                            <Attachment fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            </TableCell>
            <TableCell align="center">
                {process ? process.label : '....'}
                {process &&
                 <React.Fragment>
                     <br/>
                    {hasPrivileges({ entities: ['Procedure'], actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE] }) &&
                    <IconButton title="Dettach process" className="mr-2 text-warning" onClick={onDetachProcess}>
                        <RemoveCircle fontSize="small"/>
                    </IconButton>}
                    <IconButton color="primary" size="small" className="ml-2"
                      onClick={() => props.onDisplayLogigram(process)}>
                        <FontAwesomeIcon icon={faSitemap} fontSize="small" />
                    </IconButton>
                 </React.Fragment>
                }
                {!process && hasPrivileges({ entities: ['Procedure'], actions: [PrivilegeAction.CREATE, PrivilegeAction.UPDATE] }) &&
                    <IconButton title="Attach process" className="ml-2 text-primary" onClick={() => setOpen(true)}>
                        <Add fontSize="small"/>
                    </IconButton>
                }
            </TableCell>
            <TableCell align="center">
                {hasPrivileges({ entities: ['Procedure'], actions: [PrivilegeAction.UPDATE] }) &&
                <IconButton onClick={() =>props.handleUpdate(procedure)} color="primary" 
                    title={translate("entity.action.edit")} className="mr-2">
                    <Edit fontSize="small"/>
                </IconButton>}
                {hasPrivileges({ entities: ['Procedure'], actions: [PrivilegeAction.DELETE] }) && 
                <IconButton onClick={() =>props.handleDelete(procedure)} 
                    color="secondary" title={translate("entity.action.delete")}>
                    <Delete fontSize="small"/>
                </IconButton> }
            </TableCell>
        </TableRow>
    </React.Fragment>
  )
}

export interface IProcedureProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export const Procedure = (props: IProcedureProps) => {
  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE), props.location.search)
  );

  const [currentPage, setCurrentPage] = useState(0);

  const classes = useStyles();

  const [procedures, setProcedures] = useState<IProcedure[]>([...props.procedureList]);

  const getAllEntities = () => {
    props.getEntities(currentPage, paginationState.itemsPerPage, `${paginationState.sort},${paginationState.order}`);
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${currentPage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort, currentPage]);

  useEffect(() =>{
      if(props.procedureList && props.procedureList.length){
        setProcedures([...props.procedureList]);
      }
  }, [props.procedureList])

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get('sort');
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  useEffect(() =>{
        setProcedures([...props.procedureList]);
  }, [])

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === 'asc' ? 'desc' : 'asc',
      sort: p,
    });
  };

  const handlePagination = (event, newPage) => setCurrentPage(newPage);

  const { match, loading, totalItems } = props;

  const [open, setOpen] = useState(true);

  const [searchValue, setSearchValue] = useState('');

  const [openFileEditor, setOpenFileEditor] = useState(false);

  const [procedureToUpdate, setProcedureToUpdate] = useState<IProcedure>(null);

  const [procedureToDelete, setProcedureToDelete] = useState<IProcedure>(null);
  const [openToDelete, setOpenToDelete] = useState(false);

  const [processToDisplayLogigram, setProcessToDisplayLogigram] = useState<IProcess>(null);
  const [openLogingram, setOpenLogigram] = useState(false)

  const handleAttachFile = (procedure: IProcedure) =>{
      if(procedure){
        setProcedureToUpdate(procedure);
        setOpen(false);
        setOpenFileEditor(true);
     }
  }

  const handleUpdate = (procedure: IProcedure) =>{
    if(procedure){
      setProcedureToUpdate(procedure);
      setOpenFileEditor(false);
      setOpen(true);
    }
 }

 const onDetachFile =  (procedure: IProcedure, fileId: number) =>{
     if(fileId && serviceIsOnline(SetupService.FILEMANAGER)){
        axios.delete(`${API_URIS.mshzFileApiUri}/${fileId}`).then(() =>{
            if(procedure){
               const newProcedures = procedures.map(p =>{
                   if(p.id === procedure.id){
                       p.fileId = null;
                       props.updateEntity(p);
                   }
                  return p;
               })
               setProcedures([...newProcedures]);
            }
        }).catch(() =>{});
     }
 }
 
 const handleDelete = (procedure: IProcedure) =>{
    if(procedure){
      setProcedureToDelete(procedure);
      setOpenToDelete(true)
    }
}

const handleShowLogigram = (p: IProcess) =>{
   if(p){
    setProcessToDisplayLogigram(p);
    setOpenLogigram(true)
   }
}

  const items = procedures.filter(p =>p.name && p.name.includes(searchValue)).sort(() => -1).map(p =>{
        return <RowItem key={p.id} procedure={p} handleAttachFile={handleAttachFile} handleUpdate={handleUpdate} 
            handleDetachFile={onDetachFile} handleDelete={handleDelete} onDisplayLogigram={handleShowLogigram}/>
  });

  const handleCreate = () =>{
      setProcedureToUpdate({});
      setOpen(true);
  }
  const handleSearchOnChange = (e) =>{
    setSearchValue(e.target.value);
 }

 const handleCloseUpdateProcedureModal = () =>{
     setOpen(false);
 }

 const onSaveProcedure = (procedure: IProcedure, isNew: boolean) =>{
     if(procedure){
         if(isNew)
           setProcedures([procedure, ...procedures]);
        else
          setProcedures(procedures.map(p => p.id === procedure.id ? procedure : p));
        setOpen(false)
     }
 }

 const onSavedAttachFile = (savedFiles?: IMshzFile[]) =>{
     if(savedFiles && savedFiles.length && procedureToUpdate){
         const entity: IProcedure = {...procedureToUpdate, fileId: savedFiles[0].id}
         axios.put<IProcedure>(`${API_URIS.procedureApiUri}`, cleanEntity(entity))
            .then(res =>{
                if(res.data){
                    const els = procedures.map(p => p.id === res.data.id ? res.data : p);
                    setProcedures([...els]);
                }
            }).catch(e =>{
                /* eslint-disable no-console */
                console.log(e);
            })
     }
     setOpenFileEditor(false);
 }

 const onDelete = (deletedId?: number) =>{
     if(deletedId){
        setProcedures(procedures.filter(p => p.id !== deletedId));
        setOpenToDelete(false)
     }
 }

  return(
    <React.Fragment>
      <Helmet><title>Cperf | Procedures</title></Helmet>
      {procedureToDelete && 
        <EntityDeleterModal 
          open={openToDelete}
          entityId={procedureToDelete.id}
          urlWithoutEntityId={API_URIS.procedureApiUri}
          question={translate("microgatewayApp.microprocessProcedure.delete.question", {id: procedureToDelete.name})}
          onClose={() => setOpenToDelete(false)}
          onDelete={onDelete}
        />
      }
      {procedureToUpdate && <React.Fragment>
        <ProcedureUpdate open={open} procedure={procedureToUpdate}
            onClose={handleCloseUpdateProcedureModal} onSaved={onSaveProcedure}/>
        <EditFileModal
          open={openFileEditor} 
          entityTagName={FileEntityTag.procedure}
          entityId={procedureToUpdate.id}
          withClearPreviewerItem onSaved={onSavedAttachFile} 
          onCloseNoCancelSaving={() => setOpenFileEditor(false)}
        />
        </React.Fragment>
      }
      {processToDisplayLogigram && <LogigramModal open={openLogingram}
        process={processToDisplayLogigram} onClose={() => setOpenLogigram(false)} />}
      <Card className={classes.card}>
        <CardHeader
            action={
              <React.Fragment>
                {hasPrivileges({ entities: ['Procedure'], actions: [PrivilegeAction.CREATE] }) && 
                 <IconButton aria-label="add" onClick={handleCreate} title="add" color="inherit">
                    <Add style={{ fontSize: 30}}/>
                </IconButton>}
              </React.Fragment>
            }
            title={<Box display="flex" justifyContent="space-between" alignItems="center">
                <FontAwesomeIcon icon={faFileAlt} className="mr-3"/>
                <Translate contentKey="microgatewayApp.microprocessProcedure.home.title">Procedures</Translate>
                <CardSubHeaderInlineSearchBar 
                  onChange = {handleSearchOnChange}
                 />
              </Box>}
            titleTypographyProps={{ variant: 'h4', style:{ } }}
            classes={{ root: classes.cardHeader }}/>
            <CardContent style={ { padding:0}}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="procdures table">
                    <TableHead>
                    <TableRow className={classes.theadRow}>
                        <TableCell align='left'>
                            <Translate contentKey="microgatewayApp.microprocessProcedure.name">Name</Translate>
                        </TableCell>
                        <TableCell align='center'>
                            <Translate contentKey="microgatewayApp.microprocessProcedure.fileId">Name</Translate>
                        </TableCell>
                        <TableCell align='center'>
                            <Translate contentKey="microgatewayApp.microprocessProcess.detail.title">Process</Translate>
                        </TableCell>
                        <TableCell align='center'>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {!loading && procedures && procedures.length > 0 && items }
                        {!procedures || !procedures.length && 
                            <TableRow>
                                <TableCell colSpan={20} align="center">
                                    {!loading && <Translate contentKey="microgatewayApp.microprocessProcedure.home.notFound">No Employees found</Translate>}
                                    {loading && 'laoding'}
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                 </Table>
                </TableContainer>
            </CardContent>
            <CardActions>
              {props.totalItems > 0 &&
                <TablePagination className={props.procedureList && props.procedureList.length ? '' : 'd-none'}
                  component="div"
                  count={props.totalItems}
                  page={currentPage}
                  onPageChange={handlePagination}
                  rowsPerPage={paginationState.itemsPerPage}
                  onChangeRowsPerPage={() =>{}}
                  rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                  labelRowsPerPage=""
                  labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count, paginationState.itemsPerPage)}`}
                  classes={{ 
                      root: classes.pagination,
                      input: classes.input,
                      selectIcon: classes.selectIcon,
                }}/>}
            </CardActions>
        </Card>
    </React.Fragment>
   );
};

const mapStateToProps = ({ procedure }: IRootState) => ({
  procedureList: procedure.entities,
  loading: procedure.loading,
  totalItems: procedure.totalItems,
});

const mapDispatchToProps = {
  getEntities,
  updateEntity,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Procedure);


