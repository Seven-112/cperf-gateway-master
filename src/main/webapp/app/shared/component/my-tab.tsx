import { AppBar, AppBarProps, Box, BoxProps, Slide, Tab, TabProps, Tabs, TabsProps, useTheme } from "@material-ui/core";
import React, { Fragment, useEffect, useState } from "react"

type SlideDir =  'left' | 'right' | 'down' | 'up';

const TabPanel = (props: { value: any, index: any, slideDir: SlideDir, content: any }) =>{
    const { value, index, slideDir } = props;
    
    const theme = useTheme();
  
    return (
        <Box width={1}
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
        >
            {props.content}
        </Box>
    );
  }

export interface ITab{
    tabProps: TabProps,
    tabPanelChildren: any,
    value:number,
    hidden?: boolean,
}
export interface MyTabProps{
    tabsData: ITab[],
    defaulValue: any,
    currentTabIndex?: number,
    tabsProps?: TabsProps,
    appBarProps?: AppBarProps,
    tabsIdPrefix?: string,
    rootBoxProps?: BoxProps,
    tabPanelRootBoxProps?: BoxProps,
    slideDir?: SlideDir,
    onChnage?: Function
}

export const MyTab = (props: MyTabProps) =>{
    const { tabsProps, tabsIdPrefix, rootBoxProps, appBarProps, tabPanelRootBoxProps } = props;
    const [value, setValue] = useState(props.defaulValue)

    const handleChange = (event, newValue) => {
        if(props.onChnage)
            props.onChnage(newValue);
        setValue(newValue)
    };
    
    const tabs = [...props.tabsData].filter(t => !t.hidden).map(t => t);

    return (
        <React.Fragment>
            {tabs && tabs.length !== 0 && 
                <Box width={1} {...rootBoxProps}>
                    <AppBar {...appBarProps}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            {...tabsProps}
                        >
                            {tabs.map((tab, index) => (
                                <Tab
                                    key={index}
                                    label={tab.tabProps.label || `Tab ${index +1}`}
                                    value={tab.value}
                                    id={`${tabsIdPrefix || 'tab'}-${index}`}
                                    aria-controls={`${tabsIdPrefix || 'tabpanel'}-${0}`}
                                    classes={tab.tabProps.classes || {}}
                                    {...tab.tabProps}
                                />
                            ))}
                        </Tabs>
                    </AppBar>
                    <Box width={1} {...tabPanelRootBoxProps}>
                            {tabs.map((tab, index) => (
                                <TabPanel 
                                    key={index} 
                                    value={value}
                                    index={tab.value}
                                    slideDir={props.slideDir}
                                    content={tab.tabPanelChildren}
                                   />
                            ))}
                    </Box>
                </Box>
            }
        </React.Fragment>
    );
}

MyTab.defaultProps={
    slideDir: 'left'
}
