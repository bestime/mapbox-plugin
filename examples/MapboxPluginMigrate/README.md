#### 准备
- 依赖`turf`，使用时需要提前加载`turf.js`。
- 图标统统不支持`url地址`，需要提前加载mapbox需要用到的图片

####  初始化
```javascript
  /**
   * 初始化
   * @params {string} id 实例ID
   * @params {object} map 实例化的mapbox
   * @params {plugin} turf 项目中如果没有turf库，需要提前引入并传递进去
   *
   * */
  const iFly = new MapboxPluginMigrate('随机ID', map, turf)
```

### 添加一项飞行数据
```javascript
iFly.add({
  id: "a", // id不要重复了
  speed: 0.01, // 飞行速度
  color: "rgb(255, 0, 0)", // 线条、闪烁点颜色
  flyIcon: flyIcon, // 飞行图标（不支持url）
  targetIcon: mapboxCircleImage([255, 0, 0], 200), // 闪烁图标（不支持url）
  curveness: 0.5,// 贝塞尔弧度
  path: [
    {
      name: "北京", // 可不填
      coordinate: [116.4551, 40.2539], // 起始经纬度
    },
    {
      name: "上海",
      coordinate: [121.4648, 31.2891], // 结束经纬度
    },
  ],
})
```

### 通过ID移除一项
```javascript
iFly.removeById(id)
```

### 销毁
```javascript
iFly.dispose()
```