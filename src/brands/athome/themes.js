const MBCommonColors = {
    "backgroundColor": "#011627",
    "color": "white",
    "drawerDividerColor":'#777777'
    
}


const drawerBgColor =  "#343132";

// color Primary brand color
//const light_atHomeRed = "#C80026";
const light_atHomeRed = "#E4001F";
//const light_bgColor = "white";

const light_header_bg = "#111010";
const lightcard_body_bg =  "#F1F1F1";
const light_bgColor = lightcard_body_bg;
const light_onBody = "#444041"
const light_onBodyInverse = "white"
const light_bgColor_lighter = "#545253"
const light_body_darker = "#242424"
const light_divider = "#777777";
const light_body_with_cards = drawerBgColor;
const greenOn = "#64A70A";
//const greenOn = "orange"; for test
const active_button_color = greenOn;

//-----------------------------------
const dark_atHomeRed = "#990014";
const dark_bg_color = "#111010";
const dark_body_with_cards = dark_bg_color;
const dark_bgColor = dark_bg_color;
const dark_onBody = "white";
const dark_onBodyInverse = dark_bg_color;

const dark_card_body_bg = "#343132";
const dark_card_text_color = "#CCCCCC";
const dark_card_bg_color = "#575254";
const dark_card_header_bg_color = "#403e3e";

const dark_round_icon_wrapper_bgColor = "#686464"; 

const dark_greenOn = "#72c10b";
const dark_active_button_color = dark_greenOn;
const switchGreen = "#A2CA6C";
//------------------------------------



const THEMES = [
    
        {
            "key": "LIGHT",
            "primary": light_atHomeRed,
            "greenValid" : switchGreen,
            "redBar": light_atHomeRed,
            "onPrimary":"white",    
            "color--bg": light_bgColor, 
            "body" : light_bgColor,
            "onBody":light_onBody,
            "onBodyInverse":light_onBodyInverse,
            "body_color_text": light_onBody,
            "body_color_lighter": light_bgColor_lighter,
            "body_color_darker": light_body_darker,
            "divider_on_body": light_divider,
            "active_button_color":active_button_color,
            "screen--color--text":"white", 
            "screen--color--text--selected": light_atHomeRed,            
            "drawer--color--bg": drawerBgColor,
            "drawer--color--text":'white',
            "drawer--color--divider": light_divider,
            "header--menu--burger":require('_images/interfaces/menu/menu.png'),
            "header--color--bg": light_header_bg, 
            "header--color--text" : "white",
            "body-with-cards":light_body_with_cards,
            "card--color--headerbg":"white",
            "card--color--headertext":"red",
            "card--color--bodybg" : lightcard_body_bg,
            "card--color--text" : "#000000",
            "card--color--disabled" : "#aaaaaa",
            "card--color--icon" : "#000000",
            "card--color--icon--wrapper--border" : '#0000000',
            "card--color--icon--wrapper--background" : '#FFFFFF', 
            "card--color--deactivated-overlay" :"#80808066", 
            "widget--round--wrapper--color--background":"white",
            "widget--round--wrapper--color--border":active_button_color,    
            "program-heater-background-color":"white",
            "program-heater-color-on-block":"white",
            "program-heater-time-color":"#999",
            "add_product_list_name_color" :"black",
            "optionIconTint" : light_onBody,
            "program-heater-eco-color":"#79E0EC",
            "program-heater-comfort-1-color":"#FD9609",
            "program-heater-comfort-2-color": "#F4D323",           
            "program-heater-comfort-color":"#3BF790",
            "program-heater-on-color":"#FD9609",
            "program-heater-off-color":"#2E5D99",
            "program-heater-frost_free-color":"#8A2BE2",
            /* needed for wirepilot status frost-free */
            "program-heater-frost-free-color":"#8A2BE2",
            "program-heater-absence-color":"#73A5E6",

            "textSuccess":"#28a745",
            "on--white--color" : "black",

            "doorKeeperBgColor" : 'white',
            "WheelPicker_selected_item":light_onBody,

            "schedule_widget_text_color": light_onBody,
            "forcedWhite" : "white",
            "multipurposeline-selected-background" : "#DDDDDD",
            
        },
        {
            "key": "DARK",
            "primary":dark_atHomeRed,
            "redBar": light_atHomeRed,
            "greenValid" : switchGreen,
            "onPrimary":"white",    
            "color--bg": dark_bgColor, 
            "body" : dark_bgColor,
            "onBody":dark_onBody,
            "onBodyInverse":dark_onBodyInverse,
            "body_color_text": dark_onBody,
            "body_color_lighter": light_bgColor_lighter,
            "body_color_darker": light_body_darker,
            "divider_on_body": light_divider,
            "active_button_color":dark_active_button_color,
            "screen--color--text":"white", 
            "screen--color--text--selected":dark_atHomeRed,            
            "drawer--color--bg":drawerBgColor,
            "drawer--color--text":'white',
            "drawer--color--divider": light_divider,
            "header--menu--burger":require('_images/interfaces/menu/menu.png'),
            "header--color--bg": light_bgColor, 
            "header--color--text" : "white",
            "body-with-cards":dark_body_with_cards,
            "card--color--headerbg":dark_card_header_bg_color,
            "card--color--headertext":dark_card_text_color,
            "card--color--bodybg" : dark_card_bg_color,
            "card--color--text" : dark_card_text_color,
            "card--color--disabled" : "#777777",
            "card--color--icon" : dark_card_text_color,
            "card--color--icon--wrapper--border" : '#0000000',
            "card--color--icon--wrapper--background" : dark_card_header_bg_color, 
            "card--color--deactivated-overlay" :"#00000088",   
            "widget--round--wrapper--color--background":dark_round_icon_wrapper_bgColor,
            "widget--round--wrapper--color--border":dark_active_button_color,  
            "details_body_color" : dark_bg_color,

            "schedule_widget_background_color": dark_round_icon_wrapper_bgColor,
            "schedule_widget_text_color": "white",


            "program-heater-background-color":"white",
            "program-heater-color-on-block":"white",
            "program-heater-time-color":"#999",

            

            "program-heater-eco-color":"#79E0EC",
            "program-heater-comfort-1-color":"#FD9609",
            "program-heater-comfort-2-color": "#F4D323",           
            "program-heater-comfort-color":"#3BF790",
            "program-heater-on-color":"#FD9609",
            "program-heater-off-color":"#2E5D99",
            "program-heater-frost_free-color":"#8A2BE2",
             /* needed for wirepilot status frost-free */
             "program-heater-frost-free-color":"#8A2BE2",
            "program-heater-absence-color":"#73A5E6",
            "textSuccess":"#28a745",            
            "on--white--color" : "black",
            "multipurposeline-selected-background" : "#e62929",
            
        }
]

export default THEMES