import React from "react";
import { StyleSheet, Text, View, Dimensions,ImageBackground} from "react-native";
import tinycolor from 'tinycolor2'
import Animated, { Easing } from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";


const width = 300;
const height = 300;


const { cond,
        eq, neq, lessThan, greaterOrEq,greaterThan,match,
        add,multiply,sub,divide,modulo,
        cos,sin,
        set, Value,
        abs,round,
        event, interpolate,interpolateNode, Extrapolate ,
        color,
        block,call,
        timing,
        debug
      } = Animated;

const degreesToRadians = (degrees) =>{
  const coeff = Math.PI /180;
  return degrees * coeff;
}

const radiansToDegrees = (radians) => {
  const coeff = Math.PI /180;
  return radians / coeff;
}


export  class CircularPicker extends React.Component {
  currentX = 0;
  dragX = new Value(0);
  dragY = new Value(0);
  absX = 0;
  absY = 0;
  offsetX = new Value();
  offsetY = new Value();
  center = {x:new Value(0), y:new Value(0)}

  rad = new Value(100);
  radCoeff = 0.66; /* to match backgroundImage */
  debugT = 100;
  autoAnimation = new Value(false)
 
  //angle = new Value(5.23599);
  angle = new Value(degreesToRadians(180))
  angleDegrees = new Value(180);

  gestureState = new Value(-1);
  gestureOldState = new Value(-1);

  /* remove / add YOffset when view container is not à Square */
  extraY =  new Value(0)

  constructor (props) {
    super(props)
    this.state = {
     
      mainDegrees:0,
      currentColor:null,
      pointAnimation:{},
      isMounted:false
    }

    this._config = {
      duration: 500,
      toValue: this.angle,
      easing: Easing.inOut(Easing.ease),
    };   
 } 

 static defaultProps = {
  initialColor: "#FF0000",
  eyeColor: "deepblue",
  age: "120"        
}

setAngles() {
  const initAngle = this.toHsv(this.props.initialColor.toString()).h;
  this.angle.setValue(degreesToRadians(360-initAngle));
  this.angleDegrees.setValue(initAngle);
}

 componentDidMount() {
   this.setState({isMounted:true})
   this.setAngles();  
}

componentWillUnmount() {
  this.setState({isMounted:false})
}

pointAnimationn = null;
lastDestination = null;


shouldComponentUpdate(nextProps, nextState) {
  //console.log("in should component update !!!!!!")
  //console.log(nextProps)
  //console.log(this.props)
  if(nextProps.initialColor != this.props.initialColor) return true;
  return false;
} 

componentDidUpdate(prevProps,prevState) {

  console.log("in componentDidUpdate !!!!!!")
  if(this.state.isMounted == false ) { return true }

  const prevColor = prevProps.initialColor;
  const prevLuminoColor = prevProps.luminoPleasure;
  const newColor = this.props.initialColor;
  const newLuminoColor = this.props.luminoPleasure;

  //console.log("color",prevColor,newColor)
  //console.log("luminoColor",prevLuminoColor,newLuminoColor)
  //console.log(this.lastDestination);
  
  
  const doAnimation = (this.lastDestination == null && newColor != '-')
  const forceLuminoPleasure = (newLuminoColor == undefined) ? false : (newLuminoColor != prevLuminoColor)? true : false;

  const moveToColor = (newLuminoColor) ? newLuminoColor : newColor

  // Typical usage (don't forget to compare props):
  if ((newColor !== prevColor && doAnimation) || forceLuminoPleasure) {
    if(this.pointAnimation) {
      this.autoAnimation.setValue(false)
      //this.pointAnimation.stop();
      this.pointAnimation = null;
    }
    if(forceLuminoPleasure)this.lastDestination = moveToColor;
    this.autoAnimation.setValue(true);
    const initAngle = Math.round(this.toHsv(moveToColor.toString()).h);
    //console.log("componentDidUpdate initAngle" ,initAngle,this._config);
    const radAngle = degreesToRadians((initAngle > 180) ? (360 - initAngle) : (  -initAngle))
    const animConf = {...this._config,...{toValue:radAngle}}
    this.pointAnimation = timing(this.angle,animConf );
    this.pointAnimation.start(this.animationCompleted)
    //this.setAngles()
  }
   if(this.props.initialColor == this.lastDestination) {
     this.lastDestination = null
   }

   if(newColor == prevColor)this.lastDestination = null;
}

animationCompleted = (val) => {
  
  if(this.state.isMounted == true ) {
    this.angleDegrees.setValue(this.radiansToDegrees(this.angle));
    this.autoAnimation.setValue(false);  console.log("animation is done")
    this.lastDestination = null;
  }  
  //this.updateOnRelease([this.angleDegrees])
}

  onGestureEvent = event([
    {
      nativeEvent: {
        translationX: this.dragX,
        translationY: this.dragY,
        state: this.gestureState,
        oldState:this.gestureOldState,
        absoluteX:this.absX
      },

    },
  ]);

  onReleaseEvent = event => {
    
    if (event.nativeEvent.oldState === State.ACTIVE) {
      //
    }
  };


  /********** TRIGO ***********/

   atan2 = (y, x) => {    
    const coeff1 = Math.PI / 4;
    const coeff2 = 3 * coeff1;
    const absY = abs(y);
    const angle = cond(greaterOrEq(x, 0), [
      sub(coeff1, multiply(coeff1, divide(sub(x, absY), add(x, absY)))),
    ], [
      sub(coeff2, multiply(coeff1, divide(add(x, absY), sub(absY, x)))),
    ]);
    return cond(greaterThan(y, 0), multiply(angle, -1), angle);
  }

  radiansToDegrees = (a) => {
    const coeff = 180 / Math.PI;
    return cond(lessThan(multiply(a,coeff),0),multiply(a,-1,coeff),sub(360,multiply(a,coeff)))
  }  

  getAngle = (posX,posY,offX,offY) => {     
    let angle = this.atan2(sub(this.rad,add(offY,posY)),add(offX,sub(posX,this.rad)));    
    return angle;  
  }

  /*********** COLOR ************/
  match = function (condsAndResPairs, offset = 0) {
    if (condsAndResPairs.length - offset === 1) {
      return condsAndResPairs[offset];
    } else if (condsAndResPairs.length - offset === 0) {
      return undefined;
    }
    return cond(
      condsAndResPairs[offset],
      condsAndResPairs[offset + 1],
      this.match(condsAndResPairs, offset + 2)
    );
  }
  
  colorHSV = function(h /* 0 - 360 */, s /* 0 - 1 */, v /* 0 - 1 */) {
    // Converts color from HSV format into RGB
    // Formula explained here: https://www.rapidtables.com/convert/color/hsv-to-rgb.html
    const c = multiply(v, s);
    const hh = divide(h, 60);
    const x = multiply(c, sub(1, abs(sub(modulo(hh, 2), 1))));  
    const m = sub(v, c);  
    const colorRGB = (r, g, b) =>
      color(
        round(multiply(255, add(r, m))),
        round(multiply(255, add(g, m))),
        round(multiply(255, add(b, m)))
      );
    
    return this.match([
      lessThan(h, 60),
      colorRGB(c, x, 0),
      lessThan(h, 120),
      colorRGB(x, c, 0),
      lessThan(h, 180),
      colorRGB(0, c, x),
      lessThan(h, 240),
      colorRGB(0, x, c),
      lessThan(h, 300),
      colorRGB(x, 0, c),
      colorRGB(c, 0, x) ,
    ]);
  }
/**
 * Converts color to hsv representation.
 * @param {string} color any color represenation - name, hexa, rgb
 * @return {object} { h: number, s: number, v: number } object literal
 */
toHsv = (color) =>{
  return tinycolor(color).toHsv()
}

/**
 * Converts hsv object to hexa color string.
 * @param {object} hsv { h: number, s: number, v: number } object literal
 * @return {string} color in hexa representation
 */
fromHsv = (hsv) =>{
  return tinycolor(hsv).toHexString()
}

updateOnRelease = (val) => {
 
  this.setState({mainDegrees:val[0]});  
  const tt = tinycolor({ h: val[0], s: 100, v: 100 }).toHexString();  
  this.gestureState.setValue(-1);
  this.gestureOldState.setValue(-1);
  // Avoid sendig value to server when initializing
  
  //this.lastDestination = tt;
  this.lastDestination = null;
  this.setState({currentColor:tt},() => {
      if(this.props.callback != undefined) {     
        this.props.callback(tt);
      } 
  });
  
}
// ANCHOR onTestRealease

/***************** ANIMATED VALUES  ******************************/  
  transX =    cond(neq(this.autoAnimation,true),
                [               
                  cond(
                    eq(this.gestureState, State.ACTIVE),  
                            [               
                              set(this.angle,this.getAngle(this.dragX,this.dragY,this.offsetX,this.offsetY)),
                              set(this.angleDegrees,round(this.radiansToDegrees(this.angle))),               
                              add(this.rad,multiply(this.radCoeff,this.rad,cos(this.angle)))
                            ],
                            /* When inactive */
                            [
                              cond(eq(this.gestureState, State.END),
                                    [                                      
                                      call([this.angleDegrees,this.gestureOldState,this.gestureState], this.updateOnRelease),
                                      set(this.offsetX,add(this.rad,multiply(this.radCoeff,this.rad,cos(this.angle))))
                                      
                                    ],
                                    [ 
                                      set(this.offsetX,add(this.rad,multiply(this.radCoeff,this.rad,cos(this.angle))))
                                    ]
                              )
                            ]  
                  )
                ],
                [                 
                  set(this.offsetX,add(this.rad,multiply(this.radCoeff,this.rad,cos(this.angle)))),
                ]
              );

  transY= cond(
    eq(this.gestureState, State.ACTIVE),  
            [
                set(this.angle,this.getAngle(this.dragX,this.dragY,this.offsetX,this.offsetY)), 
                set(this.angleDegrees,round(this.radiansToDegrees(this.angle))),                   
                add(this.rad,this.extraY,multiply(this.radCoeff,this.rad,sin(this.angle))),               
            ],
               /* When inactive */  
            [
              set(this.offsetY,add(this.rad,this.extraY,multiply(this.radCoeff,this.rad,sin(this.angle)))), 
              /*debug("inTransY",this.offsetX,this.offsetY,this.angleDegrees)*/
            ]          

  );  
  
h = interpolateNode(this.radiansToDegrees(this.angle), {
  inputRange: [0, 360],
  outputRange: [0, 360],
  extrapolate: 'clamp',
});
s= 1
v = 1;
_color = this.colorHSV(this.h, this.s, this.v);

borderWidth = 2;

 find_dimensions(layout){
  const {x, y, width, height} = layout;
  this.rad.setValue(width/2);
  this.extraY.setValue(-1 *((width-height) / 2));
  //this.offsetY.setValue(200)
}


  render() {

    const { deboug } = this.state;
    const animatedStyle = {
      /*backgroundColor:interpolateColor*/
      backgroundColor: this._color,
    }

    return (
      <View style={[styles.container,]} onLayout={(event) => { this.find_dimensions(event.nativeEvent.layout) }}>
       <View style={{flex:1,alignItems:'flex-start',justifyContent:'flex-start'}}>
        <View style={[{width:'100%',height:'100%',borderColor:'green',borderWidth:0},{left:0,top:0,position:'absolute'}]}>
          <ImageBackground source={require('./assets/hsvColorWheel.png')} style={[styles.image]}></ImageBackground>
        </View>     
        
        <PanGestureHandler
          maxPointers={1}
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}         
        >       
          <Animated.View rem="cursor"
            style={[
              styles.box,
              {
                borderColor:"black",
                opacity: this.opacity,
                borderWidth: this.borderWidth,
                backgroundColor:this._color,
                transform: [
                  {
                    translateX: this.transX,
                  },
                  {
                    translateY: this.transY,
                  },
                ],
              },
            ]}
          />
        </PanGestureHandler>
        </View>
      </View>
    );
  }
} // END OF CLASS

const CIRCLE_SIZE = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth:0,
    borderColor:"transparent",   
  },
  box2: {
    backgroundColor: "tomato",    
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,  
    borderColor: "#000"
  },
  box: {
    backgroundColor: "transparent",
    marginLeft: -(CIRCLE_SIZE / 2),
    marginTop: -(CIRCLE_SIZE / 2),
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderColor: "#FF0000"
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    
  },
  image2: {
    flex: 1,
    resizeMode: "contain",
    tintColor:"#000000"
  },
});