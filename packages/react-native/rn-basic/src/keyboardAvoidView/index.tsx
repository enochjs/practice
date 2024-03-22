import React from 'react';
import { Keyboard, LayoutAnimation, Platform, View } from 'react-native';

class KeyboardAvoidingView extends React.Component<any, any> {
  _frame = null;
  _keyboardEvent = null;
  _subscriptions = [];
  viewRef = null;
  _initialFrameHeight: number = 0;
  _bottom: number = 0;

  constructor(props) {
    super(props);
    this.state = { bottom: 0 };
    this.viewRef = React.createRef();
  }

  async _relativeKeyboardHeight(keyboardFrame) {
    const frame = this._frame;
    if (!frame || !keyboardFrame) {
      return 0;
    }

    const keyboardY =
      keyboardFrame.screenY - (this.props.keyboardVerticalOffset ?? 0);

    console.log('=====>>>frame', frame);
    console.log('=====>>>keyboardFrame', keyboardFrame);
    console.log(
      '=====>>>keyboardFrame.screenY',
      frame.y + frame.height - keyboardY,
    );

    if (this.props.behavior === 'height') {
      return Math.max(
        this.state.bottom + frame.y + frame.height - keyboardY,
        0,
      );
    }

    // Calculate the displacement needed for the view such that it
    // no longer overlaps with the keyboard
    return Math.max(frame.y + frame.height - keyboardY, 0);
  }

  _onKeyboardChange = (event) => {
    this._keyboardEvent = event;
    // $FlowFixMe[unused-promise]
    this._updateBottomIfNecessary();
  };

  _onLayout = async (event) => {
    const oldFrame = this._frame;
    this._frame = event.nativeEvent.layout;
    if (!this._initialFrameHeight) {
      // save the initial frame height, before the keyboard is visible
      this._initialFrameHeight = this._frame.height;
    }

    // update bottom height for the first time or when the height is changed
    if (!oldFrame || oldFrame.height !== this._frame.height) {
      console.log('=====>>>event3');
      await this._updateBottomIfNecessary();
    }

    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  };

  // Avoid unnecessary renders if the KeyboardAvoidingView is disabled.
  _setBottom = (value: number) => {
    const enabled = this.props.enabled ?? true;
    this._bottom = value;
    if (enabled) {
      this.setState({ bottom: value });
    }
  };

  _updateBottomIfNecessary = async () => {
    if (this._keyboardEvent == null) {
      this._setBottom(0);
      return;
    }

    const { duration, easing, endCoordinates } = this._keyboardEvent;
    const height = await this._relativeKeyboardHeight(endCoordinates);
    console.log('=====>>>_updateBottomIfNecessary', height, this._bottom);

    if (this._bottom === height) {
      return;
    }

    this._setBottom(height);

    const enabled = this.props.enabled ?? true;
    if (enabled && duration && easing) {
      LayoutAnimation.configureNext({
        // We have to pass the duration equal to minimal accepted duration defined here: RCTLayoutAnimation.m
        duration: duration > 10 ? duration : 10,
        update: {
          duration: duration > 10 ? duration : 10,
          type: LayoutAnimation.Types[easing] || 'keyboard',
        },
      });
    }
  };

  componentDidUpdate(_, prevState): void {
    const enabled = this.props.enabled ?? true;
    if (enabled && this._bottom !== prevState.bottom) {
      this.setState({ bottom: this._bottom });
    }
  }

  componentDidMount(): void {
    if (Platform.OS === 'ios') {
      this._subscriptions = [
        Keyboard.addListener('keyboardWillChangeFrame', this._onKeyboardChange),
      ];
    } else {
      this._subscriptions = [
        Keyboard.addListener('keyboardDidHide', this._onKeyboardChange),
        Keyboard.addListener('keyboardDidShow', this._onKeyboardChange),
      ];
    }
  }

  componentWillUnmount(): void {
    this._subscriptions.forEach((subscription) => {
      subscription.remove();
    });
  }

  render() {
    const {
      behavior,
      children,
      contentContainerStyle,
      enabled = true,
      // eslint-disable-next-line no-unused-vars
      style,
      ...props
    } = this.props;
    const bottomHeight = enabled === true ? this.state.bottom : 0;
    switch (behavior) {
    case 'height':
      let heightStyle;
      if (this._frame != null && this.state.bottom > 0) {
        // Note that we only apply a height change when there is keyboard present,
        // i.e. this.state.bottom is greater than 0. If we remove that condition,
        // this.frame.height will never go back to its original value.
        // When height changes, we need to disable flex.
        heightStyle = {
          height: this._initialFrameHeight - bottomHeight,
          flex: 0,
        };
      }
      return (
        <View
          ref={this.viewRef}
          style={[style, heightStyle]}
          onLayout={this._onLayout}
          {...props}
        >
          {children}
        </View>
      );

    case 'position':
      return (
        <View
          ref={this.viewRef}
          style={style}
          onLayout={this._onLayout}
          {...props}
        >
          <View
            style={[
              contentContainerStyle,
              {
                bottom: bottomHeight,
              },
            ]}
          >
            {children}
          </View>
        </View>
      );

    case 'padding':
      return (
        <View
          ref={this.viewRef}
          style={[style, { paddingBottom: bottomHeight }]}
          onLayout={this._onLayout}
          {...props}
        >
          {children}
        </View>
      );

    default:
      return (
        <View
          ref={this.viewRef}
          onLayout={this._onLayout}
          style={style}
          {...props}
        >
          {children}
        </View>
      );
    }
  }
}

export default KeyboardAvoidingView;
