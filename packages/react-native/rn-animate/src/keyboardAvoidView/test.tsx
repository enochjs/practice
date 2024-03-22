import { View, Text, TextInput as RNTextInput } from 'react-native';

import KeyboardAvoidingScrollView from '.';
import TextInput, { createTextInput } from './textInput';
import { TextInput as TextInputPaper } from 'react-native-paper';

const MyTextInput1 = createTextInput(RNTextInput);

export default function MyTextInput() {
  return (
    <KeyboardAvoidingScrollView>
      <View className="h-96 bg-red-300 mb-4">
        <Text>h1</Text>
      </View>
      <MyTextInput1
        placeholder="test 1"
        style={{ width: 200, height: 48 }}
        useViewWrapper
      />
      <View className="h-96 bg-red-300 mb-4">
        <Text>h1</Text>
      </View>
      <MyTextInput1
        placeholder="test 2"
        style={{ width: 200, height: 48 }}
        useViewWrapper
      />
    </KeyboardAvoidingScrollView>
  );
}
