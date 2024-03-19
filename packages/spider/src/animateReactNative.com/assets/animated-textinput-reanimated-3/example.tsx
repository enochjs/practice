import AnimatedInput from "@/components/AnimatedInput";
import { View } from "react-native";

export default function AnimatedInputExample() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "black",
        padding: 8,
      }}>
      <AnimatedInput
        initialValue={"92241"}
        gradientColors={["black", "transparent"]}
        formatter={Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 10,
          minimumFractionDigits: 0,
        })}
      />
    </View>
  );
}