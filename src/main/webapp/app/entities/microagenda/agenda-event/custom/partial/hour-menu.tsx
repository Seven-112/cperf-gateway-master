import { makeStyles, Menu, MenuItem } from "@material-ui/core";
import React, {  } from "react";

const useStyles = makeStyles(theme =>({
    field:{
        borderRadius: 5,
        paddingLeft:7,
        paddingRight:7,
        fontSize: 15,
        '&:hover':{
            background: theme.palette.grey[200],
        },
        '&:focus':{
            background: theme.palette.grey[200],
        }
    },
    icon:{
        color: theme.palette.grey[500],
    },
    hourMenu:{
        height:300,
        marginTop: theme.spacing(5),
        borderRadius: 6,
        padding: '4px 0',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '&::-webkit-scrollbar': {
          width: '0.7em',
        },
        '&::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px white',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[200], // 'rgba(0,0,0,.1)',
          outline: '1px solid #e1f5fe',
        },
        '&:hover':{
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.grey[400], // 'rgba(0,0,0,.1)',
              outline: '1px solid #e1f5fe',
            }
        }
    },
    timeZoneBtn:{
        background: theme.palette.grey[100],
        boxShadow: 'none',
        '&:hover':{
            background: theme.palette.grey[200],
            boxShadow: 'none',
        },

    },
    patiantListItem:{
        paddingTop:0,
        paddingBottom:0,
        borderRadius:6,
    },
    listTextPrimary:{
        fontSize:13,
    },
    userBox:{
    }
}))

export const HourMenu = (props: { anchorEl: any, selected: string, intervalMinute?:number, onBlur?: Function, onSelect?:Function}) =>{

    const {selected, anchorEl} = props;

    const open = Boolean(anchorEl);

    const intervalMinute = props.intervalMinute ? props.intervalMinute -1 : 14;

    const classes = useStyles();

    const formateTime = (hour: number, minute: number) =>{
        const m = minute<10 ? '0'+minute: minute;
        return `${hour}h:${m}`;
    }

    const getHours = () =>{
        const hours: number[] = [];
        for(let h=0; h<24; h++)
            hours.push(h);
        return hours;
    }

    const handleBlur = () =>{
        if(props.onBlur)
            props.onBlur();
    }

    const handleClick = (hour, minute) =>{
        if(props.onSelect){
            props.onSelect(hour, minute);
        }
    }

    const getMinuteArray = () =>{
        const mm = [];
        for(let i=0; i<60; i++){
            mm.push(i);
            i= i+intervalMinute;
        }
        return mm;
    }
    
    return (
        <React.Fragment>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onBlur={handleBlur}
                className={classes.hourMenu}

            >
                {getHours().map(hour =>(
                    <React.Fragment key={hour}>
                        {[...getMinuteArray()].map((m, index) =>(
                            <MenuItem key={index} 
                                    value={formateTime(hour, m)}
                                    selected={selected === formateTime(hour, m)}
                                    onClick={() =>handleClick(hour, m)}>
                                {formateTime(hour, m)}
                            </MenuItem>
                        ))}
                    </React.Fragment>
                ))}
                
            </Menu>
        </React.Fragment>
    )
}

export default HourMenu;