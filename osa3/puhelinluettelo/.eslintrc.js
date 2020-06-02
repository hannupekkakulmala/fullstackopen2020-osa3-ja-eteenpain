/* eslint-disable no-mixed-spaces-and-tabs */
module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es6': true
  },
  'extends': 'eslint:recommended',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 11
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-console': 0,
    'no-trailing-spaces': 'error',
    	'object-curly-spacing': [
        	'error', 'always'
    	],
    	'arrow-spacing': [
        	'error', { 'before': true, 'after': true }
    ]

  }

}
