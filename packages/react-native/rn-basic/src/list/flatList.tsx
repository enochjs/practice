import { useMemoizedFn } from 'ahooks';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ItemData = {
  id: string;
  title: string;
};

const DATA: ItemData[] = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

type ItemProps = {
  item: ItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

const Item = ({ item, onPress, backgroundColor, textColor }: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}
  >
    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
  </TouchableOpacity>
);

// FlatList: 用于长列表数据的展示
// FlatList 组件的属性
// data: 数据源
// renderItem: 用于渲染列表项
// keyExtractor: 用于为 item 生成一个不重复的 key
// extraData: 用于刷新列表
// ListEmptyComponent: 列表为空时显示的组件
// ListFooterComponent: 列表底部组件
// ListHeaderComponent: 列表头部组件
// ItemSeparatorComponent: 列表项之间的分割线组件
// horizontal: 是否水平展示
// initialNumToRender: 初始渲染的条数
// initialScrollIndex: 初始滚动的索引
// inverted: 是否倒序展示
// numColumns: 列表的列数
// onEndReached: 到达底部时触发的事件
// onEndReachedThreshold: 到达底部触发事件的阈值
// onRefresh: 刷新事件
// refreshing: 是否正在刷新
// removeClippedSubviews: 是否移除被裁剪的视图
// viewabilityConfig: 可见性配置
// windowSize: 窗口大小
// getItemLayout: 获取列表项布局
// legacyImplementation: 是否使用旧的实现

const App = () => {
  const [selectedId, setSelectedId] = useState<string>();

  const renderItem2 = useMemoizedFn(({ item }: { item: ItemData }) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  });

  const renderItem = useCallback(({ item }: { item: ItemData }) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ItemSeparatorComponent={
          Platform.OS !== 'android' &&
          (({ highlighted }) => (
            <View
              style={[styles.separator, highlighted && { marginLeft: 0 }]}
            />
          ))
        }
        ListEmptyComponent={<Text>Empty</Text>}
        ListFooterComponent={<Text>Footer</Text>}
        ListHeaderComponent={<Text>Header</Text>}
        data={DATA}
        renderItem={renderItem2}
        keyExtractor={(item) => item.id}
        // extraData={selectedId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  separator: {
    backgroundColor: 'red',
    height: 1,
  },
});

export default App;
