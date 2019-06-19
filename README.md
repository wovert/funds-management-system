# 资金管理系统

## 技术架构

- node+vue+element-ui+mLab

```sh
npm i express mongoose body-parser bcrypt gravatar jsonwebtoken passport passport-jwt --save
npm i @babel/core @babel/node @babel/cli @babel/preset-env --D
vim .babelrc
  {
    "presets": [ "@babel/preset-env" ]
  }
```

## apidoc

``` js
/**
 * @api {get} /articles/:id 根据单个id获取文章信息
 * @apiName 根据id获取文章信息
 * @apiGroup Articles
 *
 * @apiParam (params) {String} id       文章id
 *
 * @apiSuccess {Array} article 返回相应id的文章信息
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *      {
 *        "tile": "文章标题2",
 *        "date": 1483941498230,
 *        "author": "classlfz",
 *        "content": "文章的详细内容"
 *       }
 *
 * @apiError (Error 4xx) 404 对应id的文章信息不存在
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 对应id的文章信息不存在
 *     {
 *       "error": err
 *     }
 */
```

运行 `apidoc -i src/ -o docs`，就会看到项目里边多了一个`docs`的文件夹，打开里边的`index.html`

## 前段

```sh
vue create client
```

## 前后端连载

```sh
npm i concurrently -S
vim client/package.json
  "start": "npm run serve"
vim package.json
  "client-install": "npm install --prefix client",
  "client": "npm start --prefix client",
  "dev": "concurrently \"npm run server\" \"npm run client\""
```