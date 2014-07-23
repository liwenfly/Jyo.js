Jyo.Timer = function () {
    /// <summary>计时器类</summary>
    /// <returns type="Jyo.Timer"></returns>

    Jyo.Timer.constructor.apply(this, arguments);
};

// 计时器列表
Jyo.Timer.list = [];

// 检测计时器
Jyo.Timer.checkTimer = null;

Jyo.Timer.constructor = Jyo.Overload().
                        add(null, function () {
                            /// <summary>计时器对象构造函数</summary>
                            /// <returns type="Jyo.Timer"></returns>

                            this.interval = 0;
                            this.tick = null;
                        }).
                        add("Function, Number", function (callback, interval) {
                            /// <summary>计时器对象构造函数</summary>
                            /// <param name="callback" type="Function">回调函数</param>
                            /// <param name="interval" type="Number">间隔时间</param>
                            /// <returns type="Jyo.Timer"></returns>

                            var _this = this;
                            Jyo.Timer.call(this);
                            this.interval = interval;
                            this.tick = callback;
                        }).
                        add("Function, String", function (callback, expression) {
                            /// <summary>计时器对象构造函数</summary>
                            /// <param name="callback" type="Function">回调函数</param>
                            /// <param name="etaExpression" type="String">η表达式</param>
                            /// <returns type="Jyo.Timer"></returns>

                            this.beginTime = 0;
                            this.interval = expression;
                            this.tick = callback;
                            var t = this.time = {
                                expression: expression,
                                h: null,
                                m: null,
                                s: null
                            };

                            var arr = expression.split(" ");

                            var rexCheck = /(\d+~\d+|\d+-\d+|\d+[,\d+]+|\d+\/\d+|\d+|\*)/;

                            if (arr.length != 3 || !rexCheck.test(arr[0]) || !rexCheck.test(arr[1]) || !rexCheck.test(arr[2])) {
                                throw new Error("Invalid expression");
                            }

                            if (arr[2].indexOf(",") >= 0) {
                                t.h = arr[2].split(",");
                            } else {
                                t.h = [arr[2]];
                            }

                            if (arr[1].indexOf(",") >= 0) {
                                t.m = arr[1].split(",");
                            } else {
                                t.m = [arr[1]];
                            }

                            if (arr[0].indexOf(",") >= 0) {
                                t.s = arr[0].split(",");
                            } else {
                                t.s = [arr[0]];
                            }
                        });

Jyo.Timer.prototype = new Jyo.Object({
    start: function () {
        /// <summary>开启计时器</summary>

        if (this.tick == null) return;

        if (!isNaN(this.interval)) {
            var _this = this;
            this.time = setInterval(function () {
                if (_this.interval != _this.time.interval) {
                    _this.stop();
                    _this.start();
                }
                _this.tick();
            }, this.interval);
            this.time.interval = this.interval;
            return;
        }

        this.beginTime = new Date().getTime();
        Jyo.Timer.list.push(this);
        if (Jyo.Timer.checkTimer == null) {
            Jyo.Timer.checkTimer = setInterval(function () {
                var list = Jyo.Timer.list;
                var currentTime = new Date().getTime();

                for (var i = list.length; i--;) {
                    list[i].run(new Date(currentTime - list[i].beginTime));
                }
            }, 1000);
        }
    },
    stop: function () {
        /// <summary>停止计时器</summary>

        if (!isNaN(this.interval)) {
            var _this = this;
            clearInterval(this.time);
            this.time = null;
            return;
        }

        var list = Jyo.Timer.list;
        for (var i = list.length; i--;) {
            if (list[i] == this) {
                Jyo.Timer.list = list.remove(i);
                break;
            }
        }
        if (Jyo.Timer.list.length == 0) {
            clearInterval(Jyo.Timer.checkTimer);
            Jyo.Timer.checkTimer = null;
        }
        this.beginTime = 0;
    },
    run: function (intervalTime) {
        /// <summary>检查是否可以触发函数</summary>
        /// <param name="intervalTime" type="Date">间隔时间</param>

        if (this.time.expression != this.interval) {
            Jyo.Time.call(this.callback, this.expression);
        }

        var hourPass = false,
            minutePass = false,
            secondPass = false;

        if (this.check(this.time.h, intervalTime.getHours() + intervalTime.getTimezoneOffset() / 60)) hourPass = true;
        if (this.check(this.time.m, intervalTime.getMinutes())) minutePass = true;
        if (this.check(this.time.s, intervalTime.getSeconds() - 1)) secondPass = true;

        if (hourPass && minutePass && secondPass) {
            this.tick();
        }
    },
    check: function (set, current) {
        /// <summary>检查是否可以触发</summary>
        /// <param name="set" type="String">设置的计时器</param>
        /// <param name="current" type="Number">当前间隔时间</param>
        /// <returns type="Boolean"></returns>

        var strs = null;

        if (set == "*") return true;
        if (/(\d+)/.test(set) && set == current) return true;
        if (/(\d+-\d+)/.test(set)) {
            strs = set[0].split("-");
            if (current >= strs[0] && current <= strs[1]) {
                return true;
            }
        }
        if (/(\d+\/\d+)/.test(set)) {
            strs = set[0].split("/");
            if (current >= strs[0] && (current - strs[0]) % strs[1] == 0) {
                return true;
            }
        }
        if (/\d+[,\d+]+/.test(set)) {
            for (var i = set.length; i--;) {
                if (set[i] == current.toString()) return true;
            }
        }
        return false;
    },
    getHashCode: function () {
        /// <summary>返回此矩形的哈希代码</summary>
        /// <returns type="Number">一个指定此矩形的哈希代码的整数</returns>

        return this.x ^ this.y ^ this.width ^ this.height;
    },
    equals: function (value) {
        /// <summary>测试两个矩形是否相等</summary>
        /// <param name="value" type="Jyo.Rectangle">要进行比较的Jyo.Rectangle</param>
        /// <returns type="Boolean"></returns>

        if (this === value ||
            value instanceof Jyo.Rectangle &&
            this.getHashCode() === value.getHashCode() &&
            this.x === value.x &&
            this.y === value.y &&
            this.width === value.width &&
            this.height === value.height) {
            return true;
        }
        return false;
    }
});