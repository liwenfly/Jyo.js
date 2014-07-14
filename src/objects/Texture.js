Jyo.Texture = function () {
    /// <summary>材质类</summary>
    /// <returns type="Jyo.Texture"></returns>

    // 具体对象
    this.object = null;
};

Jyo.Texture.prototype = new Jyo.Object({
    // 指示可用加载器
    useLoader: "Texture",
    bind: function (renderer, img) {
        /// <summary>绑定具体对象到托管对象</summary>
        /// <param name="renderer" type="Jyo.Renderer">绑定的渲染器</param>
        /// <param name="img" type="WebGLShader">要绑定的具体对象</param>

        if (renderer.mode == "WebGL") {
            var gl = renderer.context;
            var texture = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, texture);
            // 控制滤波
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            var error = gl.getError();
            if (error !== gl.NO_ERROR && error !== gl.CONTEXT_LOST_WEBGL) {
                throw new Error(error);
            }
            texture.image = img;
            this.gl = gl;
        }

        this.object = texture || img;
        this.width = img.width;
        this.height = img.height;
    },
    getHashCode: function () {
        /// <summary>返回此材质的哈希代码</summary>
        /// <returns type="Number">一个指定此材质的哈希代码的整数</returns>

        return 112;
    },
    equals: function (value) {
        /// <summary>测试两个材质是否相等</summary>
        /// <param name="value" type="Jyo.Texture">要进行比较的Jyo.Texture</param>
        /// <returns type="Boolean"></returns>

        if (this === value ||
            value instanceof Jyo.Texture &&
            this.getHashCode() === value.getHashCode() &&
            this.object === value.object) {
            return true;
        }
        return false;
    },
    destroy: function () {
        /// <summary>销毁对象</summary>

        if (this.gl) {
            this.gl.deleteTexture(this.object);
        }
        this.object = null;
        delete this.object;
    }
});