Jyo.Content = function () {
    /// <summary>内容管理器类</summary>
    /// <returns type="Jyo.Content"></returns>

    // 要加载的文件根路径
    this.rootDirectory = "";

    Jyo.Content.constructor.apply(this, arguments);
};

Jyo.Content.constructor = Jyo.Overload().
                          add("Jyo.Renderer", function (renderer) {
                              /// <summary>内容管理器构造函数</summary>
                              /// <param name="renderer" type="Jyo.Renderer">要绑定到的渲染器对象</param>
                              /// <returns type="Jyo.Content"></returns>

                              // 同步加载中数量
                              this.loadNum = 0;

                              // 加载完成数量
                              this.loadDoneNum = 0;

                              // 绑定到的渲染器
                              this.renderer = renderer;
                          }).
                          add("Jyo.Renderer, String", function (renderer, rootDirectory) {
                              /// <summary>内容管理器构造函数</summary>
                              /// <param name="renderer" type="Jyo.Renderer">要绑定到的渲染器对象</param>
                              /// <param name="rootDirectory" type="String">要加载的文件根路径</param>
                              /// <returns type="Jyo.Content"></returns>

                              // 路径检测
                              if (rootDirectory.lastIndexOf("/") != rootDirectory.length - 1) {
                                  rootDirectory += "/";
                              }

                              // 设置默认加载路径
                              this.rootDirectory = rootDirectory;

                              Jyo.Content.call(this, renderer);
                          });

Jyo.Content.prototype = new Jyo.Object({
    load: Jyo.Overload().
          add("Object, String", function (object, filename) {
              /// <summary>加载文件</summary>
              /// <param name="object" type="Object">要绑定到的对象</param>
              /// <param name="filename" type="String">要加载的文件名</param>

              if (object.object) return;

              var _this = this;

              // 获取文件后缀名
              var extName = /\.([^\.]+)$/.exec(filename)[1].trim().toLowerCase();

              if (typeof object.useLoader != "undefined") {
                  this.loadNum++;
                  var loader = null;
                  for (var i in Jyo.Content) {
                      loader = Jyo.Content[i];
                      if (typeof loader.supportList != "undefined") {
                          for (var extIndex = loader.supportList.length; extIndex--;) {
                              if (extName == loader.supportList[extIndex] && object.useLoader == loader.type) {
                                  loader.load(this, object, this.rootDirectory + "/" + filename);
                                  return;
                              }
                          }
                      }
                  }
                  throw new Error("\"" + extName + "\" file does not support the import");
              } else {
                  throw new Error("Does not support the type of file to load");
              }
          }).
          add("Object, String, Function", function (object, filename, callback) {
              /// <summary>加载文件</summary>
              /// <param name="object" type="Object">要绑定到的对象</param>
              /// <param name="filename" type="String">要加载的文件名</param>
              /// <param name="callback" type="Function">加载完成后处理函数</param>

              if (object.object) return;

              var _this = this;

              // 获取文件后缀名
              var extName = /\.([^\.]+)$/.exec(filename)[1].trim().toLowerCase();

              if (typeof object.useLoader != "undefined") {
                  this.loadNum++;
                  var loader = null;
                  for (var i in Jyo.Content) {
                      loader = Jyo.Content[i];
                      if (typeof loader.supportList != "undefined") {
                          for (var extIndex = loader.supportList.length; extIndex--;) {
                              if (extName == loader.supportList[extIndex] && object.useLoader == loader.type) {
                                  loader.load(this, object, this.rootDirectory + "/" + filename, callback);
                                  return;
                              }
                          }
                      }
                  }
                  throw new Error("\"" + extName + "\" file does not support the import");
              } else {
                  throw new Error("Does not support the type of file to load");
              }
          }).
          add("Object, String, Object", function (object, filename, loader) {
              /// <summary>加载文件</summary>
              /// <param name="object" type="Object">要绑定到的对象</param>
              /// <param name="filename" type="String">要加载的文件名</param>
              /// <param name="loader" type="Function">自定义加载器</param>

              if (object.object) return;

              var _this = this;

              // 获取文件后缀名
              var extName = /\.[^\.]+$/.exec(filename).trim().toLowerCase();

              if (typeof object.useLoader != "undefined") {
                  this.loadNum++;
                  if (typeof loader.supportList != "undefined") {
                      for (var extIndex = loader.supportList.length; extIndex--;) {
                          if (extName == loader.supportList[extIndex] && object.useLoader == loader.type) {
                              loader.load(this, object, this.rootDirectory + "/" + filename);
                              return;
                          }
                      }
                  }
                  throw new Error("\"" + extName + "\" file does not support the import");
              } else {
                  throw new Error("Does not support the type of file to load");
              }
          }),
    isLoading: function () {
        /// <summary>指示是否已加载完成</summary>
        /// <returns type="Boolean"></returns>

        if (this.loadNum > this.loadDoneNum) {
            return true;
        }
        return false;
    },
    getHashCode: function () {
        /// <summary>返回此内容管理器的哈希代码</summary>
        /// <returns type="Number">一个指定此内容管理器的哈希代码的整数</returns>

        return this.renderer.getHashCode() ^ 10;
    },
    equals: function (value) {
        /// <summary>测试两个内容管理器是否相等</summary>
        /// <param name="value" type="Jyo.Content">要进行比较的Jyo.Content</param>
        /// <returns type="Boolean"></returns>

        if (this === value ||
            value instanceof Jyo.Content &&
            this.getHashCode() === value.getHashCode() &&
            this.rootDirectory === value.rootDirectory &&
            this.loadNum === value.loadNum &&
            this.loadDoneNum === value.loadDoneNum) {
            return true;
        }
        return false;
    }
});