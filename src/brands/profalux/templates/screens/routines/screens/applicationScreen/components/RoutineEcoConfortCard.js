import '_brand/templates/screens/routines/locales'
import React from 'react';
import {View } from 'react-native';
import { CardImageWithArrow } from '_brand/templates/screens/addObject/components/addBoxComponents/CardImageWithArrow';


  export const RoutineEcoConfortCard = (props) => {
    const { handleNavigation, title, text, iconSize, icon, iconColor, id, cardBgColor, disabled } = props
    return (
      <View style={{ marginBottom: 10 }}>
        <CardImageWithArrow
          id={id}
          disabled={disabled}
          cardBgColor={cardBgColor}
          onPressNextArrow={handleNavigation}
          ImageJs={icon}
          iconColor={iconColor}
          imgWidth={iconSize}
          imgHeight={iconSize}
          imgMarginLeft={-10}
          sideTextBoxWidth={250}
          cardPading={10}
          sideTextTitle={title}
          sideText={text}
          withArrow={true}
        />
      </View>
    )
  }