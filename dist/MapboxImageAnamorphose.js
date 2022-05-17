class MapboxImageAnamorphose {
  constructor (map, options) {
    this._option = Object.assign({
      // 1:1时的地图缩放值
      basicZoom: 3
    }, options)
    this._map = map

    this._scale = 0
    
    this._canvas = document.createElement("canvas")
    this._canvas.style.cssText = 'border:red solid 1px;'
    
    this._ctx = this._canvas.getContext('2d')
    
    this._oImage = new Image()
    this._onZoom = this._onZoom.bind(this)

    // map.on('zoom', this._onZoom)

    document.body.appendChild(this._canvas)
  }

  dispose () {
    this._map.off('zoom', this._onZoom)
  }

  _onZoom () {
    let realScale = this._map.getZoom() / this._option.basicZoom
    realScale = Math.ceil(realScale)

    console.log("realScale", realScale)

    if(realScale !== this._scale) {
      // 取整，以免小数失真
      this._scale = realScale
      
      this._draw()
    }
  }


  _draw () {
    this._ctx.clearRect(0,0,this._cssWidth,this._cssHeight)
    // 缩放后的画笔尺寸
    const penWidth = this._cssWidth * this._scale
    const penHeight =  this._cssHeight * this._scale
    this._canvas.width = penWidth
    this._canvas.height = penHeight
    this._canvas.style.width = penWidth + 'px'
    this._canvas.style.height = penHeight + 'px'

    let color;
    let x = 0, y = 0;

    for(let a = 0; a<this._imgData.data.length; a+=4) {
      
      color = [
        this._imgData.data[a],
        this._imgData.data[a+1],
        this._imgData.data[a+2],
        this._imgData.data[a+3],
      ]

      // console.log("color", color)
      

      this._ctx.fillStyle = `rgba(${color.join(',')})`;
      this._ctx.fillRect(x, y, this._scale, this._scale);

      // console.log(this._ctx.fillStyle, x, y)

      x+=this._scale
      if(x>penWidth-1) {
        x=0
        y+=this._scale
      }
    }



    this._ctx.fillRect(0, 0, this._cssWidth, this._cssHeight);
    // console.log("penWidth", this._scale, penWidth, penHeight)
  }

  updateImage (options) {
    this._oImage.onload = (ev) => {
      console.log("图片加载成功", this._oImage)
      this._cssWidth = this._oImage.width
      this._cssHeight = this._oImage.height
      this._canvas.width = this._cssWidth
      this._canvas.height = this._cssHeight
      this._canvas.style.width = this._cssWidth + 'px'
      this._canvas.style.height = this._cssHeight + 'px'
      this._ctx.drawImage(this._oImage,0,0,this._cssWidth, this._cssHeight);
      // this._imgData = this._ctx.getImageData(0,0,this._cssWidth, this._cssHeight);
      // this._ctx.clearRect(0,0,this._cssWidth, this._cssHeight)
      // console.log("this._imgData", this._imgData)
      // this._onZoom()
    }
    this._oImage.src = options.url
    
  }

  getCanvasElement () {
    return this._canvas
  }
}