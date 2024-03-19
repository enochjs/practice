import * as React from 'react';
import {TextInput} from 'react-native'
import Animated, {useAnimatedProps} from 'react-native-reanimated'

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function AnimatedText({ text, style, formatter = '', ...props }) {
  const animatedProps = useAnimatedProps(() => {
    if (!text) {
      return {};
    }
    return {
      text: `${Math.round(text.value)}${formatter}`,
    };
  });
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      style={[style]}
      allowFontScaling={true}
      numberOfLines={1}
      value={`${text.value}${formatter}`}
      {...{ animatedProps }}
    />
  );
};