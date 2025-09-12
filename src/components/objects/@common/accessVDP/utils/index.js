import moment from 'moment/min/moment-with-locales';
import {Dimensions} from 'react-native';
const timeRegExp = /[0-9:,]/g;
const dateRegExp = /[0-9.-/]/g;

const removeLastNWords = (str, n, separator) => {
  return `${str.split(' ').splice(0, n).join(separator)}`;
}

const removeDigitsAndTimeChars = (str) => {
  return `${str.replace(timeRegExp, '').trimEnd()}`;
}

const removeLastNWordsStripped = (str, n, separator) => {
  return removeDigitsAndTimeChars(removeLastNWords(str, n, separator));
}

const calendarNoTime = (inp, strict) => {
  const originalCalendarDate = moment(inp, strict).calendar();
  const parts = originalCalendarDate.split(' ');
    
  /**
   * Most languages use the 'L' format for calendar: { sameElse },
   * these have parts of length 1. zh-cn does not use a space to separate 
   * the time from the date, so remove it if present otherwise keep 
   * the 'L' format. If `cn` not needed, simply return parts[0]. 
   * `sr/sl` uses spaces to separate day, month, year.  
   * 
   */
  if (parts.length === 1 || dateRegExp.test(parts[0])) {
    return parts[0].includes(':') ? removeDigitsAndTimeChars(parts[0]) : parts.join(' ');
  }

  switch (moment.locale()) {

    /**
     * These languages have a preposition with a length of < 3 
     * before the time. Find that preposition and keep the words
     * till that preposition. If `ru` not needed,
     * use removeLastNWords(originalCalendarDate, prepositionIndex, ' ')
     * 
     */
    case 'bg':
    case 'cs':
    case 'de':
    case 'es':
    case 'en':
    case 'en-gb':
    case 'fr':
    case 'fr-ca':
    case 'hr':
    case 'nl':
    case 'pl':
    case 'pt':
    case 'ro':
    case 'ru':
    case 'sk':
    case 'sl':
    case 'sr':
    case 'uk':
      const prepositionIndex = parts.findIndex((part, i) => i !== 0 && part.length < 3);
      return removeLastNWordsStripped(originalCalendarDate, prepositionIndex, ' ');

      /**
       * Less strict than the above, these languages put their preposition at
       * next to last index inside the `parts` array to every wording.
       * 
       */
    case 'da':
    case 'fi':
    case 'it':
    case 'kk':
    case 'nb':
    case 'th':
    case 'vi':
      return removeLastNWords(originalCalendarDate, parts.length - 2, ' ');

      // Uses [dddd, XX:XX] format, remove digits and special characters
    case 'et':
    case 'ja':
    case 'ko':
    case 'lt':
    case 'sv':
    case 'zh-tw':
    case 'zh-cn':
      return removeDigitsAndTimeChars(originalCalendarDate);

      // Same as above expect the preposition is at parts.length - 3
    case 'el':
      return removeLastNWords(originalCalendarDate, parts.length - 3, ' ');

      // Same as above + [dddd LT] format for some days
    case 'hy-am':
      return parts.length < 3 ? parts[0] : removeLastNWords(originalCalendarDate, parts.length - 3, ' ');

      // Same as above, preposition is at parts.length - 2
    case 'tr':
      return parts.length < 3 ? parts[0] : removeLastNWords(originalCalendarDate, parts.length - 2, ' ');

      // Appends `kor` to time, remove the word that contains this substring
    case 'hu':
      return originalCalendarDate.replace(/ *\b\S*?kor\S*\b/g, '');

      // Custom formats 
      // https://momentjs.com/docs/#/displaying/calendar-time/
    case 'ar':
      return moment(inp).calendar({
        sameDay: '[اليوم]',
        nextDay: '[غدًا]',
        nextWeek: 'dddd',
        lastDay: '[أمس]',
        lastWeek: 'dddd',
        sameElse: 'L',
      });
    case 'he':
      return moment(inp).calendar({
        sameDay: '[היום]',
        nextDay: '[מחר]',
        nextWeek: 'dddd',
        lastDay: '[אתמול]',
        lastWeek: 'dddd',
        sameElse: 'L',
      });

      // Unsupported language, use default format with time
    default:
      return originalCalendarDate;
  }
}


//============================================================






const reorderByKey = (arr,key)=> {
    arr.sort((a, b) => (a[key] < b[key]) ? 1 : -1)

    return arr
}

export const getLastEvents = (events,quantity = 0) => {
    const list = reorderByKey(events,"date");
    return list.slice(0,quantity);
}

export const orderEventsByDate = (events) => {
    let result = [];
    let currentDate = "";
    reorderByKey(events,"date").map((e,i) => {
        let dateSplitted = e.date.split(" ");
        dateSplitted.pop();
        const myDate = dateSplitted.join(' ');
        if(result[myDate] == undefined) {
            currentDate = myDate
            result[currentDate] = [];
        }
        result[currentDate].push(e)

    });

    const resultToArray =  Object.keys(result).reduce(function(r, key) {
        r.push({'date':key,'data':result[key]})    
        return r;
      }, []);

      const reordered = reorderByKey(resultToArray,'date')

    return reordered;
}

export const getTitleDate = (dateKey,currentLang,extraDateFormat ='') => {

    moment.locale(currentLang); 
  
    const dateFormatStr = "YYYY-MM-DD";
    const today = moment().format(dateFormatStr);
    const yesterday = moment(today).subtract(1,'days').format(dateFormatStr);

    if(dateKey == today) return calendarNoTime(today);
    if(dateKey == yesterday) return calendarNoTime(yesterday);

    let myFormat = dateFormatStr+ extraDateFormat || ""
    const myMoment = moment(dateKey, myFormat);
    //moment(myMoment).format('dddd')
    let returnFormat = 'dddd D MMMM';
    if(extraDateFormat)returnFormat += " "+extraDateFormat;
   // console.log("returnFormat",extraDateFormat,returnFormat)
    return moment(myMoment).format(returnFormat);

}

//--------------------------------------------------
export const getVideoSize = (ratioProp,fullscreen) => {

  const ratio = ratioProp || 16/9;
  const width =  Dimensions.get('window').width;

  if(fullscreen) {
    return {'width':width,height:Dimensions.get('window').height}
  }
  
  return {'width':width,'height':width/ratio}
  
}
export const getRatioHeight = (ratio) => {
  const width =  Dimensions.get('window').width;
  return width /ratio;
}
