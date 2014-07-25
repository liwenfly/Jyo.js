Jyo.Renderer.Css = function () {
    // 添加渲染元素
    this._addRenderElement("div");

    // 隐藏超出部分
    this.canvas.style.overflow = "hidden";

    this.context = {};

    // 用于开启硬件加速的样式
    this.css3d = function () {
        var element = document.createElement("div");
        if ("transform" in element.style || Jyo.prefix.lowercase + "Transform" in element.style) {
            element.style["transform"] = "translateZ(1px)";
            element.style[Jyo.prefix.lowercase + "Transform"] = "translateZ(1px)";
            if (element.style["transform"] === "translateZ(1px)" ||
                   element.style[Jyo.prefix.lowercase + "Transform"] === "translateZ(1px)") {
                return "transform: translateZ(0px);" +
                       Jyo.prefix.css + "transform: translateZ(0px);" +
                       "backface-visibility: hidden;" +
                       Jyo.prefix.css + "backface-visibility: hidden;" +
                       "perspective: 1000;" +
                       Jyo.prefix.css + "perspective: 1000;" +
                       "transform-origin: 50% 50%;" +
                       Jyo.prefix.css + "transform-origin: 50% 50%;";
            }
        } else {
            return "";
        }
    }();

    // 缓存列表
    this.catchList = [];

    // 临时列表
    this.tempList = [];

    // 基础元素
    this.baseElement = document.createElement("div");
    this.baseElement.style.position = "absolute";
    this.baseElement.style["pointer-events"] = "none";
    this.baseElement.style.cssText += this.css3d;
};

Jyo.Renderer.Css.isSupport = function () {
    /// <summary>检测是否支持</summary>
    /// <returns type="Boolean"></returns>

    var element = document.createElement("div");
    return "borderRadius" in element.style;
}

Jyo.Renderer.Css.prototype = new Jyo.Object({
    mode: "Css",
    _autoSize: function (parentWidth, parentHeight) {
        /// <summary>自动缩放</summary>
        /// <param name="parentWidth" type="Number">父容器宽度</param>
        /// <param name="parentHeight" type="Number">父容器高度</param>

        var cs = this.domElement.style;
        cs.position = "relative";
        cs.width = this.width + "px";
        cs.height = this.height + "px";
        if (this.autoSizeMode == "ratio") {
            // 同比缩放设置

            // 计算缩放值
            var scaling = Math.min(parentWidth / this.width, parentHeight / this.height);
            cs.left = cs.top = "50%";
            cs.marginLeft = "-" + this.width / 2 + "px";
            cs.marginTop = "-" + (this.height * scaling / 2) + "px";
            cs[Jyo.prefix.lowercase + "Transform"] = "scale(" + scaling + "," + scaling + ")";
            cs["transform"] = "scale(" + scaling + "," + scaling + ")";
            cs[Jyo.prefix.lowercase + "TransformOrigin"] = "50% 0%";
            cs["transformOrigin"] = "50% 0%";
        }
        else if (this.autoSizeMode === "fill") {
            // 填充缩放设置

            cs.left = "0px";
            cs.top = "0px";
            cs.marginLeft = "0px";
            cs.marginTop = "0px";
            var scale = "scale(" + parentWidth / this.width + "," + parentHeight / this.height + ")";
            cs[Jyo.prefix.lowercase + "Transform"] = scale;
            cs["transform"] = scale;
            cs[Jyo.prefix.lowercase + "TransformOrigin"] = "0% 0%";
            cs["transformOrigin"] = "0% 0%";
        }
    },
    clear: Jyo.Overload().
           add(null, function () {
               /// <summary>清空画布</summary>

               return;
           }).
           add("Jyo.Color", function (color) {
               /// <summary>清空画布</summary>
               /// <param name="color" type="Jyo.Color">颜色对象</param>

               this.clear(color.toRgba());
               this.canvas.innerHTML = "";
           }).
           add("String", function (colorStr) {
               /// <summary>清空画布</summary>
               /// <param name="colorStr" type="String">颜色字符串值</param>

               this.canvas.style.backgroundColor = colorStr;
               this.canvas.innerHTML = "";
           }),
    begin: function () {
        /// <summary>开始绘制</summary>

        this.tempList.clear();
    },
    end: function () {
        /// <summary>结束绘制</summary>

        var tl = this.tempList,
            cl = this.catchList;

        // 检查若有节点增删则重置画布
        if (tl.length != cl.length) {
            cl.clear();
            this.canvas.innerHTML = "";
        }
        // 重新创建元素
        if (!cl.length) {
            var frag = document.createDocumentFragment();
            for (var i = tl.length; i-- ;) {
                cl.push({ element: this.baseElement.cloneNode(false), style: {} });
                frag.appendChild(cl[cl.length - 1].element);
            }
            this.canvas.appendChild(frag);
        }

        var el;
        for (var i = 0; i < cl.length; i++) {
            el = cl[i];
            // 仅更新存在差异的属性
            if (Object.keys(el.style).length != Object.keys(tl[i]).length || function () {
                for (var n in tl[i]) {
                    if (tl[i][n] != el.style[n]) return true;
            }
                return false;
            }()) {
                for (var n in tl[i]) {
                    if (n == "text") {
                        el.element.innerHTML = tl[i][n];
                        continue;
                    }
                    el.element.style[n] = tl[i][n];
                }
                el.style = tl[i];
            }
        }
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

                  this.tempList.push({
                      left: x + "px",
                      top: y + "px",
                      width: width + "px",
                      height: height + "px",
                      backgroundColor: colorStr || "#000000"
                  });
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

                  lineWidth = lineWidth || 1.0;

                  this.tempList.push({
                      left: x + "px",
                      top: y + "px",
                      width: (width - lineWidth * 2) + "px",
                      height: (height - lineWidth * 2) + "px",
                      border: "solid " + lineWidth + "px " + (colorStr || "#000000")
                  });
              }),
    drawImage: Jyo.Overload().
               add("*, Number, Number", function (element, x, y) {
                   /// <summary>绘制图象</summary>
                   /// <param name="element" type="Object">要绘制的元素</param>
                   /// <param name="x" type="Number">起始X坐标</param>
                   /// <param name="y" type="Number">起始Y坐标</param>

                   element = element.object || element;

                   this.tempList.push({
                       left: x + "px",
                       top: y + "px",
                       width: element.width + "px",
                       height: element.height + "px",
                       backgroundImage: element.other || "url(" + element.src + ")"
                   });
               }).
               add("*, Jyo.Rectangle", function (element, rect) {
                   /// <summary>绘制图象</summary>
                   /// <param name="element" type="Object">要绘制的元素</param>
                   /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>

                   element = element.object || element;

                   this.tempList.push({
                       left: rect.x + "px",
                       top: rect.y + "px",
                       width: rect.width + "px",
                       height: rect.height + "px",
                       backgroundImage: element.other || "url(" + element.src + ")",
                       backgroundSize: "100%"
                   });
               }).
               add("*, Number, Number, Number, Number", function (element, x, y, width, height) {
                   /// <summary>绘制图象</summary>
                   /// <param name="element" type="Object">要绘制的元素</param>
                   /// <param name="x" type="Number">起始X坐标</param>
                   /// <param name="y" type="Number">起始Y坐标</param>
                   /// <param name="width" type="Number">图像宽度</param>
                   /// <param name="height" type="Number">图像高度</param>

                   element = element.object || element;

                   this.tempList.push({
                       left: x + "px",
                       top: y + "px",
                       width: width + "px",
                       height: height + "px",
                       backgroundImage: element.other || "url(" + element.src + ")",
                       backgroundSize: "100%"
                   });
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

                   element = element.object || element;

                   this.tempList.push({
                       left: x + "px",
                       top: y + "px",
                       width: width + "px",
                       height: height + "px",
                       backgroundRepeat: "no-repeat",
                       backgroundImage: element.other || "url(" + element.src + ")",
                       backgroundPosition: -cx + "px " + -cy + "px",
                       backgroundSize: element.width + "px " + element.height + "px"
                   });
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

                    this.tempList.push({
                        text: str.replace(/(\r\n|\n|\r)/ig, "<br>"),
                        left: x + "px",
                        top: y + "px",
                        font: font || "14px Arial",
                        color: colorStr || "#000000",
                        whiteSpace: "nowrap"
                    });
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

                  var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                  var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

                  var obj = {
                      left: x1 + "px",
                      top: y1 + "px",
                      width: length + "px",
                      height: "0px",
                      borderTop: "solid " + (lineWidth || 1) + "px " + (colorStr || "#000000")
                  };
                  obj["transformOrigin"] = "0px 0px";
                  obj[Jyo.prefix.lowercase + "TransformOrigin"] = "0px 0px";
                  obj["transform"] = "rotate(" + angle + "deg)";
                  obj[Jyo.prefix.lowercase + "Transform"] = obj["transform"];

                  this.tempList.push(obj);
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

                     colorStr = colorStr || "#000000";
                     lineWidth = lineWidth || 1.0;
                     lineJoin = lineJoin || "miter";

                     var prePoint;
                     for (var i = 0; i < list.length; i++) {
                         if (prePoint) {
                             this.drawLine(prePoint.x, prePoint.y, list[i].x, list[i].y, colorStr, lineWidth, lineJoin);
                         }
                         prePoint = list[i];
                     }
                     if (list.length) {
                         this.drawLine(prePoint.x, prePoint.y, list[0].x, list[0].y, colorStr, lineWidth, lineJoin);
                     }
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

                     //var pl = [];
                     //for (var i = 0; i < list.length; i++) {
                     //    pl.push(list[i].x + "px " + list[i].y + "px");
                     //}

                     //var obj = {
                     //    left: 0 + "px",
                     //    top: 0 + "px",
                     //    width: 500 + "px",
                     //    height: 500 + "px",
                     //    backgroundColor: colorStr || "#000000"
                     //};
                     //obj["shapeInside"] = "polygon(" + pl.join() + ")";
                     //obj[Jyo.prefix.lowercase + "ShapeInside"] = obj["shapeInside"];

                     //this.tempList.push(obj);

                     //var ctx = this.context;

                     //ctx.fillStyle = colorStr || "#000000";

                     //ctx.moveTo(list[0].x, list[0].y);
                     //for (var i = list.length; i-- > 0; ctx.lineTo(list[i].x, list[i].y));
                     //ctx.closePath();
                     //ctx.fill()
                 })
});