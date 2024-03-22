import { useCallback, useEffect, useRef } from 'react';
import { Keyboard, ScrollView, ScrollViewProps, View } from 'react-native';
import Animated, {
  MeasuredDimensions,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import EventEmitter from 'eventemitter3';

export const emitter = new EventEmitter();
export const EMIT_INPUT_MEASURE_INFO = 'EMIT_INPUT_MEASURE_INFO';

type KeyboardAvoidingScrollViewProps = ScrollViewProps & {
  useScrollView?: boolean;
};

export default function KeyboardAvoidingScrollView(
  props: KeyboardAvoidingScrollViewProps,
) {
  const { useScrollView = true } = props;

  const measureInfo = useRef<MeasuredDimensions>();
  const translateY = useSharedValue(0);
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -translateY.value }],
    };
  });

  const onKeyboardDidShow = useCallback((e) => {
    if (e.endCoordinates.screenY < measureInfo.current.pageY) {
      translateY.value = withTiming(
        measureInfo.current.pageY -
          e.endCoordinates.screenY +
          measureInfo.current.height,
        {
          duration: 300,
        },
      );
    }
  }, []);

  const onKeyboardDidHide = useCallback(() => {
    translateY.value = withTiming(0, {
      duration: 300,
    });
  }, []);

  const handleTranslate = useCallback((value: MeasuredDimensions) => {
    measureInfo.current = value;
  }, []);

  useEffect(() => {
    const subKDS = Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
    const subKDH = Keyboard.addListener('keyboardWillHide', onKeyboardDidHide);

    emitter.on(EMIT_INPUT_MEASURE_INFO, handleTranslate);

    return () => {
      subKDH.remove();
      subKDS.remove();
      emitter.off(EMIT_INPUT_MEASURE_INFO);
    };
  }, []);

  const Wrapper = useScrollView ? ScrollView : View;

  return (
    <Wrapper style={{ flex: 1 }} {...props}>
      <Animated.View style={translateStyle}>{props.children}</Animated.View>
    </Wrapper>
  );
}
