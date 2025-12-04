module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Plugin wajib untuk animasi reanimated
      'react-native-reanimated/plugin', 
    ],
  };
};