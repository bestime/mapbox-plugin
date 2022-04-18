## 初始化
```
// iMap => mapbox实例化，请在onload后使用
// turf => turf库。用来处理部分计算
const iFly = MapboxPluginFlyPath('ID', iMap, turf, {
  step: 1000, // 每次走多远。（单位：米）
  curveness: 1, // 二次贝塞尔值
  iconPath: '../../static/images/fj4.png', // 飞行图标
  iconScale: 1, // 图标缩放
  lineColor: 'rgba(0,0,0,0.6)', // 路径颜色
  lineWidth: 4, // 路径宽度
  lineDashArray: [1, 0], // 虚线配置
})
```

## 播放路径
```
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
```
iFly.dispose()
```
