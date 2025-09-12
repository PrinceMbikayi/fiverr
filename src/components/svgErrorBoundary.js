import React from 'react';
import {Text} from 'react-native';
class SvgErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null, errorInfo: null };
    }
    
    static getDerivedStateFromError(error) {
      // Mettez à jour l'état, de façon à montrer l'UI de repli au prochain rendu.
      console.log("getDerivedStateFromError",error);
      return { hasError: true };
    }


    componentDidCatch(error, errorInfo) {
      // Catch errors in any components below and re-render with error message
      console.log('erreur componentDidCatch !!!!!!!')
      this.setState({
        error: error,
        errorInfo: errorInfo
      })
      // You can also log error messages to an error reporting service here
    }
    
    render() {
     
      if (this.state.hasError) {
        // Vous pouvez afficher n'importe quelle UI de repli.
        return <Text>Something went wrong.</Text>;
      }
  
      return this.props.children;
    }
   
  }

  export default SvgErrorBoundary