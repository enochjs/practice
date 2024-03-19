/*
Tap right => move to next post from story
Tap right => if is last item from the story, moves to next story
Tap left => move to prev post from story
Tap left => if is first post from story, moves to previous story
Slide right => next story
Slide left => Prev story
Timings:
- Image => 2 seconds
- Video => video duration
!Image and Videos are from Pexels.com!
*/

import * as React from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Image,
  View,
  StyleSheet,
  Easing,
} from 'react-native';
import { faker } from '@faker-js/faker';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('screen');

faker.seed(10);

const videos = [
  {
    type: 'video',
    source:
      'https://player.vimeo.com/external/435727923.sd.mp4?s=b0ba1cb22e8bd3c728c0e0645f1afa737c54685b&profile_id=165&oauth2_token_id=57447761',
  },
  {
    type: 'video',
    source:
      'https://player.vimeo.com/external/380084525.sd.mp4?s=45d958488c04382808d32bccd2bb617d0c854497&profile_id=165&oauth2_token_id=57447761',
  },
  {
    type: 'video',
    source:
      'https://player.vimeo.com/external/458869473.sd.mp4?s=8a12f7ccab0e8c2f76fc4d035432896a94c39867&profile_id=165&oauth2_token_id=57447761',
  },
  {
    type: 'video',
    source:
      'https://player.vimeo.com/external/469935935.sd.mp4?s=43593162e39790a79ea6e9c640229d5d0df757c0&profile_id=165&oauth2_token_id=57447761',
  },
  {
    type: 'video',
    source:
      'https://player.vimeo.com/external/380092036.sd.mp4?s=057bf055b7ea202dbe0a603c988c0710dc7e7a8d&profile_id=165&oauth2_token_id=57447761',
  },
  {
    type: 'video',
    source:
      'https://player.vimeo.com/external/436232831.sd.mp4?s=265a57186f31bdd8c8a375c3191847c440b57dbc&profile_id=165&oauth2_token_id=57447761',
  },
  {
    type: 'video',
    source:
      'https://player.vimeo.com/external/400197170.sd.mp4?s=9d47e96f8406ac10b646bcae30791fc923733796&profile_id=165&oauth2_token_id=57447761',
  },
  {
    type: 'video',
    source:
      'https://player.vimeo.com/external/435485194.sd.mp4?s=67c4fb57332ea6a27834381cb68c014ec13623f2&profile_id=165&oauth2_token_id=57447761',
  },
  // {
  //   type: 'video',
  //   source: 'https://player.vimeo.com/external/371908964.sd.mp4?s=864e3312b11e54004505ce81e7b7f0a7adcfd760&profile_id=165&oauth2_token_id=57447761'
  // },
  {
    type: 'video',
    source:
      'https://player.vimeo.com/external/393663466.sd.mp4?s=1f9532a51186c387606aabd2ff0183743fcaa82b&profile_id=165&oauth2_token_id=57447761',
  },
];

const images = [
  {
    type: 'image',
    source:
      'https://images.pexels.com/photos/2710131/pexels-photo-2710131.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  },
  {
    type: 'image',
    source:
      'https://images.pexels.com/photos/1237611/pexels-photo-1237611.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  },
  {
    type: 'image',
    source:
      'https://images.pexels.com/photos/3314294/pexels-photo-3314294.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
  {
    type: 'image',
    source:
      'https://images.pexels.com/photos/4906249/pexels-photo-4906249.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  },
  {
    type: 'image',
    source:
      'https://images.pexels.com/photos/1964471/pexels-photo-1964471.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  },
  {
    type: 'image',
    source:
      'https://images.pexels.com/photos/2234685/pexels-photo-2234685.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  },
  {
    type: 'image',
    source:
      'https://images.pexels.com/photos/3632869/pexels-photo-3632869.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  },
  {
    type: 'image',
    source:
      'https://images.pexels.com/photos/5380591/pexels-photo-5380591.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  },
  {
    type: 'image',
    source:
      'https://images.pexels.com/photos/2119560/pexels-photo-2119560.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  },
];

const slides = [...Array(10).keys()].map(() => {
  return {
    key: faker.datatype.uuid(),
    data: faker.helpers.arrayElements(
      faker.helpers.shuffle([...images, ...videos]),
      faker.datatype.number({ min: 1, max: 5 })
    ),
  };
});

const StoryProgress = ({
  isLongPressed,
  done,
  activeIndex,
  index,
  onEnd,
  active,
  duration = 2000,
}) => {
  const progress = React.useRef(new Animated.Value(-width / 3)).current;
  const [progressWidth, setProgressWidth] = React.useState(null);
  const longPressElapsedDuration = React.useRef(0);

  const animation = (durations) =>
    Animated.timing(progress, {
      toValue: 0,
      duration: durations,
      easing: Easing.linear,
      useNativeDriver: true,
    });

  React.useEffect(() => {
    // we need to store the passed duration so when we
    // release the longpress is going to start the timing
    // from with the elapsed duration.
    const listener = progress.addListener(({ value }) => {
      longPressElapsedDuration.current = Math.abs(
        (value * duration) / progressWidth
      );
    });

    return () => {
      progress.removeListener(listener);
      progress.removeAllListeners();
    };
  });

  React.useEffect(() => {
    if (isLongPressed) {
      progress.stopAnimation();
    } else {
      if (active) {
        // start animation with elapsed duration
        animation(longPressElapsedDuration.current).start((status) => {
          // in case of previous, we need to cancel the animation
          // or move to next when the animation has finished.
          if (status.finished) {
            onEnd(index + 1);
          }
        });
      }
    }
  }, [isLongPressed, progressWidth]);
  React.useEffect(() => {
    progress.setValue(-progressWidth);
    if (active) {
      progress.setValue(-progressWidth);
      animation(duration).start((status) => {
        // in case of previous, we need to cancel the animation
        // or move to next when the animation has finished.
        if (status.finished) {
          onEnd(index + 1);
        }
      });
    }

    if (done) {
      progress.setValue(0);
      return;
    }
  }, [active, done]);

  React.useEffect(() => {
    progress.setValue(-progressWidth);
  }, [progressWidth]);

  return (
    <View
      key={index}
      style={{
        height: 4,
        flex: 1,
        overflow: 'hidden',
        marginRight: 8,
        backgroundColor: 'rgba(255,255,255,0.4)',
      }}>
      <Animated.View
        onLayout={(e) => setProgressWidth(e.nativeEvent.layout.width)}
        style={{
          height: 4,
          backgroundColor: 'white',
          transform: [
            {
              translateX: progress,
            },
          ],
        }}
      />
    </View>
  );
};

const Slide = ({
  isScrolling,
  item,
  index,
  active,
  onNextSlide,
  onPrevSlide,
}) => {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [duration, setDuration] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setActiveSlide(0);
  }, [active]);

  const goPrev = React.useCallback(
    (newSlide) => {
      if (newSlide < 0) {
        return onPrevSlide();
      }
      setLoading(true);
      setActiveSlide(newSlide);
    },
    [activeSlide]
  );

  const goNext = React.useCallback(
    (newSlide) => {
      if (newSlide > item.data.length - 1) {
        return onNextSlide();
      }
      setLoading(true);
      setActiveSlide(newSlide);
    },
    [activeSlide]
  );

  const [isLongPressed, setIsLongPressed] = React.useState(false);

  return (
    <View style={{ width, height }}>
      <View style={[StyleSheet.absoluteFillObject]}>
        {item.data[activeSlide].type === 'video' ? (
          <Video
            onLoad={(status) => {
              setDuration(status.durationMillis);
              setLoading(false);
            }}
            source={{ uri: item.data[activeSlide].source }}
            rate={1.0}
            volume={0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay={active && !isLongPressed && !isScrolling}
            isLooping={false}
            style={{ flex: 1 }}
          />
        ) : (
          <Image
            onLoad={() => {
              setLoading(false);
              setDuration(2000);
            }}
            source={{ uri: item.data[activeSlide].source }}
            style={{ flex: 1 }}
          />
        )}
      </View>
      <View style={[StyleSheet.absoluteFillObject, { flexDirection: 'row' }]}>
        <TouchableWithoutFeedback
          delayLongPress={200}
          onPressOut={() => {
            setIsLongPressed(false);
          }}
          onLongPress={() => {
            setIsLongPressed(true);
          }}
          onPress={() => goPrev(activeSlide - 1)}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          delayLongPress={200}
          onPressOut={() => {
            setIsLongPressed(false);
          }}
          onLongPress={() => {
            setIsLongPressed(true);
          }}
          onPress={() => goNext(activeSlide + 1)}>
          <View style={{ backgroundColor: 'transparent', flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>
      <View
        key={`story-progress-${index}`}
        style={{
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          position: 'absolute',
          top: 50,
        }}>
        {item.data.map((_, i) => {
          return (
            <StoryProgress
              isLongPressed={isLongPressed || isScrolling}
              activeIndex={activeSlide}
              index={i}
              key={`story-progress-${index}-${i}`}
              done={activeSlide > i}
              active={activeSlide === i && !loading && active}
              duration={duration}
              onEnd={goNext}
            />
          );
        })}
      </View>
    </View>
  );
};

const perspective = width;
const angle = Math.atan(perspective / (width / 2));

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isScrolling, setIsScrolling] = React.useState(0);
  const ref = React.useRef();
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.FlatList
        ref={ref}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: true,
          }
        )}
        pagingEnabled
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollEnd={(ev) => {
          setActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 0.5) * width,
            index * width,
            (index + 0.5) * width,
          ];
          const rotateY = scrollX.interpolate({
            inputRange,
            outputRange: [`${angle / 2}rad`, '0rad', `-${angle / 2}rad`],
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
          });

          const translateX1 = scrollX.interpolate({
            inputRange,
            outputRange: [-width / 2, 0, width / 2],
            extrapolate: 'clamp',
          });
          const translateX2 = scrollX.interpolate({
            inputRange,
            outputRange: [width / 2, 0, -width / 2],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={{
                opacity,
                transform: [
                  { perspective: width * 4 },
                  { translateX: translateX1 },
                  { rotateY },
                  { translateX: translateX2 },
                ],
              }}>
              <Slide
                item={item}
                index={index}
                active={index === activeIndex}
                onNextSlide={() => {
                  ref?.current?.scrollToOffset({
                    offset: (index + 1) * width,
                    animated: true,
                  });
                }}
                isScrolling={isScrolling}
                onPrevSlide={() => {
                  ref?.current?.scrollToOffset({
                    offset: (index - 1) * width,
                    animated: true,
                  });
                }}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
