import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Hello from '@/hello';
import BasicView from '@/basic/View';
import BasicText from '@/basic/Text';
import BasicImage from '@/basic/Image';
import BasicTextInput from '@/basic/TextInput';
import BasicScrollView from '@/basic/ScrollView';
import BasicStyleSheet from '@/basic/StyleSheet';
import BasicFlatList from '@/list/flatList';
import BasicSectionList from '@/list/sectionList';
import OtherAlert from '@/others/alert';
import ApiAccessibilityInfo from '@/api/accessibilityInfo';
import Test from '@/keyboardAvoidView/test';

// Ensure we import the CSS for Tailwind so it's included in hot module reloads.
const ctx = (require as any).context(
  // If this require.context is not inside the root directory (next to the package.json) then adjust this file path
  // to resolve correctly.
  './node_modules/.cache/expo/tailwind',
);
if (ctx.keys().length) ctx(ctx.keys()[0]);

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* <BasicView /> */}
      {/* <BasicText /> */}
      {/* <BasicImage /> */}
      {/* <BasicTextInput /> */}
      {/* <BasicScrollView /> */}
      {/* <View className="h-full w-full bg-red-400">
        <BasicStyleSheet />
      </View> */}
      {/* <BasicFlatList /> */}
      {/* <BasicSectionList /> */}
      {/* <OtherAlert /> */}
      {/* <ApiAccessibilityInfo /> */}
      <Test />
      <StatusBar style="auto" />
    </View>
  );
}
