import React, { useMemo, useState, useRef } from "react";
import Animated, {
  LinearTransition,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { Text, TextStyle, StyleSheet, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function formatNumberWithCommas(formatter: Intl.NumberFormat, num: number) {
  const formattedNum = formatter.format(num);
  console.log(formattedNum);
  const result: { value: string; key: string }[] = [];
  let commaCount = 0;

  for (let i = 0; i < formattedNum.length; i++) {
    const char = formattedNum[i];
    // We want to count the number of commas because we would like to
    // keep the index of the digits the same.
    if (char === ",") {
      result.push({ value: char, key: `comma-${i}` });

      commaCount++;
    } else {
      result.push({ value: char, key: `digit-${i - commaCount}` });
    }
  }

  return result;
}

type AnimatedInputProps = {
  style?: TextStyle;
  onChangeText?: (text: string) => void;
  gradientColors?: string[];
  initialValue?: string | number;
  formatter?: Intl.NumberFormat;
  autoFocus?: boolean;
};

export default function AnimatedInput({
  style,
  onChangeText,
  gradientColors = ["black", "transparent"],
  initialValue = "0",
  formatter = new Intl.NumberFormat("en-US"),
  autoFocus = true,
}: AnimatedInputProps) {
  const [amount, setAmount] = useState(initialValue);
  const inputRef = useRef<TextInput>(null);

  const initialFontSize = style?.fontSize ?? 124;
  const animationDuration = 300;
  const [fontSize, setFontSize] = useState(initialFontSize);

  const formattedNumbers = React.useMemo(() => {
    return formatNumberWithCommas(formatter, parseFloat(String(amount) || "0"));
  }, [amount, formatter]);

  const gradients = useMemo(() => {
    return {
      normal: [...gradientColors],
      reversed: [...gradientColors.reverse()],
    };
  }, [gradientColors]);

  return (
    <Animated.View
      style={{
        height: fontSize * 1.2,
        width: "100%",
        marginBottom: 100,
      }}>
      {/*
        We are using a dummy Text to let React Native do the math for the font size,
        in case the text will not fit on a single line.
      */}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          // Initial FontSize
          fontSize: initialFontSize,
          lineHeight: initialFontSize,
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          position: "absolute",
          top: -10000,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          opacity: 0,
        }}
        onTextLayout={(e) => {
          setFontSize(Math.round(e.nativeEvent.lines[0].ascender));
        }}>
        {formattedNumbers.map((x) => x.value).join("")}
      </Text>
      <Animated.View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          flex: 1,
          overflow: "hidden",
        }}>
        {formattedNumbers.map((formattedNumber, idx) => {
          return (
            <Animated.Text
              layout={LinearTransition.duration(animationDuration)}
              key={formattedNumber.key}
              entering={SlideInDown.duration(
                animationDuration
              ).withInitialValues({
                originY: initialFontSize / 2,
              })}
              exiting={SlideOutDown.duration(
                animationDuration
              ).withInitialValues({
                transform: [{ translateY: -initialFontSize / 2 }],
              })}
              style={[styles.text, style, { fontSize }]}>
              {formattedNumber.value}
            </Animated.Text>
          );
        })}
        {/**
         *
         * Hidden text input. This is because we're using the native keyboard.
         * TODO: Add a custom keyboard as well :)
         */}
        <TextInput
          ref={inputRef}
          returnKeyType='default'
          selectionColor='black'
          keyboardType='numeric'
          defaultValue={String(initialValue)}
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: 0,
            },
          ]}
          autoFocus={autoFocus}
          onChangeText={(text) => {
            setAmount(text);
            onChangeText?.(text);
          }}
        />
      </Animated.View>
      <LinearGradient
        colors={gradients.normal}
        style={{
          height: fontSize / 2,
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
        }}
        pointerEvents='none'
      />
      <LinearGradient
        colors={gradients.reversed}
        style={{
          height: fontSize / 2,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        }}
        pointerEvents='none'
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    // fontFamily: 'Menlo'
    // fontVariant: ['tabular-nums']
  },
});
