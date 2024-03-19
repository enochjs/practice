import * as React from 'react';
import {
  StatusBar,
  SectionList,
  FlatList,
  LayoutRectangle,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  useWindowDimensions,
} from 'react-native';

import Constants from 'expo-constants';
import Animated, {
  FadeInDown,
  Layout,
  SharedValue,
  interpolate,
  interpolateColor,
  runOnUI,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import chroma from 'chroma-js'

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function sleep(ms = 1000, value = true) {
  await timeout(ms);
  return value;
}

const mockedTabs = [
  'Animation',
  'Branding',
  'Illustration',
  'Calligraphy',
  'Doodling',
  'Game development',
  'Drawing',
  'Development',
];

const sections = mockedTabs.map((tab) => {
  return {
    key: tab,
    data: chroma.scale([chroma.random(), chroma.random()]).colors(10).map((c: string, i: number) => ({
      key: `color_${c}_${i}`,
      color: c
    }))
  }
}, {})

const _spacing = 20;

type MenuLayout = {
  [key: number]: LayoutRectangle;
};
type MenuProps = {
  menu: string[];
  onChange: (index: number) => void;
  initialIndex?: number;
  animationDuration?: number;
};

function clamp(n: number, min: number, max: number) {
  'worklet';
  return Math.max(Math.min(n, max), min);
}

const Indicator = ({
  menuLayout,
  activeMenu,
  animationDuration = 300,
}: {
  menuLayout: MenuLayout;
  activeMenu: SharedValue<number>;
  animationDuration?: number;
}) => {
  const anim = useSharedValue(0);
  useAnimatedReaction(
    () => {
      return activeMenu.value;
    },
    (v, oldV) => {
      // This just mounted...
      console.log({ v, oldV });
      if (typeof oldV !== 'number') {
        return;
      }
      anim.value = 0;
      if (v > oldV) {
        anim.value = withDelay(0, withTiming(1, { duration: animationDuration }));
        // right
      } else {
        anim.value = withDelay(0, withTiming(-1, { duration: animationDuration }));
        // left
      }
    },
    [activeMenu],
  );
  const stylez = useAnimatedStyle(() => {
    const itemLayout = menuLayout[activeMenu.value]!;
    const newWidth = clamp(itemLayout.width - _spacing, 20, itemLayout?.width);
    return {
      position: 'absolute',
      left: itemLayout.x + itemLayout?.width / 2 - newWidth / 2,
      top: itemLayout.y + itemLayout.height + _spacing / 4,
      width: newWidth,
      transform: [
        {
          scaleX: interpolate(Math.abs(anim.value), [0, 0.5, 1], [1, 2.2, 1]),
        },
        {
          scaleY: interpolate(Math.abs(anim.value), [0, 0.5, 1], [1, 0.5, 1]),
        },
      ],
      backgroundColor: interpolateColor(Math.abs(anim.value), [0, 0.3, .7, 1], ['#333', '#999','#999', '#333'])
    };
  });

  return (
    <Animated.View
      layout={Layout}
      entering={FadeInDown.duration(animationDuration)}
      style={[{ height: 4, width: 40, backgroundColor: '#333', borderRadius: 2 }, stylez]}
    />
  );
};

const Menu = React.memo(
  ({ menu, initialIndex = 0, onChange, animationDuration = 300 }: MenuProps) => {
    const _menuLayout = React.useRef<MenuLayout>({});
    const [isVisible, setIsVisible] = React.useState(false);
    const activeMenu = useSharedValue(0);
    const aRef = useAnimatedRef<Animated.ScrollView>();

    const { width } = useWindowDimensions();
    const scrollToIndex = React.useCallback(
      async (index: number, animated = true) => {
        await sleep(animationDuration / 2, true);
        activeMenu.value = index;
        runOnUI(scrollTo)(
          aRef,
          _menuLayout.current[index]!.x + _menuLayout.current[index]!.width / 2 - width / 2,
          0,
          animated,
        );
      },
      [initialIndex],
    );

    React.useEffect(() => {
      if (isVisible) {
        if (initialIndex > menu.length) {
          throw new Error('initialIndex out of range');
        }
        console.log(initialIndex);
        activeMenu.value = initialIndex;
        scrollToIndex(initialIndex, true);
      } else {
        activeMenu.value = initialIndex;
      }
    }, [initialIndex, isVisible]);
    return (
      <Animated.ScrollView
        ref={aRef}
        horizontal
        style={{ flexGrow: 0 }}
        contentContainerStyle={{
          paddingHorizontal: _spacing,
          paddingBottom: _spacing / 4 + 4,
        }}
        snapToAlignment='center'
        showsHorizontalScrollIndicator={false}
      >
        {menu.map((m) => {
          // JavaScript ensures the order, anyway...
          const newIndex = menu.indexOf(m);
          return (
            <TouchableOpacity
              key={m}
              onPress={async () => {
                // pressing on the same item...
                if (newIndex === activeMenu.value) {
                  return;
                }
                activeMenu.value = newIndex;
                onChange(newIndex);
                await sleep(animationDuration / 2, true);
              }}
              style={{ marginRight: _spacing }}
              onLayout={(ev) => {
                _menuLayout.current[newIndex] = {
                  ...ev.nativeEvent.layout,
                };

                if (Object.keys(_menuLayout.current).length === menu.length && !isVisible) {
                  setIsVisible(true);
                }
              }}
            >
              <View>
                <Text>{m}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {isVisible && (
          <Indicator
            menuLayout={_menuLayout.current}
            activeMenu={activeMenu}
            animationDuration={animationDuration}
          />
        )}
      </Animated.ScrollView>
    );
  },
);

export default function App() {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const ref = React.useRef<FlatList>(null);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden/>
      <Menu
        menu={mockedTabs}
        initialIndex={activeIndex}
        animationDuration={300}
        onChange={(index) => {
          // do something
          console.log('index has changed: ', index);
          setActiveIndex(index);
          ref.current?.scrollToIndex({
            index,
            animated: true,
          });
        }}
      />
      <FlatList
        ref={ref}
        data={mockedTabs}
        horizontal
        pagingEnabled
        initialScrollIndex={activeIndex}
        onMomentumScrollEnd={(ev) => {
          setActiveIndex(Math.round(ev.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item, index }) => {
          // console.log(item)
          return <View style={{ width}}>
            <Tab item={item} index={index}/>
            
          </View>
        }}
      />
    </SafeAreaView>
  );
}

const Tab = ({item, index}: {item: string, index: number}) => {
  return <FlatList 
    data={sections[index].data}
    contentContainerStyle={{padding: _spacing}}
    renderItem={({item}) => {
      return <View 
        style={{backgroundColor: item.color, height: 100, marginBottom: _spacing / 2, borderRadius: _spacing, justifyContent: 'flex-end', alignItems: 'flex-end', padding: _spacing / 2}}
      >
        <Text style={{fontFamily: 'Menlo', color: 'white', fontWeight: '700'}}>{item.color}</Text>
      </View>
    }}
  />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
});
