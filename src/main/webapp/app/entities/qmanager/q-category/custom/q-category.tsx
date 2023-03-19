import { IQCategory, defaultValue as defaultQCategory } from "app/shared/model/qmanager/q-category.model";
import { API_URIS, getTotalPages } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "app/shared/util/pagination.constants";
import React, { useEffect, useState } from "react";
import { Helmet }  from 'react-helmet';
import { translate } from "react-jhipster";
import axios from 'axios';
import { Badge, Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography } from "@material-ui/core";
import CardSubHeaderInlineSearchBar from "app/shared/layout/search-forms/card-subheader-inline-searchbar";
import { hasPrivileges } from "app/shared/auth/helper";
import { PrivilegeAction } from "app/shared/model/enumerations/privilege-action.model";
import { Add } from "@material-ui/icons";
import QCategoryUpdate from "./q-category-update";
import { QCategoryItem } from "./partial/q-catery-item";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import { useHistory } from "react-router";

const useStyles = makeStyles(theme =>({
    card:{
      boxShadow: '-1px -1px 10px',makeStyles
    },
    cardHeader: {
      paddingTop:2,
      paddingBottom:2,
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.dark,
      // backgroundColor: theme.palette.primary.main, // colors.blueGrey[400],
    },
    cardContent:{
    },
    cardActions:{
      paddingTop:0,
      paddingBottom:0,
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
    tasksFab:{
      boxShadow: 'none',
      background: 'transparent',
      color: theme.palette.success.dark,
      '& :disabled':{
        background: 'transparent',
      }
    },
    procedureFileIllustration:{
       height: theme.spacing(4),
       width: theme.spacing(5),
       fontSize: theme.spacing(6),
       cursor: 'pointer',
       marginTop:'1px',
       '&:hover':{
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
        maxWidth: 100,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: 'ellipsis',
    },
    catSelect:{
        height:theme.spacing(3),
        fontSize:15,
        color: theme.palette.primary.dark,
        "&&&:before": {
          borderBottom: "none"
        },
        "&&:after": {
          borderBottom: "none"
        }
        // borderBottom: '1px solid white',
    },
  }))

export const QCategory = (props) =>{
    const [cats, setCats] = useState<IQCategory[]>([]);
    
    const [loading, setLoading] = useState(false);

    const [totalItems, setTotalItems] = useState(0);
  
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
    const [activePage, setActivePage] = useState(0);

    const [searchValue, setSearchValue] = useState('')

    const [catToUpdate, setCatToUpdate] = useState<IQCategory>(defaultQCategory);
    const [openToUpdate, setOpenToUpdate] = useState(false);

    const [catToDelete, setCatToDelete] = useState<IQCategory>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [nbQueries, setNbQueries] = useState(0);

    const history = useHistory();

    const classes = useStyles();

    const countQueries = () =>{
      axios.get<number>(`${API_URIS.queryApiUri}/count`)
          .then(res => setNbQueries(res.data))
          .catch(e => console.log(e))
    }

    const getCats = (p?: number, rows?: number) => {
      setLoading(true);
      const page = p || p === 0 ? p : activePage;
      const size = rows || itemsPerPage; 
      const requestUri =`${API_URIS.queryCategoryApiUri}/?parentId.specified=false&page=${page}&size=${size}&sort=id,desc`;
      axios.get<IQCategory[]>(requestUri)
        .then(res => {
          setTotalItems(parseInt(res.headers['x-total-count'], 10));
          setCats(res.data)
        }).catch((e) =>{
          console.log(e);
        }).finally(() =>{
            setLoading(false);
        });
    };

    useEffect(() =>{
        getCats();
        countQueries();
    }, [])

    const handleUpdate = (c?: IQCategory) =>{
        setCatToUpdate(c || defaultQCategory);
        setOpenToUpdate(true);
    }

    const onSave = (saved?: IQCategory, isNew?: boolean) =>{
        if(saved){
            if(isNew)
                setCats([...cats, saved])
            else
                setCats([...cats].map(c => c.id === saved.id ? saved : c));
            setOpenToUpdate(false);
        }
    }

    const handleDelete = (c?: IQCategory) =>{
        if(c){
            setCatToDelete(c);
            setOpenDelete(true);
        }
    }

    const onDelete = (deletedId?: any) =>{
        if(deletedId){
            setCats([...cats].filter(c => c.id !== deletedId));
            setOpenDelete(false);
        }
    }

    const handleSearchChange = (e) =>{
      setSearchValue(e.target.value);
    }

    const handleChangeItemsPerpage = (event) =>{
      setItemsPerPage(parseInt(event.target.value, 10));
      getCats(0, parseInt(event.target.value, 10))
    }
  
    const handleChangePage = (event, newPage) =>{
      setActivePage(newPage);
      getCats(newPage)
    }

    const items = [...cats].filter(c =>
          (
              (c.name && c.name.toLowerCase().includes(searchValue.toLowerCase()))
              || (c.description && c.description.toLowerCase().includes(searchValue.toLowerCase()))
          )
       ).map((category, index) =>(
         <QCategoryItem
             key={index} 
             category={category}
             onUpdate={handleUpdate}
             onDelete={handleDelete}
         />
      ))


    const viewQueries = () =>{
          history.push(`/query`)
    }

    return (
        <React.Fragment>
            <Helmet><title>{`Cperf | ${translate("microgatewayApp.qmanagerQCategory.home.title")}`}</title></Helmet>
            <QCategoryUpdate 
                category={catToUpdate}
                open={openToUpdate}
                onSave={onSave}
                onClose={() => setOpenToUpdate(false)}
            />
            {catToDelete && 
                <EntityDeleterModal
                    open={openDelete}
                    entityId={catToDelete.id}
                    urlWithoutEntityId={API_URIS.queryCategoryApiUri}
                    onDelete={onDelete}
                    onClose={() => setOpenDelete(false)}
                    question={translate("microgatewayApp.qmanagerQCategory.delete.question", {id: catToDelete.name})}
                />
             }
            <Card className={classes.card}>
                <CardHeader
                    title={<Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography className="mr-3" variant="h4">
                            {translate("microgatewayApp.qmanagerQCategory.home.title")}
                        </Typography>
                        <CardSubHeaderInlineSearchBar
                        onChange = {handleSearchChange}
                        />
                          <Button color="primary" 
                               size="small" variant="text"
                               style={{ textTransform: 'none'}}
                               onClick={viewQueries}>
                                {translate("_global.label.allQueries")}&nbsp;
                                <span className="badge badge-danger badge-pill">{nbQueries}</span>
                          </Button>
                        {hasPrivileges({ entities: ['Query'] , actions: [PrivilegeAction.CREATE]}) && 
                        <IconButton aria-label="add" 
                            onClick={() => {handleUpdate(null)}}
                            color="primary" className="ml-3">
                            <Add style={{ fontSize: 30 }} />
                        </IconButton>
                        }
                    </Box>}
                    className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                  <Table>
                      <TableHead className={classes.thead}>
                          <TableRow className={classes.theadRow}>
                              <TableCell align="left" style={{ width:30 }}></TableCell>
                              <TableCell align="left">
                                {translate('microgatewayApp.qmanagerQCategory.name')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQCategory.description')}
                              </TableCell>
                              <TableCell align="center">
                                {translate('microgatewayApp.qmanagerQuery.home.title')}
                              </TableCell>
                              <TableCell align="center">{'Actions'}</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                        {(loading || items.length ===0) && <TableRow>
                          <TableCell align="center" colSpan={20}>
                            {loading && 'loading...'}
                            {(!loading && items.length===0) &&
                              <Typography variant="body1">
                                  {translate("microgatewayApp.qmanagerQCategory.home.notFound")}
                              </Typography>
                            }
                          </TableCell>
                        </TableRow>}
                          {items}
                      </TableBody>
                  </Table>
                </CardContent>
               {totalItems > 0 &&
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
              }
            </Card>
        </React.Fragment>
    )
}

export default QCategory;