// Inspiration: https://ro.pinterest.com/pin/270497521358783664/
import {
  StatusBar,
  FlatList,
  Dimensions,
  View,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import Animated, {
  useDerivedValue,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import chroma from 'chroma-js';

const { width, height } = Dimensions.get('window');

const colors = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(14);

const data = colors.map((color, index) => ({
  key: color,
  bg: color,
  image: `https://source.unsplash.com/collection/31433654/300x${560 + index}`,
}));

// @refresh reset 12
const _itemWidth = width * 0.8;
const _itemHeight = height * 0.75;
const _spacing = 10;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

function Item({ item, index, scrollX }: any) {
  const activeIndex = useDerivedValue(() => {
    return scrollX.value / (_itemWidth + _spacing * 2);
  });

  const translateY = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [100, 40, 100],
            'clamp',
          ),
        },
      ],
    };
  });

  const scale = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            activeIndex.value,
            [index - 1, index, index + 1],
            [1.5, 1, 1.5],
            'clamp',
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: _itemWidth,
          height: _itemHeight,
          margin: _spacing,
          overflow: 'hidden',
          borderRadius: 30,
        },
        translateY,
      ]}
    >
      <Animated.Image
        source={{ uri: item.image }}
        style={[
          {
            borderRadius: 20,
            width: _itemWidth,
            height: _itemHeight,
            resizeMode: 'cover',
          },
          scale,
        ]}
      />
    </Animated.View>
  );
}

export default function App() {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((ev) => {
    scrollX.value = ev.contentOffset.x;
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <AnimatedFlatList
        data={data}
        extraData={data}
        keyExtractor={(item) => item.key}
        horizontal
        onScroll={onScroll}
        scrollEventThrottle={16}
        // snapToInterval={_itemWidth + _spacing}
        snapToInterval={_itemWidth + _spacing * 2}
        style={{ flexGrow: 0, backgroundColor: 'transparent' }}
        contentContainerStyle={{
          paddingHorizontal: (width - (_itemWidth + _spacing * 2)) / 2,
        }}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        renderItem={({ item, index }) => {
          return <Item item={item} index={index} scrollX={scrollX} />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
