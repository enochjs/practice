import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// View: 用于包裹一些元素，类似于 div
// tips: View 不能接受任何文本内容，如果需要显示文本内容，需要使用 Text 组件
// View 组件的属性
// onLayout: 当组件挂载或者布局变化的时候调用
// pointerEvents: 用于控制子元素是否可以成为触摸事件的目标
// style: 样式
// testID: 用于测试的 ID
// hitSlop: 用于扩大点击区域
// nativeID: 原生 ID
// collapsable: 是否可以折叠, android 上默认为 true

const ViewBoxesWithColorAndText = () => {
  const [count, setCount] = useState(0);

  return (
    <View accessible={true} collapsable>
      <View
        className="h-24 bg-blue-500 mb-1"
        // pointerEvents 用于控制子元素是否可以成为触摸事件的目标
        // auto: 默认值，子元素可以成为触摸事件的目标
        // none: 子元素不可以成为触摸事件的目标
        // box-none: 元素不可以成为触摸事件的目标，但是它的子元素可以成为触摸事件的目标
        // box-only: 元素可以成为触摸事件的目标，但是它的子元素不可以成为触摸事件的目标
        pointerEvents="auto"
      >
        <Text>this is a view</Text>
      </View>
      <TouchableOpacity
        onPress={() => setCount(count + 1)}
        className=" h-12 bg-slate-600 mb-1"
        // hitSlop: 用于扩大点击区域， 很有用的属性
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}
        // onLayout: 当组件挂载或者布局变化的时候调用
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          console.log('layout', layout);
        }}
      >
        <Text>Click me</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setCount(count + 1)}
        className=" h-12 bg-slate-600"
      >
        <Text>Click me 2</Text>
      </TouchableOpacity>
      {/*  polite: 辅助服务应该提醒用户当前视图的变化 */}
      <Text accessibilityLiveRegion="polite">Clicked {count} times</Text>
    </View>
  );
};

export default ViewBoxesWithColorAndText;
