import * as React from 'react';
import {
  Animated,
  Platform,
  UIManager,
  Dimensions,
  Image,
  FlatList,
  Text,
  View,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import Constants from 'expo-constants';
import { faker } from '@faker-js/faker';

const { width } = Dimensions.get('window');

import SegmentedControl from '@react-native-community/segmented-control';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

faker.seed(1);
const DATA = [...Array(100).keys()]
  .map((i) => {
    const name = faker.name.firstName();
    return {
      key: faker.datatype.uuid(),
      phone: faker.phone.number(),
      name,
      avatar: `https://eu.ui-avatars.com/api/?name=${name}&background=random`,
      missedCall: faker.helpers.arrayElement([true, false, false]),
      date: dayjs(faker.date.recent(i / 4)),
    };
  })
  .sort((a, b) => (a.date.isAfter(b.date) ? -1 : 1));

const SIZE = 36;
const SPACING = 12;
const HEADER_HEIGHT = 60 + Constants.statusBarHeight;
const threshold = HEADER_HEIGHT;

export default function App() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [flatListData, setFlatListData] = React.useState(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  React.useEffect(() => {
    const data =
      selectedIndex === 0 ? DATA : DATA.filter((x) => x.missedCall === true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFlatListData(data);
  }, [selectedIndex]);

  if (!flatListData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          height: HEADER_HEIGHT,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: Constants.statusBarHeight,
        }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: 'rgba(0,0,0,0.02)',
              borderBottomColor: 'rgba(0,0,0,0.1)',
              borderBottomWidth: 1,
              opacity: scrollY.interpolate({
                inputRange: [-1, 0, threshold, threshold + 1],
                outputRange: [0, 0, 1, 1],
              }),
            },
          ]}
        />
        <SegmentedControl
          values={['All', 'Missed']}
          style={{ width: width / 2 }}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
      <Animated.FlatList
        data={flatListData}
        extraData={DATA}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={
          <Text
            style={{
              fontWeight: '700',
              fontSize: 36,
              marginLeft: -SIZE - SPACING,
              marginVertical: SPACING,
            }}>
            Recents
          </Text>
        }
        contentContainerStyle={{
          paddingRight: SPACING,
          paddingLeft: SPACING * 2 + SIZE,
        }}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                marginBottom: SPACING,
                alignItems: 'center',
                paddingBottom: SPACING,
                borderBottomColor: 'rgba(0,0,0,0.1)',
                borderBottomWidth: 1,
              }}>
              <Image
                source={{ uri: item.avatar }}
                style={{
                  width: SIZE,
                  height: SIZE,
                  borderRadius: SIZE,
                  marginLeft: -SIZE - SPACING,
                  marginRight: SPACING,
                }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: SPACING / 2,
                    color: item.missedCall ? 'red' : '#222',
                  }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#333' }}>
                  {item.phone}
                </Text>
              </View>
              <Text>{item.date.fromNow()}</Text>
            </View>
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
    backgroundColor: '#ffffff',
  },
});
