import { IEmployee } from "app/shared/model/employee.model";
import React, { useEffect, useState } from "react"
import { connect } from "react-redux";
import axios from 'axios';
import { IUserExtra } from "app/shared/model/user-extra.model";
import { API_URIS } from "app/shared/util/helpers";
import { Box, Card, CardContent, CardHeader, Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import EmployeeTaskStatistics from "./EmployeeTaskStatistics";
import { EmployeeObjectifStatistics } from "./EmployeeObjectifStatistics";
import { IObjectif } from "app/shared/model/objectif.model";
import { Translate } from "react-jhipster";
import { serviceIsOnline, SetupService } from "app/config/service-setup-config";

const useStyles = makeStyles(theme =>({
  cardHeader:{
    borderRadius: '5px 5px 0 0',
    borderTop: '3px solid',
    borderColor: theme.palette.primary.dark,
  },
  input:{
      width: theme.spacing(7),
      padding: 0,
      '& .MuiInputBase-root':{
          fontSize: "13px",
          color: 'white',
          borderColor: 'white',
          '&:before': {
            borderColor: 'white',
          },
          '&:hover': {
            '&:before':{
              borderColor: 'white',
            }
          },
      },
      '& .Mui-focused':{
          color: 'white',
          '&:before':{
            borderColor: 'white',
          },
      },
  }
}));

interface IndividualStatisticsProps{
    employee: IEmployee,
    startDate: Date,
    endDate: Date
}

export const IndividualStatistics = (props: IndividualStatisticsProps) =>{
    const {startDate, endDate, employee} = props;

    const [objectifs, setObjectifs] = useState<IObjectif[]>([]);

    const [loading, setLoading] = useState(false);

    const getObjectifs = () =>{
        if(employee && serviceIsOnline(SetupService.OBJECTIF)){
            setLoading(true);
            const deptId = employee.department ? employee.department.id : null;
            const fonctionId = employee.fonction ? employee.fonction.id : null;
            const requestUri = `${API_URIS.objectifApiUri}/for-employee-between/?employeeId=${employee.id}&departmentId=${deptId}&fonctionId=${fonctionId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            axios.get<IObjectif[]>(requestUri).then(res =>{
                setObjectifs([...res.data]);
            }).catch(() =>{}).finally(() => setLoading(false));
        }else{
            setObjectifs([]);
        }
    }

    useEffect(() =>{
        getObjectifs();
    }, [employee, endDate, startDate])

    const classes = useStyles();

    return (
        <React.Fragment>
            {employee && serviceIsOnline(SetupService.OBJECTIF) &&
            <Card>
                <CardHeader className={classes.cardHeader}
                    title={<Box display="flex" justifyContent="center">
                            <Typography variant="h5" className="text-primary font-weight-bold">
                                <Translate contentKey="_global.label.personalDashbord">personal Dashbord</Translate>&nbsp;
                                <Translate contentKey="_global.label.for">for</Translate>&nbsp;&nbsp;
                                {employee.firstName + ' '+employee.lastName}
                            </Typography>
                            {loading && <span className="mr-3">Loading...</span>}
                    </Box>}/>
                <CardContent>
                    <Box display="flex" justifyContent="space-between">
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <EmployeeObjectifStatistics objectifs={objectifs} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <EmployeeTaskStatistics employee={employee} startDate={startDate} endDate={endDate} />
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>}
        </React.Fragment>
    )
}
  
export default IndividualStatistics;