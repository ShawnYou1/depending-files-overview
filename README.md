# files-overview
This Project is developed to let the programmer have an overview when they meet a new project.

## Example
### React's files overview
```
[ { fileName: 'index.js',
    path: './react-master/packages/create-subscription/',
    from:
     [ './react-master/packages/create-subscription/src/createSubscription.js' ] },
  { fileName: 'index.js',
    path: './react-master/packages/create-subscription/npm/',
    from: [] },
  { fileName: 'createSubscription-test.internal.js',
    path: './react-master/packages/create-subscription/src/__tests__/',
    from: [] },
  { fileName: 'createSubscription.js',
    path: './react-master/packages/create-subscription/src/',
    from:
     [ './react-master/packages/react/index.js',
       './react-master/packages/shared/invariant.js',
       './react-master/packages/shared/warningWithoutStack.js' ] },
```

## Run it
`node index.js`

## About the Author
[Shawn You](https://youshaohua.com)
