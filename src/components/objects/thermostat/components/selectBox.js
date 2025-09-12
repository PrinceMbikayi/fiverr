import React, { Component } from 'react';
import {SelectBox} from '_components/ui/selectBox';

import { useTheme } from '_theming/themeProvider';


export const MySelectBox = (props) => {


    const {theme} = useTheme();
    const { label, hideInputFilter = true,options, isMulti, onMultiSelect,onTapClose,
        
            selectedValues,value,validate,singleSelectionCallback,onChange, cancel} = props;
    return (
        <SelectBox
                    label={label}
                    labelStyle={{color:'white'}}
                    hideInputFilter={hideInputFilter}
                    options={options}
                    selectedValues={selectedValues}
                    value={value}
                    onMultiSelect={onMultiSelect}
                    onTapClose={onTapClose}
                    isMulti={isMulti}
                    optionsLabelStyle={{color:'white'}}
                    toggleIconColor={theme.primary}
                    multiOptionContainerStyle={{}}
                    containerStyle={{marginBottom:10}}
                    optionContainerStyle={{marginBottom:10,maxHeight:200}}                   
                    validate = {validate}
                    singleSelectionCallback = {singleSelectionCallback}
                    onChange={onChange}
                    cancel={cancel}
                />
    )
}
