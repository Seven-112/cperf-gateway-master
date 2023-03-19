import { faBoxes, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, TableCell, TableCellProps, TableRow, Tooltip } from "@material-ui/core";
import MyCustomTable from "app/shared/component/my-custom-table";
import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet';
import { translate } from "react-jhipster";
import axios from 'axios';
import { IProcessCategory } from "app/shared/model/microprocess/process-category.model";
import { API_URIS } from "app/shared/util/helpers";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import EntityDeleterModal from "app/shared/component/entity-deleter-modal";
import ProcessCategoryUpdate from "./process-category-update";
import ProcessCategoryUser from "../../process-category-user/custom/process-category-user";
import { DeleteIconButton, EditIconButton } from "app/shared/component/custom-button";


export const ProcessCategory = (props) =>{
    const [activePage, setActivePage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
    const [cats, setCats] = useState<IProcessCategory[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [category, setCategory] = useState<IProcessCategory>(null);
    const [openToUpdate, setOpenToUpdate] = useState(false);
    const [openToDelete, setOpenToDelete] = useState(false);
    const [openCatUsers, setOpenCatUsers] = useState(false);

    const getCategories = (page?: number, rows?: number) =>{
        const p = (page || page === 0)? page : activePage;
        const size = rows || itemsPerPage;
        setLoading(true);
        axios.get<IProcessCategory[]>(`${API_URIS.processCategoryApiUri}/?page=${p}&size=${size}&sort=id,asc`)
            .then(res => {
                setCats([...res.data])
                setTotalItems(parseInt(res.headers['x-total-count'], 10));
            }).catch(e => console.log(e))
            .finally(() => setLoading(false))
    }

    useEffect(() =>{
        getCategories();
    }, [])
   
    const handleUpdate = (cat?: IProcessCategory) =>{
        setCategory(cat);
        setOpenToUpdate(true);
    }

    const handleDelete = (cat?: IProcessCategory) =>{
        if(cat){
            setCategory(cat);
            setOpenToDelete(true);
        }
    }

    const handleOpenUsers = (c?: IProcessCategory) =>{
        if(c){
            setCategory(c);
            setOpenCatUsers(true);
        }
    }

    const handleSearch = (e) => setSearchVal(e.target.value || '');

    const handleChangeItemsPerpage = (rows: number) =>{
      getCategories(null, rows);
      setItemsPerPage(rows);
    }
  
    const handleChangePage = (newPage) =>{
      getCategories(newPage);
      setActivePage(newPage);
    }

    const onSave = (saved?: IProcessCategory, isNew?:boolean) =>{
        if(saved){
            if(isNew){
             setCats([...cats,saved])
             setOpenToUpdate(false);
            }
            else{
                setCats(cats.map(c => c.id === saved.id ? saved : c));
            }
        }
    }

    const onDelete = (deletedId) =>{
        if(deletedId){
            setCats([...cats].filter(c => c.id !== deletedId))
            setOpenToDelete(false);
        }
    }

    const TRow = ({c}: {c: IProcessCategory}) =>(
        <TableRow>
            <TableCell>{c.name}</TableCell>
            <TableCell align="center">{c.description}</TableCell>
            <TableCell align="center">
                <Tooltip title={translate("userManagement.home.title")}
                    onClick={() => handleOpenUsers(c)}>
                    <IconButton color="default">
                        <FontAwesomeIcon icon={faUsers} />
                    </IconButton>
                </Tooltip>
                <EditIconButton onClick={() => handleUpdate(c)} />
                <DeleteIconButton onClick={() => handleDelete(c)} />
            </TableCell>
        </TableRow>
    )

    const tRows = [...cats].filter(c => 
        (c.name && c.name.toLowerCase().includes(searchVal.toLowerCase()))
        || (c.description && c.description.toLowerCase().includes(searchVal.toLowerCase())))
        .map((c, index)=> <TRow key={index} c={c}/> )

    const thHeadCells: TableCellProps[] = [
        {
            children: translate("microgatewayApp.microprocessProcessCategory.name"),
            align: 'left',
        },
        {
            children: translate("microgatewayApp.microprocessProcessCategory.description"),
            align: 'center',
        },
        {
            children: "Actions",
            align: 'center',
        }
    ];
    

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${translate("_global.appName")} | ${translate("microgatewayApp.microprocessProcess.home.title")} | ${translate("microgatewayApp.microprocessProcessCategory.home.title")}`}</title>
            </Helmet>
            {<ProcessCategoryUpdate 
                category={category}
                open={openToUpdate}
                onSave={onSave}
                onClose={() => setOpenToUpdate(false)}
            />}
            {category && <>
                <ProcessCategoryUser 
                    open={openCatUsers}
                    category={category}
                    onClose={() => setOpenCatUsers(false)}
                />
                <EntityDeleterModal 
                    open={openToDelete}
                    entityId={category.id}
                    urlWithoutEntityId={API_URIS.processCategoryApiUri}
                    onDelete={onDelete}
                    onClose={() => setOpenToDelete(false)}
                    question={translate("microgatewayApp.microprocessProcessCategory.delete.question", {id: category.name})}
                />
            </>}
            <MyCustomTable 
                title={translate("microgatewayApp.microprocessProcessCategory.home.title")} 
                tHeadColums={thHeadCells}
                tRows={tRows}
                loading={loading}
                cardIcon={faBoxes}
                notFound={translate("microgatewayApp.microprocessProcessCategory.home.notFound")}
                totalItems={totalItems}
                rowsPerPage={itemsPerPage}
                activePage={activePage}
                handleSearch={handleSearch}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeItemsPerpage}
                handleCreate={() => handleUpdate()}
             />
        </React.Fragment>
    )
}

export default ProcessCategory;