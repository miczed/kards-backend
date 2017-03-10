import React, {Component} from 'react';
import {render} from 'react-dom';
import Animated from 'animated/lib/targets/react-dom';
import Hammer from 'hammerjs';
import ReactDOM from 'react-dom';
/* Gratefully copied from https://github.com/brentvatne/react-native-animated-demo-tinder */
'use strict';

import clamp from 'clamp';


const SWIPE_THRESHOLD = 120;

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
};

//Components could be unloaded and loaded and we will loose the users currentIndex, we can persist it here.
let currentIndex = {};
let guid = 0;

export default class SwipeCards extends Component {

    static propTypes = {
        cards: React.PropTypes.array,
        cardKey: React.PropTypes.string,
        loop: React.PropTypes.bool,
        onLoop: React.PropTypes.func,
        allowGestureTermination: React.PropTypes.bool,
        stack: React.PropTypes.bool,
        stackGuid: React.PropTypes.string,
        stackDepth: React.PropTypes.number,
        stackOffsetX: React.PropTypes.number,
        stackOffsetY: React.PropTypes.number,
        renderNoMoreCards: React.PropTypes.func,
        showYup: React.PropTypes.bool,
        showNope: React.PropTypes.bool,
        handleYup: React.PropTypes.func,
        handleNope: React.PropTypes.func,
        yupText: React.PropTypes.string,
        noText: React.PropTypes.string,
        onClickHandler: React.PropTypes.func,
        renderCard: React.PropTypes.func,
        cardRemoved: React.PropTypes.func,
        dragY: React.PropTypes.bool,
        smoothTransition: React.PropTypes.bool
    };

    static defaultProps = {
        cards: [],
        cardKey: 'key',
        loop: false,
        onLoop: () => null,
        allowGestureTermination: true,
        stack: false,
        stackDepth: 5,
        stackOffsetX: 25,
        stackOffsetY: 0,
        showYup: true,
        showNope: true,
        handleYup: (card) => null,
        handleNope: (card) => null,
        nopeText: "Nope!",
        yupText: "Yup!",
        onClickHandler: () => { alert('tap') },
        cardRemoved: (ix) => null,
        renderCard: (card) => null,
        style: {},
        dragY: true,
        smoothTransition: false
    };

    constructor(props) {
        super(props);

        //Use a persistent variable to track currentIndex instead of a local one.
        this.guid = this.props.guid || guid++;
        if (!currentIndex[this.guid]) currentIndex[this.guid] = 0;

        this.state = {
            pan: new Animated.ValueXY(0),
            enter: new Animated.Value(0.5),
            cards: [].concat(this.props.cards),
            card: this.props.cards[currentIndex[this.guid]],
        };

        this.cardAnimation = null;
    }
    componentDidMount() {
        this._animateEntrance();
        this.hammer = new Hammer(ReactDOM.findDOMNode(this));

        this.hammer.on('panstart', (e) => {
            this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
            this.state.pan.setValue({ x: 0, y: 0 });
        });
        this.hammer.on('panmove', (e) => {
            this.state.pan.setValue({ x: e.deltaX, y: e.deltaY });
        });
        this.hammer.on('panend', (e) => {
            var dx = e.deltaX;
            var dy = e.deltaY;
            var vx = e.velocityX;
            var vy = e.velocityY;

            this.state.pan.flattenOffset();
            let velocity;
            if (Math.abs(dx) <= 5 && Math.abs(dy) <= 5)   //meaning the gesture did not cover any distance
            {
                this.props.onClickHandler(this.state.card)
            }

            if (vx > 0) {
                velocity = clamp(vx, 3, 5);
            } else if (vx < 0) {
                velocity = clamp(vx * -1, 3, 5) * -1;
            } else {
                velocity = dx < 0 ? -3 : 3;
            }

            if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD && vx !== 0) {

                let cancelled = false;

                if (this.state.pan.x._value > 0) {
                    cancelled = this.props.handleYup(this.state.card);
                } else {
                    cancelled = this.props.handleNope(this.state.card);
                }

                //Yup or nope was cancelled, return the card to normal.
                if (cancelled) {
                    this._resetPan();
                    return;
                };

                this.props.cardRemoved(currentIndex[this.guid]);

                if (this.props.smoothTransition) {
                    this._advanceState();
                } else {
                    this.cardAnimation = Animated.decay(this.state.pan, {
                        velocity: { x: velocity, y: vy },
                        deceleration: 0.98
                    });
                    this.cardAnimation.start(status => {
                            if (status.finished) this._advanceState();
                            else this._resetState();

                            this.cardAnimation = null;
                        }
                    );
                }

            } else {
                this._resetPan();
            }
        });
    }
    componentWillUnmount() {
        if (this.hammer) {
            this.hammer.stop();
            this.hammer.destroy();
        }
        this.hammer = null;
    }
    _forceLeftSwipe() {
        this.cardAnimation = Animated.timing(this.state.pan, {
            toValue: { x: -500, y: 0 },
        }).start(status => {
                if (status.finished) this._advanceState();
                else this._resetState();

                this.cardAnimation = null;
            }
        );
        this.props.cardRemoved(currentIndex[this.guid]);
    }

    _forceRightSwipe() {
        this.cardAnimation = Animated.timing(this.state.pan, {
            toValue: { x: 500, y: 0 },
        }).start(status => {
                if (status.finished) this._advanceState();
                else this._resetState();

                this.cardAnimation = null;
            }
        );
        this.props.cardRemoved(currentIndex[this.guid]);
    }

    _goToNextCard() {
        currentIndex[this.guid]++;

        // Checks to see if last card.
        // If props.loop=true, will start again from the first card.
        if (currentIndex[this.guid] > this.state.cards.length - 1 && this.props.loop) {
            this.props.onLoop();
            currentIndex[this.guid] = 0;
        }

        this.setState({
            card: this.state.cards[currentIndex[this.guid]]
        });
    }

    _goToPrevCard() {
        this.state.pan.setValue({ x: 0, y: 0 });
        this.state.enter.setValue(0);
        this._animateEntrance();

        currentIndex[this.guid]--;

        if (currentIndex[this.guid] < 0) {
            currentIndex[this.guid] = 0;
        }

        this.setState({
            card: this.state.cards[currentIndex[this.guid]]
        });
    }


    _animateEntrance() {
        Animated.spring(
            this.state.enter,
            { toValue: 1, friction: 8 }
        ).start();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.cards !== this.props.cards) {

            if (this.cardAnimation) {
                this.cardAnimation.stop();
                this.cardAnimation = null;
            }

            currentIndex[this.guid] = 0;
            this.setState({
                cards: [].concat(nextProps.cards),
                card: nextProps.cards[0]
            });
        }
    }

    _resetPan() {
        Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            friction: 4
        }).start();
    }

    _resetState() {
        this.state.pan.setValue({ x: 0, y: 0 });
        this.state.enter.setValue(0);
        this._animateEntrance();
    }

    _advanceState() {
        this.state.pan.setValue({ x: 0, y: 0 });
        this.state.enter.setValue(0);
        this._animateEntrance();
        this._goToNextCard();
    }

    /**
     * Returns current card object
     */
    getCurrentCard() {
        return this.state.cards[currentIndex[this.guid]];
    }

    renderNoMoreCards() {
        if (this.props.renderNoMoreCards) {
            return this.props.renderNoMoreCards();
        }

        return (<div><p>Keine Karten mehr!</p></div>);
    }

    /**
     * Renders the cards as a stack with props.stackDepth cards deep.
     */
    renderStack() {
        if (!this.state.card) {
            return this.renderNoMoreCards();
        }

        //Get the next stack of cards to render.
        let cards = this.state.cards.slice(currentIndex[this.guid], currentIndex[this.guid] + this.props.stackDepth).reverse();

        return cards.map((card, i) => {

            let offsetX = this.props.stackOffsetX * cards.length - i * this.props.stackOffsetX;
            let lastOffsetX = offsetX + this.props.stackOffsetX;

            let offsetY = this.props.stackOffsetY * cards.length - i * this.props.stackOffsetY;
            let lastOffsetY = offsetY + this.props.stackOffsetY;

            let opacity = 0.25 + (0.75 / cards.length) * (i + 1);
            let lastOpacity = 0.25 + (0.75 / cards.length) * i;

            let scale = 0.85 + (0.15 / cards.length) * (i + 1);
            let lastScale = 0.85 + (0.15 / cards.length) * i;

            let style = {
                position: 'absolute',
                width: '100%',
                top: this.state.enter.interpolate({ inputRange: [0, 1], outputRange: [lastOffsetY, offsetY] }),
                //left: this.state.enter.interpolate({ inputRange: [0, 1], outputRange: [lastOffsetX, offsetX] }),
                opacity: this.props.smoothTransition ? 1 : this.state.enter.interpolate({ inputRange: [0, 1], outputRange: [lastOpacity, opacity] }),
                transform: [{ scale: this.state.enter.interpolate({ inputRange: [0, 1], outputRange: [lastScale, scale] }) }],
                elevation: i * 10
            };

            //Is this the top card?  If so animate it and hook up the pan handlers.
            if (i + 1 === cards.length) {
                let {pan} = this.state;
                let [translateX, translateY] = [pan.x, pan.y];

                let rotate = pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"] });
                let opacity = this.props.smoothTransition ? 1 : pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5] });

                let animatedCardStyles = {
                    ...style,
                    left: pan.x,
                    transform: [
                        { translateX: translateX },
                        { translateY: translateY },
                        { rotate: rotate },
                        { scale: this.state.enter.interpolate({ inputRange: [0, 1], outputRange: [lastScale, scale] }) }
                    ]
                };
                let animStyles = Object.assign({},styles.card, animatedCardStyles);
                return <Animated.div key={card[this.props.cardKey]} style={animStyles} >
                    {this.props.renderCard(this.state.card)}
                </Animated.div>;
            }
            return <Animated.div key={card[this.props.cardKey]} style={style}>{this.props.renderCard(card)}</Animated.div>;
        });
    }

    renderCard() {
        if (!this.state.card) {
            return this.renderNoMoreCards();
        }
        let {pan, enter} = this.state;
        let [translateX, translateY] = [pan.x, pan.y];
        let layout = pan.getLayout();
        console.log(layout);


        let opacity = pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5] });

        let scale = enter;


        let animatedCardStyles = { left: pan.x,transform: [{ scale }], opacity, position:'absolute', top: 0, width: '100%' };
        let animStyles = Object.assign({},styles.card, animatedCardStyles);
        return <Animated.div key={"top"} style={animStyles} >
            {this.props.renderCard(this.state.card)}
        </Animated.div>;
    }

    renderNope() {
        let {pan} = this.state;

        let nopeOpacity = pan.x.interpolate({ inputRange: [-150, 0], outputRange: [1, 0] });
        let nopeScale = pan.x.interpolate({ inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp' });
        let animatedNopeStyles = { transform: [{ scale: nopeScale }], opacity: nopeOpacity };
        let animStyles = Object.assign({},styles.nope, animatedNopeStyles);
        if (this.props.renderNope) {
            return this.props.renderNope(pan);
        }

        if (this.props.showNope) {
            return <Animated.div style={animStyles} className="nope">
                <p>{this.props.nopeText}</p>
            </Animated.div>;
        }

        return null;
    }

    renderYup() {
        let {pan} = this.state;

        let yupOpacity = pan.x.interpolate({ inputRange: [0, 150], outputRange: [0, 1] });
        let yupScale = pan.x.interpolate({ inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp' });
        let animatedYupStyles = { transform: [{ scale: yupScale }], opacity: yupOpacity };

        if (this.props.renderYup) {
            return this.props.renderYup(pan);
        }

        if (this.props.showYup) { //[styles.yup, animatedYupStyles]
            return <Animated.div className="yup" style={animatedYupStyles}>
                <p>{this.props.yupText}</p>
            </Animated.div>;
        }

        return null;
    }
    handleClick = () => {

    }
    render() {
        return (
            <div id="CardStack" style={styles.container} className="cardStack" onClick={this.handleClick}>
               {this.props.stack ? this.renderStack() : this.renderCard()}
                {this.renderNope()}
                {this.renderYup()}
            </div>
        );
    }
}