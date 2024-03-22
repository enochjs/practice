import React, {
  ComponentClass,
  ComponentType,
  FunctionComponent,
  forwardRef,
  useCallback,
} from 'react';
import { TextInput as RNTextInput, TextInputProps, View } from 'react-native';
import {
  measure,
  runOnJS,
  useAnimatedRef,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { EMIT_INPUT_MEASURE_INFO, emitter } from '.';

type LMextInputProps = TextInputProps & {
  // 如果报错了，请开启这个属性
  useViewWrapper?: boolean;
};

// type a = Parameters<RNTextInput>;

// Don't change the order of overloads, since such a change breaks current behavior
export function createTextInput<P extends object>(
  component: FunctionComponent<P>,
  // options?: Options<P>,
): FunctionComponent<P>;

export function createTextInput<P extends object>(
  component: ComponentClass<P>,
): ComponentClass<P>;

export function createTextInput(Component: any) {
  function Wrapper(props: LMextInputProps, ref?: React.Ref<any>) {
    const animatedRef = useAnimatedRef();
    const pageY = useSharedValue(100);

    const handleEmitMeasureInfo = useCallback((v) => {
      emitter.emit(EMIT_INPUT_MEASURE_INFO, v);
    }, []);

    const handleMeasure = useCallback(() => {
      pageY.value = withTiming(
        pageY.value,
        {
          duration: 0,
        },
        () => {
          const measurement = measure(animatedRef);
          if (measurement === null) {
            return;
          }
          runOnJS(handleEmitMeasureInfo)(measurement);
        },
      );
    }, []);

    if (props.useViewWrapper) {
      return (
        <View ref={animatedRef}>
          <Component
            {...props}
            onFocus={() => {
              handleMeasure();
            }}
            ref={ref}
          />
        </View>
      );
    }

    return (
      <Component
        {...props}
        onFocus={() => {
          handleMeasure();
        }}
        ref={animatedRef}
      />
    );
  }

  return forwardRef(Wrapper);
}

export default createTextInput(RNTextInput);
