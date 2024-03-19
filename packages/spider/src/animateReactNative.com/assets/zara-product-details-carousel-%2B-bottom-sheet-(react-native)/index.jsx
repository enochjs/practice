import * as React from 'react';
import { FlatList, Image, Animated, Text, View, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const data = [
    'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_1_1_1.jpg?ts=1606727905128',
    'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_1_1.jpg?ts=1606727908993',
    'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_2_1.jpg?ts=1606727889015',
    'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_3_1.jpg?ts=1606727896369',
    'https://static.zara.net/photos///2020/I/1/1/p/6543/610/091/2/w/2460/6543610091_2_4_1.jpg?ts=1606727898445',
];

const ITEM_HEIGHT = height * 0.75;
const DOT_SIZE = 6;
const DOT_SPACING = DOT_SIZE;

export default () => {
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const translateY = Animated.divide(scrollY, ITEM_HEIGHT).interpolate({
        inputRange: [0, 1],
        outputRange: [0, DOT_SIZE + DOT_SPACING],
    });

    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = React.useMemo(() => [height - ITEM_HEIGHT, height / 2, height], []);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ width, height: ITEM_HEIGHT }}>
                <Animated.FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate='fast'
                    bounces={false}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                        useNativeDriver: true,
                    })}
                    renderItem={({ item }) => {
                        return (
                            <Image source={{ uri: item }} style={{ width, height: ITEM_HEIGHT, resizeMode: 'cover' }} />
                        );
                    }}
                />
                <View style={{ position: 'absolute', bottom: ITEM_HEIGHT / 3, left: 20 }}>
                    {data.map((_, i) => {
                        return (
                            <View
                                key={i}
                                style={{
                                    height: DOT_SIZE,
                                    width: DOT_SIZE,
                                    borderRadius: DOT_SIZE,
                                    backgroundColor: '#333',
                                    marginBottom: DOT_SIZE,
                                }}
                            />
                        );
                    })}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: -DOT_SIZE / 2,
                            left: -DOT_SIZE / 2,
                            height: DOT_SIZE * 2,
                            width: DOT_SIZE * 2,
                            borderWidth: 1,
                            borderColor: '#333',
                            borderRadius: DOT_SIZE,
                            transform: [
                                {
                                    translateY,
                                },
                            ],
                        }}
                    />
                </View>
            </View>
            <BottomSheet ref={bottomSheetRef} initialSnapIndex={0} snapPoints={snapPoints}>
                <BottomSheetScrollView contentContainerStyle={{ padding: 20 }} style={{ backgroundColor: 'white' }}>
                    <Text style={{ fontWeight: '800' }}>SOFT MINI CROSSBODY BAG WITH KISS LOCK</Text>
                    <Text style={{ marginBottom: 20 }}>29.99£</Text>
                    <Text style={{ fontSize: 13, marginBottom: 10 }}>
                        Mini crossbody bag available in various colours. Featuring two compartments. Handles and
                        detachable crossbody shoulder strap. Lined interior. Clasp with two metal pieces.
                    </Text>
                    <Text style={{ fontSize: 13 }}>
                        Height x Length x Width: 14 x 21.5 x 4.5 cm. / 5.5 x 8.4 x 1.7″
                    </Text>
                </BottomSheetScrollView>
            </BottomSheet>
        </View>
    );
};
