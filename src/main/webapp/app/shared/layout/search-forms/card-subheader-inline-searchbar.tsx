import { Box, BoxProps, Checkbox, Chip, IconButton, InputAdornment, InputBase, ListItemText, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { blueGrey } from '@material-ui/core/colors';
import { translate } from 'react-jhipster';
import theme from 'app/theme';

const useStyles = makeStyles({
  searchEmpInput:{
    color: theme.palette.primary.dark,
    background: 'white',
    marginTop: '1px',
    marginBottom: '1px',
    paddingLeft: 5,
    paddingRight: 5,
  },
  box:{
      background: "white",
      color:  theme.palette.primary.main,
      paddingLeft: 1,
      paddingRight: 1,
      '&:hover':{
        border: `1px solid grey`,
      }
  },
  searchIcon:{
    color:blueGrey[100],
  },
  select:{
      fontSize:12,
      marginLeft: 5,
      color: theme.palette.primary.dark,
      background: 'transparent',
      height: 3,
      marginRight: 1,
      "&&&:before": {
        borderBottom: "none"
      },
      "&&:after": {
        borderBottom: "none"
      }
      // borderBottom: '1px solid white',
  },
  selectMenuItemList:{
      background: theme.palette.background.paper,
      color: theme.palette.primary.dark,
      boxShadow: `1px 1px 5px grey`,
  },
  icon:{
    color: theme.palette.primary.dark,
    '&:hover':{
      color: theme.palette.primary.main,
    }
  },
  chip:{
    padding: 'none',
    marginLeft: 1,
    color: theme.palette.primary.main,
    backgroundColor: 'transparent'
  }
});

export interface ISearchCriteria{
  label?: string,
  value: any,
}

export interface InlineSearchBarProps{
    placeHolder?: string,
    rootBoxProps?: BoxProps,
    criterias?: ISearchCriteria[],
    filterLabel?: string,
    multipleSelectCriteria?: boolean,
    onChange?:Function,
    onSubmit?: Function,
}

export const CardSubHeaderInlineSearchBar = (props: InlineSearchBarProps) => {

    const { filterLabel, criterias } = props

    const [selectedCriterias, setSelectedCriterias] = useState([]);

    const [searchValue, setSearchValue] = useState("");

    const classes = useStyles();

    const withCritaria = props.criterias && props.criterias.length !== 0;

    const onSubmit = () =>{
      if(props.onSubmit){
        if(props.multipleSelectCriteria){
          props.onSubmit(searchValue, selectedCriterias);
        }else{
          props.onSubmit(searchValue, (selectedCriterias && selectedCriterias.length !== 0) ? selectedCriterias[0] : null);
        }
      }
    }

    const handleChange = (e) =>{
      setSearchValue(e.target.value);
      if(props.onChange){
          if(props.multipleSelectCriteria){
            props.onChange(e, selectedCriterias);
          }else{
            props.onChange(e, (selectedCriterias && selectedCriterias.length !== 0) ? selectedCriterias[0] : null)
          }
      }
    }
    
    const handleChangeCriteria = (event) => {
      const { value } = event.target;
      if(props.multipleSelectCriteria){
        const values = [];
        [...value].forEach(v => values.push(v));
        setSelectedCriterias([...values]); 
      }else{
        setSelectedCriterias([value]); 
      }
    };

    const handleKeyDown = (e) =>{
      if(e.key === 'Enter'){
        onSubmit();
      }
    }

    const handleUnselectCriteria = (c: ISearchCriteria) => {
      const newCriterias = [...selectedCriterias].filter(v => v !== c.value);
      setSelectedCriterias(newCriterias)
      if(!newCriterias || newCriterias.length === 0){
        setSearchValue("")
        if(props.onSubmit)
              props.onSubmit()
      }else{
        if(props.onSubmit)
          props.onSubmit(searchValue, newCriterias);
      }
     }

    const renderSelectedCriterias = <>
        {(selectedCriterias && selectedCriterias.length !== 0 && withCritaria) && 
          <Box display={"flex"} justifyContent="center" flexWrap="noWrap">
            {[...criterias].filter(c => [...selectedCriterias].some(v => v ===c.value))
              .map((c, index) => (
                <Chip key={index} label={c.label || c.value}
                 color="primary"
                 className={classes.chip}
                 classes={{
                  deleteIcon: classes.icon,
                 }}
                 onDelete={() =>handleUnselectCriteria(c)} />
              ))
            }
          </Box>
        }
      </>;

    return (
        <Box  
            flexGrow={1}
            display="flex" 
            alignItems="center" overflow="auto" 
            boxShadow={1} 
            ml={2}
            mr={2}
            borderRadius={7}
            className={classes.box}
            {...props.rootBoxProps}>
          <InputBase  aria-describedby="Search..."
              fullWidth  type='search'
              value={searchValue}
              placeholder={props.placeHolder ? props.placeHolder : `${translate("_global.label.search")}...`} 
              classes= {{ 
                  input: classes.searchEmpInput
                }}
              startAdornment={
                  <InputAdornment position='start'>
                    <Box display="flex"
                      alignItems="center">
                      {withCritaria && <>
                        <Select
                            style={{fontSize: '12px',}}
                            multiple={props.multipleSelectCriteria}
                            value={[...selectedCriterias]}
                            onChange={handleChangeCriteria}
                            MenuProps={{
                                classes: {
                                    list: classes.selectMenuItemList,
                                }
                            }}
                            classes={{
                                icon: classes.icon,
                            }}
                            className={classes.select}
                            displayEmpty
                            renderValue={() => filterLabel || `${translate("_global.label.filter")}(s)`}
                          >
                          {[...criterias].map((c,index) => <MenuItem key={index} value={c.value}>
                            {props.multipleSelectCriteria ? <>
                                <Checkbox color='primary' 
                                  checked={[...selectedCriterias].some(v => v === c.value)}/>
                                <ListItemText primary={c.label || c.value}/>
                               </> : <> {c.label || c.value}</>
                            }
                          </MenuItem>)}
                        </Select>
                         {[...selectedCriterias].length !==0 ? <Typography color='primary' className='ml-1'>:</Typography> : ''}
                        {renderSelectedCriterias}
                      </>}
                      {!props.onSubmit && <SearchIcon className={classes.searchIcon}/>}
                  </Box>
                  </InputAdornment>
              }
              onChange = {handleChange}
              onKeyDown={handleKeyDown}
              />
              {props.onSubmit && <IconButton className='p-0' onClick={onSubmit}>
                  <SearchIcon  className={classes.searchIcon} />
              </IconButton>}
        </Box>
    )
}

export default CardSubHeaderInlineSearchBar;