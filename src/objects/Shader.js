Jyo.Shader = function () {
    /// <summary>渲染器类</summary>
    /// <returns type="Jyo.Shader"></returns>

    // 具体对象
    this.object = null;

    // 是否为软件渲染
    this.isSoftware = false;

    // 着色器类型
    this.type = "unkonw";
};

Jyo.Shader.prototype = new Jyo.Object({
    // 指示可用加载器
    useLoader: "Shader",
    bind: function (renderer, webglShader) {
        /// <summary>绑定具体对象到托管对象</summary>
        /// <param name="renderer" type="Jyo.Renderer">绑定的渲染器</param>
        /// <param name="webglShader" type="WebGLShader">要绑定的具体对象</param>

        this.object = webglShader;

        if (renderer.mode == "WebGL") {
            var gl = renderer.context;
            if (webglShader instanceof WebGLShader) {
                this.type = gl.getShaderParameter(webglShader, gl.SHADER_TYPE);
                switch (gl.getShaderParameter(webglShader, gl.SHADER_TYPE)) {
                    case gl.VERTEX_SHADER:
                        this.type = "VERTEX_SHADER";
                        break;
                    case gl.FRAGMENT_SHADER:
                        this.type = "FRAGMENT_SHADER";
                        break;
                }
            }
            this.gl = gl;
        } else if (renderer.mode == "Canvas") {
            // 转换GLSL为像素处理函数
        }
    },
    getHashCode: function () {
        /// <summary>返回此着色器的哈希代码</summary>
        /// <returns type="Number">一个指定此着色器的哈希代码的整数</returns>

        return 111;
    },
    equals: function (value) {
        /// <summary>测试两个着色器是否相等</summary>
        /// <param name="value" type="Jyo.Shader">要进行比较的Jyo.Shader</param>
        /// <returns type="Boolean"></returns>

        if (this === value ||
            value instanceof Jyo.Shader &&
            this.getHashCode() === value.getHashCode() &&
            this.object === value.object) {
            return true;
        }
        return false;
    },
    destroy: function () {
        /// <summary>销毁对象</summary>

        if (this.gl) {
            this.gl.deleteShader(this.object);
        }
        this.object = null;
        delete this.object;
    }
});