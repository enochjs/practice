import { AnimateReactNative } from './index';
import fs from 'fs/promises';


(async () => {
  const animateReactNative = new AnimateReactNative();
  await animateReactNative.start();
})();

