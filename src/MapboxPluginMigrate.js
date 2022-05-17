import getQuadraticBezierPath from "./bestime/getQuadraticBezierPath.js"
import { removeLayer, removeImage, removeSource } from "./utils/mapboxUtils"
import some from "./bestime/some.js"
import _Number from "./bestime/_Number.js"
const NAME = "MapboxPluginMigrate"
let turfInject

function createLines(start, end, curveness) {
  const list = [start]
  let point
  for (let a = 0; a < 1; a += 0.01) {
    point = getQuadraticBezierPath(start, end, curveness, a)
    list.push(point)
  }

  list.push(end)

  return list
}





export default function MapboxPluginMigrate(id, map, turfLibrary) {
  turfInject = turfLibrary
  this.records = []
  this.timer = null
  this.map = map

  this.LAYER_ID_POINT = NAME + "layer-point" + id
  this.LAYER_ID_PATH = NAME + "layer-path" + id
  this.LAYER_ID_SHAN_ICON = NAME + "layer-shan" + id

  this.SOURCE_ID_POINT = NAME + "source-point" + id
  this.SOURCE_ID_PATH = NAME + "source-path" + id
  this.SOURCE_ID_SHAN_ICON = NAME + "source-shan" + id

  // 闪烁图标图层
  map.addSource(this.SOURCE_ID_SHAN_ICON, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  })

  map.addLayer({
    id: this.LAYER_ID_SHAN_ICON,
    type: "symbol",
    source: this.SOURCE_ID_SHAN_ICON,
    layout: {
      "icon-image": ["get", "targetIcon"],
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
  })

  map.addSource(this.SOURCE_ID_PATH, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  })

  map.addLayer({
    id: this.LAYER_ID_PATH,
    source: this.SOURCE_ID_PATH,
    type: "line",
    paint: {
      "line-width": 1,
      "line-color": ["get", "color"],
      "line-dasharray": ['get', 'lineDashArray'],
    },
  })

  map.addSource(this.SOURCE_ID_POINT, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  })

  map.addLayer({
    id: this.LAYER_ID_POINT,
    source: this.SOURCE_ID_POINT,
    type: "symbol",
    layout: {
      "icon-size": ['get', 'flyIconScale'],
      "icon-image": ["get", "flyIconId"],
      "icon-rotate": ["get", "bearing"],
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
    },
  })

  

  
}

MapboxPluginMigrate.prototype.getAllIconPoint = function () {
  const features = this.records.map(function (item) {
    return {
      type: "Feature",
      properties: {
        targetIcon: item.targetIcon,
      },
      geometry: {
        type: "Point",

        coordinates: item.data.path[1].coordinate,
      },
    }
  })

  return {
    type: "FeatureCollection",
    features: features,
  }
}

MapboxPluginMigrate.prototype.getAllLinesFeature = function () {
  const features = this.records.map(function (item) {
    return {
      type: "Feature",
      properties: {
        color: item.data.color,
        lineDashArray: item.lineDashArray,
      },
      geometry: {
        type: "LineString",

        coordinates: item.lines,
      },
    }
  })

  return {
    type: "FeatureCollection",
    features,
  }
}

MapboxPluginMigrate.prototype.getAllFlyFeature = function () {
  const features = this.records.map(function (item) {
    return {
      type: "Feature",
      properties: {
        flyIconScale: item.flyIconScale,
        flyIconId: item.flyIconId,
        bearing: item.bearing,
      },
      geometry: {
        type: "Point",
        coordinates: item.coordinates,
      },
    }
  })
  return {
    type: "FeatureCollection",
    features,
  }
}

MapboxPluginMigrate.prototype.dispose = function () {
  
  clearInterval(this.timer)
  
  removeLayer(this.map, this.LAYER_ID_POINT)
  removeLayer(this.map, this.LAYER_ID_PATH)
  removeLayer(this.map, this.LAYER_ID_SHAN_ICON)

  removeSource(this.map, this.SOURCE_ID_POINT)
  removeSource(this.map, this.SOURCE_ID_PATH)
  removeSource(this.map, this.SOURCE_ID_SHAN_ICON)

  this.records.forEach((item) => {
    removeImage(this.map, item.targetIcon)
    removeImage(this.map, item.flyIconId)
  })

  

  this.records = undefined
}

MapboxPluginMigrate.prototype.startPlay = function () {
  var self = this

  clearInterval(this.timer)
  this.timer = setInterval(() => {
    
    if(this.records.length===0) {
      return this.clear()
    }
    this.records.forEach((item) => {
      
      
      const start = item.data.path[0].coordinate
      const end = item.data.path[1].coordinate
      item.currentDistence += item.direction * item.speed
      
      let coordinates;
      
      if(item.currentDistence<=0) {
        coordinates = start
        item.direction *= -1
        handleCount()
      } else if(item.currentDistence>=item.totalDistence) {
        item.currentDistence = item.totalDistence
        clearInterval(this._timer)
        coordinates = end
        item.direction *= -1
        handleCount()
      } else if(item.curveness !== 0){
        coordinates = getQuadraticBezierPath(
          start,
          end,
          item.curveness,
          item.currentDistence/item.totalDistence
        )      
      }

      // console.log("lineDistance", item.direction,item.currentDistence)
      

      function handleCount () {
        item.count++
        if(item.stopCount>0 && item.count >= item.stopCount) {
          self.removeById(item.id)
          item.onRemove && item.onRemove(item.id)
        }
      }


      const prePoint = item.coordinates
  
      item.coordinates = coordinates
      item.bearing = turfInject.bearing(
        turfInject.point(prePoint),
        turfInject.point(coordinates)
      )

      this._updateFlyIcon()
    })
  }, 17)
}

MapboxPluginMigrate.prototype._updatePathAndTarget = function () {
  const iSource01 = this.map.getSource(this.SOURCE_ID_PATH)
  const iSource02 = this.map.getSource(this.SOURCE_ID_SHAN_ICON)
  iSource01 && iSource01.setData(this.getAllLinesFeature())
  iSource02 && iSource02.setData(this.getAllIconPoint())
}

MapboxPluginMigrate.prototype._updateFlyIcon = function () {
  this.map.getSource(this.SOURCE_ID_POINT).setData(this.getAllFlyFeature())
}



MapboxPluginMigrate.prototype.clear = function () {
  clearInterval(this.timer)
  this.removeById(undefined)
}

/**
 * 清除一条数据
 * @param {string} [id=undefined] 如果没有ID，就全部清除
*/
MapboxPluginMigrate.prototype.removeById = function (id) {
  for (let a = 0; a < this.records.length; a++) {
    if (this.records[a].id === id || id===undefined) {
      this.records.splice(a--, 1)
    }
  }
  
  this._updatePathAndTarget()
  this._updateFlyIcon()
  
  clearTimeout(this._timerout)
  this._timerout = setTimeout(() => {
    this._updatePathAndTarget()
    this._updateFlyIcon()
  }, 100)
}

MapboxPluginMigrate.prototype.add = function (line) {
  const existPointId = some(this.records, function (item) {
    return item.id === line.id
  })

  if (existPointId) return

  const route = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        line.path[0].coordinate,
        line.path[1].coordinate
      ],
    },
  }
  
  // 总长度
  const lineDistance = turfInject.lineDistance(route, {
    units: 'meters'
  })

  // console.log('turfInject', lineDistance)

  
  
  this.records.push({
    id: line.id,
    onRemove: line.onRemove,
    speed: line.speed,
    currentDistence: _Number(line.currentDistence),
    curveness: line.curveness,
    flyIconId: line.iconFly,
    flyIconScale: line.flyIconScale==null? 1:line.flyIconScale,
    lineDashArray: line.lineDashArray || [4, 2],
    targetIcon: line.iconTarget,
    percent: line.percent||0, // 当前百分比
    direction: line.direction||1, // 当前运动方向
    data: line, // 原始数据
    bearing: 0, // 当前旋转度
    count: 0, // 跑了几次
    stopCount: _Number(line.count), // 第几次停止
    totalDistence: lineDistance,
    lines: createLines(
      line.path[0].coordinate,
      line.path[1].coordinate,
      line.curveness
    ),
    coordinates: line.path[0].coordinate, // 当前位置
  })

  this._updatePathAndTarget()
  this.startPlay()
}
