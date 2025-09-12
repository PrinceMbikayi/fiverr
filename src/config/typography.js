// typography.js
console.log("Typography !!!!!")
import React from 'react'
import { Text, Button, Platform, StyleSheet } from 'react-native';
import { Button as RNEButton} from 'react-native-elements';

import brandConfig from '../../brand.config.json';
console.log("brandConfig",brandConfig);

export const typography = () => {
  const oldTextRender = Text.render
  Text.render = function(...args) {
    const origin = oldTextRender.call(this, ...args)
    return React.cloneElement(origin, {
      style: [styles.defaultText, origin.props.style],
    })
  }

  const oldButtonRender = Button.render
  Button.render = function(...args) {
    const origin = oldButtonRender.call(this, ...args)
    return React.cloneElement(origin, {
        titleStyle: [styles.defaultText, origin.props.titleStyle],
    })
  }

  const oldRNEButtonRender = RNEButton.render
  RNEButton.render = function(...args) {
    const origin = oldRNEButtonRender.call(this, ...args)
    return React.cloneElement(origin, {
        titleStyle: [styles.defaultText, origin.props.titleStyle],
    })
  }





}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily:brandConfig.fontName,
   
  }
});

/*
 fontFamily: 'Segoe UI','Comic Sans MS'
 */