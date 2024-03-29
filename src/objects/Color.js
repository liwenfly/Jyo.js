﻿Jyo.Color = function () {
    /// <summary>颜色类</summary>
    /// <returns type="Jyo.Color"></returns>

    Jyo.Color.constructor.apply(this, arguments);
};

Jyo.Color.constructor = Jyo.Overload().
                        add(null, function () {
                            /// <summary>颜色构造函数</summary>
                            /// <returns type="Jyo.Color"></returns>

                            Jyo.Color.call(this, 0, 0, 0, 1);
                        }).
                        add("Jyo.Color", function (color) {
                            /// <summary>颜色构造函数</summary>
                            /// <param name="color" type="Jyo.Color">颜色对象</param>
                            /// <returns type="Jyo.Color"></returns>

                            Jyo.Color.call(this, color.red, color.green, color.blue, color.alpha);
                        }).
                        add("String", function (colorStr) {
                            /// <summary>颜色构造函数</summary>
                            /// <param name="colorStr" type="String">颜色值</param>
                            /// <returns type="Jyo.Color"></returns>

                            var hex, rgb, hsl;

                            if (Jyo.Color.colorMap[colorStr.toLowerCase()]) {
                                // 从颜色表中获取颜色值

                                colorStr = Jyo.Color.colorMap[colorStr.toLowerCase()];
                            }

                            if ((hex = colorStr.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) && (hex = hex[1])) {
                                // 检查是否为HEX值

                                hex = hex.length == 3 ? [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]].join("") : hex;
                                Jyo.Color.call(this, parseInt(hex, 16));
                            } else if ((rgb = colorStr.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([.\d]+))?\s*\)$/i))) {
                                // 检查是否为RGB或RGBA值

                                if (typeof rgb[4] != "undefined") Jyo.Color.call(this, +rgb[1], +rgb[2], +rgb[3], +rgb[4]);
                                else Jyo.Color.call(this, +rgb[1], +rgb[2], +rgb[3]);
                            } else if ((hsl = colorStr.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*([.\d]+))?\s*\)$/))) {
                                // 检查是否为HSL或HSLA值

                                var r, g, b, a = typeof hsl[4] != "undefined" ? +hsl[4] : 1;
                                var h = +hsl[1] / 360, s = +hsl[2] / 100, l = +hsl[3] / 100;
                                if (s == 0) {
                                    r = g = b = l;
                                } else {
                                    function hue2rgb(p, q, t) {
                                        if (t < 0) t += 1;
                                        if (t > 1) t -= 1;
                                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                                        if (t < 1 / 2) return q;
                                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                                        return p;
                                    }
                                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                                    var p = 2 * l - q;
                                    r = hue2rgb(p, q, h + 1 / 3);
                                    g = hue2rgb(p, q, h);
                                    b = hue2rgb(p, q, h - 1 / 3);
                                }
                                Jyo.Color.call(this, Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
                            }
                        }).
                        add("Number", function (colorInt) {
                            /// <summary>颜色构造函数</summary>
                            /// <param name="colorInt" type="Number">十进制颜色值</param>
                            /// <returns type="Jyo.Color"></returns>

                            Jyo.Color.call(this, colorInt >> 16 & 0xFF, colorInt >> 8 & 0xFF, colorInt & 0xFF);
                        }).
                        add("Number,Number,Number", function (r, g, b) {
                            /// <summary>颜色构造函数</summary>
                            /// <param name="r" type="Number">红色值</param>
                            /// <param name="g" type="Number">绿色值</param>
                            /// <param name="b" type="Number">蓝色值</param>
                            /// <returns type="Jyo.Color"></returns>

                            this.red = (r > 255 ? 255 : r < 0 ? 0 : r) << 0;
                            this.green = (g > 255 ? 255 : g < 0 ? 0 : g) << 0;
                            this.blue = (b > 255 ? 255 : b < 0 ? 0 : b) << 0;
                            this.alpha = 1.0;
                        }).
                        add("Number,Number,Number,Number", function (r, g, b, a) {
                            /// <summary>颜色构造函数</summary>
                            /// <param name="r" type="Number">红色值</param>
                            /// <param name="g" type="Number">绿色值</param>
                            /// <param name="b" type="Number">蓝色值</param>
                            /// <param name="a" type="Number">Alpha值</param>
                            /// <returns type="Jyo.Color"></returns>

                            Jyo.Color.call(this, r, g, b);
                            this.alpha = a > 1 ? 1 : a < 0 ? 0 : a;
                        });

Jyo.Color.prototype = new Jyo.Object({
    toInt32: function () {
        /// <summary>转换为32位10进制表示法</summary>
        /// <returns type="Number"></returns>

        return (this.red << 16 | this.green << 8 | this.blue);
    },
    toHex: function () {
        /// <summary>转换为16进制表示法(无法表示Alpha值)</summary>
        /// <returns type="String"></returns>

        return "#" + this.toInt32().toString(16);
    },
    toRgb: function () {
        /// <summary>转换为RGB表示法</summary>
        /// <returns type="String"></returns>

        return String.format("rgb({0},{1},{2})", this.red, this.green, this.blue);
    },
    toRgba: function () {
        /// <summary>转换为RGBA表示法</summary>
        /// <returns type="String"></returns>

        return String.format("rgba({0},{1},{2},{3})", this.red, this.green, this.blue, this.alpha);
    },
    toHsl: function () {
        /// <summary>转换为HSL表示法</summary>
        /// <returns type="String"></returns>

        var r = this.red / 255,
            g = this.green / 255,
            b = this.blue / 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0;
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return String.format("hsl({0},{1}%,{2}%)", (h * 360) | 0, s * 100, l * 100);
    },
    toHsla: function () {
        /// <summary>转换为HSLA表示法</summary>
        /// <returns type="String"></returns>

        var _this = this;
        return this.toHsl().replace(/(\(|\))/g, function (char) {
            switch (char) {
                case "(":
                    return "a(";
                case ")":
                    return "," + _this.alpha + ")";
            }
        });
    },
    getHashCode: function () {
        /// <summary>返回此颜色的哈希代码</summary>
        /// <returns type="Number">一个指定此颜色的哈希代码的整数</returns>

        return this.red ^ this.green ^ this.blue ^ ((this.alpha * 255) << 0);
    },
    equals: function (value) {
        /// <summary>测试两个颜色是否相等</summary>
        /// <param name="value" type="Jyo.Color">要进行比较的Jyo.Color</param>
        /// <returns type="Boolean"></returns>

        if (typeof value === "string" || typeof value === "number") {
            return this.equals(new Jyo.Color(value));
        }

        if (this === value ||
            value instanceof Jyo.Color &&
            this.getHashCode() === value.getHashCode() &&
            this.red === value.red &&
            this.green === value.green &&
            this.blue === value.blue &&
            this.alpha === value.alpha) {
            return true;
        }
        return false;
    }
});

Jyo.Color.colorMap = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkgrey": "#a9a9a9",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkslategrey": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "grey": "#808080",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightgrey": "#d3d3d3",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightslategrey": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "slategrey": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "transparent": "rgba(0,0,0,0)",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
};