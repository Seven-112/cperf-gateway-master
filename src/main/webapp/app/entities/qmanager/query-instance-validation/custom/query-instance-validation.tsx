import { Box, makeStyles, TableCell, TableCellProps, TableRow, Typography } from "@material-ui/core";
import { IQueryInstanceValidation } from "app/shared/model/qmanager/query-instance-validation.model";
import { IQueryInstance } from "app/shared/model/qmanager/query-instance.model";
import { IRootState } from "app/shared/reducers";
import { ITEMS_PER_PAGE } from "app/shared/util/pagination.constants";
import React, { useEffect, useState } from "react"
import { connect } from "react-redux";
import axios from 'axios';
import { API_URIS, getMshzFileByEntityIdAndEntityTag, getUserExtraFullName } from "app/shared/util/helpers";
import MyCustomModal from "app/shared/component/my-custom-modal";
import MyCustomTable from "app/shared/component/my-custom-table";
import { TextFormat, translate } from "react-jhipster";
import { IUserExtra } from "app/shared/model/user-extra.model";
import { MyCustomPureHtmlRenderModal } from "app/shared/component/my-custom-pure-html-render";
import ModalFileManager from "app/shared/component/modal-file-manager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import CustomAvatar from "app/shared/component/custom-avatar";
import clsx from "clsx";
import { QueryValidationStatus } from "app/shared/model/enumerations/query-validation-status.model";
import { FileEntityTag } from "app/shared/model/file-chunk.model";
import { IMshzFile } from "app/shared/model/microfilemanager/mshz-file.model";
import { VisibilityIconButton } from "app/shared/component/custom-button";

const useStyles = makeStyles({
    table:{
        boxShadow: 'none',
        marginTop: -35,
    }
})

interface QueryInstanceValidationProps extends StateProps, DispatchProps{
    istance: IQueryInstance,
    open?: boolean,
    onClose: Function,
}

export const QueryInstanceValidation = (props: QueryInstanceValidationProps) =>{

    const { istance, open } = props;

    const [loading, setLoading] = useState(false);

    const [validations, setValidations] = useState<IQueryInstanceValidation[]>([]);

    const [activePage, setActivePage] = useState(0);
    
    const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

    const [totalItems, setTotalItems] = useState(0);

    const [validation, setValidation] = useState<IQueryInstanceValidation>(null);

    const [openJustification, setOpenJustification] = useState(false);
    const [openFiles, setOpenFiles] = useState(false);
    const [files, setFiles] = useState<IMshzFile[]>([]);

    const [validators, setValidators] = useState<IUserExtra[]>([]);
    
    const [loadingFiles, setLoadingFiles] = useState(false);

    const classes = useStyles();


    const getValidators = (validrosIds: any[]) =>{
        if(validrosIds){
            setLoading(true);
            const apiUri = `${API_URIS.userExtraApiUri}/?id.in=${validrosIds.join(",")}`;
            axios.get<IUserExtra[]>(apiUri)
                .then(res =>{
                    setValidators(res.data);
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }

    const getEntities = (p?: number, rows?: number) =>{
        if(props.istance){
            const page = p || p===0 ? p : activePage;
            const size = rows || itemsPerPage;
            setLoading(true);
            let apiUri = `${API_URIS.queryInstanceValidationApiUri}/?instanceId.equals=${props.istance.id}`;
            apiUri = `${apiUri}&page=${page}&size=${size}`;
            axios.get<IQueryInstanceValidation[]>(apiUri)
                .then(res =>{
                    setValidations(res.data);
                    setTotalItems(parseInt(res.headers['x-total-count'], 10));
                    getValidators([...res.data].map(v => v.validatorId));
                }).catch(e => console.log(e))
                .finally(() => setLoading(false))
        }
    }


    useEffect(() =>{
        getEntities();
    }, [props.istance])

    const handleClose = () => props.onClose();

    const getValidator =  (valiatorId) =>{
        const validator = [...validators].find(v => v.id === valiatorId);
        if(validator){
            return (
                <Box display={"flex"} justifyContent="center" alignItems="center" flexWrap="wrap">
                    <Typography className="mr-2">{getUserExtraFullName(validator)}</Typography>
                    <CustomAvatar 
                        photoId={validator.employee ? validator.employee.photoId : null}
                        avatarProps={{
                            style: { maxWidth: 35, maxHeight:35 }
                        }}
                    />
                </Box>
            )
        }
        return "";
    }

    const handleOpenJustification = (v: IQueryInstanceValidation) =>{
        if(v){
            setValidation(v);
            setOpenJustification(true);
        }
    }

    const handleOpenDocs = (v: IQueryInstanceValidation) =>{
        if(v){
            setValidation(v);
            setLoadingFiles(true);
            setOpenFiles(true);
            getMshzFileByEntityIdAndEntityTag(v.id, FileEntityTag.queryInstanceValidation)
            .then(res =>{
                setFiles(res.data);
            }).catch(e => console.log(e))
            .finally(() => {
                setLoadingFiles(false);
            });
        }
    }

    const handleChangePage = (newPage) =>{
        setActivePage(newPage);
        getEntities(newPage);
    }

    const handleChangeItemsPerpage = (rows) =>{
        setItemsPerPage(rows);
        setActivePage(0);
        setItemsPerPage(rows)
        getEntities(0, rows);
    }

    const tHeadColums: TableCellProps[] = [
        {
            children: translate("microgatewayApp.qmanagerQueryInstanceValidation.validatedAt"),
            align: 'left',
        },
        {
            children: translate("microgatewayApp.qmanagerQueryInstanceValidation.status"),
            align: 'center',
        },
        {
            children: translate("microgatewayApp.qmanagerQueryInstanceValidation.justification"),
            align: 'center',
        },
        {
            children: translate("_global.label.files"),
            align: 'center',
        },
        {
            children: translate("microgatewayApp.qmanagerQueryInstanceValidation.validatorId"),
            align: 'center',
        },
    ];

    const TRow = ({v} : {v: IQueryInstanceValidation }) => (
        <TableRow>
            <TableCell>
              {v.validatedAt ? <TextFormat type="date" 
                value={v.validatedAt} 
                format={`DD/MM/YYYY ${translate("_global.label.to")} HH:mm`} /> 
                : '...'}
            </TableCell>
            <TableCell align="center">
                <span className={clsx("badge badge-pill", {
                    'badge-success': v.status === QueryValidationStatus.APPROVED,
                    'badge-danger': v.status === QueryValidationStatus.REJECTED,
                })}
                >
                    {translate(`microgatewayApp.QueryValidationStatus.${v.status.toString()}`)}
                </span>
            </TableCell>
            <TableCell align="center">
                {v.justification ? <VisibilityIconButton onClick={() => handleOpenJustification(v)} /> : '...'}
            </TableCell>
            <TableCell align="center">
                <VisibilityIconButton onClick={() => handleOpenDocs(v)} />
            </TableCell>
            <TableCell align="center">
                {getValidator(v.validatorId)}
            </TableCell>
        </TableRow>
    )

    const tRows = [...validations].map((v, index) => <TRow key={index} v={v} />)

    return (
        <React.Fragment>
            {validation && <>
                <MyCustomPureHtmlRenderModal
                    open={openJustification}
                    onClose={() => setOpenJustification(false)}
                    body={validation.justification}
                    title={translate("microgatewayApp.qmanagerQueryInstanceValidation.justification")}
                 />
                <ModalFileManager 
                    files={...files} 
                    open={openFiles}
                    entityId={validation.id}
                    entityTagName={FileEntityTag.queryInstanceValidation}
                    onClose={() => setOpenFiles(false)}
                    loading={loadingFiles}
                    readonly
                    title={translate("_global.label.files")}
                />
            </>}
            <MyCustomModal
                open={open}
                onClose={handleClose}
                title={translate("microgatewayApp.qmanagerQueryInstanceValidation.home.title")}
                avatarIcon={<FontAwesomeIcon icon={faCheckCircle} />}
            >
                <MyCustomTable 
                    tHeadColums={tHeadColums}
                    tRows={tRows}
                    loading={loading}
                    activePage={activePage}
                    notFound={translate("microgatewayApp.qmanagerQueryInstanceValidation.home.notFound")}
                    rowsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeItemsPerpage}
                    rootCustomClassName={classes.table}
                />
            </MyCustomModal>
        </React.Fragment>
    )
}


const mapStateToProps = ({ authentication }: IRootState) => ({
    account: authentication.account,
  });
  
  const mapDispatchToProps = {};
  
  type StateProps = ReturnType<typeof mapStateToProps>;
  type DispatchProps = typeof mapDispatchToProps;
  
  export default connect(mapStateToProps, mapDispatchToProps)(QueryInstanceValidation);