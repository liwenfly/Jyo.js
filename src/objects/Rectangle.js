Jyo.Rectangle = function () {
    /// <summary>矩形类</summary>
    /// <returns type="Jyo.Rectangle"></returns>

    Jyo.Rectangle.constructor.apply(this, arguments);
};

Jyo.Rectangle.constructor = Jyo.Overload().
                            add(null, function () {
                                /// <summary>矩形对象构造函数</summary>
                                /// <returns type="Jyo.Rectangle"></returns>

                                Jyo.Color.call(this, 0, 0, 0, 0);
                            }).
                            add("Jyo.Rectangle", function (rect) {
                                /// <summary>矩形对象构造函数</summary>
                                /// <param name="rect" type="Jyo.Rectangle">矩形对象</param>
                                /// <returns type="Jyo.Rectangle"></returns>

                                Jyo.Color.call(this, rect.x, rect.y, rect.width, rect.height);
                            }).
                            add("Number, Number, Number, Number", function (x, y, width, height) {
                                /// <summary>矩形对象构造函数</summary>
                                /// <param name="x" type="Number">起始X坐标</param>
                                /// <param name="y" type="Number">起始Y坐标</param>
                                /// <param name="width" type="Number">矩形宽度</param>
                                /// <param name="height" type="Number">矩形高度</param>
                                /// <returns type="Jyo.Rectangle"></returns>

                                this.x = x;
                                this.y = y;
                                this.width = width < 0 ? 0 : width;
                                this.height = height < 0 ? 0 : height;
                            });

Jyo.Rectangle.intersect = Jyo.Overload().
                          add("Jyo.Rectangle, Jyo.Rectangle", function (value1, value2) {
                              /// <summary>找到相交的矩形</summary>
                              /// <param name="value1" type="Jyo.Rectangle">要检测的第一个矩形</param>
                              /// <param name="value2" type="Jyo.Rectangle">要检测的第二个矩形</param>
                              /// <returns type="Jyo.Rectangle"></returns>

                              var x, y, width, height;
                              x = value1.x > value2.x ? value1.x : value2.x;
                              y = value1.y > value2.y ? value1.y : value2.y;
                              width = value1.x + value1.width < value2.x + value2.width ? value1.x + value1.width : value2.x + value2.width - x;
                              height = value1.y + value1.height < value2.y + value2.height ? value1.y + value1.height : value2.y + value2.height - y;
                              if (width < 0 || height < 0) {
                                  width = 0;
                                  height = 0;
                              }
                              return new Jyo.Rectangle(x, y, width, height);
                          });

Jyo.Rectangle.prototype = new Jyo.Object({
    intersects: Jyo.Overload().
                add("Jyo.Rectangle", function (rect) {
                    /// <summary>检测两个矩形是否相交</summary>
                    /// <param name="rect" type="Jyo.Rectangle">要与之检测的矩形</param>
                    /// <returns type="Boolean"></returns>

                    return this.intersects(rect.x, rect.y, rect.width, rect.height);
                }).
                add("Number, Number, Number, Number", function (x, y, width, height) {
                    /// <summary>检测两个矩形是否相交</summary>
                    /// <param name="x" type="Number">起始X坐标</param>
                    /// <param name="y" type="Number">起始Y坐标</param>
                    /// <param name="width" type="Number">矩形宽度</param>
                    /// <param name="height" type="Number">矩形高度</param>
                    /// <returns type="Boolean"></returns>

                    return !(this.x + this.width < x ||
                             x + width < this.x ||
                             this.y + this.height < y ||
                             y + height < this.y);
                }),
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