/* eslint-disable */
// Learn more https://docs.expo.io/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const tailwind = require('tailwindcss/lib/cli/build');

module.exports = (async () => {
  /** @type {import('expo/metro-config').MetroConfig} */
  const config = getDefaultConfig(__dirname, {
    // Enable CSS support.
    isCSSEnabled: true,
  });

  // Run Tailwind CLI to generate CSS files.
  await tailwind.build({
    '--input': path.relative(__dirname, './global.css'),
    '--output': path.resolve(
      __dirname,
      'node_modules/.cache/expo/tailwind/eval.css'
    ),
    '--watch': process.env.NODE_ENV === 'development' ? 'always' : false,
    '--poll': true,
  });

  // support mjs
  config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs']; // <-- mjs added here

  return config;
})();
