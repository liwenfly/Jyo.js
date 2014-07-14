Jyo.Renderer.Canvas = function () {
    // 添加渲染元素
    this._addRenderElement("canvas");

    // 获取上下文
    this.context = this.canvas.getContext("2d");
};

Jyo.Renderer.Canvas.isSupport = function () {
    /// <summary>检测是否支持</summary>
    /// <returns type="Boolean"></returns>

    if (typeof HTMLCanvasElement.prototype.getContext == "undefined") {
        return false;
    }

    return true;
}

Jyo.Renderer.Canvas.prototype = new Jyo.Object({
    mode: "Canvas",
    clear: Jyo.Overload().
           add(null, function () {
               /// <summary>清空画布</summary>

               var ctx = this.context;
               ctx.clearRect(0, 0, this.width, this.height);
           }).
           add("Jyo.Color", function (color) {
               /// <summary>清空画布</summary>
               /// <param name="color" type="Jyo.Color">颜色对象</param>

               this.clear(color.toRgba());
           }).
           add("String", function (colorStr) {
               /// <summary>清空画布</summary>
               /// <param name="colorStr" type="String">颜色字符串值</param>

               var ctx = this.context;
               ctx.fillStyle = colorStr;
               ctx.fillRect(0, 0, this.width, this.height);
           }),
    begin: function () {
        this.clear();
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
                  ctx.strokeRect(x + lineWidth / 2, y + lineWidth / 2, width - lineWidth, height - lineWidth);
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

                    var fontHeight = this.getTextSize(str, ctx.font).height;
                    var strList = str.split(/\r\n|\n|\r/ig);
                    for (var i = 0; i < strList.length; i++) {
                        ctx.fillText(strList[i], x, y + fontHeight * (i + 0.8));
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

                     ctx.beginPath();
                     ctx.moveTo(list[0].x, list[0].y);
                     for (var i = list.length; i-- > 0; ctx.lineTo(list[i].x, list[i].y));
                     ctx.closePath();
                     ctx.stroke();
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

                     ctx.beginPath();
                     ctx.moveTo(list[0].x, list[0].y);
                     for (var i = list.length; i-- > 0; ctx.lineTo(list[i].x, list[i].y));
                     ctx.closePath();
                     ctx.fill();
                 })
});