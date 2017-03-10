import React, {Component} from 'react';
import Animated from 'animated/lib/targets/react-dom';

export default class AnimTest extends Component {
    constructor() {
        super();
        this.state = {
            anim: new Animated.ValueXY({x: 0, y: 0}),
        }
    }
    handleClick = () => {
        var x = Math.floor((Math.random() * 100) + 1);
        var y = Math.floor((Math.random() * 100) + 1);
        this.state.anim.setValue({x: x, y: y});
    }
    render() {
        //let transformX = this.state.anim.x;
        //let transformY = this.state.anim.y;
        let scale = this.state.anim.x.interpolate({ inputRange: [0, 100], outputRange: [0.3, 1], extrapolate: 'clamp' });
        const styles = {
            transform: [{scale}]
        };

        return(
            <Animated.div onMouseDown={this.handleClick} className="card" style={styles}><p>Click Me and I will move!</p></Animated.div>
        );
    }
}