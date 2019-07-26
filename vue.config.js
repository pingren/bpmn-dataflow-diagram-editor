module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.bpmn$/,
          use: 'raw-loader',
        },
      ],
    },
  },
}
