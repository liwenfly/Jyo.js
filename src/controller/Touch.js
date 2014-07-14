Jyo.Touch = function () {
    /// <summary>触摸类</summary>
    /// <returns type="Jyo.Touch"></returns>

    Jyo.Touch.constructor.apply(this, arguments);
};

Jyo.Touch.constructor = Jyo.Overload().
                        add("Jyo.Renderer", function (renderer) {
                            // 与之有关的渲染其对象
                            this.renderer = renderer;

                            // 当前鼠标监听的元素
                            this.element = renderer.domElement;

                            // 检查是否支持多点触摸
                            this.supportMultipleTouches = function () {
                                var ua = navigator.userAgent.toLowerCase();
                                if (ua.indexOf("android") > 0 && parseFloat(((ua.split("android ")[1] || "").split(";")[0])) <= 2.3) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }();

                            // 触摸列表
                            this.list = [];

                            this.bind();
                        });

Jyo.Touch.prototype = new Jyo.Object({
    bind: function () {
        /// <summary>绑定事件</summary>

        var _this = this;
        var el = this.element;

        // 监听触摸按下事件
        el.addEventListener("touchstart", function (e) {
            var changeList = [];
            for (var i = 0; i < e.changedTouches.length; i++) {
                var object = {
                    id: e.changedTouches[i].identifier,
                    x: ((e.changedTouches[i].pageX - el.offsetLeft) * (_this.renderer.width / el.clientWidth)) | 0,
                    y: ((e.changedTouches[i].pageY - el.offsetTop) * (_this.renderer.height / el.clientHeight)) | 0
                };
                _this.list.push(object);
                changeList.push(object);
            }

            typeof _this.ontouchstart != "undefined" && _this.ontouchstart(changeList);
        });

        // 监听触摸移动事件
        el.addEventListener("touchmove", function (e) {
            (typeof event != "undefined" ? event : e).preventDefault();

            var changeList = [];

            for (var i = 0; i < _this.list.length; i++) {
                for (var n = 0; n < e.changedTouches.length; n++) {
                    if (e.changedTouches[n].identifier == _this.list[i].id) {
                        _this.list[i].x = ((e.changedTouches[n].pageX - el.offsetLeft) * (_this.renderer.width / el.clientWidth)) | 0;
                        _this.list[i].y = ((e.changedTouches[n].pageY - el.offsetTop) * (_this.renderer.height / el.clientHeight)) | 0;
                        changeList.push(_this.list[i]);
                    }
                }
            }

            typeof _this.ontouchmove != "undefined" && _this.ontouchmove(changeList);
        });

        function end(e) {
            var changeList = [];

            for (var i = 0; i < _this.list.length; i++) {
                for (var n = 0; n < e.changedTouches.length; n++) {
                    if (e.changedTouches[n].identifier == _this.list[i].id) {
                        changeList.push(_this.list[i]);
                        _this.list = function (l, i) {
                            return (i < 0) ? l : l.slice(0, i).concat(l.slice(i + 1, l.length))
                        }(_this.list, i);
                    }
                }
            }

            typeof _this.ontouchend != "undefined" && _this.ontouchend(changeList);
        }

        // 监听触摸抬起事件
        el.addEventListener("touchend", end);

        // 监听触摸取消事件
        el.addEventListener('touchcancel', end);
    }
});