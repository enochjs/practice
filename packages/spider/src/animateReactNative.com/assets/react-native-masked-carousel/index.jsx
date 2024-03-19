// Inspiration: https://dribbble.com/shots/6541825-Arnie-Dance-App-3-0-Final

import * as React from 'react';
import {
    StatusBar,
    FlatList,
    Image,
    Animated,
    Text,
    View,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Easing,
    SafeAreaViewBase,
    SafeAreaView,
} from 'react-native';
const { width, height } = Dimensions.get('screen');
import MaskedView from '@react-native-community/masked-view';

const API_KEY = "YOUR_PEXELS_API_KEY";
const API_URL = `https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20`;
const ITEM_WIDTH = width * 0.72;
const ITEM_HEIGHT = ITEM_WIDTH * 1.74;
const SPACING = 20;

const fetchImagesFromPexels = async () => {
    const data = await fetch(API_URL, {
        headers: {
            Authorization: API_KEY,
        },
    });

    const { photos } = await data.json();

    return photos;
};

export default () => {
    const [images, setImages] = React.useState(null);
    React.useEffect(() => {
        const fetchImages = async () => {
            const images = await fetchImagesFromPexels();

            setImages(images);
        };

        fetchImages();
    }, []);

    const scrollX = React.useRef(new Animated.Value(0)).current;

    if (!images) {
        return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontWeight: '500'}}>Loading...</Text>
        </View>;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#EBE2E8' }}>
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: ITEM_WIDTH,
                    bottom: 0,
                    padding: SPACING,
                    paddingTop: 52,
                }}
            >
                <Animated.View style={[StyleSheet.absoluteFillObject, {backgroundColor: 'white',
                width: ITEM_WIDTH,
                transform: [
                    {
                        translateX: scrollX.interpolate({
                            inputRange:[-1, 0, ITEM_WIDTH],
                            outputRange: [ITEM_WIDTH, ITEM_WIDTH, 0],
                            extrapolate: 'clamp'
                        }),
                    },
                ],}]}/>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '500', fontSize: 18, opacity: 0.6, marginBottom: SPACING / 2 }}>
                        Welcome to Pexels
                    </Text>
                    <Text style={{ fontWeight: '900', fontSize: 32 }}>Choose the daily wallpaper</Text>
                </View>
                <MaskedView
                    style={[StyleSheet.absoluteFillObject]}
                    maskElement={
                        <Animated.View
                            style={{
                                backgroundColor: 'transparent',
                                flex: 1,
                                transform: [
                                    {
                                        translateX: scrollX.interpolate({
                                            inputRange: [-1, 0, ITEM_WIDTH],
                                            outputRange: [0, 0, -ITEM_WIDTH],
                                            extrapolate: 'clamp'
                                        }),
                                    },
                                ],
                            }}
                        >
                            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'blue' }]} />
                        </Animated.View>
                    }
                >
                    <View style={{ backgroundColor: 'blue', flex: 1, padding: SPACING, paddingTop: 52 }}>
                        <Text
                            style={{
                                fontWeight: '500',
                                color: 'white',
                                fontSize: 18,
                                opacity: 0.6,
                                marginBottom: SPACING / 2,
                            }}
                        >
                            Welcome to Pexels
                        </Text>
                        <Text style={{ fontWeight: '900', color: 'white', fontSize: 32 }}>
                            Choose the daily wallpaper
                        </Text>
                    </View>
                </MaskedView>
            </View>
            <Animated.FlatList
                data={images}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: true,
                })}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={ITEM_WIDTH + SPACING}
                snapToAlignment='start'
                decelerationRate='fast'
                style={{ paddingTop: 150 }}
                contentContainerStyle={{ paddingHorizontal: SPACING }}
                renderItem={({ item, index }) => {
                    console.log(item)
                    const itemSize = ITEM_WIDTH + SPACING
                    const inputRange = [(index - 1 ) * itemSize, index * itemSize, (index + 1) * itemSize]
                    const yPercentage = .2;
                    const translateY = scrollX.interpolate({
                        inputRange,
                        outputRange: [ITEM_HEIGHT * yPercentage / 2, 0, ITEM_HEIGHT * yPercentage / 2]
                    })
                    const scaleY = scrollX.interpolate({
                        inputRange,
                        outputRange: [1 - yPercentage, 1, 1 - yPercentage]
                    })
                    return (
                        <Animated.View style={{
                            width: ITEM_WIDTH,
                            height: ITEM_HEIGHT, marginRight: SPACING,
                            shadowColor: '#000',
                            shadowRadius: 16,
                            shadowOpacity: .3,
                            shadowOffset: {
                                width: 0,
                                height: 24
                            },
                            borderRadius: 24,
                            overflow: 'hidden',
                            transform: [
                                { translateY},
                                { scaleY }
                            ]}}>
                            <Image
                                source={{ uri: item.src.portrait }}
                                style={[StyleSheet.absoluteFillObject]}
                            />
                        </Animated.View>
                    );
                }}
            />
        </SafeAreaView>
    );
};
