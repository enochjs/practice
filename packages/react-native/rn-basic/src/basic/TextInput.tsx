import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';

// textInput: 用于输入文本
// textInput 组件的属性
// value: 输入框的值
// defaultValue: 输入框的默认值
// placeholder: 输入框的占位符
// placeholderTextColor: 输入框占位符的颜色
// keyboardType: 输入框的键盘类型
//   - default: 默认键盘
//   - numeric: 数字键盘
//   - email-address: 邮箱键盘
//   - phone-pad: 电话键盘
//   - number-pad: 数字键盘
//   - decimal-pad: 带小数点的数字键盘
//   - visible-password: 可见密码键盘
//   - search: 搜索键盘
// secureTextEntry: 输入框的密码输入
// maxLength: 输入框的最大长度
// multiline: 输入框是否多行
// numberOfLines: 输入框的行数
// autoCapitalize: 输入框的首字母是否大写
//   - none: 不自动大写
//   - sentences: 句子首字母大写
//   - words: 单词首字母大写
//   - characters: 所有字母大写
// autoCorrect: 输入框是否自动纠正
// autoFocus: 输入框是否自动获取焦点
// editable: 输入框是否可编辑
// returnKeyType: 输入框的返回键类型
//   - done: 完成
//   - go: 前往
//   - next: 下一个
//   - search: 搜索
//   - send: 发送
//   - none: 无
//   - previous: 上一个
//   - default: 默认
// textContentType: 输入框的内容类型
//   - none: 无
//   - URL: URL
//   - addressCity: 城市
//   - addressCityAndState: 城市和州
//   - addressState: 州
//   - countryName: 国家
//   - creditCardNumber: 信用卡号
//   - emailAddress: 邮箱
//   - familyName: 姓
//   - fullStreetAddress: 完整地址
//   - givenName: 名
//   - jobTitle: 职位
//   - location: 位置
//   - middleName: 中间名
//   - name: 名字
//   - namePrefix: 名字前缀
//   - nameSuffix: 名字后缀
//   - newPassword: 新密码
//   - nickname: 昵称
//   - organizationName: 组织名
// textAlign: 输入框的文本对齐方式
//   - left: 左对齐
//   - right: 右对齐
//   - center: 居中

// TextInput 组件的事件
// onChangeText: 输入框的值改变事件
// onEndEditing: 输入框结束编辑事件
// onFocus: 输入框获取焦点事件
// onBlur: 输入框失去焦点事件
// onSubmitEditing: 输入框提交事件
// onKeyPress: 输入框按键事件
// onSelectionChange: 输入框选择改变事件
// onScroll: 输入框滚动事件
// onContentSizeChange: 输入框内容大小改变事件

const TextInputExample = () => {
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');
  const [value, onChangeTextMulti] = React.useState('');

  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="useless placeholder"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number}
        placeholder="useless"
        keyboardType="numeric"
        textContentType="password"
        secureTextEntry
      />
      <View
        style={{
          backgroundColor: value,
          borderBottomColor: '#000000',
          borderBottomWidth: 1,
        }}
      >
        <TextInput
          editable
          multiline
          numberOfLines={4}
          autoComplete="name"
          // maxLength={40}
          onChangeText={(text) => onChangeTextMulti(text)}
          value={value}
          style={{ padding: 10 }}
          // autoFocus
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default TextInputExample;
