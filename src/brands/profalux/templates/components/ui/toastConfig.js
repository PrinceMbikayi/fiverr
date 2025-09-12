import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export  const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{ borderLeftColor: 'green' }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{ fontSize: 16, color:"#3E495E" }}
                text2Style={{ fontSize: 14, color:"#3E495E", }}
            />
        ),
        error: (props) => (
            <ErrorToast
                {...props}
                style={{ borderLeftColor: 'red' }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{ fontSize: 16, color:"#3E495E" }}
                text2Style={{ fontSize: 14, color:"#3E495E" }}
            />
        ),
    };