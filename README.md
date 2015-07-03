# semantic-release-gitflow

Semantic release for [gitflow](https://github.com/petervanderdoes/gitflow)

package version will be updated automatically based on recommendation of conventional changelog

##INSTALLATION
```shell
npm install gitawego/semantic-release-gitflow --save-dev 
```
##HOWTO
```js
var release = require('semantic-release-gitflow');
release({
    path:'directory/of/project', //optional
    bump:{}, //optional,
    changelog:{} //optional
},callback);
```

* **bump** see [conventional-recommended-bump](https://github.com/stevemao/conventional-recommended-bump) for detail
* **changelog** see [conventional-changelog](https://github.com/ajoslin/conventional-changelog) for detail

##IMPORTANT

* in package.json, repository must be defined