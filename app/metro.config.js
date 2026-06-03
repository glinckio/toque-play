const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { assetExts } = config.resolver;
config.resolver.assetExts = [...assetExts, 'otf'];

module.exports = config;
