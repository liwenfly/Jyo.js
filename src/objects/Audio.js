Jyo.Audio = function () {
    /// <summary>音频类</summary>
    /// <returns type="Jyo.Audio"></returns>

    // 具体对象
    this.object = null;
};

Jyo.Audio.prototype = new Jyo.Object({
    // 指示可用加载器
    useLoader: "Audio",
    bind: function (renderer, audio) {
        /// <summary>绑定具体对象到托管对象</summary>
        /// <param name="renderer" type="Jyo.Renderer">绑定的渲染器</param>
        /// <param name="audio" type="Audio">要绑定的具体对象</param>

        this.object = audio;
    },
    play: function () {
        /// <summary>开始播放</summary>

        if (this.object != null && this.object.readyState == 4) {
            this.object.play();
        }
    },
    pause: function () {
        /// <summary>暂停音乐</summary>

        if (this.object != null && this.object.readyState == 4) {
            this.object.pause();
        }
    },
    stop: function () {
        /// <summary>停止播放音乐</summary>

        if (this.object != null && this.object.readyState == 4) {
            this.object.pause();
            this.object.currentTime = 0;
        }
    },
    getHashCode: function () {
        /// <summary>返回此材质的哈希代码</summary>
        /// <returns type="Number">一个指定此材质的哈希代码的整数</returns>

        return 113;
    },
    equals: function (value) {
        /// <summary>测试两个音频是否相等</summary>
        /// <param name="value" type="Jyo.Audio">要进行比较的Jyo.Audio</param>
        /// <returns type="Boolean"></returns>

        if (this === value ||
            value instanceof Jyo.Audio &&
            this.getHashCode() === value.getHashCode() &&
            this.object === value.object) {
            return true;
        }
        return false;
    },
    destroy: function () {
        /// <summary>销毁对象</summary>

        this.stop();
        this.object = null;
        delete this.object;
    }
});