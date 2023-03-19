import { IRootState } from 'app/shared/reducers';
import React from 'react';
import { getSession } from 'app/shared/reducers/authentication';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { Box, Card, CardContent, CardHeader, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, makeStyles, MenuItem, Select, Switch, Tooltip, Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { translate } from 'react-jhipster';
import { Add, More } from '@material-ui/icons';
import { useState } from 'react';
import { ITender } from 'app/shared/model/microprovider/tender.model';
import UserTenderLunched from './user-tender-lunched';
import ProviderTender from './provider-tender';
import { hasAuthorities, hasPrivileges } from 'app/shared/auth/helper';
import { PrivilegeAction } from 'app/shared/model/enumerations/privilege-action.model';
import { AUTHORITIES } from 'app/config/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles(theme =>({
    card:{
        width: '100%',
        background: 'transparent',
    },
    cardheader:{
        background: theme.palette.background.paper,
        color: theme.palette.primary.dark,
        borderRadius: '15px 15px 0 0',
    },
    cardcontent:{
        background: 'white',
        minHeight: theme.spacing(5),
        borderTop: 'none',
        borderRadius: '0 0 15px 15px',
    },
    formcontrol:{
        border: '1px solid white',
        borderRadius: 4,
    },
    label:{
        color: theme.palette.primary.dark,
        marginRight: theme.spacing(2),
    },
    select:{
        color: theme.palette.primary.dark,
        '&fieldset':{
            border: `1px solid ${theme.palette.primary.dark}`,
        }
    },
}))

interface ITenderProps extends StateProps, DispatchProps{}

export const Tender = (props: ITenderProps) =>{

    const { account } = props;

    const [showRecievedTenders, setShowReceivedTenders] = useState(false);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    
    const classes = useStyles();

    const userHasAllNecessaryProfiles = (account && hasAuthorities([AUTHORITIES.PROVIDER,AUTHORITIES.EVALUATOR], account.authorities) &&
                                    hasPrivileges({entities: ["Tender"], actions: [PrivilegeAction.ALL]}, account.authorities))

    const userIsProviderOnly = (account && (hasAuthorities([AUTHORITIES.PROVIDER], account.authorities) &&
                                 (!hasPrivileges({entities: ["Tender"], actions: [PrivilegeAction.ALL]}, account.authorities)
                                    && !hasAuthorities([AUTHORITIES.EVALUATOR], account.authorities))
                                ))
                                    
    const userIsTenerManagerOnly = (account && (!hasAuthorities([AUTHORITIES.PROVIDER], account.authorities) &&
                                (hasPrivileges({entities: ["Tender"], actions: [PrivilegeAction.ALL]}, account.authorities)
                                    || hasAuthorities([AUTHORITIES.EVALUATOR], account.authorities))
                                ))

    useEffect(() =>{
        if(!props.account)
            props.getSession();
    }, [])

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${translate("_global.appName")} | ${translate("_global.label.callTender")}`}</title>
            </Helmet>
            <Box width={1} display="flex" flexWrap="wrap" overflow="auto" boxShadow="-1px -1px 7px">
                <Card className={classes.card}>
                    <CardHeader 
                        title={<Box display="flex" alignItems="center" flexWrap="wrap">
                            <FontAwesomeIcon icon={faChevronCircleUp} fontSize="small" className="mr-3"/>
                            <Typography variant="h4">{translate("microgatewayApp.microproviderTender.home.title")}</Typography>
                        </Box>
                        }
                        className={classes.cardheader}
                        action={
                            <Box display="flex" justifyContent="flex-end" alignItems="center">
                                {userHasAllNecessaryProfiles && 
                                    <>
                                        <Typography className={classes.label}>{translate("role.detail.title")}</Typography>
                                        <FormControl variant="outlined" size="small" 
                                            classes={{
                                                root: classes.formcontrol
                                            }}>
                                            <Select value={showRecievedTenders ? "1" : "0"}
                                                className={classes.select}
                                                classes={{
                                                    icon: 'text-white'
                                                }}
                                                 onChange={() => setShowReceivedTenders(!showRecievedTenders)}>
                                                <MenuItem value="0">{translate("_global.label.editor")}</MenuItem>
                                                <MenuItem value="1">{translate("role."+AUTHORITIES.PROVIDER.toString())}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </>
                                }
                                {(account && (!showRecievedTenders || userIsTenerManagerOnly) &&
                                hasPrivileges({ entities: ["Tender"], actions: [PrivilegeAction.CREATE]},
                                account.authorities)) && 
                                    <Tooltip
                                        placement="left"
                                        title={translate("_global.label.add")}
                                        classes={{
                                            tooltip: 'bg-white text-primary font-weight-bold',
                                        }}
                                        onClick={() =>{ setOpenCreateModal(true)}}
                                        >
                                            <IconButton size="small" color="primary"><Add /></IconButton>
                                    </Tooltip>
                                }
                            </Box>
                        }
                    />
                    <CardContent className={classes.cardcontent}>
                        {(showRecievedTenders || userIsProviderOnly) ? (
                            <ProviderTender userId={account ? account.id : null}/>
                        ):( 
                            (!showRecievedTenders || userIsTenerManagerOnly) && 
                             <UserTenderLunched
                                account={account}
                                userId={account ? account.id : null}
                                openCreateModal={openCreateModal} 
                                onCreateModalClose={() => setOpenCreateModal(false)}/>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </React.Fragment>
    )
}

const mapStateToProps = ({ authentication } : IRootState) =>({
    account: authentication.account,
})

const mapDispatchToProps = {
    getSession
}

type StateProps = ReturnType<typeof mapStateToProps>

type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Tender);