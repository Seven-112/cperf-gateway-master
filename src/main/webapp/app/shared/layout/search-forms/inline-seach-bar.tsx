import { Checkbox, createStyles, Divider, IconButton, InputAdornment, InputBase, List, ListItem, ListItemIcon, ListItemText, makeStyles, Menu, MenuItem, Paper, Theme } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
      
      [theme.breakpoints.down('xs')]: {
        maxWidth: 120,
      },
      [theme.breakpoints.down('sm')]: {
        maxWidth: 200,
      },
      height:40,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    paper: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height:40,
    },
  }),
);

export interface IInlineSearchBarProps{
    placeholder?: string,
    filters?: string[],
    htmlFor?: string,
    rootStyle?: any,
    inputStyle?: any,
    iconButtonStyle?: any,
    handleChange?: Function,
    handleSubmit?: Function,

}
const InlineSearchBar = (props: IInlineSearchBarProps) =>{
    const classes = useStyles(); 
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    const [checked, setChecked] = React.useState([]);
    const [serachValue, setSearchValue] = React.useState(null);

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
    };

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    const _handleChange = (e) =>{
      e.persist();
      setSearchValue(e.target.value);
      if(props.handleChange)
        props.handleChange(serachValue, checked);
    }

    const _handleSubmit = (e:any) =>{
      e.persist();
      /* eslint-disable no-console */
      console.log(e);
      if(props.handleSubmit){
        props.handleSubmit(serachValue, checked);
      }
    }

    return (
        <Paper component="form" className={classes.root} style={props.rootStyle}>
         {props.filters && <IconButton className={classes.iconButton} aria-label="inline-serachbar-menu"
                aria-controls="inline-serachbar-menu"
                aria-haspopup="true"
                onClick={handleClick}>
            <FilterListIcon titleAccess='filter' />
          </IconButton>}
           {props.filters && <Menu
                id="inline-serachbar-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
            >
            <MenuItem onClick={handleClose}>
                <List>
                    {props.filters.map((filter, index) =>(
                        <ListItem
                        key={'flt'+index}
                        role={undefined}
                        dense
                        button
                        onClick={handleToggle(filter)}
                        >
                        <ListItemIcon>
                            <Checkbox
                            edge="start"
                            checked={checked.includes(filter) === true}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': filter }}
                            />
                        </ListItemIcon>
                        <ListItemText id={filter} primary={filter} />
                        </ListItem>
                    ))}
                </List>
            </MenuItem>
          </Menu>}
          <InputBase
            className={classes.input}
            placeholder={ props.placeholder ? props.placeholder : 'Search...'}
            inputProps={{ 'aria-label': 'search google maps' }}
            style={props.inputStyle} 
            value={serachValue}
            onChange= {(e) =>_handleChange(e)}
          />
          <IconButton className={classes.iconButton} aria-label="search" 
           style={props.iconButtonStyle} onClick={(e) => _handleSubmit(e)}>
            <SearchIcon />
          </IconButton>
        </Paper>
    )
}

export const SimpleInlineSearchBar = (props: { value?: any, paperClassName?:string, onChange:Function }) =>{
  const classes = useStyles();

  const handleChange = (e) => props.onChange(e);

  return (
      <Paper component="form" className={clsx(classes.paper, {
        [props.paperClassName] : props.paperClassName
      })}>
          <InputBase
                className={classes.input}
                placeholder={`Search...`}
                inputProps={{ 'aria-label': 'search google maps' }}
                value={props.value}
                onChange= {handleChange}
                endAdornment={<InputAdornment position="end"><SearchIcon /></InputAdornment>}
            />
      </Paper>
    );
}

export default InlineSearchBar;