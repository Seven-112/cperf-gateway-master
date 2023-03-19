import { Button, ButtonGroup, ButtonGroupProps, ButtonProps, ClickAwayListener, Grow, MenuItem, MenuItemTypeMap, MenuList, MenuListProps, Paper, Popper, SvgIconProps } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

export interface IOption{
    value?: any,
    label?: string,
    selected?: boolean,
    disabled?: boolean,
}


interface SelectableButtonGroupProps{
    options: IOption[],
    buttonGroupProps?: ButtonGroupProps,
    buttonProps?: ButtonProps
    menuItemProps?: MenuItemTypeMap,
    menuProps?: MenuListProps,
    iconProps?: SvgIconProps,
    onChange?: Function,
}


export const SelectableButtonGroup = (props: SelectableButtonGroupProps) => {
  const { options, buttonGroupProps, buttonProps, menuProps, menuItemProps, iconProps } = props;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selected, setSelected] = useState<IOption>([...props.options].find(op => op.selected) || {});

  useEffect(() =>{
        setSelected([...props.options].find(op => op.selected) || {})
  }, [props.options])

  const handleClick = () => {
    console.info(`You clicked ${selected.label}`);
  };

  const handleMenuItemClick = (event, option: IOption) => {
    setSelected(option)
    if(props.onChange)
        props.onChange(option);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" {...buttonGroupProps}>
        <Button onClick={handleClick} {...buttonProps}>{selected.label}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          {...buttonProps}
        >
          <ArrowDropDown {...iconProps}/>
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem {...menuProps}>
                  {options.map((option, index) => (
                    <MenuItem
                      key={index}
                      disabled={option.disabled}
                      selected={option.selected}
                      onClick={(event) => handleMenuItemClick(event, option)}
                      {...menuItemProps}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}

export default SelectableButtonGroup;
