import { View, Image, StyleSheet } from 'react-native';
import imgSrc from 'assets/icon.png';

// image: 用于显示图片
// image 组件的属性
// source: 图片的地址
// src 为字符串的时候，表示图片的地址
// src 为对象的时候，表示图片的地址和一些其他的属性
//  - uri: 图片的地址
//  - method: 请求的方法
//  - headers: 请求的头部
//  - body: 请求的 body
//  - width: 图片的宽度
//  - height: 图片的高度
//  - scale: 图片的缩放比例
//  - priority: 图片的优先级
//  - cache: 图片的缓存策略
//  - headers: 图片的请求头
//  - onProgress: 图片的加载进度
//  - onLoadStart: 图片的加载开始
//  - onLoad: 图片的加载完成
//  - onError: 图片的加载失败
//  - onLoadEnd: 图片的加载结束
//  - defaultSource: 图片的默认地址
//  - loadingIndicatorSource: 图片的加载中的地址
//  - blurRadius: 图片的模糊半径
//  resizeMode: 图片的显示方式
//   - contain: 图片的显示方式，保持宽高比，显示整个图片，可能会有空白
//   - cover: 图片的显示方式，保持宽高比，填充整个容器
//   - stretch: 图片的显示方式，拉伸图片
//   - repeat: 图片的显示方式，重复图片
//   - center: 图片的显示方式，居中显示

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

const DisplayAnImage = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.tinyLogo} source={imgSrc} />
      <Image
        style={styles.tinyLogo}
        defaultSource={imgSrc}
        // source={{
        //   uri: 'https://reactnative.dev/img/tiny_logo.png',
        // }}
        blurRadius={3}
        src="https://reactnative.dev/img/tiny_logo.png"
      />
      <Image
        style={styles.logo}
        source={{
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
        }}
      />
    </View>
  );
};

export default DisplayAnImage;
