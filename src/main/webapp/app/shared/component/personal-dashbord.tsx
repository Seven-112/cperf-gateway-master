import { Backdrop, Box, Card, CardContent, CardHeader, IconButton, makeStyles, Modal, TextField } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { useState } from "react";
import { IEmployee } from "../model/employee.model";
import IndividualStatistics from "./statistics/individual";

const useStyles = makeStyles(theme =>({
    modal:{
        display: 'flex',
        justifyContent: 'center',
        background: 'transparent',
        boxShadow: 'none',
    },
    box:{
        width: '55%',
        maxHeight: '95%',
        overflow: 'auto',
        marginTop:theme.spacing(5),
        [theme.breakpoints.down('sm')]:{
            width: '80%',
        },
        background: 'transparent',
        boxShadow: 'none',
    },
    cardHeader:{
      background: theme.palette.primary.light, //  colors.grey[200],
      padding: theme.spacing(1),
      borderRadius: '5px 5px 0 0',
    },
    cardContent:{
        background: theme.palette.background.paper,
        maxHight: '80%',
        overflow: 'auto',
    },
    input:{
        width: theme.spacing(10),
        padding: 0,
        '& .MuiInputBase-root':{
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
}))

interface IPersonalDashBordProps{
    employee: IEmployee,
    open: boolean,
    onClose: Function,
}
export const PersonalDashbord = (props: IPersonalDashBordProps) =>{

  const employee = props.employee;
  
  const dt = new Date();
  const [startDate, setStartDate] =  useState(new Date(dt.getFullYear()-1, 0, 1, 1));
  const [endDate, setEndDate] = useState(new Date(dt.getFullYear(), 11, 31, 0, 59, 59));

  const handleClose = () =>{
      props.onClose();
  }
  
  const handleChangeStartYear = (e) =>{
    const value = parseInt(e.target.value, 10);
    if(value && value >0 && value <= endDate.getFullYear())
      setStartDate(new Date(value, 0, 1, 1));
  }

  const handleChangeEndYear = (e) =>{
      const value = parseInt(e.target.value, 10);
      if(value > 0 && value <= dt.getFullYear() && value >= startDate.getFullYear())
          setEndDate(new Date(value, 11, 31, 0, 59, 59));
  }

  const classes = useStyles();

  return (
    <React.Fragment>
    <React.Fragment>
        <Modal open={props.open} onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500,
        }}
        disableBackdropClick
        className={classes.modal}>
            <Card className={classes.box}>
                <CardHeader className={classes.cardHeader}
                    title={
                        <Box display="flex" justifyContent="center">
                                <TextField type="number" value={startDate.getFullYear()} onChange={handleChangeStartYear} 
                                    variant="standard" size="small" className={classes.input + ' mr-3'} />
                                <TextField type="number" value={endDate.getFullYear()} onChange={handleChangeEndYear} 
                                    variant="standard" size="small" className={classes.input + ' mr-3'} />
                        </Box>
                    }
                    action={<IconButton onClick={handleClose} style={{ color: 'white'}}><Close color="inherit"/></IconButton>}
                />
                <CardContent className={classes.cardContent}>
                    <IndividualStatistics employee={employee} startDate={startDate} endDate={endDate}/>
                </CardContent>
            </Card>
        </Modal>
    </React.Fragment>
    </React.Fragment>
  )
}

export default PersonalDashbord;