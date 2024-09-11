### config with app config

#### https://docs.expo.dev/workflow/configuration/

1. 添加 dynamic config

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'my-app',
  name: 'My App',
  version: '2.0.0',
  extra: {
    fact: 'kittens are cool',
  },
});
```

2. 读取expo配置

```typescript
import Constants from 'expo-constants';
Constants.expoConfig.extra.fact === 'kittens are cool';
```
