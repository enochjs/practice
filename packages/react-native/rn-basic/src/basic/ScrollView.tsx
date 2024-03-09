import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';

// scrollView: 用于滚动视图, 必须有一个确定的高度
// scrollView 组件的属性
// horizontal: 是否水平滚动
// showsHorizontalScrollIndicator: 是否显示水平滚动条
// showsVerticalScrollIndicator: 是否显示垂直滚动条
// pagingEnabled: 是否开启分页
// scrollEnabled: 是否可以滚动
// onScroll: 滚动事件
// onMomentumScrollBegin: 滚动开始事件
// onMomentumScrollEnd: 滚动结束事件
// onScrollBeginDrag: 开始拖拽事件
// onScrollEndDrag: 结束拖拽事件
// onContentSizeChange: 内容大小改变事件
// contentContainerStyle: 内容容器的样式
// refreshControl: 刷新控件
//   - refreshing: 是否正在刷新
//   - onRefresh: 刷新事件
//   - title: 刷新标题
//   - titleColor: 刷新标题颜色
//   - tintColor: 刷新控件颜色
//   - colors: 刷新控件颜色
//   - progressBackgroundColor: 刷新控件背景颜色
//   - size: 刷新控件大小
//   - progressViewOffset: 刷新控件偏移
//   - enabled: 是否启用刷新控件
//   - progressViewStyle: 刷新控件样式
//

function StickyHeader() {
  return (
    <View className="h-10">
      <Text>Sticky Header 1234</Text>
    </View>
  );
}

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        stickyHeaderIndices={[0]}
        // StickyHeaderComponent={StickyHeader}
        // nestedScrollEnabled
        // invertStickyHeaders
        contentContainerStyle={{ padding: 20, backgroundColor: 'yellow' }}
      >
        <View className="h-10">
          <Text>Sticky Header 1234</Text>
        </View>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    width: '100%',
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
    flex: 1,
    width: '100%',
  },
  text: {
    fontSize: 42,
  },
});

export default App;
