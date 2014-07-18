Jyo.Renderer.WebGL = function () {
    // 添加渲染元素
    this._addRenderElement("canvas");

    // 获取上下文
    this.context = Jyo.Renderer.WebGL.tryGetContext(this.canvas);

    // 使WebGL上下文拥有Canvas2DApi
    Jyo.Renderer.WebGL["2d"](this.context);
};

Jyo.Renderer.WebGL.isSupport = function () {
    /// <summary>检测是否支持</summary>
    /// <returns type="Boolean"></returns>

    if (typeof HTMLCanvasElement.prototype.getContext == "undefined") {
        return false;
    }

    if (Jyo.Renderer.WebGL.tryGetContext() != null) {
        return true;
    }

    return false;
}

// 上下文列表
Jyo.Renderer.WebGL.contextList = ["webgl2", "experimental-webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl", "3d"];

// 尝试获取上下文函数重载
Jyo.Renderer.WebGL.tryGetContext = Jyo.Overload().
                                   add(null, function () {
                                       /// <summary>尝试获取上下文对象</summary>
                                       /// <returns type="WebGLRenderingContext"></returns>

                                       var canvas = document.createElement("canvas");
                                       return Jyo.Renderer.WebGL.tryGetContext(canvas);
                                   }).
                                   add("HTMLCanvasElement", function (canvas) {
                                       /// <summary>尝试获取上下文对象</summary>
                                       /// <param name="canvas" type="HTMLCanvasElement">画布对象</param>
                                       /// <returns type="WebGLRenderingContext"></returns>

                                       var list = Jyo.Renderer.WebGL.contextList;
                                       var gl = null;
                                       // 获取上下文
                                       for (var i = 0; i < list.length && gl == null; i++) {
                                           gl = canvas.getContext(list[i]);
                                       }
                                       return gl;
                                   });

Jyo.Renderer.WebGL.prototype = new Jyo.Object({
    mode: "WebGL",
    clear: Jyo.Overload().
           add(null, function () {
               /// <summary>清空画布</summary>

               var ctx = this.context;
               ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
           }).
           add("Jyo.Color", function (color) {
               /// <summary>清空画布</summary>
               /// <param name="color" type="Jyo.Color">颜色对象</param>

               var ctx = this.context;
               ctx.clearColor(color.red / 255, color.green / 255, color.blue / 255, color.alpha);
               this.clear();
           }).
           add("String", function (colorStr) {
               /// <summary>清空画布</summary>
               /// <param name="colorStr" type="String">颜色字符串值</param>

               this.clear(new Jyo.Color(colorStr));
           }),
    begin: function () {
        this.context.save();
    },
    end: function () {
        this.context.restore();
    },
    fillRect: Jyo.Overload().
              add("Jyo.Rectangle", function (rect) {
                  /// <summary>绘制实心矩形</summary>
                  /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>

                  this.fillRect(rect.x, rect.y, rect.width, rect.height, "");
              }).
              add("Number, Number, Number, Number", function (x, y, width, height) {
                  /// <summary>绘制实心矩形</summary>
                  /// <param name="x" type="Number">起始X坐标</param>
                  /// <param name="y" type="Number">起始Y坐标</param>
                  /// <param name="width" type="Number">矩形宽度</param>
                  /// <param name="height" type="Number">矩形高度</param>

                  this.fillRect(x, y, width, height, "");
              }).
              add("Jyo.Rectangle, Jyo.Color", function (rect, color) {
                  /// <summary>绘制实心矩形</summary>
                  /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                  /// <param name="color" type="Jyo.Color">颜色对象</param>

                  this.fillRect(rect.x, rect.y, rect.width, rect.height, color.toRgba());
              }).
              add("Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, color) {
                  /// <summary>绘制实心矩形</summary>
                  /// <param name="x" type="Number">起始X坐标</param>
                  /// <param name="y" type="Number">起始Y坐标</param>
                  /// <param name="width" type="Number">矩形宽度</param>
                  /// <param name="height" type="Number">矩形高度</param>
                  /// <param name="color" type="Jyo.Color">颜色对象</param>

                  this.fillRect(x, y, width, height, color.toRgba());
              }).
              add("Jyo.Rectangle, String", function (rect, colorStr) {
                  /// <summary>绘制实心矩形</summary>
                  /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                  /// <param name="colorStr" type="String">颜色字符串值</param>

                  this.fillRect(rect.x, rect.y, rect.width, rect.height, colorStr);
              }).
              add("Number, Number, Number, Number, String", function (x, y, width, height, colorStr) {
                  /// <summary>绘制实心矩形</summary>
                  /// <param name="x" type="Number">起始X坐标</param>
                  /// <param name="y" type="Number">起始Y坐标</param>
                  /// <param name="width" type="Number">矩形宽度</param>
                  /// <param name="height" type="Number">矩形高度</param>
                  /// <param name="colorStr" type="String">颜色字符串值</param>

                  ctx = this.context;
                  ctx.fillStyle = colorStr;
                  ctx.fillRect(x, y, width, height);
              }),
    drawRect: Jyo.Overload().
              add("Jyo.Rectangle, Jyo.Color", function (rect, color) {
                  /// <summary>绘制空心矩形</summary>
                  /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                  /// <param name="color" type="Jyo.Color">颜色对象</param>

                  this.drawRect(rect.x, rect.y, rect.width, rect.height, color.toRgba(), 1);
              }).
              add("Number, Number, Number, Number, Jyo.Color", function (x, y, width, height, color) {
                  /// <summary>绘制空心矩形</summary>
                  /// <param name="x" type="Number">起始X坐标</param>
                  /// <param name="y" type="Number">起始Y坐标</param>
                  /// <param name="width" type="Number">矩形宽度</param>
                  /// <param name="height" type="Number">矩形高度</param>
                  /// <param name="color" type="Jyo.Color">颜色对象</param>

                  this.drawRect(x, y, width, height, color.toRgba(), 1);
              }).
              add("Jyo.Rectangle, String", function (rect, colorStr) {
                  /// <summary>绘制空心矩形</summary>
                  /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                  /// <param name="colorStr" type="String">颜色字符串值</param>

                  this.drawRect(rect.x, rect.y, rect.width, rect.height, colorStr, 1);
              }).
              add("Number, Number, Number, Number, String", function (x, y, width, height, colorStr) {
                  /// <summary>绘制空心矩形</summary>
                  /// <param name="x" type="Number">起始X坐标</param>
                  /// <param name="y" type="Number">起始Y坐标</param>
                  /// <param name="width" type="Number">矩形宽度</param>
                  /// <param name="height" type="Number">矩形高度</param>
                  /// <param name="colorStr" type="String">颜色字符串值</param>

                  this.drawRect(x, y, width, height, colorStr, 1);
              }).
              add("Jyo.Rectangle, Jyo.Color, Number", function (rect, color, lineWidth) {
                  /// <summary>绘制空心矩形</summary>
                  /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                  /// <param name="color" type="Jyo.Color">颜色对象</param>
                  /// <param name="lineWidth" type="Number">线条宽度</param>

                  this.drawRect(rect.x, rect.y, rect.width, rect.height, color.toRgba(), lineWidth);
              }).
              add("Number, Number, Number, Number, Jyo.Color, Number", function (x, y, width, height, color, lineWidth) {
                  /// <summary>绘制空心矩形</summary>
                  /// <param name="x" type="Number">起始X坐标</param>
                  /// <param name="y" type="Number">起始Y坐标</param>
                  /// <param name="width" type="Number">矩形宽度</param>
                  /// <param name="height" type="Number">矩形高度</param>
                  /// <param name="color" type="Jyo.Color">颜色对象</param>
                  /// <param name="lineWidth" type="Number">线条宽度</param>

                  this.drawRect(x, y, width, height, color.toRgba(), lineWidth);
              }).
              add("Jyo.Rectangle, String, Number", function (rect, colorStr, lineWidth) {
                  /// <summary>绘制空心矩形</summary>
                  /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                  /// <param name="colorStr" type="String">颜色字符串值</param>
                  /// <param name="lineWidth" type="Number">线条宽度</param>

                  this.drawRect(rect.x, rect.y, rect.width, rect.height, colorStr, lineWidth);
              }).
              add("Number, Number, Number, Number, String, Number", function (x, y, width, height, colorStr, lineWidth) {
                  /// <summary>绘制空心矩形</summary>
                  /// <param name="x" type="Number">起始X坐标</param>
                  /// <param name="y" type="Number">起始Y坐标</param>
                  /// <param name="width" type="Number">矩形宽度</param>
                  /// <param name="height" type="Number">矩形高度</param>
                  /// <param name="colorStr" type="String">颜色字符串值</param>
                  /// <param name="lineWidth" type="Number">线条宽度</param>

                  ctx = this.context;
                  ctx.lineWidth = lineWidth;
                  ctx.strokeStyle = colorStr;
                  ctx.strokeRect(x, y, width, height);

                  if (lineWidth > 1) {
                      this.drawRect(x + 1, y + 1, width - 2, height - 2, colorStr, lineWidth - 1);
                  }
              }),
    drawImage: Jyo.Overload().
               add("*, Number, Number", function (element, x, y) {
                   /// <summary>绘制图象</summary>
                   /// <param name="element" type="Object">要绘制的元素</param>
                   /// <param name="x" type="Number">起始X坐标</param>
                   /// <param name="y" type="Number">起始Y坐标</param>

                   this.context.drawImage(element.object || element, x, y);
               }).
               add("*, Jyo.Rectangle", function (element, rect) {
                   /// <summary>绘制图象</summary>
                   /// <param name="element" type="Object">要绘制的元素</param>
                   /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>

                   this.drawImage(element.object || element, rect.x, rect.y, rect.width, rect.height);
               }).
               add("*, Number, Number, Number, Number", function (element, x, y, width, height) {
                   /// <summary>绘制图象</summary>
                   /// <param name="element" type="Object">要绘制的元素</param>
                   /// <param name="x" type="Number">起始X坐标</param>
                   /// <param name="y" type="Number">起始Y坐标</param>
                   /// <param name="width" type="Number">图像宽度</param>
                   /// <param name="height" type="Number">图像高度</param>

                   this.context.drawImage(element.object || element, x, y, width, height);
               }).
               add("*, Number, Number, Number, Number, Number, Number, Number, Number", function (element, x, y, width, height, cx, cy, cwidth, cheight) {
                   /// <summary>绘制图象</summary>
                   /// <param name="element" type="Object">要绘制的元素</param>
                   /// <param name="x" type="Number">起始X坐标</param>
                   /// <param name="y" type="Number">起始Y坐标</param>
                   /// <param name="width" type="Number">图像宽度</param>
                   /// <param name="height" type="Number">图像高度</param>
                   /// <param name="cx" type="Number">在原图坐标上进行剪裁的起始X坐标</param>
                   /// <param name="cy" type="Number">在原图坐标上进行剪裁的起始Y坐标</param>
                   /// <param name="cwidth" type="Number">在原图坐标上进行剪裁的图像宽度</param>
                   /// <param name="cheight" type="Number">在原图坐标上进行剪裁的图像高度</param>

                   this.context.drawImage(element.object || element, cx, cy, cwidth, cheight, x, y, width, height);
               }),
    drawText: Jyo.Overload().
                add("String, Number, Number", function (str, x, y) {
                    /// <summary>绘制文字</summary>
                    /// <param name="str" type="String">要显示的文字</param>
                    /// <param name="x" type="Number">起始X坐标</param>
                    /// <param name="y" type="Number">起始Y坐标</param>

                    this.drawText(str, x, y, "", "");
                }).
                add("String, Number, Number, Jyo.Color", function (str, x, y, color) {
                    /// <summary>绘制文字</summary>
                    /// <param name="str" type="String">要显示的文字</param>
                    /// <param name="x" type="Number">起始X坐标</param>
                    /// <param name="y" type="Number">起始Y坐标</param>
                    /// <param name="color" type="Jyo.Color">颜色对象</param>

                    this.drawText(str, x, y, color.toRgba(), "");
                }).
                add("String, Number, Number, String", function (str, x, y, colorStr) {
                    /// <summary>绘制文字</summary>
                    /// <param name="str" type="String">要显示的文字</param>
                    /// <param name="x" type="Number">起始X坐标</param>
                    /// <param name="y" type="Number">起始Y坐标</param>
                    /// <param name="colorStr" type="String">颜色字符串值</param>

                    this.drawText(str, x, y, colorStr, "");
                }).
                add("String, Number, Number, Jyo.Color, String", function (str, x, y, color, font) {
                    /// <summary>绘制文字</summary>
                    /// <param name="str" type="String">要显示的文字</param>
                    /// <param name="x" type="Number">起始X坐标</param>
                    /// <param name="y" type="Number">起始Y坐标</param>
                    /// <param name="color" type="Jyo.Color">颜色对象</param>
                    /// <param name="font" type="String">字体字符串值</param>

                    this.drawText(str, x, y, color.toRgba(), font);
                }).
                add("String, Number, Number, String, String", function (str, x, y, colorStr, font) {
                    /// <summary>绘制文字</summary>
                    /// <param name="str" type="String">要显示的文字</param>
                    /// <param name="x" type="Number">起始X坐标</param>
                    /// <param name="y" type="Number">起始Y坐标</param>
                    /// <param name="colorStr" type="String">颜色字符串值</param>
                    /// <param name="font" type="String">字体字符串值</param>

                    var ctx = this.context;

                    ctx.fillStyle = colorStr || "#000000";
                    ctx.font = font || "14px Arial";

                    var fs = this.getTextSize(str, ctx.font);
                    var strList = str.split(/\r\n|\n|\r/ig);
                    for (var i = 0; i < strList.length; i++) {
                        ctx.fillText(strList[i], x, y + fs.height * (i + 0.8));
                    }
                }),
    drawLine: Jyo.Overload().
              add("Number, Number, Number, Number", function (x1, y1, x2, y2) {
                  /// <summary>绘制线段</summary>
                  /// <param name="x1" type="Number">起始X坐标</param>
                  /// <param name="y1" type="Number">起始Y坐标</param>
                  /// <param name="x2" type="Number">结束X坐标</param>
                  /// <param name="y2" type="Number">结束Y坐标</param>

                  this.drawLine(x1, y1, x2, y2, "", 1, "");
              }).
              add("Number, Number, Number, Number, Jyo.Color", function (x1, y1, x2, y2, color) {
                  /// <summary>绘制线段</summary>
                  /// <param name="x1" type="Number">起始X坐标</param>
                  /// <param name="y1" type="Number">起始Y坐标</param>
                  /// <param name="x2" type="Number">结束X坐标</param>
                  /// <param name="y2" type="Number">结束Y坐标</param>
                  /// <param name="color" type="Jyo.Color">颜色对象</param>

                  this.drawLine(x1, y1, x2, y2, color.toRgba(), 1, "");
              }).
              add("Number, Number, Number, Number, String", function (x1, y1, x2, y2, colorStr) {
                  /// <summary>绘制线段</summary>
                  /// <param name="x1" type="Number">起始X坐标</param>
                  /// <param name="y1" type="Number">起始Y坐标</param>
                  /// <param name="x2" type="Number">结束X坐标</param>
                  /// <param name="y2" type="Number">结束Y坐标</param>
                  /// <param name="colorStr" type="String">颜色字符串值</param>

                  this.drawLine(x1, y1, x2, y2, colorStr, 1, "");
              }).
              add("Number, Number, Number, Number, Jyo.Color, Number", function (x1, y1, x2, y2, color, lineWidth) {
                  /// <summary>绘制线段</summary>
                  /// <param name="x1" type="Number">起始X坐标</param>
                  /// <param name="y1" type="Number">起始Y坐标</param>
                  /// <param name="x2" type="Number">结束X坐标</param>
                  /// <param name="y2" type="Number">结束Y坐标</param>
                  /// <param name="color" type="Jyo.Color">颜色对象</param>
                  /// <param name="lineWidth" type="Number">线条宽度</param>

                  this.drawLine(x1, y1, x2, y2, color.toRgba(), lineWidth, "");
              }).
              add("Number, Number, Number, Number, String, Number", function (x1, y1, x2, y2, colorStr, lineWidth) {
                  /// <summary>绘制线段</summary>
                  /// <param name="x1" type="Number">起始X坐标</param>
                  /// <param name="y1" type="Number">起始Y坐标</param>
                  /// <param name="x2" type="Number">结束X坐标</param>
                  /// <param name="y2" type="Number">结束Y坐标</param>
                  /// <param name="colorStr" type="String">颜色字符串值</param>
                  /// <param name="lineWidth" type="Number">线条宽度</param>

                  this.drawLine(x1, y1, x2, y2, colorStr, lineWidth, "");
              }).
              add("Number, Number, Number, Number, Jyo.Color, Number, String", function (x1, y1, x2, y2, color, lineWidth, cap) {
                  /// <summary>绘制线段</summary>
                  /// <param name="x1" type="Number">起始X坐标</param>
                  /// <param name="y1" type="Number">起始Y坐标</param>
                  /// <param name="x2" type="Number">结束X坐标</param>
                  /// <param name="y2" type="Number">结束Y坐标</param>
                  /// <param name="color" type="Jyo.Color">颜色对象</param>
                  /// <param name="lineWidth" type="Number">线条宽度</param>
                  /// <param name="cap" type="String">闭合样式</param>

                  this.drawLine(x1, y1, x2, y2, color.toRgba(), lineWidth, cap);
              }).
              add("Number, Number, Number, Number, String, Number, String", function (x1, y1, x2, y2, colorStr, lineWidth, cap) {
                  /// <summary>绘制线段</summary>
                  /// <param name="x1" type="Number">起始X坐标</param>
                  /// <param name="y1" type="Number">起始Y坐标</param>
                  /// <param name="x2" type="Number">结束X坐标</param>
                  /// <param name="y2" type="Number">结束Y坐标</param>
                  /// <param name="colorStr" type="String">颜色字符串值</param>
                  /// <param name="lineWidth" type="Number">线条宽度</param>
                  /// <param name="cap" type="String">闭合样式</param>

                  var ctx = this.context;

                  ctx.strokeStyle = colorStr || "#000000";
                  ctx.lineWidth = lineWidth || 1.0;
                  ctx.lineCap = cap || "butt";

                  ctx.beginPath();
                  ctx.moveTo(x1, y1);
                  ctx.lineTo(x2, y2);
                  ctx.closePath();
                  ctx.stroke();
              }),
    drawPolygon: Jyo.Overload().
                 add("Array", function (list) {
                     /// <summary>绘制空心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>

                     this.drawPolygon(list, "", 1, "");
                 }).
                 add("Array, Jyo.Color", function (list, color) {
                     /// <summary>绘制空心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>
                     /// <param name="color" type="Jyo.Color">颜色对象</param>

                     this.drawPolygon(list, color.toRgba(), 1, "");
                 }).
                 add("Array, String", function (list, colorStr) {
                     /// <summary>绘制空心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>
                     /// <param name="colorStr" type="String">颜色字符串值</param>

                     this.drawPolygon(list, colorStr, 1, "");
                 }).
                 add("Array, Jyo.Color, Number", function (list, color, lineWidth) {
                     /// <summary>绘制空心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>
                     /// <param name="color" type="Jyo.Color">颜色对象</param>
                     /// <param name="lineWidth" type="Number">线条宽度</param>

                     this.drawPolygon(list, color.toRgba(), lineWidth, "");
                 }).
                 add("Array, String, Number", function (list, colorStr, lineWidth) {
                     /// <summary>绘制空心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>
                     /// <param name="colorStr" type="String">颜色字符串值</param>
                     /// <param name="lineWidth" type="Number">线条宽度</param>

                     this.drawPolygon(list, colorStr, lineWidth, "");
                 }).
                 add("Array, Jyo.Color, Number, String", function (list, color, lineWidth, lineJoin) {
                     /// <summary>绘制空心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>
                     /// <param name="color" type="Jyo.Color">颜色对象</param>
                     /// <param name="lineWidth" type="Number">线条宽度</param>
                     /// <param name="lineJoin" type="String">线条闭合样式</param>

                     this.drawPolygon(list, color.toRgba(), lineWidth, lineJoin);
                 }).
                 add("Array, String, Number, String", function (list, colorStr, lineWidth, lineJoin) {
                     /// <summary>绘制空心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>
                     /// <param name="colorStr" type="String">颜色字符串值</param>
                     /// <param name="lineWidth" type="Number">线条宽度</param>
                     /// <param name="lineJoin" type="String">线条闭合样式</param>

                     var ctx = this.context;

                     ctx.strokeStyle = colorStr || "#000000";
                     ctx.lineWidth = lineWidth || 1.0;
                     ctx.lineJoin = lineJoin || "miter";

                     ctx.moveTo(list[0].x, list[0].y);
                     for (var i = list.length; i-- > 0; ctx.lineTo(list[i].x, list[i].y));
                     ctx.closePath();
                     ctx.stroke()
                 }),
    fillPolygon: Jyo.Overload().
                 add("Array", function (list) {
                     /// <summary>绘制实心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>

                     this.drawPolygon(list, "");
                 }).
                 add("Array, Jyo.Color", function (list, color) {
                     /// <summary>绘制实心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>
                     /// <param name="color" type="Jyo.Color">颜色对象</param>

                     this.drawPolygon(list, color.toRgba());
                 }).
                 add("Array, String", function (list, colorStr) {
                     /// <summary>绘制实心多边形</summary>
                     /// <param name="list" type="Array">顶点列表</param>
                     /// <param name="colorStr" type="String">颜色字符串值</param>

                     var ctx = this.context;

                     ctx.fillStyle = colorStr || "#000000";

                     ctx.moveTo(list[0].x, list[0].y);
                     for (var i = list.length; i-- > 0; ctx.lineTo(list[i].x, list[i].y));
                     ctx.closePath();
                     ctx.fill()
                 })
});

(function (Math, undefined) {
    if (!Jyo.Renderer.WebGL.isSupport()) return;

    var M_PI = 3.1415926535897932384626433832795028841968;
    var M_TWO_PI = 2.0 * M_PI;
    var M_HALF_PI = M_PI / 2.0;

    function isPOT(value) {
        return value > 0 && ((value - 1) & value) === 0;
    }

    var vec3 = {
        length: function (pt) {
            return Math.sqrt(pt[0] * pt[0] + pt[1] * pt[1] + pt[2] * pt[2]);
        },

        normalize: function (pt) {
            var d = Math.sqrt((pt[0] * pt[0]) + (pt[1] * pt[1]) + (pt[2] * pt[2]));
            if (d === 0) {
                return [0, 0, 0];
            }
            return [pt[0] / d, pt[1] / d, pt[2] / d];
        },

        dot: function (v1, v2) {
            return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
        },

        angle: function (v1, v2) {
            return Math.acos((v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]) / (Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2]) * Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2])));
        },

        cross: function (vectA, vectB) {
            return [vectA[1] * vectB[2] - vectB[1] * vectA[2], vectA[2] * vectB[0] - vectB[2] * vectA[0], vectA[0] * vectB[1] - vectB[0] * vectA[1]];
        },

        multiply: function (vectA, constB) {
            return [vectA[0] * constB, vectA[1] * constB, vectA[2] * constB];
        },

        add: function (vectA, vectB) {
            return [vectA[0] + vectB[0], vectA[1] + vectB[1], vectA[2] + vectB[2]];
        },

        subtract: function (vectA, vectB) {
            return [vectA[0] - vectB[0], vectA[1] - vectB[1], vectA[2] - vectB[2]];
        },

        equal: function (a, b) {
            var epsilon = 0.0000001;
            if ((a === undefined) && (b === undefined)) {
                return true;
            }
            if ((a === undefined) || (b === undefined)) {
                return false;
            }
            return (Math.abs(a[0] - b[0]) < epsilon && Math.abs(a[1] - b[1]) < epsilon && Math.abs(a[2] - b[2]) < epsilon);
        }
    };

    var mat3 = {
        identity: [1.0, 0.0, 0.0,
                   0.0, 1.0, 0.0,
                   0.0, 0.0, 1.0],

        multiply: function (m1, m2) {
            var m10 = m1[0], m11 = m1[1], m12 = m1[2], m13 = m1[3], m14 = m1[4], m15 = m1[5], m16 = m1[6], m17 = m1[7], m18 = m1[8],
                m20 = m2[0], m21 = m2[1], m22 = m2[2], m23 = m2[3], m24 = m2[4], m25 = m2[5], m26 = m2[6], m27 = m2[7], m28 = m2[8];

            m2[0] = m20 * m10 + m23 * m11 + m26 * m12;
            m2[1] = m21 * m10 + m24 * m11 + m27 * m12;
            m2[2] = m22 * m10 + m25 * m11 + m28 * m12;
            m2[3] = m20 * m13 + m23 * m14 + m26 * m15;
            m2[4] = m21 * m13 + m24 * m14 + m27 * m15;
            m2[5] = m22 * m13 + m25 * m14 + m28 * m15;
            m2[6] = m20 * m16 + m23 * m17 + m26 * m18;
            m2[7] = m21 * m16 + m24 * m17 + m27 * m18;
            m2[8] = m22 * m16 + m25 * m17 + m28 * m18;
        },

        vec2_multiply: function (m1, m2) {
            var mOut = [];
            mOut[0] = m2[0] * m1[0] + m2[3] * m1[1] + m2[6];
            mOut[1] = m2[1] * m1[0] + m2[4] * m1[1] + m2[7];
            return mOut;
        },

        transpose: function (m) {
            return [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];
        }
    }; //mat3

    function Transform(mat) {
        return this.clearStack(mat);
    }

    var STACK_DEPTH_LIMIT = 16;

    Transform.prototype.clearStack = function (init_mat) {
        this.m_stack = [];
        this.m_cache = [];
        this.c_stack = 0;
        this.valid = 0;
        this.result = null;

        for (var i = 0; i < STACK_DEPTH_LIMIT; i++) {
            this.m_stack[i] = this.getIdentity();
        }

        if (init_mat !== undefined) {
            this.m_stack[0] = init_mat;
        } else {
            this.setIdentity();
        }
    }; //clearStack

    Transform.prototype.setIdentity = function () {
        this.m_stack[this.c_stack] = this.getIdentity();
        if (this.valid === this.c_stack && this.c_stack) {
            this.valid--;
        }
    };

    Transform.prototype.getIdentity = function () {
        return [1.0, 0.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 0.0, 1.0];
    };

    Transform.prototype.getResult = function () {
        if (!this.c_stack) {
            return this.m_stack[0];
        }

        var m = mat3.identity;

        if (this.valid > this.c_stack - 1) { this.valid = this.c_stack - 1; }

        for (var i = this.valid; i < this.c_stack + 1; i++) {
            m = mat3.multiply(this.m_stack[i], m);
            this.m_cache[i] = m;
        }

        this.valid = this.c_stack - 1;

        this.result = this.m_cache[this.c_stack];

        return this.result;
    };

    Transform.prototype.pushMatrix = function () {
        this.c_stack++;
        this.m_stack[this.c_stack] = this.getIdentity();
    };

    Transform.prototype.popMatrix = function () {
        if (this.c_stack === 0) { return; }
        this.c_stack--;
    };

    var translateMatrix = Transform.prototype.getIdentity();

    Transform.prototype.translate = function (x, y) {
        translateMatrix[6] = x;
        translateMatrix[7] = y;

        mat3.multiply(translateMatrix, this.m_stack[this.c_stack]);

        /*
        if (this.valid === this.c_stack && this.c_stack) {
          this.valid--;
        }
        */
    };

    var scaleMatrix = Transform.prototype.getIdentity();

    Transform.prototype.scale = function (x, y) {
        scaleMatrix[0] = x;
        scaleMatrix[4] = y;

        mat3.multiply(scaleMatrix, this.m_stack[this.c_stack]);

        /*
        if (this.valid === this.c_stack && this.c_stack) {
          this.valid--;
        }
        */
    };

    var rotateMatrix = Transform.prototype.getIdentity();

    Transform.prototype.rotate = function (ang) {
        var sAng, cAng;

        sAng = Math.sin(-ang);
        cAng = Math.cos(-ang);

        rotateMatrix[0] = cAng;
        rotateMatrix[3] = sAng;
        rotateMatrix[1] = -sAng;
        rotateMatrix[4] = cAng;

        mat3.multiply(rotateMatrix, this.m_stack[this.c_stack]);

        /*
        if (this.valid === this.c_stack && this.c_stack) {
          this.valid--;
        }
        */
    };

    var WebGL2D = function WebGL2D(gl) {
        /// <summary>启用WebGL2D支持</summary>
        /// <param name="gl" type="WebGLRenderingContext">WebGL上下文对象</param>

        if (!(this instanceof WebGL2D)) {
            return new WebGL2D(gl);
        }

        this.canvas = gl.canvas;
        this.gl = gl;
        this.fs = undefined;
        this.vs = undefined;
        this.shaderProgram = undefined;
        this.transform = new Transform();
        this.shaderPool = [];
        this.maxTextureSize = undefined;

        this.initShaders();
        this.initBuffers();

        // Append Canvas2D API features to the WebGL context
        this.initCanvas2DAPI();

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        // 默认蓝色背景
        //gl.clearColor(99 / 255, 149 / 255, 236 / 255, 1);
        gl.clear(gl.COLOR_BUFFER_BIT); // | gl.DEPTH_BUFFER_BIT);

        // Depth options
        //gl.enable(gl.DEPTH_TEST);
        //gl.depthFunc(gl.LEQUAL);

        // Blending options
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

        this.postInit();
    };

    // Shader Pool BitMasks, i.e. sMask = (shaderMask.texture+shaderMask.stroke)
    var shaderMask = {
        texture: 1,
        crop: 2,
        path: 4
    };

    // Fragment shader source
    WebGL2D.prototype.getFragmentShaderSource = function getFragmentShaderSource(sMask) {
        var fsSource = [
          "#ifdef GL_ES",
            "precision highp float;",
          "#endif",

          "#define hasTexture " + ((sMask & shaderMask.texture) ? "1" : "0"),
          "#define hasCrop " + ((sMask & shaderMask.crop) ? "1" : "0"),

          "varying vec4 vColor;",

          "#if hasTexture",
            "varying vec2 vTextureCoord;",
            "uniform sampler2D uSampler;",
            "#if hasCrop",
              "uniform vec4 uCropSource;",
            "#endif",
          "#endif",

          "void main(void) {",
            "#if hasTexture",
              "#if hasCrop",
                "gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x * uCropSource.z, vTextureCoord.y * uCropSource.w) + uCropSource.xy);",
              "#else",
                "gl_FragColor = texture2D(uSampler, vTextureCoord);",
              "#endif",
            "#else",
              "gl_FragColor = vColor;",
            "#endif",
          "}"
        ].join("\n");

        return fsSource;
    };

    WebGL2D.prototype.getVertexShaderSource = function getVertexShaderSource(stackDepth, sMask) {
        var w = 2 / this.canvas.width, h = -2 / this.canvas.height;

        stackDepth = stackDepth || 1;

        var vsSource = [
          "#define hasTexture " + ((sMask & shaderMask.texture) ? "1" : "0"),
          "attribute vec4 aVertexPosition;",

          "#if hasTexture",
          "varying vec2 vTextureCoord;",
          "#endif",

          "uniform vec4 uColor;",
          "uniform mat3 uTransforms[" + stackDepth + "];",

          "varying vec4 vColor;",

          "const mat4 pMatrix = mat4(" + w + ",0,0,0, 0," + h + ",0,0, 0,0,1.0,1.0, -1.0,1.0,0,0);",

          "mat3 crunchStack(void) {",
            "mat3 result = uTransforms[0];",
            "for (int i = 1; i < " + stackDepth + "; ++i) {",
              "result = uTransforms[i] * result;",
            "}",
            "return result;",
          "}",

          "void main(void) {",
            "vec3 position = crunchStack() * vec3(aVertexPosition.x, aVertexPosition.y, 1.0);",
            "gl_Position = pMatrix * vec4(position, 1.0);",
            "vColor = uColor;",
            "#if hasTexture",
              "vTextureCoord = aVertexPosition.zw;",
            "#endif",
          "}"
        ].join("\n");
        return vsSource;
    };

    // Initialize fragment and vertex shaders
    WebGL2D.prototype.initShaders = function initShaders(transformStackDepth, sMask) {
        var gl = this.gl;

        transformStackDepth = transformStackDepth || 1;
        sMask = sMask || 0;
        var storedShader = this.shaderPool[transformStackDepth];

        if (!storedShader) { storedShader = this.shaderPool[transformStackDepth] = []; }
        storedShader = storedShader[sMask];

        if (storedShader) {
            gl.useProgram(storedShader);
            this.shaderProgram = storedShader;
            return storedShader;
        } else {
            var fs = this.fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(this.fs, this.getFragmentShaderSource(sMask));
            gl.compileShader(this.fs);

            if (!gl.getShaderParameter(this.fs, gl.COMPILE_STATUS)) {
                throw "fragment shader error: " + gl.getShaderInfoLog(this.fs);
            }

            var vs = this.vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(this.vs, this.getVertexShaderSource(transformStackDepth, sMask));
            gl.compileShader(this.vs);

            if (!gl.getShaderParameter(this.vs, gl.COMPILE_STATUS)) {
                throw "vertex shader error: " + gl.getShaderInfoLog(this.vs);
            }


            var shaderProgram = this.shaderProgram = gl.createProgram();
            shaderProgram.stackDepth = transformStackDepth;
            gl.attachShader(shaderProgram, fs);
            gl.attachShader(shaderProgram, vs);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw "Could not initialise shaders.";
            }

            gl.useProgram(shaderProgram);

            shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
            gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

            shaderProgram.uColor = gl.getUniformLocation(shaderProgram, 'uColor');
            shaderProgram.uSampler = gl.getUniformLocation(shaderProgram, 'uSampler');
            shaderProgram.uCropSource = gl.getUniformLocation(shaderProgram, 'uCropSource');

            shaderProgram.uTransforms = [];
            for (var i = 0; i < transformStackDepth; ++i) {
                shaderProgram.uTransforms[i] = gl.getUniformLocation(shaderProgram, 'uTransforms[' + i + ']');
            } //for
            this.shaderPool[transformStackDepth][sMask] = shaderProgram;
            return shaderProgram;
        } //if
    };

    var rectVertexPositionBuffer;
    var rectVertexColorBuffer;

    var pathVertexPositionBuffer;
    var pathVertexColorBuffer;

    // 2D Vertices and Texture UV coords
    var rectVerts = new Float32Array([
        0, 0, 0, 0,
        0, 1, 0, 1,
        1, 1, 1, 1,
        1, 0, 1, 0
    ]);

    WebGL2D.prototype.initBuffers = function initBuffers() {
        var gl = this.gl;

        rectVertexPositionBuffer = gl.createBuffer();
        rectVertexColorBuffer = gl.createBuffer();

        pathVertexPositionBuffer = gl.createBuffer();
        pathVertexColorBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, rectVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rectVerts, gl.STATIC_DRAW);
    };

    // Maintains an array of all WebGL2D instances
    WebGL2D.instances = [];

    WebGL2D.prototype.postInit = function () {
        WebGL2D.instances.push(this);
    };

    // Extends gl context with Canvas2D API
    WebGL2D.prototype.initCanvas2DAPI = function initCanvas2DAPI() {
        var gl2d = this,
            gl = this.gl;

        var textCanvas = document.createElement("canvas");
        textCanvas.width = gl.canvas.width;
        textCanvas.height = gl.canvas.height;
        textCanvas.noCatch = true;
        var textCtx = textCanvas.getContext("2d");

        var reRGBAColor = /^rgb(a)?\(\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,\s*(-?[\d]+)(%)?\s*,?\s*(-?[\d\.]+)?\s*\)$/;
        var reHSLAColor = /^hsl(a)?\(\s*(-?[\d\.]+)\s*,\s*(-?[\d\.]+)%\s*,\s*(-?[\d\.]+)%\s*,?\s*(-?[\d\.]+)?\s*\)$/;
        var reHex6Color = /^#([0-9A-Fa-f]{6})$/;
        var reHex3Color = /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/;

        function HSLAToRGBA(h, s, l, a) {
            var r, g, b, m1, m2;

            // Clamp and Normalize values
            h = (((h % 360) + 360) % 360) / 360;
            s = s > 100 ? 1 : s / 100;
            s = s < 0 ? 0 : s;
            l = l > 100 ? 1 : l / 100;
            l = l < 0 ? 0 : l;

            m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
            m1 = l * 2 - m2;

            function getHue(value) {
                var hue;

                if (value * 6 < 1) {
                    hue = m1 + (m2 - m1) * value * 6;
                } else if (value * 2 < 1) {
                    hue = m2;
                } else if (value * 3 < 2) {
                    hue = m1 + (m2 - m1) * (2 / 3 - value) * 6;
                } else {
                    hue = m1;
                }

                return hue;
            }

            r = getHue(h + 1 / 3);
            g = getHue(h);
            b = getHue(h - 1 / 3);

            return [r, g, b, a];
        }

        // Converts rgb(a) color string to gl color vector
        function colorStringToVec4(value) {
            var result = [], match, channel, isPercent, hasAlpha, alphaChannel, sameType;

            if ((match = reRGBAColor.exec(value))) {
                hasAlpha = match[1], alphaChannel = parseFloat(match[8]);

                if ((hasAlpha && isNaN(alphaChannel)) || (!hasAlpha && !isNaN(alphaChannel))) {
                    return false;
                }

                sameType = match[3];

                for (var i = 2; i < 8; i += 2) {
                    channel = match[i], isPercent = match[i + 1];

                    if (isPercent !== sameType) {
                        return false;
                    }

                    // Clamp and normalize values
                    if (isPercent) {
                        channel = channel > 100 ? 1 : channel / 100;
                        channel = channel < 0 ? 0 : channel;
                    } else {
                        channel = channel > 255 ? 1 : channel / 255;
                        channel = channel < 0 ? 0 : channel;
                    }

                    result.push(channel);
                }

                result.push(hasAlpha ? alphaChannel : 1.0);
            } else if ((match = reHSLAColor.exec(value))) {
                hasAlpha = match[1], alphaChannel = parseFloat(match[5]);
                result = HSLAToRGBA(match[2], match[3], match[4], parseFloat(hasAlpha && alphaChannel ? alphaChannel : 1.0));
            } else if ((match = reHex6Color.exec(value))) {
                var colorInt = parseInt(match[1], 16);
                result = [((colorInt & 0xFF0000) >> 16) / 255, ((colorInt & 0x00FF00) >> 8) / 255, (colorInt & 0x0000FF) / 255, 1.0];
            } else if ((match = reHex3Color.exec(value))) {
                var hexString = "#" + [match[1], match[1], match[2], match[2], match[3], match[3]].join("");
                result = colorStringToVec4(hexString);
            } else if (value.toLowerCase() in colorKeywords) {
                result = colorStringToVec4(colorKeywords[value.toLowerCase()]);
            } else if (value.toLowerCase() === "transparent") {
                result = [0, 0, 0, 0];
            } else {
                // Color keywords not yet implemented, ie "orange", return hot pink
                return false;
            }

            return result;
        }

        function colorVecToString(vec4) {
            return "rgba(" + (vec4[0] * 255) + ", " + (vec4[1] * 255) + ", " + (vec4[2] * 255) + ", " + parseFloat(vec4[3]) + ")";
        }

        var colorKeywords = Jyo.Color.colorMap;

        // Maintain drawing state params during gl.save and gl.restore. see saveDrawState() and restoreDrawState()
        var drawState = {}, drawStateStack = [];

        // A fast simple shallow clone
        function cloneObject(obj) {
            var target = {};
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    target[i] = obj[i];
                }
            }
            return target;
        }

        function saveDrawState() {
            var bakedDrawState = {
                fillStyle: [drawState.fillStyle[0], drawState.fillStyle[1], drawState.fillStyle[2], drawState.fillStyle[3]],
                strokeStyle: [drawState.strokeStyle[0], drawState.strokeStyle[1], drawState.strokeStyle[2], drawState.strokeStyle[3]],
                globalAlpha: drawState.globalAlpha,
                globalCompositeOperation: drawState.globalCompositeOperation,
                lineCap: drawState.lineCap,
                lineJoin: drawState.lineJoin,
                lineWidth: drawState.lineWidth,
                miterLimit: drawState.miterLimit,
                shadowColor: drawState.shadowColor,
                shadowBlur: drawState.shadowBlur,
                shadowOffsetX: drawState.shadowOffsetX,
                shadowOffsetY: drawState.shadowOffsetY,
                textAlign: drawState.textAlign,
                font: drawState.font,
                textBaseline: drawState.textBaseline
            };

            drawStateStack.push(bakedDrawState);
        }

        function restoreDrawState() {
            if (drawStateStack.length) {
                drawState = drawStateStack.pop();
            }
        }

        // WebGL requires colors as a vector while Canvas2D sets colors as an rgba string
        // These getters and setters store the original rgba string as well as convert to a vector
        drawState.fillStyle = [0, 0, 0, 1]; // default black

        Object.defineProperty(gl, "fillStyle", {
            get: function () { return colorVecToString(drawState.fillStyle); },
            set: function (value) {
                drawState.fillStyle = colorStringToVec4(value) || drawState.fillStyle;
                textCtx.fillStyle = value;
            }
        });

        drawState.strokeStyle = [0, 0, 0, 1]; // default black

        Object.defineProperty(gl, "strokeStyle", {
            get: function () { return colorVecToString(drawState.strokeStyle); },
            set: function (value) {
                drawState.strokeStyle = colorStringToVec4(value) || drawStyle.strokeStyle;
                textCtx.strokeStyle = value;
            }
        });

        // WebGL already has a lineWidth() function but Canvas2D requires a lineWidth property
        // Store the original lineWidth() function for later use
        gl.$lineWidth = gl.lineWidth;
        drawState.lineWidth = 1.0;

        Object.defineProperty(gl, "lineWidth", {
            get: function () { return drawState.lineWidth; },
            set: function (value) {
                gl.$lineWidth(value);
                drawState.lineWidth = value;
            }
        });

        // Currently unsupported attributes and their default values
        drawState.lineCap = "butt";

        Object.defineProperty(gl, "lineCap", {
            get: function () { return drawState.lineCap; },
            set: function (value) {
                drawState.lineCap = value;
            }
        });

        drawState.lineJoin = "miter";

        Object.defineProperty(gl, "lineJoin", {
            get: function () { return drawState.lineJoin; },
            set: function (value) {
                drawState.lineJoin = value;
            }
        });

        drawState.miterLimit = 10;

        Object.defineProperty(gl, "miterLimit", {
            get: function () { return drawState.miterLimit; },
            set: function (value) {
                drawState.miterLimit = value;
            }
        });

        drawState.shadowOffsetX = 0;

        Object.defineProperty(gl, "shadowOffsetX", {
            get: function () { return drawState.shadowOffsetX; },
            set: function (value) {
                drawState.shadowOffsetX = value;
                textCtx.shadowOffsetX = value;
            }
        });

        drawState.shadowOffsetY = 0;

        Object.defineProperty(gl, "shadowOffsetY", {
            get: function () { return drawState.shadowOffsetY; },
            set: function (value) {
                drawState.shadowOffsetY = value;
                textCtx.shadowOffsetY = value;
            }
        });

        drawState.shadowBlur = 0;

        Object.defineProperty(gl, "shadowBlur", {
            get: function () { return drawState.shadowBlur; },
            set: function (value) {
                drawState.shadowBlur = value;
                textCtx.shadowBlur = value;
            }
        });

        drawState.shadowColor = "rgba(0, 0, 0, 0.0)";

        Object.defineProperty(gl, "shadowColor", {
            get: function () { return drawState.shadowColor; },
            set: function (value) {
                drawState.shadowColor = value;
                textCtx.shadowColor = value;
            }
        });

        drawState.font = "10px sans-serif";

        Object.defineProperty(gl, "font", {
            get: function () { return drawState.font; },
            set: function (value) {
                drawState.font = value;
                textCtx.font = value;
            }
        });

        drawState.textAlign = "start";

        Object.defineProperty(gl, "textAlign", {
            get: function () { return drawState.textAlign; },
            set: function (value) {
                drawState.textAlign = value;
                textCtx.textAlign = value;
            }
        });

        drawState.textBaseline = "alphabetic";

        Object.defineProperty(gl, "textBaseline", {
            get: function () { return drawState.textBaseline; },
            set: function (value) {
                drawState.textBaseline = value;
                textCtx.textBaseline = value;
            }
        });

        // This attribute will need to control global alpha of objects drawn.
        drawState.globalAlpha = 1.0;

        Object.defineProperty(gl, "globalAlpha", {
            get: function () { return drawState.globalAlpha; },
            set: function (value) {
                drawState.globalAlpha = value;
                textCtx.globalAlpha = value;
            }
        });

        // This attribute will need to set the gl.blendFunc mode
        drawState.globalCompositeOperation = "source-over";

        Object.defineProperty(gl, "globalCompositeOperation", {
            get: function () { return drawState.globalCompositeOperation; },
            set: function (value) {
                drawState.globalCompositeOperation = value;
            }
        });

        var tempCanvas = document.createElement('canvas');
        var tempCtx = tempCanvas.getContext('2d');

        gl.save = function save() {
            gl2d.transform.pushMatrix();
            saveDrawState();
        };

        gl.restore = function restore() {
            gl2d.transform.popMatrix();
            restoreDrawState();
        };

        gl.translate = function translate(x, y) {
            gl2d.transform.translate(x, y);
        };

        gl.rotate = function rotate(a) {
            gl2d.transform.rotate(a);
        };

        gl.scale = function scale(x, y) {
            gl2d.transform.scale(x, y);
        };

        gl.createImageData = function createImageData(width, height) {
            return tempCtx.createImageData(width, height);
        };

        gl.getImageData = function getImageData(x, y, width, height) {
            var data = tempCtx.createImageData(width, height);
            var buffer = new Uint8Array(width * height * 4);
            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
            var w = width * 4, h = height;
            for (var i = 0, maxI = h / 2; i < maxI; ++i) {
                for (var j = 0, maxJ = w; j < maxJ; ++j) {
                    var index1 = i * w + j;
                    var index2 = (h - i - 1) * w + j;
                    data.data[index1] = buffer[index2];
                    data.data[index2] = buffer[index1];
                } //for
            } //for

            return data;
        };

        gl.putImageData = function putImageData(imageData, x, y) {
            gl.drawImage(imageData, x, y);
        };

        gl.transform = function transform(m11, m12, m21, m22, dx, dy) {
            var m = gl2d.transform.m_stack[gl2d.transform.c_stack];

            m[0] *= m11;
            m[1] *= m21;
            m[2] *= dx;
            m[3] *= m12;
            m[4] *= m22;
            m[5] *= dy;
            m[6] = 0;
            m[7] = 0;
        };

        function sendTransformStack(sp) {
            var stack = gl2d.transform.m_stack;
            for (var i = 0, maxI = gl2d.transform.c_stack + 1; i < maxI; ++i) {
                gl.uniformMatrix3fv(sp.uTransforms[i], false, stack[maxI - 1 - i]);
            } //for
        }

        gl.setTransform = function setTransform(m11, m12, m21, m22, dx, dy) {
            gl2d.transform.setIdentity();
            gl.transform.apply(this, arguments);
        };

        gl.fillRect = function fillRect(x, y, width, height) {
            var transform = gl2d.transform;
            var shaderProgram = gl2d.initShaders(transform.c_stack + 2, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, rectVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);

            transform.pushMatrix();

            transform.translate(x, y);
            transform.scale(width, height);

            sendTransformStack(shaderProgram);

            gl.uniform4f(shaderProgram.uColor, drawState.fillStyle[0], drawState.fillStyle[1], drawState.fillStyle[2], drawState.fillStyle[3]);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

            transform.popMatrix();
        };

        gl.strokeRect = function strokeRect(x, y, width, height) {
            var transform = gl2d.transform;
            var shaderProgram = gl2d.initShaders(transform.c_stack + 2, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, rectVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);

            transform.pushMatrix();

            transform.translate(x, y);
            transform.scale(width, height);

            sendTransformStack(shaderProgram);

            gl.uniform4f(shaderProgram.uColor, drawState.strokeStyle[0], drawState.strokeStyle[1], drawState.strokeStyle[2], drawState.strokeStyle[3]);

            gl.drawArrays(gl.LINE_LOOP, 0, 4);

            transform.popMatrix();
        };

        gl.clearRect = function clearRect(x, y, width, height) { };

        gl.fillText = function (text, x, y, fontSize) {
            textCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            textCtx.fillText(text, x, y);

            this.drawImage(textCanvas, 0, 0);
        };

        gl.strokeText = function (text, x, y, fontHeight) {
            // 暂不支持strokeText
        };

        gl.measureText = function (text) {
            // 暂不支持measureText
        };

        gl.quadraticCurveTo = function (cp1x, cp1y, x, y) {
            // 暂不支持quadraticCurveTo
        };

        gl.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            // 暂不支持bezierCurveTo
        };

        gl.arcTo = function (x1, y1, x2, y2, radius) {
            // 暂不支持arcTo
        };

        gl.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            // 暂不支持arc
        };

        gl.clip = function clip() {
            // 暂不支持clip
        };

        var subPaths = [];

        function SubPath(x, y) {
            this.closed = false;
            this.verts = [x, y, 0, 0];
        }

        // Empty the list of subpaths so that the context once again has zero subpaths
        gl.beginPath = function beginPath() {
            subPaths.length = 0;
        };

        // Mark last subpath as closed and create a new subpath with the same starting point as the previous subpath
        gl.closePath = function closePath() {
            if (subPaths.length) {
                // Mark last subpath closed.
                var prevPath = subPaths[subPaths.length - 1], startX = prevPath.verts[0], startY = prevPath.verts[1];
                prevPath.closed = true;

                // Create new subpath using the starting position of previous subpath
                var newPath = new SubPath(startX, startY);
                subPaths.push(newPath);
            }
        };

        // Create a new subpath with the specified point as its first (and only) point
        gl.moveTo = function moveTo(x, y) {
            subPaths.push(new SubPath(x, y));
        };

        gl.lineTo = function lineTo(x, y) {
            if (subPaths.length) {
                subPaths[subPaths.length - 1].verts.push(x, y, 0, 0);
            } else {
                // Create a new subpath if none currently exist
                gl.moveTo(x, y);
            }
        };

        // Adds a closed rect subpath and creates a new subpath
        gl.rect = function rect(x, y, w, h) {
            gl.moveTo(x, y);
            gl.lineTo(x + w, y);
            gl.lineTo(x + w, y + h);
            gl.lineTo(x, y + h);
            gl.closePath();
        };

        function fillSubPath(index) {
            var transform = gl2d.transform;
            var shaderProgram = gl2d.initShaders(transform.c_stack + 2, 0);

            var subPath = subPaths[index];
            var verts = subPath.verts;

            gl.bindBuffer(gl.ARRAY_BUFFER, pathVertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);

            transform.pushMatrix();

            sendTransformStack(shaderProgram);

            gl.uniform4f(shaderProgram.uColor, drawState.fillStyle[0], drawState.fillStyle[1], drawState.fillStyle[2], drawState.fillStyle[3]);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, verts.length / 4);

            transform.popMatrix();
        }

        gl.fill = function fill() {
            for (var i = 0; i < subPaths.length; i++) {
                fillSubPath(i);
            }
        };

        function strokeSubPath(index) {
            var transform = gl2d.transform;
            var shaderProgram = gl2d.initShaders(transform.c_stack + 2, 0);

            var subPath = subPaths[index];
            var verts = subPath.verts;

            gl.bindBuffer(gl.ARRAY_BUFFER, pathVertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);

            transform.pushMatrix();

            sendTransformStack(shaderProgram);

            gl.uniform4f(shaderProgram.uColor, drawState.strokeStyle[0], drawState.strokeStyle[1], drawState.strokeStyle[2], drawState.strokeStyle[3]);

            if (subPath.closed) {
                gl.drawArrays(gl.LINE_LOOP, 0, verts.length / 4);
            } else {
                gl.drawArrays(gl.LINE_STRIP, 0, verts.length / 4);
            }

            transform.popMatrix();
        }

        gl.stroke = function stroke() {
            for (var i = 0; i < subPaths.length; i++) {
                strokeSubPath(i);
            }
        };

        gl.isPointInPath = function isPointInPath() { };

        gl.drawFocusRing = function drawFocusRing() { };

        var imageCache = [], textureCache = [];

        function Texture(image) {
            this.obj = gl.createTexture();

            if (!image.noCatch) {
                this.index = textureCache.push(this);
                imageCache.push(image);
            }

            // we may wish to consider tiling large images like this instead of scaling and
            // adjust appropriately (flip to next texture source and tile offset) when drawing
            if (image.width > gl2d.maxTextureSize || image.height > gl2d.maxTextureSize) {
                var canvas = document.createElement("canvas");

                canvas.width = (image.width > gl2d.maxTextureSize) ? gl2d.maxTextureSize : image.width;
                canvas.height = (image.height > gl2d.maxTextureSize) ? gl2d.maxTextureSize : image.height;

                var ctx = canvas.getContext("2d");

                ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

                image = canvas;
            }

            gl.bindTexture(gl.TEXTURE_2D, this.obj);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Enable Mip mapping on power-of-2 textures
            if (isPOT(image.width) && isPOT(image.height)) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }

            // Unbind texture
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        gl.drawImage = function drawImage(image, a, b, c, d, e, f, g, h) {
            image = image.image || image;

            var transform = gl2d.transform;

            transform.pushMatrix();

            var sMask = shaderMask.texture;
            var doCrop = false;

            //drawImage(image, dx, dy)
            if (arguments.length === 3) {
                transform.translate(a, b);
                transform.scale(image.width, image.height);
            }

                //drawImage(image, dx, dy, dw, dh)
            else if (arguments.length === 5) {
                transform.translate(a, b);
                transform.scale(c, d);
            }

                //drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
            else if (arguments.length === 9) {
                transform.translate(e, f);
                transform.scale(g, h);
                sMask = sMask | shaderMask.crop;
                doCrop = true;
            }

            var shaderProgram = gl2d.initShaders(transform.c_stack, sMask);

            var texture, cacheIndex = imageCache.indexOf(image);

            if (cacheIndex !== -1) {
                texture = textureCache[cacheIndex];
            } else {
                texture = new Texture(image);
            }

            if (doCrop) {
                gl.uniform4f(shaderProgram.uCropSource, a / image.width, b / image.height, c / image.width, d / image.height);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, rectVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 4, gl.FLOAT, false, 0, 0);

            gl.bindTexture(gl.TEXTURE_2D, texture.obj);
            gl.activeTexture(gl.TEXTURE0);

            gl.uniform1i(shaderProgram.uSampler, 0);

            sendTransformStack(shaderProgram);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

            transform.popMatrix();
        };
    };

    Jyo.Renderer.WebGL["2d"] = WebGL2D;
}(Math));