export const operatorList = [
  {
    id: 9,
    label: '朴素贝叶斯',
    description: `朴素贝叶斯是一种构建分类器的简单方法。
    该分类器模型会给问题实例分配用特征值表示的类标签，类标签取自有限集合。
    它不是训练这种分类器的单一算法，而是一系列基于相同原理的算法：
    所有朴素贝叶斯分类器都假定样本每个特征与其他特征都不相关。举个例子，
    如果一种水果其具有红，圆，直径大概3英寸等特征，该水果可以被判定为是苹果。
    尽管这些特征相互依赖或者有些特征由其他特征决定，然而朴素贝叶斯分类器认为这些属性在判定该水果是否为苹果的概率分布上独立的。`,
    props: [
      {
        label: 'Config 1',
        prop: 'c1',
        type: 'input',
      },
      {
        label: 'Config 2',
        prop: 'c2',
        type: 'select',
        options: [
          {
            value: 'fast',
            label: 'fast',
          },
          {
            value: 'slow',
            label: 'slow',
          },
        ],
      },
      {
        label: 'Config 3',
        prop: 'option3',
        type: 'mselect',
        options: [
          {
            value: 'A',
            label: 'A',
          },
          {
            value: 'B',
            label: 'B',
          },
          {
            value: 'C',
            label: 'C',
          },
        ],
      },
    ],
    output: [{key:'option3',rename:'c7-1' }, {key:'c2' }]
  },
  {
    id: 10,
    label: '逻辑回归',
    description:
      '逻辑回归（Logistic Regression）是一种用于解决二分类（0 or 1）问题的机器学习方法，用于估计某种事物的可能性。比如某用户购买某商品的可能性，某病人患有某种疾病的可能性，以及某广告被用户点击的可能性等。',
    datatype: 'dict',
    props: [
      {
        label: 'Config 4',
        prop: 'c4',
        type: 'input',
        regex: '',
      },
      {
        label: 'Config 5',
        prop: 'c5',
        type: 'select',
        options: [
          {
            value: 'fast',
            label: 'fast',
          },
          {
            value: 'slow',
            label: 'slow',
          },
        ],
      },
      {
        label: 'Config 6',
        prop: 'c6',
        type: 'mselect',
        options: [
          {
            value: 'D',
            label: 'D',
          },
          {
            value: 'E',
            label: 'E',
          },
          {
            value: 'F',
            label: 'F',
          },
        ],
      },
      {
        label: 'c7: parent Nodes Config 3',
        prop: 'c7',
        type: 'select',
        mode: 'input'
        // options:
      },
    ],
    input:[{
      key: ['c7-1','c7-2'],
      target: 'c7',
      mode: 'flatMap'
    }],
    output: [{key:'c6', rename:'c7-2' }]
  },
]
