import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WheelPicker } from 'react-native-wheel-picker-android';  // Import WheelPicker
import moment from 'moment/min/moment-with-locales';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider'

export const DateMonthPickerAndroid = (props) => {

    const { initialMonth, initialDate, onDateChange, onMonthChange, pickerWidth, pickerHeight } = props;

    let myInitMonth = decrement(initialMonth); // Adjust month because months are 0-indexed in JS but cron expression months are 1-indexed.
    let myInitialDate = decrement(initialDate); // Adjust date because days 0-indexed in WheelPicker but 1-indexed in cron expression .

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'

    let currentLang = i18n.language;
    if (currentLang === "en") currentLang += "-gb";
    moment.locale(currentLang);
    const months = moment.months();
    console.log("MOMENT_MONTHS :", currentLang, months);

    function increment(index) {
      const newIndex = index?parseInt(index):1;
      return (newIndex + 1);
    }
    function decrement(index) {
      const newIndex = index?parseInt(index):1;
      return (newIndex - 1);
    }

  // State variables for the selected month, date, and dynamically generated days in the month
  const [selectedMonth, setSelectedMonth] = useState(myInitMonth);
  const [selectedDate, setSelectedDate] = useState(myInitialDate);
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(myInitMonth));

  // Function to get the correct number of days based on the selected month
  function getDaysInMonth (monthIndex) {
    const bissecFlag = (new Date().getFullYear() % 4 === 0 && (new Date().getFullYear() % 100 !== 0 || new Date().getFullYear() % 400 === 0));
    const daysInMonth = [31, bissecFlag ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return Array.from({ length: daysInMonth[monthIndex] }, (_, i) => (i + 1).toString());
  };

  // Update the number of days whenever the month changes
  const handleMonthChange = (index) => {
    let mySelectedMonth = increment(index); // Adjust for 1-indexed cron month format
    onMonthChange(mySelectedMonth);
    console.log('PICKER_MONTH :', index, "PICKER_MONTH_MY_SELECTED_MONTH :", mySelectedMonth);
    setSelectedMonth(index);
    const days = getDaysInMonth(index);
    setDaysInMonth(days);
    if (selectedDate > days.length) {
      setSelectedDate(days.length);  // Adjust day if it's out of bounds for the selected month
    }
  };

  // Update the selected date
  const handleDateChange = (index) => {
    let mySelectedDate = increment(index); // Adjust for 1-indexed cron day format
    console.log('PICKER_DATE :', index);
    onDateChange(mySelectedDate);
    setSelectedDate(parseInt(index));
  };

  const dates = daysInMonth;

  let renderContent;
  switch (currentLang) {
    case "fr":
      renderContent = (
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            <WheelPicker
              data={dates}
              selectedItem={selectedDate}  // WheelPicker uses zero-based index, so subtract 1
              onItemSelected={handleDateChange}
              itemTextColor={textColor}
              style={{ width: pickerWidth, height: pickerHeight }}
            />
            {/* <Text style={styles.separator}>-</Text> */}
            <WheelPicker
              data={months}
              selectedItem={selectedMonth} // No need to subtract 1, as it's already in the correct 0-indexed form
              onItemSelected={handleMonthChange}
              style={{ width: pickerWidth, height: pickerHeight }}
            />
          </View>
        </View>
      );
      break;
    default:
      renderContent = (
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            <WheelPicker
              data={months}
              selectedItem={selectedMonth}  // Correct index for the selected month
              onItemSelected={handleMonthChange}
              style={{ width: pickerWidth, height: pickerHeight }}
            />
            {/* <Text style={styles.separator}>-</Text> */}
            <WheelPicker
              data={dates}
              selectedItem={selectedDate}  // Correct zero-based index for the selected date
              onItemSelected={handleDateChange}
              style={{ width: pickerWidth, height: pickerHeight }}
            />
          </View>
        </View>
      );
      break;
  }

  return renderContent;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    width: 200,
    height: 100,
  },
  separator: {
    fontSize: 30,
    marginHorizontal: 10,
  },
});