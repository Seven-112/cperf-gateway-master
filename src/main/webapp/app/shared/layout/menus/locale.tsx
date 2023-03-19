import React from 'react';
import { DropdownItem } from 'reactstrap';
import { NavDropdown } from './menu-components';
import { locales, languages } from 'app/config/translation';
import { IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import TranslateIcon from '@material-ui/icons/Translate';
import FlagIcon from '@material-ui/icons/Flag';

export const LocaleMenu = ({ currentLocale, onClick }: { currentLocale: string; onClick: React.MouseEventHandler<HTMLElement> }) =>
  Object.keys(languages).length > 1 ? (
    <NavDropdown icon="flag" name={currentLocale ? languages[currentLocale].name : undefined}>
      {locales.map((locale, index) => (
        <DropdownItem key={index} value={locale} onClick={onClick}>
          {languages[locale].name}
        </DropdownItem>
      ))}
    </NavDropdown>
  ) : null;

export const  CustomLocalMenu = (props: {currentLocale: string, onClick: Function}) =>{

    const [localAnchorEl, setLocalAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClickLocalMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
      setLocalAnchorEl(event.currentTarget);
    };

    const handleCloseLocalMenu = () => {
      setLocalAnchorEl(null);
    };
    
    return(
      Object.keys(languages).length > 1 ? (
        <React.Fragment>
          <IconButton edge="end"
          aria-label="lang of user"
          aria-controls="primary-lang-manu"
          aria-haspopup="true"
          onClick={handleClickLocalMenu}
          color="inherit">
            <TranslateIcon />
            <Typography variant="subtitle1">{props.currentLocale ? languages[props.currentLocale].name : undefined}</Typography>
          </IconButton>
            <Menu
              id="primary-lang-manu"
              anchorEl={localAnchorEl}
              keepMounted
              open={Boolean(localAnchorEl)}
              onClose={handleCloseLocalMenu}
            >
              {locales.map((locale, index) => (
                <MenuItem key={index} value={locale}  onClick={props.onClick.bind(this,locale)}>
                  <FlagIcon /> {languages[locale].name}
                </MenuItem>
              ))}
            </Menu>
        </React.Fragment>
      ) : (null)
    )
  }