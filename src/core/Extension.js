Math.arctg = function (value) {
    /// <summary>反正切</summary>
    /// <param name="value" type="Number">计算值</param>
    /// <returns type="Number"></returns>

    return Math.atan2(value) / Math.PI * 180;
};

Number.prototype.toUInt = function () {
    /// <summary>转换为UInt</summary>
    /// <returns type="Number"></returns>

    return this < 0 ? this + 4294967296 : this;
};

Number.prototype.bytes32 = function () {
    /// <summary>转换为32位bytes</summary>
    /// <returns type="Array"></returns>

    return [(this >>> 24) & 0xff, (this >>> 16) & 0xff, (this >>> 8) & 0xff, this & 0xff];
};

Number.prototype.bytes32sw = function () {
    /// <summary>转换为倒置32位bytes</summary>
    /// <returns type="Array"></returns>

    return [this & 0xff, (this >>> 8) & 0xff, (this >>> 16) & 0xff, (this >>> 24) & 0xff];
};

Number.prototype.bytes16 = function () {
    /// <summary>转换为16位bytes</summary>
    /// <returns type="Array"></returns>

    return [(this >>> 8) & 0xff, this & 0xff];
};

Number.prototype.bytes16sw = function () {
    /// <summary>转换为倒置16位bytes</summary>
    /// <returns type="Array"></returns>

    return [this & 0xff, (this >>> 8) & 0xff];
};

Array.prototype.shuffle = function () {
    /// <summary>洗牌</summary>
    /// <returns type="Array"></returns>

    var tempList = [];

    for (var i = this.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        tempList[i] = this[j];
        tempList[j] = this[i];
    }
    return tempList;
};

Array.prototype.insert = function (value, index) {
    /// <summary>插入项</summary>
    /// <param name="value" type="Object">元素</param>
    /// <param name="index" type="Number">索引</param>
    /// <returns type="Array"></returns>

    if (index > this.length) index = this.length;
    if (index < -this.length) index = 0;
    if (index < 0) index = this.length + index;
    for (var i = this.length; i > index; i--) {
        this[i] = this[i - 1];
    }
    this[index] = value;
    return this;
};

Array.prototype.remove = function (index) {
    /// <summary>移除项</summary>
    /// <param name="index" type="Number">索引</param>
    /// <returns type="Array">数组</returns>

    return (index < 0) ? this : this.slice(0, index).concat(this.slice(index + 1, this.length));
};

Array.prototype.clear = function () {
    /// <summary>清空数组</summary>

    this.length = 0;
};

Array.prototype.adler32 = function (start, len) {
    /// <summary>计算Adler32校验和</summary>
    /// <param name="start" type="Number">起始位置</param>
    /// <param name="len" type="Number">长度</param>
    /// <returns type="Number"></returns>

    switch (arguments.length) { case 0: start = 0; case 1: len = this.length - start; }
    var a = 1, b = 0;
    for (var i = 0; i < len; i++) {
        a = (a + this[start + i]) % 65521; b = (b + a) % 65521;
    }
    return ((b << 16) | a).toUInt();
};

Array.prototype.crc32 = function (start, len) {
    /// <summary>计算CRC32校验和</summary>
    /// <param name="start" type="Number">起始位置</param>
    /// <param name="len" type="Number">长度</param>
    /// <returns type="Number"></returns>

    switch (arguments.length) { case 0: start = 0; case 1: len = this.length - start; }
    var table = arguments.callee.crctable;
    if (!table) {
        table = [];
        var c;
        for (var n = 0; n < 256; n++) {
            c = n;
            for (var k = 0; k < 8; k++)
                c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            table[n] = c.toUInt();
        }
        arguments.callee.crctable = table;
    }
    var c = 0xffffffff;
    for (var i = 0; i < len; i++)
        c = table[(c ^ this[start + i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff).toUInt();
};

String.format = function (str, args) {
    /// <summary>格式化字符串</summary>
    /// <param name="str" type="String">要格式化的字符串</param>
    /// <param name="args" type="[..]">其余参数</param>
    /// <returns type="String"></returns>

    var tempStr = str;
    for (var i = 0; i < arguments.length; i++) {
        var reg = eval("/\\{" + i + "\\}/g");
        tempStr = tempStr.replace(reg, arguments[i + 1]);
    }
    return tempStr;
};

String.prototype.repeat = function (n) {
    /// <summary>重复字符串</summary>
    /// <param name="n" type="Number">要重复的次数</param>
    /// <returns type="String"></returns>

    var _this = this;
    var result = '';
    for (var i = 0; i < n; i++) {
        result += _this;
    }
    return result;
};

if ("DataView" in window) {
    DataView.prototype.getString = function (pos, length) {
        /// <summary>获取特定字符串</summary>
        /// <param name="pos" type="Number">起始点</param>
        /// <param name="length" type="Number">获取长度</param>
        /// <returns type="String"></returns>

        var str = "";
        var u8 = new Uint8Array(1);
        for (var i = pos; i < pos + length; i++) {
            u8[0] = this.getUint8(i);
            if (u8[0] == 0) break;
            str += String.fromCharCode(u8[0]);
        }
        return str;
    };

    DataView.prototype.getVectorN = function (pos, n) {
        /// <summary>获取向量N</summary>
        /// <param name="pos" type="Number">起始点</param>
        /// <param name="n" type="Number">获取长度</param>
        /// <returns type="Float32Array"></returns>

        var vec = new Float32Array(n);
        for (var i = 0 ; i < n ; i++) {
            vec[i] = this.getFloat32(pos + i * 4, true);
        }
        return vec;
    }
}