Jyo.Renderer = function () {
    /// <summary>渲染器接口</summary>
    /// <returns type="Jyo.Renderer"></returns>

    // 文本测量元素
    if (document.getElementById("txtMetric")) {
        this.textMetricElement = document.getElementById("txtMetric");
    } else {
        this.textMetricElement = document.createElement("span");
        this.textMetricElement.id = "txtMetric";
        this.textMetricElement.style.cssText = "position:absolute;top:-1000px;left:-1000px;padding:0px;margin:0px;z-index:-1000;color:transparent;pointer-events:none;";
        this.textMetricElement.innerHTML = "你好Helloこんにちは";
        document.body.appendChild(this.textMetricElement);
    }

    Jyo.Renderer.constructor.apply(this, arguments);
};

Jyo.Renderer.constructor = Jyo.Overload().
                           add("String", function (domId) {
                               /// <summary>渲染器接口构造函数</summary>
                               /// <param name="domId" type="String">Div元素id</param>
                               /// <returns type="Jyo.Renderer"></returns>

                               var domElement = document.getElementById(domId) ||
                                                document.getElementsByClassName(domId)[0] ||
                                                document.getElementsByTagName(domId)[0];
                               Jyo.Renderer.call(this, domElement);
                           }).
                           add("*", function (domElement) {
                               if (!domElement || typeof domElement.getAttribute == "undefined") {
                                   throw new Error("Using an invalid element");
                               }

                               // 画区宽度
                               this.width = domElement.getAttribute("width") || domElement.clientWidth;

                               // 画区高度
                               this.height = domElement.getAttribute("height") || domElement.clientHeight;

                               // 所绑定的DOM元素
                               this.domElement = domElement;

                               // 自动缩放模式
                               this.autoSizeMode = "none";

                               // 缩放值
                               this.scaling = 1;

                               // 禁止右键菜单
                               domElement.oncontextmenu = function () { return false; };

                               // 触屏不显示触摸框
                               domElement.style.cssText += "-webkit-user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);";

                               // 解决安卓下重影问题
                               document.body.style.cssText += "overflow:visible;-webkit-transform: translateZ(0);";

                               var assign = this.assign;
                               delete this.assign;

                               if (typeof assign == "undefined") {
                                   // 分配合适的渲染器
                                   var renderer;
                                   for (var i in Jyo.Renderer) {
                                       renderer = Jyo.Renderer[i];
                                       if (typeof renderer.isSupport != "undefined" && renderer.isSupport()) {
                                           this._applyRenderer(renderer);
                                           return this;
                                       }
                                   }
                               } else {
                                   // 尝试使用指定的渲染器
                                   var renderer = Jyo.Renderer[assign];
                                   if (renderer && typeof renderer.isSupport != "undefined" && renderer.isSupport()) {
                                       this._applyRenderer(renderer);
                                       return this;
                                   } else {
                                       throw new Error("Can not use this renderer");
                                   }
                               }

                               throw new Error("No suitable renderer");
                           }).
                           add("String, String", function (domId, assign) {
                               /// <summary>渲染器接口构造函数</summary>
                               /// <param name="domId" type="String">Div元素id</param>
                               /// <param name="assign" type="String" optional="true">指定使用的渲染技术，可选如下：&#10;WebGL&#10;Canvas&#10;Svg&#10;Css&#10;VML -> (IE专有，不推荐)</param>
                               /// <returns type="Jyo.Renderer"></returns>

                               this.assign = assign;
                               Jyo.Renderer.call(this, domId);
                           }).
                           add("*, String", function (domElement, assign) {
                               /// <summary>渲染器接口构造函数</summary>
                               /// <param name="domElement" type="HTMLDivElement">Div元素</param>
                               /// <param name="assign" type="String" optional="true">指定使用的渲染技术，可选如下：&#10;WebGL&#10;Canvas&#10;Svg&#10;Css&#10;VML -> (IE专有，不推荐)</param>
                               /// <returns type="Jyo.Renderer"></returns>

                               this.assign = assign;
                               Jyo.Renderer.call(this, domElement);
                           });

Jyo.Renderer.prototype = new Jyo.Object({
    _applyRenderer: function (renderer) {
        /// <summary>应用渲染器</summary>
        /// <param name="renderer" type="Jyo.Renderer">要应用的渲染器类</param>

        this.mode = renderer.mode;
        for (var i in renderer.prototype) {
            if (renderer.hasOwnProperty(i)) continue;
            this[i] = renderer.prototype[i];
        }
        renderer.call(this);
    },
    _addRenderElement: function (tagName) {
        /// <summary>添加渲染用元素</summary>
        /// <param name="tagName" type="String">标签名称</param>

        var element = document.createElement(tagName);
        element.width = this.width;
        element.height = this.height;
        element.style.cssText = "position:relative;left:0px;top:0px;width:100%;height:100%;margin:0px;padding:0px;border:0px;outline:none;";
        this.domElement.appendChild(element);
        this.canvas = element;
    },
    resize: function (width, height) {
        /// <summary>重新设置大小</summary>
        /// <param name="width" type="Number">宽度</param>
        /// <param name="height" type="Number">高度</param>

        var element = this.domElement;
        element.style.width = width + "px";
        element.style.height = height + "px";
        element.setAttribute("width", width);
        element.setAttribute("height", height);
        if (this.autoSizeMode !== "none") {
            this.autoSize();
        }
    },
    enableAutoSize: function (mode) {
        /// <summary>启用画布自适应</summary>
        /// <param name="mode" type="String" optional="true">适应模式，可用值如下:&#10;fill&#10;ratio&#10;默认为ratio</param>

        var _this = this;

        // 判断是否直接在body中显示
        // 如果是，则增加全屏样式
        var parentElement = this.domElement.parentElement || this.domElement.parentNode || document.body;
        if (parentElement == document.body) {
            var style;
            var str = "html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;}";
            if (typeof window.attachEvent != "undefined") {
                style = document.styleSheets["JyoJsHTMLStyle"] || document.createStyleSheet();
                style.owningElement.id = "JyoJsHTMLStyle";
                style.cssText = str;
            }
            else {
                style = document.createElement("style");
                style.id = "JyoJsHTMLStyle";
                style.innerHTML = str;
                var head = document.getElementsByTagName('head')[0];
                if (typeof head != "undefined") {
                    head.appendChild(style);
                } else {
                    document.appendChild(style);
                }
            }
        }

        this.autoSizeMode = function () {
            if (mode !== "ratio" && mode !== "fill") {
                return "ratio";
            }
            return mode;
        }();
        this._autoSizeFun = function () {
            _this.autoSize();
        };
        window.addEventListener("resize", this._autoSizeFun);
        this.autoSize();
    },
    disableAutoSize: function () {
        /// <summary>停用画布自适应</summary>

        var style = this.domElement.style;
        style.width = this.width + "px";
        style.height = this.height + "px";
        style.marginTop = style.marginLeft = style.top = style.left = style.padding = "0px";
        style.position = "static";

        if (window.attachEvent) {
            document.styleSheets["JyoJsHTMLStyle"].cssText = "";
        }
        else {
            style[Jyo.prefix.lowercase + "Transform"] = style.transform = null;
            style[Jyo.prefix.lowercase + "TransformOrigin"] = style.transformOrigin = null;
            var htmlStyle = document.getElementById("JyoJsHTMLStyle");
            htmlStyle.parentElement.removeChild(htmlStyle);
        }

        if (typeof this._autoSizeFun != "undefined") {
            this.autoSizeMode = "none";
            window.removeEventListener("resize", this._autoSizeFun);
        }
    },
    autoSize: function () {
        /// <summary>让画布自适应一次</summary>

        var parentElement = this.domElement.parentElement || this.domElement.parentNode || document.body;
        var width = this.width,
            height = this.height,
            parentWidth = parentElement.clientWidth,
            parentHeight = parentElement.clientHeight;

        // 计算缩放值
        var scaling = Math.min(parentWidth / width, parentHeight / height);
        this.scaling = scaling;

        //// 设置画布大小(Svg有效)
        //if (this.canvas instanceof SVGSVGElement) {
        //    this.canvas.setAttribute("viewBox", "0 0 " + width + " " + height);
        //    this.canvas.setAttribute("width", (width * scaling) + "px");
        //    this.canvas.setAttribute("height", (height * scaling) + "px");
        //}

        // 设置画区大小
        var style = this.domElement.style;
        if (this.autoSizeMode === "ratio") {
            style.width = (width * scaling) + "px";
            style.height = (height * scaling) + "px";
            if (parentElement == document.body) {
                style.marginTop = ((parentHeight - height * scaling) / 2) + "px";
                style.marginLeft = ((parentWidth - width * scaling) / 2) + "px";
            }
        } else if (this.autoSizeMode === "fill") {
            style.width = "100%";
            style.height = "100%";
            style.marginTop = "0px";
            style.marginLeft = "0px";
        }
        style.padding = "0px";

        // 如果渲染器需要其他缩放操作则触发
        if (typeof this._autoSize != "undefined") {
            this._autoSize(parentWidth, parentHeight);
        }
    },
    getTextSize: function (str, font) {
        /// <summary>获取文字尺寸</summary>
        /// <param name="str" type="String">要获取的字符串</param>
        /// <param name="font" type="String" optional="true">字体</param>
        /// <returns type="Object"></returns>

        var tme = this.textMetricElement;

        tme.style.font = font || this.context.font;
        return {
            width: tme.offsetWidth,
            height: tme.offsetHeight
        };
    },
    getHashCode: function () {
        /// <summary>返回此渲染器的哈希代码</summary>
        /// <returns type="Number">一个指定此渲染器的哈希代码的整数</returns>

        return this.width ^ this.height ^ 11;
    },
    equals: function (value) {
        /// <summary>测试两个渲染器是否相等</summary>
        /// <param name="value" type="Jyo.Color">要进行比较的Jyo.Renderer</param>
        /// <returns type="Boolean"></returns>

        if (this === value ||
            value instanceof Jyo.Renderer &&
            this.getHashCode() === value.getHashCode() &&
            this.mode === value.mode &&
            this.domElement === value.domElement) {
            return true;
        }
        return false;
    }
});