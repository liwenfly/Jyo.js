Jyo.Object = function (objProto) {
    /// <summary>Jyo.Object类</summary>
    /// <param name="objProto" type="Object" optional="true">对象原型</param>
    /// <returns type="Jyo.Object"></returns>

    this.getHashCode = function () {
        /// <summary>用作特定类型的哈希函数</summary>
        /// <returns type="Number"></returns>

        return 0;
    };

    this.equals = function (obj) {
        /// <summary>确定指定的Object是否等于当前的Object</summary>
        /// <param name="obj" type="Jyo.Object">与当前Object进行比较的Object</param>
        /// <returns type="Boolean"></returns>

        if (!obj) {
            return false;
        }
        return true;
    };

    this.memberwiseClone = function () {
        /// <summary>创建当前Object的浅表副本</summary>
        /// <returns type="Jyo.Object"></returns>

        var obj = new Jyo.Object();
        for (var i in this) {
            if (typeof this[i] != "function" && this.hasOwnProperty(i)) {
                obj[i] = this[i];
            }
        }
        return obj;
    };

    if (typeof objProto != "undefined") {
        for (var i in objProto) {
            this[i] = objProto[i];
        }
    }
};

Jyo.Object.equals = Jyo.Overload().add("*,*", function (objA, objB) {
    /// <summary>确定指定的Object实例是否被视为相等</summary>
    /// <param name="objA" type="Jyo.Object">要比较的第一个Object</param>
    /// <param name="objB" type="Jyo.Object">要比较的第二个Object</param>
    /// <returns type="Boolean"></returns>

    if (!objA && !objB ||
        objA === objB ||
        (objA instanceof Jyo.Object && objA.equals(objB) && objB instanceof Jyo.Object && objA.getHashCode() === objB.getHashCode())) {
        return true;
    }
    return false;
});