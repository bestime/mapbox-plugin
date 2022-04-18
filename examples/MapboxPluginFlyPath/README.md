## 资源
- [在线示例](https://bestime.github.io/mapbox-plugin/examples/MapboxPluginFlyPath/index.html)

## 初始化
```javascript
// iMap => mapbox实例化，请在onload后使用
// turf => turf库。用来处理部分计算
const iFly = MapboxPluginFlyPath('ID', iMap, turf, {
  // 每次走多远。（单位：米）
  step: 1000, 

  // 二次贝塞尔值
  curveness: 1, 

  // 飞行图标
  iconPath: '../../static/images/fj4.png', 

  // 图标缩放
  iconScale: 1, 

  // 路径颜色
  lineColor: 'rgba(0,0,0,0.6)', 

  // 路径宽度
  lineWidth: 4, 

  // 虚线配置
  lineDashArray: [1, 0], 
})
```

## 播放路径
```javascript
// 数据，经纬度集合
const data: [number, number][] = trackJson.data

iFly.play(data, function (coordinate, percent, isEnd) {
  // console.log('当前坐标',coordinate, percent)

  if(percent===0) {
    // console.log("新的起点", coordinate)
  }

  if(isEnd) {
    console.log("跑完了", percent, isEnd)
  }
})
```

## 销毁
```javascript
iFly.dispose()
```
