module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/',
  ],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom'
}
