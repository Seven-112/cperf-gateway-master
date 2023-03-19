import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, CardActions, CardContent, CardHeader, IconButton, makeStyles, Table, TableBody, TableCell, TableCellProps, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import clsx from "clsx";
import React, { ReactNode } from "react";
import { translate } from "react-jhipster";
import CardSubHeaderInlineSearchBar, { ISearchCriteria } from "../layout/search-forms/card-subheader-inline-searchbar";
import { getTotalPages } from "../util/helpers";
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPRIONS } from "../util/pagination.constants";

const useStyles = makeStyles(theme =>({
    card:{
      boxShadow: '-1px -1px 10px',
    },
    cardHeader: {
      paddingTop:2,
      paddingBottom:2,
      backgroundColor: theme.palette.common.white,
      color: theme.palette.primary.dark,
      // backgroundColor: theme.palette.primary.main, // colors.blueGrey[400],
    }, 
    tableContainer: {
        overflowX: "initial"
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

export interface MyCutomTableProps{
    title?:any,
    tHeadColums:TableCellProps[]
    tRows?: ReactNode[],
    cardHeaderActions?: any,
    cardIcon?: IconProp,
    notFound?: string,
    loading?: boolean,
    loadingComponent?: any,
    rootCustomClassName?:any,
    activePage?: number,
    totalItems: number,
    rowsPerPage?: number,
    handleSearch?: Function,
    handleSubmitSearch?: Function,
    searchCritarias?: ISearchCriteria[],
    serachCritariaSelectMultiple?: boolean,
    handleChangeRowsPerPage?: Function,
    handleChangePage?: Function,
    handleCreate?: Function,
    handleGoToBack?: Function,
    enableSearch?: boolean,
    searchFilterLabel?: string,
}
export const MyCustomTable = (props: MyCutomTableProps) =>{
    const { tHeadColums, loading } = props;
    const classes = useStyles();

  const handleChangeItemsPerpage = (event) =>{
    if(props.handleChangeRowsPerPage)
        props.handleChangeRowsPerPage(parseInt(event.target.value, 10));
  }

  const handleChangePage = (event, newPage) =>{
    if(props.handleChangePage)
        props.handleChangePage(newPage);
  }

    return (
        <React.Fragment>
            <Card className={clsx(classes.card, { [props.rootCustomClassName]: props.rootCustomClassName})}>
                <CardHeader 
                        action={
                            <>
                            {props.handleCreate && 
                                <Tooltip title={translate('_global.label.add')}
                                    onClick={() => props.handleCreate()}>
                                    <IconButton aria-label="add" color="primary" className="">
                                        <Add style={{ fontSize: 30 }} />
                                    </IconButton>
                                </Tooltip>
                            }
                            </>
                        }
                        title={<Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                        <Box display={"flex"} alignItems={"center"}>
                            {props.handleGoToBack ? (
                                <IconButton 
                                    aria-label="back" 
                                    color="inherit"
                                    onClick={() => props.handleGoToBack()} 
                                    title="prev" style={{ marginRight:15}}>
                                    <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                                </IconButton>
                                ) : (
                                    props.cardIcon ? <Box p={0} m={0} mr={3}><FontAwesomeIcon icon={props.cardIcon} /></Box> : <></>
                                )
                            }
                            {props.title || ''}
                        </Box>
                        {(props.enableSearch || props.handleSearch || props.handleSubmitSearch) &&
                            <CardSubHeaderInlineSearchBar
                                onChange = {props.handleSearch}
                                onSubmit={props.handleSubmitSearch}
                                criterias={props.searchCritarias}
                                multipleSelectCriteria={props.serachCritariaSelectMultiple}
                                filterLabel={props.searchFilterLabel}
                                placeHolder={`${translate("_global.label.search")}...`}
                            />
                        }
                        {props.cardHeaderActions && 
                            <Box display="flex" justifyContent="flex-end" alignItems="center">
                                {props.cardHeaderActions}
                            </Box>}
                    </Box>}
                    titleTypographyProps={{ variant: 'h4', style:{ } }}
                    classes={{ root: classes.cardHeader }}
                />
                <CardContent className={classes.cardContent}>
                    <Table>
                        {[...tHeadColums] && [...tHeadColums].length !== 0 &&
                            <TableHead className={classes.thead}>
                                <TableRow className={classes.theadRow}>
                                    {tHeadColums.map((th, index) =>(
                                        <TableCell key={index} {...th} />
                                    ))}
                                </TableRow>
                            </TableHead>
                        }
                        <TableBody>
                            {(loading || (!props.tRows || props.tRows.length === 0)) && <TableRow>
                            <TableCell align="center" colSpan={[...tHeadColums].length +1}>
                                {loading ? <>{props.loadingComponent || 'loading ...'}</> : 
                                  <Typography variant="body1">{props.notFound || 'No data found ...'}</Typography>
                                }
                            </TableCell>
                            </TableRow>}
                            {props.tRows}
                        </TableBody>
                    </Table>
                </CardContent>
               {(props.totalItems > 0 && (props.handleChangePage || props.handleChangeRowsPerPage)) &&
                <CardActions className={classes.cardActions}>
                    <TablePagination 
                    component="div"
                    count={props.totalItems}
                    page={props.activePage || 0}
                    onPageChange={handleChangePage}
                    rowsPerPage={props.rowsPerPage || ITEMS_PER_PAGE}
                    onChangeRowsPerPage={handleChangeItemsPerpage}
                    rowsPerPageOptions={ITEMS_PER_PAGE_OPRIONS}
                    labelRowsPerPage={translate("_global.label.rowsPerPage")}
                    labelDisplayedRows={({from, to, count, page}) => `Page ${page+1}/${getTotalPages(count,props.rowsPerPage)}`}
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

MyCustomTable.defaultProps={
    enableSearch: true
}

export default MyCustomTable;