Jyo.Content.Audio = new Jyo.Object({
    // 指示加载器类型
    type: "Audio",
    // 指示支持的格式
    supportList: ["mp3", "ogg", "wav", "aac"],
    load: function (content, object, filename, callback) {
        /// <summary>加载</summary>
        /// <param name="content" type="Jyo.Content">内容管理器对象</summary>
        /// <param name="object" type="Object">要绑定到的对象</param>
        /// <param name="filename" type="String">文件名</param>
        /// <param name="callback" type="Function" optional="true">加载完成后的处理函数</param>

        var audio = document.createElement("audio");

        audio.setAttribute("preload", "preload");

        audio.addEventListener("pause", function () {
            object.isPlaying = false;
        });

        audio.addEventListener("play", function () {
            object.isPlaying = true;
        });

        audio.addEventListener("ended", function () {
            if (object.isLoop) {
                object.stop();
                object.play();
            }
        });

        audio.addEventListener("error", function (e) {
            if (this.error.code == 4) {
                object.bind(content.renderer, this);
                content.loadDoneNum++;
                callback && callback(object);
            } else {
                throw new Error("File \"" + filename + "\" failed to load");
            }
        });

        audio.addEventListener("canplaythrough", function () {
            object.bind(content.renderer, this);
            content.loadDoneNum++;
            callback && callback(object);
        });

        audio.src = filename;

        audio.load();
    },
    getHashCode: function () {
        /// <summary>返回此加载器的哈希代码</summary>
        /// <returns type="Number">一个指定此加载器的哈希代码的整数</returns>

        return this.supportList.length ^ 1003;
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