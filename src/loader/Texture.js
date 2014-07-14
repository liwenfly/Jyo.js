Jyo.Content.Texture = new Jyo.Object({
    // 指示加载器类型
    type: "Texture",
    // 指示支持的格式
    supportList: ["bmp", "png", "jpg", "jpeg", "gif"],
    load: function (content, object, filename) {
        /// <summary>加载</summary>
        /// <param name="content" type="Jyo.Content">内容管理器对象</summary>
        /// <param name="object" type="Object">要绑定到的对象</param>
        /// <param name="filename" type="String">文件名</param>

        var img = new Image();
        img.onload = function () {
            object.bind(content.renderer, this);
            content.loadDoneNum++;
        };
        img.onerror = function () {
            throw new Error("File \"" + filename + "\" failed to load");
        };
        img.src = filename;
    },
    getHashCode: function () {
        /// <summary>返回此加载器的哈希代码</summary>
        /// <returns type="Number">一个指定此加载器的哈希代码的整数</returns>

        return this.supportList.length ^ 1002;
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