import { Box, FormControl, InputLabel, LinearProgress, List, ListItem, ListItemText, makeStyles, MenuItem, Select, TablePagination, Typography } from "@material-ui/core";
import { IRootState } from "app/shared/reducers";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { getEntities } from 'app/entities/microprocess/process/process.reducer';
import { IProcess } from "app/shared/model/microprocess/process.model";
import { TextFormat, translate, Translate } from "react-jhipster";
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { APP_DATE_FORMAT } from "app/config/constants";
import MyCustomModal from "app/shared/component/my-custom-modal";
import theme from "app/theme";
import { IProcessCategory } from "app/shared/model/microprocess/process-category.model";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";
import axios from 'axios';

const useStyles = makeStyles({
    card:{
      width: '35%', 
      [theme.breakpoints.down('sm')]:{
        width: '85%', 
      }
    },
    pagination:{
     padding:0,
     color:theme.palette.primary.dark,
   },
   input:{
       width: theme.spacing(10),
       display: 'none',
   },
   selectIcon:{
       color: theme.palette.primary.dark,
       display: 'none',
   },
   selectedListItem:{
     backgroundColor: theme.palette.primary.main,
     color: 'white',
   }
})

interface IProcessSelector extends StateProps, DispatchProps{
  open: boolean,
  selected?: IProcess,
  specialLoading?: boolean,
  withInstances?: boolean,
  onClose: Function,
  onSelect: Function,
}

const ROWS_PER_PAGE = Math.floor(ITEMS_PER_PAGE/2)

export const ProcessSelector = (props: IProcessSelector) =>{
  
  const { processList, totalItems, loading, open, specialLoading } = props;

  const [activePage, setActivePage] = useState(0);

  const [category, setCategory] = useState<IProcessCategory>(null);

  const [cats, setCats] = useState<IProcessCategory[]>([]);

  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);

  const [selectedProcess, setSelectedProcess] = useState<IProcess>(props.selected);

  const getCategories = () =>{
    if(serviceIsOnline(SetupService.PROCESS)){
        axios.get<IProcessCategory[]>(API_URIS.processCategoryApiUri)
             .then(res =>{
                 setCats(res.data)
             }).catch(e => console.log(e))
    }
  }

  const getProcesses = (p?: number, catId?:any) =>{
    const page = p || p===0 ? p : activePage;
    const cId = catId || catId === 0 ? catId : category ? category.id : null;
    let sort = `id,desc&valid.equals=true`;
    if(!props.withInstances)
      sort = `${sort}&modelId.specified=false`;
    if(cId)
      sort = `${sort}&categoryId.equals=${cId}`;
    else
      sort = `${sort}&categoryId.specified=false`;
    props.getEntities(page, rowsPerPage, sort);
  }

  const handleClose = () => props.onClose();

  const handleChangePage = (event, newPage) => {
    setActivePage(newPage);
    getProcesses(newPage);
  };

  useEffect(() =>{
      getCategories();
  }, [])


  useEffect(() =>{
    setSelectedProcess(props.selected);
    getProcesses(null, (props.selected && props.selected.category) ? props.selected.category.id : null);
}, [props.selected])

  const selectProcess = (event, id) => {
    const entity = [...processList].find(p => p.id === id)
    setSelectedProcess(entity);
    props.onSelect(entity);
  }

  const handleChangeCategory = (e) =>{
    const { value } = e.target;
    const cat = [...cats].find(c => c.id === value);
    setCategory(cat);
    getProcesses(null, cat ? cat.id : 0);
}

  const classes = useStyles();
  
  return (
    <React.Fragment>
      <MyCustomModal
        open={open}
        onClose={handleClose}
        rootCardClassName={classes.card}
        title={`${translate("_global.label.select")} ${translate("_global.label.un")} ${translate("microgatewayApp.microprocessProcess.detail.title")}`}
        footer={totalItems > 0 ?
                <TablePagination 
                component="div"
                count={totalItems}
                page={activePage}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage={""}
                labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,rowsPerPage)}`}
                classes={{ 
                  root: classes.pagination,
                  input: classes.input,
                  selectIcon: classes.selectIcon,
              }}/> : <></>
          }
      >
        {(loading || specialLoading) && <LinearProgress /> }
        <Box width={1} mt={1}>
            <FormControl fullWidth size="small">
                <InputLabel shrink={true}>{translate("microgatewayApp.microprocessProcessCategory.detail.title")}</InputLabel>
                <Select value={category ? category.id : 0}
                    displayEmpty variant="outlined" onChange={handleChangeCategory}>
                    {[...cats].map((c, index) =>(
                        <MenuItem key={index} value={c.id}> {c.name}</MenuItem>
                    ))}
                    <MenuItem value={0}>{translate('_global.label.uncategorized')}</MenuItem>
                </Select>
            </FormControl>
        </Box>
        {!loading && (
          processList && processList.length !== 0 ? (
            <List component="nav" aria-label="Process list">
              <ListItem button 
                selected={!selectedProcess}
                onClick={(event) => selectProcess(event, null)}
                classes={{
                  selected: 'bg-primary text-white',
                }} >
                <ListItemText primary={<Translate contentKey="_global.label.noSelect">No Select</Translate>}/>
              </ListItem>
                {processList.map(process =>(
                  <ListItem key={process.id} button 
                    selected={selectedProcess && selectedProcess.id === process.id}
                    onClick={(event) => selectProcess(event, process.id)}
                    classes={{
                      selected: 'bg-primary text-white',
                    }}>
                    <ListItemText primary={process.label}
                      secondary={
                        <React.Fragment>
                          {process.createdAt && <React.Fragment>
                              <Translate contentKey="microgatewayApp.microprocessProcess.createdAt">Created at</Translate>&nbsp;
                              <TextFormat type="date" value={process.createdAt} format={APP_DATE_FORMAT} />
                            </React.Fragment>
                          }
                        </React.Fragment>}/>
                  </ListItem>
                ))}
            </List>
          ):(
            <Typography variant="body1">
              <Translate contentKey="microgatewayApp.microprocessProcess.home.notFound">No Processes found</Translate>
            </Typography>
          )
        )}
      </MyCustomModal>
    </React.Fragment>
  )
}



const mapStateToProps = ({ process }: IRootState) => ({
  processList: process.entities,
  loading: process.loading,
  totalItems: process.totalItems,
});

const mapDispatchToProps = {
  getEntities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ProcessSelector);