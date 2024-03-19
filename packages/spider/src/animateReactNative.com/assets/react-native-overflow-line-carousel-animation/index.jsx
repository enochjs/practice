// Inspiration: https://dribbble.com/shots/5464986-Nike-Store-App

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

const API_KEY = 'YOUR_PEXELS_API_KEY';
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

        if (!images) {
            fetchImages();
        }
    }, [images]);

    const scrollX = React.useRef(new Animated.Value(0)).current;

    if (!images) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: '500' }}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#EBE2E8' }}>
            <StatusBar hidden />
            <Animated.FlatList
                data={images}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: true,
                })}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    return (
                        <Animated.View
                            style={{
                                width,
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 16,
                                },
                                shadowOpacity: 0.4,
                                shadowRadius: 20,
                            }}
                        >
                            <Image
                                source={{ uri: item.src.portrait }}
                                style={{
                                    width: ITEM_WIDTH,
                                    height: ITEM_HEIGHT,
                                    resizeMode: 'cover',
                                    borderRadius: 16,
                                }}
                            />
                        </Animated.View>
                    );
                }}
            />
            <View
                style={{ height: 36, margin: SPACING, width: ITEM_WIDTH, overflow: 'hidden', justifyContent: 'center' }}
            >
                {images.map((item, index) => {
                    const opacity = Animated.divide(scrollX, width).interpolate({
                        inputRange: [index - 0.8, index, index + 1],
                        outputRange: [0, 1, 0],
                    });
                    return (
                        <Animated.Text
                            style={{
                                opacity,
                                position: 'absolute',
                                textTransform: 'uppercase',
                                fontWeight: '900',
                                fontSize: 36,
                            }}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            key={item.id}
                        >
                            {item.photographer}
                        </Animated.Text>
                    );
                })}
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        {
                            backgroundColor: '#000',
                            transform: [
                                {
                                    translateX: Animated.divide(Animated.modulo(scrollX, width), width).interpolate({
                                        inputRange: [0, 0.2, 0.8, 1],
                                        outputRange: [-ITEM_WIDTH, 0, 0, ITEM_WIDTH],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            </View>
        </SafeAreaView>
    );
};
