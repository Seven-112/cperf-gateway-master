import MyCustomModal from "app/shared/component/my-custom-modal";
import { IProcessCategoryUser } from "app/shared/model/microprocess/process-category-user.model";
import React, { useEffect, useState } from "react";
import { translate } from "react-jhipster";
import axios from 'axios';
import { API_URIS, getUserExtraEmail, getUserExtraFullName } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import { IProcessCategory } from "app/shared/model/microprocess/process-category.model";
import MyCustomTable from "app/shared/component/my-custom-table";
import { IconButton, makeStyles, TableCell, TableCellProps, TableRow, Tooltip } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import UserExtraFinder2 from "app/entities/user-extra/custom/user-extra-finder2";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { cleanEntity } from "app/shared/util/entity-utils";
import ConfirmDialog from "app/shared/component/confirm-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { IProcess } from "app/shared/model/microprocess/process.model";
import { DeleteIconButton } from "app/shared/component/custom-button";

const useStyles = makeStyles(theme =>({
    card:{
        background: "transparent",
        boxShadow: 'none',
        marginTop:theme.spacing(5),
        minWidth: '45%',
        maxWidth: '90%',
        [theme.breakpoints.down('sm')]:{
            minWidth: '80%',
            maxWidth: '80%',
        }
    },
    tableRoot:{
        boxShadow: 'none',
        marginTop:theme.spacing(-5),
    },
    deletConfirmCard:{
        background: 'transparent',
        minWidth: '20%',
        maxWidth: '25%',
        [theme.breakpoints.down("sm")]:{
            maxWidth: '60%',
        },
        boxShadow: 'none',
        border: 'none',
    },
}))

interface IProcessCategoryUserProps{
    category?: IProcessCategory
    processus?: IProcess,
    open?: boolean,
    onClose: Function,
}

export const ProcessCategoryUser = (props: IProcessCategoryUserProps) =>{
    const { open, category, processus } = props;
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [users, setUsers] = useState<IProcessCategoryUser[]>([]);
    const [user, setUser] = useState<IProcessCategoryUser>(null);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openToDelete, setOpenToDelete] = useState(false);
    const [openToAdd, setOpenToAdd] = useState(false);

    const classes = useStyles();
    
    const getUsers = (p?:number, rows?:number) =>{
        if((props.category && props.category.id) || (props.processus && props.processus.id)){
        const page = p || p === 0 ? p : activePage;
        const size = rows || itemsPerPage;
        setLoading(true)
        let apiUri = `${API_URIS.processCategoryUserApiUri}/?page=${page}&size=${size}`;
        if(props.category)
            apiUri = `${apiUri}&categoryId.equals=${props.category.id}`;
        if(props.processus)
            apiUri = `${apiUri}&processId.equals=${props.processus.id}`;
        axios.get<IProcessCategoryUser[]>(apiUri)
            .then(res =>{
                setUsers([...res.data])
                setTotalItems(parseInt(res.headers['x-total-count'], 10));
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
        }
    }

    useEffect(() =>{
        getUsers();
    }, [props.category, props.processus])

    const handleDelete = (u?: IProcessCategoryUser) =>{
        if(u){
            setUser(u);
            setOpenToDelete(true);
        }
    }
    const handleChangeItemsPerpage = (rows: number) =>{
        getUsers(null, rows);
        setItemsPerPage(rows);
      }
    
    const handleChangePage = (newPage) =>{
        getUsers(newPage);
        setActivePage(newPage);
    }

    const onUserSelectChange = (ue?: IUserExtra, isSelecting?: boolean) => {
        if(ue && (category || processus)){
          setLoading(false)
              if(isSelecting){
                  const entity: IProcessCategoryUser = {
                      categoryId: category ? category.id : null,
                      processId: processus ? processus.id : null,
                      userId: ue.id,
                      userFullName: getUserExtraFullName(ue),
                      userEmail: getUserExtraEmail(ue),
                  }
                  axios.post<IProcessCategoryUser>(API_URIS.processCategoryUserApiUri, cleanEntity(entity))
                      .then(res =>{
                          if(res.data){
                              setUsers([res.data, ...users])
                          }
                      }).catch(e => console.log(e))
                      .finally(() => {
                          setLoading(false);
                      })
              }else{
                  setLoading(true);
                  let apiUri = `${API_URIS.processCategoryUserApiUri}/deleteByUserAndCategoryAndProcess/?userId=${ue.id}`;
                  if(category && category.id)
                    apiUri = `${apiUri}&categoryId=${category.id}`;
                  if(processus && processus.id)
                    apiUri = `${apiUri}&processId=${processus.id}`;
                  axios.delete(apiUri)
                      .then(res =>{
                        setUsers([...users].filter(u => u.userId !== ue.id));
                      }).catch(e => console.log(e))
                      .finally(() => { setLoading(false); })
              }
          }
    };

    const handleConfirmDelete = () =>{
        if(user && user.id){
            axios.delete(`${API_URIS.processCategoryUserApiUri}/${user.id}`)
            .then(res =>{
              setUsers([...users].filter(u => u.id !== user.id));
              setUser(null);
            }).catch(e => console.log(e))
            .finally(() => { setLoading(false); })
        }
        setOpenToDelete(false)
    }

    const TRow = ({ pcu } : {pcu: IProcessCategoryUser}) =>(
        <TableRow>
            <TableCell>{pcu.userFullName}</TableCell>
            <TableCell align="center">{processus ? processus.label : '...'}</TableCell>
            <TableCell align="center">{category ? category.name : '...'}</TableCell>
            <TableCell align="center">
                <DeleteIconButton onClick={() => handleDelete(pcu)} />
            </TableCell>
        </TableRow>
    )

    const tRows = [...users].map((pcu, index) =><TRow key={index} pcu={pcu} /> )
    
    const thHeadCells: TableCellProps[] = [
        {
            children: translate("microgatewayApp.microprocessProcessCategoryUser.userFullName"),
            align: 'center',
        },
        {
            children: translate("microgatewayApp.microprocessProcess.detail.title"),
            align: 'center',
        },
        {
            children: translate("microgatewayApp.microprocessProcessCategory.detail.title"),
            align: 'left',
        },
        {
            children: "Actions",
            align: 'center',
        }
    ];
    

    return (
    <React.Fragment>
        {user &&
        <ConfirmDialog 
            open={openToDelete}
            question={translate("microgatewayApp.microprocessProcessCategoryUser.delete.question", {id: user.userFullName})}
            rootCardCustomClassName={classes.deletConfirmCard}
            onClose={() => setOpenToDelete(false)}
            onConfirm={handleConfirmDelete}
        />}
        <UserExtraFinder2 
            open={openToAdd}
            multiple
            onSelectChange={onUserSelectChange}
            unSelectableIds={[[...users].map(u => u.userId)]}
            onClose={() => setOpenToAdd(false)}
        />
        <MyCustomModal 
            open={open}
            avatarIcon={<FontAwesomeIcon icon={faUsers} />}
            title={translate("microgatewayApp.microprocessProcessCategoryUser.home.title")}
            rootCardClassName={classes.card}
            customActionButtons={
            <Tooltip title={translate("_global.label.add")}
                onClick={() => setOpenToAdd(true)}>
                <IconButton color="primary"><Add /></IconButton>
            </Tooltip>
            }
            onClose={() => props.onClose()}>
            <MyCustomTable 
                tHeadColums={thHeadCells}
                tRows={tRows}
                rootCustomClassName={classes.tableRoot}
                loading={loading}
                notFound={translate("microgatewayApp.microprocessProcessCategoryUser.home.notFound")}
                totalItems={totalItems}
                rowsPerPage={itemsPerPage}
                activePage={activePage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeItemsPerpage}
             />
        </MyCustomModal>
    </React.Fragment>
    )
}

export default ProcessCategoryUser;