module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins:
    process.env.NODE_ENV === 'production'
      ? ['react-native-reanimated/plugin', 'transform-remove-console']
      : ['react-native-reanimated/plugin'],
}
