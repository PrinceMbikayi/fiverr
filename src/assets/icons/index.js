// CalypsHome Icon Registry
// Centralized icon management for the application

import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Icon components with consistent interface
export const Icons = {
  Material: MaterialIcons,
  Ionicons: Ionicons,
  Entypo: Entypo,
  FontAwesome: FontAwesome,
};

// Commonly used icons in the app
export const AppIcons = {
  // Navigation
  home: { family: 'Material', name: 'home' },
  back: { family: 'Material', name: 'arrow-back' },
  menu: { family: 'Material', name: 'menu' },
  close: { family: 'Material', name: 'close' },
  
  // Actions
  add: { family: 'Material', name: 'add' },
  edit: { family: 'Material', name: 'edit' },
  delete: { family: 'Material', name: 'delete' },
  settings: { family: 'Material', name: 'settings' },
  
  // Status
  success: { family: 'Material', name: 'check-circle' },
  error: { family: 'Material', name: 'error' },
  warning: { family: 'Material', name: 'warning' },
  info: { family: 'Material', name: 'info' },
  
  // Connectivity
  wifi: { family: 'Material', name: 'wifi' },
  bluetooth: { family: 'Material', name: 'bluetooth' },
  network: { family: 'Material', name: 'signal-cellular-4-bar' },
  
  // UI Elements
  visibility: { family: 'Material', name: 'visibility' },
  visibilityOff: { family: 'Material', name: 'visibility-off' },
  refresh: { family: 'Material', name: 'refresh' },
  search: { family: 'Material', name: 'search' },
};

// Icon renderer helper
export const renderIcon = (iconConfig, size = 24, color = '#000') => {
  const IconComponent = Icons[iconConfig.family];
  if (!IconComponent) {
    console.warn(`Icon family '${iconConfig.family}' not found`);
    return null;
  }
  
  return <IconComponent name={iconConfig.name} size={size} color={color} />;
};

export default Icons;