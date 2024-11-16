module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-class-properties', { loose: true }], // Necessário para classes
    ['@babel/plugin-transform-private-methods', { loose: true }], // Suporte a métodos privados
    ['@babel/plugin-transform-private-property-in-object', { loose: true }], // Propriedades privadas
    'react-native-reanimated/plugin', // Deve ser o último
  ],
};
