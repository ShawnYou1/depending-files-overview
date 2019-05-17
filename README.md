# Depending Files Overview 
This Project is developed to let the programmer have an overview when they meet a new project.

## Example
### React's files overview
```
{
   "rootNode":{
      "fileName":"packages",
      "filePath":"./react-master",
      "type":"folder",
      "leaves":[
         {
            "fileName":"create-subscription",
            "filePath":"./react-master/packages",
            "type":"folder",
            "leaves":[
               {
                  "fileName":"index.js",
                  "filePath":"./react-master/packages/create-subscription",
                  "type":"file",
                  "leaves":[

                  ],
                  "deps":[
                     "./react-master/packages/create-subscription/src/createSubscription.js"
                  ]
               },
// ...
```

## Run it
`node index.js`

## About the Author
[Shawn You](https://youshaohua.com)
