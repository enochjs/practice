import { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

// text: 用于显示文本内容
// text 组件的属性
// numberOfLines: 最多显示的行数
// ellipsizeMode: 当文本内容超出指定的宽度时，用于指定文本内容的显示方式
//  - head: 从头部开始截断
//  - middle: 从中间开始截断
//  - tail: 从尾部开始截断
//  - clip: 直接裁剪文本
// pressRetentionOffset: 按下的时候，触摸的区域

const TextInANest = () => {
  const [titleText, setTitleText] = useState('Bird\'s Nest');
  const bodyText = 'This is not really a bird nest.';

  const onPressTitle = () => {
    setTitleText('Bird\'s Nest [pressed]');
  };

  return (
    <>
      <View className=" w-32">
        <Text numberOfLines={3} ellipsizeMode="middle">
          View numberOfLines View numberOfLines View numberOfLines View
        </Text>
      </View>
      <Text style={styles.baseText} adjustsFontSizeToFit>
        <Text style={styles.titleText} onPress={onPressTitle}>
          {titleText}
          {'\n'}
          {'\n'}
        </Text>
        <Text numberOfLines={5}>{bodyText}</Text>
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Cochin',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TextInANest;
