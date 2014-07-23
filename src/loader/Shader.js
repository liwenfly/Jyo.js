Jyo.Content.Shader = new Jyo.Object({
    // 指示加载器类型
    type: "Shader",
    // 指示支持的格式
    supportList: ["vs", "fs", "glvs", "glfs"],
    load: function (content, object, filename, callback) {
        /// <summary>加载</summary>
        /// <param name="content" type="Jyo.Content">内容管理器对象</summary>
        /// <param name="object" type="Object">要绑定到的对象</param>
        /// <param name="filename" type="String">文件名</param>
        /// <param name="callback" type="Function" optional="true">加载完成后的处理函数</param>

        // 获取文件后缀名
        var extName = /\.([^\.]+)$/.exec(filename)[1].trim().toLowerCase();

        var type = "";
        // 判断类型
        if (extName == "vs" || extName == "glvs") {
            type = "VERTEX_SHADER";
        } else {
            type = "FRAGMENT_SHADER";
        }

        if (content.renderer.mode == "WebGL") {
            // 检测是否绑定到WebGL渲染器
            var gl = content.renderer.context;
        }

        Jyo.loadFile(filename, true, null, function (str) {
            if (typeof gl != "undefined") {
                var shaderObj = gl.createShader(gl[type]);
                gl.shaderSource(shaderObj, str);
                gl.compileShader(shaderObj);
                // 检查错误
                var error = gl.getError();
                if (error !== gl.NO_ERROR && error !== gl.CONTEXT_LOST_WEBGL) {
                    throw new Error(error);
                }
                if (!gl.getShaderParameter(shaderObj, gl.COMPILE_STATUS)) {
                    throw new Error("Shader \"" + filename + "\" compile error" + ":\r\n" + gl.getShaderInfoLog(shaderObj));
                }
                object.bind(content.renderer, shaderObj);
                content.loadDoneNum++;
                callback && callback(object);
            }
        });
    },
    getHashCode: function () {
        /// <summary>返回此加载器的哈希代码</summary>
        /// <returns type="Number">一个指定此加载器的哈希代码的整数</returns>

        return this.supportList.length ^ 1001;
    },
    equals: function (value) {
        /// <summary>测试两个加载器是否相等</summary>
        /// <param name="value" type="Jyo.Object">要进行比较的Jyo.Object</param>
        /// <returns type="Boolean"></returns>

        if (this === value ||
            this.getHashCode() === value.getHashCode() &&
            this.type === value.type) {
            return true;
        }
        return false;
    }
});