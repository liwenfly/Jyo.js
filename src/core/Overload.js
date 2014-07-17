Jyo.Overload = function () {
    "use strict";

    // 重载所记录的数组
    var list = [];

    // 匹配函数名正则
    var reFunction = /function\s((\w|\w)+)/;

    var fun = function () {
        /// <summary>调用重载函数</summary>

        var canRun = false;

        for (var i = 0, types; i < list.length; i += 2) {
            types = list[i];

            if (types.length === 0 && arguments.length == 0) {
                canRun = true;
                break;
            }

            if (types.length != arguments.length &&
                types.length &&
                types[types.length - 1] !== "...") {
                continue;
            }

            for (var n = 0, type, inputType; n < types.length; n++) {
                type = types[n] || "",
                inputType = arguments[n];

                if (type === "...") {
                    if (n + 1 === types.length) {
                        canRun = true;
                    }
                    break;
                }

                var typeName = type.toString().match(reFunction) || "";
                if (typeName != null && typeName != "") typeName = typeName[1];

                if (type === "*" ||
                    type === inputType ||
                    inputType instanceof type ||
                    typeof inputType == typeName.toLowerCase()) {
                    if (n + 1 === types.length) {
                        canRun = true;
                        break;
                    }
                    continue;
                }
                break;
            }

            if (canRun) {
                break;
            }
        }

        if (canRun) {
            return list[i + 1].apply(this, arguments);
        }

        throw new TypeError("Invalid parameter");
    };

    fun.add = function (types, callback) {
        /// <summary>添加重载函数</summary>
        /// <param name="types" type="String">重载所需要的函数类型表</param>
        /// <param name="callback" type="Function">重载所触发的函数</param>

        types = types || [];

        if (types instanceof Array) {
            list.push(types, callback);
            return this;
        }

        if (types != null && types.trim() !== "") {
            types = types.split(",");
        }

        for (var i = types.length, type; i--;) {
            type = types[i].trim();

            if (type === "..." || type == "*") {
                continue;
            }

            types[i] = type = eval(type);

            if (typeof types[i] == "undefined") {
                throw new ReferenceError(typeList[i] + " is not defined");
            }
        }

        list.push(types, callback);
        return this;
    };

    return fun;
};