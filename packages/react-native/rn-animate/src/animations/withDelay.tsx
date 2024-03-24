import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Button } from 'react-native';
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type WithDelayTextHandle = {
  show: (delay: number) => void;
  hide: (delay: number) => void;
};

function WithDelayText(
  props: { label: string },
  ref?: React.Ref<WithDelayTextHandle>,
) {
  const { label } = props;
  const opacity = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    show: (delay: number) => {
      opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: 1000,
        }),
      );
    },
    hide: (delay: number) => {
      opacity.value = withDelay(
        delay,
        withTiming(0, {
          duration: 1000,
        }),
      );
    },
  }));

  return (
    <Animated.Text
      className="text-xl font-bold mr-2"
      style={{
        opacity: opacity,
      }}
    >
      {label}
    </Animated.Text>
  );
}

const WithDelayTextRef = forwardRef(WithDelayText);

export default function WithDelay() {
  const arrays = ['React', 'Native', 'Animated'];

  const [toggle, setToggle] = useState('show');
  const textRefs = useRef<WithDelayTextHandle[]>([]);

  const handleToggle = () => {
    console.log('handleToggle', textRefs.current);
    textRefs.current.forEach((ref, index) => {
      if (toggle === 'show') {
        ref.show((index + 1) * 500);
      } else {
        ref.hide((textRefs.current.length - index) * 500);
      }
    });
    setToggle(toggle === 'show' ? 'hide' : 'show');
  };

  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-row flex-nowrap">
        {arrays.map((item, index) => {
          return (
            <WithDelayTextRef
              key={index}
              label={item}
              ref={(element) => {
                textRefs.current[index] = element;
              }}
            ></WithDelayTextRef>
          );
        })}
      </View>
      <Button title={toggle} onPress={handleToggle}></Button>
    </View>
  );
}
