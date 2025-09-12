import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment/min/moment-with-locales';
import { useTranslation } from 'react-i18next';
import {RenderPickerIos} from './RenderPickerIos';


export const DateMonthPickerIos = (props) => {

    const {initialMonth, initialDate, onDateChange, onMonthChange, pickerWidth, pickerHeight } = props;

    let myInitMonth = decrementMonth(initialMonth); // because months are 0-indexed but cron expression months are 1-indexed

    const { t, i18n } = useTranslation();

    let currentLang = i18n.language;
    if (currentLang == "en") currentLang += "-gb";
    moment.locale(currentLang);
    const months = moment.months();
    console.log("MOMENT_MONTHS :", currentLang, months);

    function incrementMonth(index) {
      return (index + 1);
    }
    function decrementMonth(index) {
      return (index - 1);
    }

  // State variables for the selected month, date, and dynamically generated days in the month
  const [selectedMonth, setSelectedMonth] = useState(myInitMonth);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(myInitMonth));

  // Function to get the correct number of days based on the selected month
  function getDaysInMonth (monthIndex){
    const bissecFlag = (new Date().getFullYear() % 4 === 0 && (new Date().getFullYear() % 100 !== 0 || new Date().getFullYear() % 400 === 0));
    const daysInMonth = [31, bissecFlag ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return Array.from({ length: daysInMonth[monthIndex] }, (_, i) => (i + 1).toString());
  };

  // Update the number of days whenever the month changes
  const handleMonthChange = (itemValue, itemIndex) => {
    let mySelectedMonth = incrementMonth(parseInt(itemIndex)); // because months are 0-indexed but cron expression months are 1-indexed
    onMonthChange(mySelectedMonth);
    console.log('PICKER_MONTH :', itemIndex, "PICKER_MONTH_MY_SELECTED_MONTH :", mySelectedMonth);
    setSelectedMonth(itemIndex);
    const days = getDaysInMonth(itemIndex);
    setDaysInMonth(days);
    if (selectedDate > days.length) {
      setSelectedDate(days.length);  // Adjust day if it's out of bounds for the selected month
    }
    
  };

  // Update the selected date
  const handleDateChange = (itemValue) => {
    onDateChange(parseInt(itemValue));
    setSelectedDate(parseInt(itemValue));
  };


  const dates = daysInMonth;


  let renderContent;
  switch (currentLang) {
    case "fr":
      renderContent = (
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            <RenderPickerIos 
              data={dates}
              selectedValue={selectedDate.toString()}
              onValueChange={handleDateChange}
              pickerWidth={pickerWidth}
              pickerHeight={pickerHeight}
            />
            {/* <Text style={styles.separator}>-</Text> */}
            <RenderPickerIos 
              data={months}
              selectedValue={months[selectedMonth]}
              onValueChange={handleMonthChange}
              pickerWidth={pickerWidth}
              pickerHeight={pickerHeight}
            />
          </View>

        </View>
      );
      break;
    default:
      renderContent = (
        <View style={styles.container}>
          <View style={styles.pickerContainer}>

            <RenderPickerIos 
              data={months}
              selectedValue={months[selectedMonth]}
              onValueChange={handleMonthChange}
              pickerWidth={pickerWidth}
              pickerHeight={pickerHeight}
            />
            <Text style={styles.separator}>-</Text>
            <RenderPickerIos 
              data={dates}
              selectedValue={selectedDate.toString()}
              onValueChange={handleDateChange}
              pickerWidth={pickerWidth}
              pickerHeight={pickerHeight}
            />
          </View>
  
        </View>
      );
      break

  }

  return (
    renderContent
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    //backgroundColor: '#f5f5f5',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    fontSize: 30,
    marginHorizontal: 10,
  },
});
