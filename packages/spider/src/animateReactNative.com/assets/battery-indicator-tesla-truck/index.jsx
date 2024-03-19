/*
    Inspiration: https://dribbble.com/shots/8930339-Tesla-Cybertruck-Control-App
*/
import * as React from 'react';
import { View, Dimensions, TouchableOpacity, StyleSheet, UIManager, Platform, LayoutAnimation } from 'react-native';
import { useDynamicAnimation, View as MView, Text as MText, Image as MImage, AnimatePresence, motify } from 'moti';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Easing } from 'react-native-reanimated';
const { width, height } = Dimensions.get('screen');

const _min = 30;
const _max = 60;
const _spacing = 20;
const _items = 20;

const _colors = {
    bg: '#101527',
    active: '#0CFBBB',
    inactive: '#17303F',
};

const AnimatedNumber = ({ percentage = '00', style }) => {
    return (
        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, style]}>
            <View style={{ flexDirection: 'row' }}>
                {percentage.split('').map((t, i) => {
                    return (
                        <View key={i} style={{ overflow: 'hidden', height: 20, justifyContent: 'center', width: 14 }}>
                            <AnimatePresence>
                                <MText
                                    from={{ translateY: 20 }}
                                    animate={{ translateY: 0 }}
                                    exit={{ translateY: -20 }}
                                    transition={{
                                        duration: 500,
                                        type: 'timing',
                                        delay: 800 + i * 50,
                                    }}
                                    key={`percentage-${t}-${i}`}
                                    // transition={{duration: 350, type: 'timing'}}
                                    style={{
                                        fontFamily: 'Menlo',
                                        position: 'absolute',
                                        fontWeight: '800',
                                        fontSize: 20,
                                        color: _colors.active,
                                    }}
                                >
                                    {t}
                                </MText>
                            </AnimatePresence>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default function TeslaTruck() {
    const [percentage, setPercentage] = React.useState(Math.floor(Math.random() * 100));

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setPercentage(Math.floor(Math.random() * 100));
        }, 3000);

        return () => {
            clearTimeout(timeout);
        };
    }, [percentage]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: _colors.bg }}>
            <StatusBar hidden/>
            <AnimatedNumber
                percentage={percentage < 10 ? ` ${percentage}%` : `${percentage}%`}
                style={{ marginBottom: _spacing }}
                // percentage={percentage.toString()}
            />
            <View>
                {[...Array(_items).keys()].reverse().map((i) => {
                    // if you're confused, the order is reversed because we're starting from the
                    // biggest to the smallest.
                    // Also, we're animating the items in reversed way. This is only because
                    // of how the items are displayed.
                    // For me only: Just think outside the box for a moment and make this code
                    // simple. It's hard to write simple code, only dump ass motherfuckers write
                    // illegilible code.
                    const isActive = Math.floor((percentage * _items) / 100) >= i;
                    return (
                        <MView
                            key={i}
                            from={{
                                shadowOpacity: 0,
                                backgroundColor: _colors.inactive,
                                scaleY: 1,
                                shadowRadius: 0
                            }}
                            animate={{
                                shadowOpacity: isActive ? 1 : 0,
                                scaleY: isActive ? 1.3 : 1,
                                backgroundColor: isActive ? _colors.active : _colors.inactive,
                                shadowRadius: isActive ? 20 : 10
                            }}
                            transition={{
                                delay: isActive ? i * 100 : (_items - i) * 100,
                            }}
                            style={{
                                width: _min + (i * (_max - _min)) / 15,
                                height: 4,
                                backgroundColor: _colors.active,
                                marginBottom: _spacing / 2,
                                borderRadius: 10,
                                shadowColor: _colors.active,
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: 1,
                                shadowRadius: 20,
                            }}
                        />
                    );
                })}
            </View>
        </View>
    );
}
