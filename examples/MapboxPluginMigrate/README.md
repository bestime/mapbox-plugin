
## 资源
- [在线示例](https://bestime.github.io/mapbox-plugin/examples/MapboxPluginMigrate/index.html)

## 初始化
```javascript
// iMap => mapbox实例化，请在onload后使用
// turf => turf库。用来处理部分计算
const iFly = MapboxPluginMigrate('ID', iMap, turf)
```

## 添加一条线
```javascript
// 数据，经纬度集合
const data = {
  // id
  id: "a", 

  // 跑几次停止，0表示一直循环
  count: 0, 

  // 飞行速度（单位：千米）
  speed: 0.01, 

  // 颜色
  color: "rgb(255, 0, 0)", 

  // 飞行图标ID
  iconFly: 'icon01', 

  // 目的地图标ID
  iconTarget: 'ped01', 

  // 二次贝塞尔曲线值
  curveness: 0.5, 

  // 被移除的回调
  onRemove: function (id) {
    console.log("移除了", id)
  },

  // 起始点和目标点
  path: [
    {
      coordinate: [116.4551, 40.2539],
    },
    {
      coordinate: [121.4648, 31.2891],
    },
  ],
}

iFly.add(data)
```

## 销毁
```javascript
iFly.dispose()
```
