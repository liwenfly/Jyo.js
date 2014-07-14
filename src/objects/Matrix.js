Jyo.Matrix = function () {
    /// <summary>矩阵类</summary>
    /// <returns type="Jyo.Matrix"></returns>

    Jyo.Matrix.constructor.apply(this, arguments);
};

Jyo.Matrix.constructor = Jyo.Overload().
                         add(null, function () {
                             /// <summary>矩阵对象构造函数</summary>
                             /// <returns type="Jyo.Matrix"></returns>

                             // 创建4*4矩阵的变量
                             for (var y = 1; y <= 4; y++) {
                                 for (var x = 1; x <= 4; x++) {
                                     this["m" + y + x] = 0;
                                 }
                             }
                         }).
                         add("Number,".repeat(15) + "Number", function (m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
                             /// <summary>矩阵对象构造函数</summary>
                             /// <param  name="m11" type="Number">矩阵中的一行第一列的值</param>
                             /// <param  name="m12" type="Number">矩阵中的一行第二列的值</param>
                             /// <param  name="m13" type="Number">矩阵中的一行第三列的值</param>
                             /// <param  name="m14" type="Number">矩阵中的一行第四列的值</param>
                             /// <param  name="m21" type="Number">矩阵中的二行第一列的值</param>
                             /// <param  name="m22" type="Number">矩阵中的二行第二列的值</param>
                             /// <param  name="m23" type="Number">矩阵中的二行第三列的值</param>
                             /// <param  name="m24" type="Number">矩阵中的二行第四列的值</param>
                             /// <param  name="m31" type="Number">矩阵中的三行第一列的值</param>
                             /// <param  name="m32" type="Number">矩阵中的三行第二列的值</param>
                             /// <param  name="m33" type="Number">矩阵中的三行第三列的值</param>
                             /// <param  name="m34" type="Number">矩阵中的三行第四列的值</param>
                             /// <param  name="m41" type="Number">矩阵中的四行第一列的值</param>
                             /// <param  name="m42" type="Number">矩阵中的四行第二列的值</param>
                             /// <param  name="m43" type="Number">矩阵中的四行第三列的值</param>
                             /// <param  name="m44" type="Number">矩阵中的四行第四列的值</param>
                             /// <returns type="Jyo.Matrix"></returns>

                             // 创建4*4矩阵的变量
                             this.m11 = m11;
                             this.m12 = m12;
                             this.m13 = m13;
                             this.m14 = m14;
                             this.m21 = m21;
                             this.m22 = m22;
                             this.m23 = m23;
                             this.m24 = m24;
                             this.m31 = m31;
                             this.m32 = m32;
                             this.m33 = m33;
                             this.m34 = m34;
                             this.m41 = m41;
                             this.m42 = m42;
                             this.m43 = m43;
                             this.m44 = m44;
                         });

// 矩阵相加
Jyo.Matrix.add = Jyo.Overload().
                 add("Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2) {
                     /// <summary>矩阵相加</summary>
                     /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                     /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                     /// <returns type="Jyo.Matrix"></returns>

                     var newMatrix = new Jyo.Matrix(),
                         attrName = null,
                         y, x;

                     for (y = 1; y <= 4; y++) {
                         for (x = 1; x <= 4; x++) {
                             attrName = ["m" + y + x];
                             newMatrix[attrName] = matrix1[attrName] + matrix2[attrName];
                         }
                     }
                     return newMatrix;
                 });

// 矩阵相减
Jyo.Matrix.subtract = Jyo.Overload().
                      add("Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2) {
                          /// <summary>矩阵相减</summary>
                          /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                          /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                          /// <returns type="Jyo.Matrix"></returns>

                          var newMatrix = new Jyo.Matrix(),
                              attrName = null,
                              y, x;

                          for (y = 1; y <= 4; y++) {
                              for (x = 1; x <= 4; x++) {
                                  attrName = ["m" + y + x];
                                  newMatrix[attrName] = matrix1[attrName] - matrix2[attrName];
                              }
                          }
                          return newMatrix;
                      });

// 矩阵相乘
Jyo.Matrix.multiply = Jyo.Overload().
                      add("Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2) {
                          /// <summary>矩阵相乘</summary>
                          /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                          /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                          /// <returns type="Jyo.Matrix"></returns>

                          var newMatrix = new Jyo.Matrix(),
                              y, x, n;

                          for (y = 1; y <= 4; y++) {
                              for (x = 1; x <= 4; x++) {
                                  newMatrix["m" + y + x] = 0;
                                  for (n = 1; n <= 4; n++)
                                      newMatrix["m" + y + x] += matrix1["m" + y + n] * matrix2["m" + n + x];
                              }
                          }
                          return newMatrix;
                      }).
                      add("Jyo.Matrix, Number", function (matrix1, scaleFactor) {
                          /// <summary>由标量值乘以一个矩阵</summary>
                          /// <param name="matrix1" type="Number">源矩阵</param>
                          /// <param name="scaleFactor" type="Number">标量值</param>
                          /// <returns type="Jyo.Matrix"></returns>

                          var newMatrix = new Jyo.Matrix(),
                              attrName = null,
                              y, x;

                          for (y = 1; y <= 4; y++) {
                              for (x = 1; x <= 4; x++) {
                                  attrName = ["m" + y + x];
                                  newMatrix[attrName] = matrix1[attrName] * scaleFactor;
                              }
                          }
                          return newMatrix;
                      }).
                      add("Number, Jyo.Matrix", function (scaleFactor, matrix1) {
                          /// <summary>由标量值乘以一个矩阵</summary>
                          /// <param name="scaleFactor" type="Number">标量值</param>
                          /// <param name="matrix1" type="Number">源矩阵</param>
                          /// <returns type="Jyo.Matrix"></returns>

                          return Jyo.Matrix.multiply(matrix1, scaleFactor);
                      });

// 矩阵相除
Jyo.Matrix.divide = Jyo.Overload().
                      add("Jyo.Matrix, Jyo.Matrix", function (matrix1, matrix2) {
                          /// <summary>矩阵相除</summary>
                          /// <param name="matrix1" type="Jyo.Matrix">源矩阵</param>
                          /// <param name="matrix2" type="Jyo.Matrix">源矩阵</param>
                          /// <returns type="Jyo.Matrix"></returns>

                          var newMatrix = new Jyo.Matrix(),
                              y, x, n;

                          for (y = 1; y <= 4; y++) {
                              for (x = 1; x <= 4; x++) {
                                  attrName = ["m" + y + x];
                                  newMatrix[attrName] = matrix1[attrName] / matrix2[attrName];
                              }
                          }
                          return newMatrix;
                      }).
                      add("Jyo.Matrix, Number", function (matrix1, scaleFactor) {
                          /// <summary>由标量值为被除数计算一个矩阵</summary>
                          /// <param name="matrix1" type="Number">源矩阵</param>
                          /// <param name="scaleFactor" type="Number">标量值</param>
                          /// <returns type="Jyo.Matrix"></returns>

                          var newMatrix = new Jyo.Matrix(),
                              attrName = null,
                              y, x;

                          for (y = 1; y <= 4; y++) {
                              for (x = 1; x <= 4; x++) {
                                  attrName = ["m" + y + x];
                                  newMatrix[attrName] = matrix1[attrName] / scaleFactor;
                              }
                          }
                          return newMatrix;
                      }).
                      add("Number, Jyo.Matrix", function (scaleFactor, matrix1) {
                          /// <summary>由标量值为被除数计算一个矩阵</summary>
                          /// <param name="scaleFactor" type="Number">标量值</param>
                          /// <param name="matrix1" type="Number">源矩阵</param>
                          /// <returns type="Jyo.Matrix"></returns>

                          return Jyo.Matrix.multiply(matrix1, scaleFactor);
                      });

// 矩阵转置
Jyo.Matrix.transpose = Jyo.Overload().
                       add("Jyo.Matrix", function (matrix) {
                           /// <summary>转置矩阵的行和列</summary>
                           /// <param name="matrix" type="Jyo.Matrix">源矩阵</param>
                           /// <returns type="Jyo.Matrix"></returns>

                           var newMatrix = new Jyo.Matrix(),
                               y, x;

                           for (y = 1; y <= 4; y++) {
                               for (x = 1; x <= 4; x++) {
                                   newMatrix["m" + y + x] = matrix["m" + x + y];
                               }
                           }
                           return newMatrix;
                       });

Jyo.Matrix.prototype = new Jyo.Object({
    print: function () {
        /// <summary>打印矩阵</summary>
        /// <returns type="String"></returns>

        var str = "";

        for (var y = 1; y <= 4; y++) {
            for (var x = 1; x <= 4; x++) {
                str += this["m" + y + x] + "\t";
            }
            str += "\r\n";
        }
        return str;
    }
});

// 单位矩阵实例
Jyo.Matrix.identity = new Jyo.Matrix(1, 0, 0, 0,
                                     0, 1, 0, 0,
                                     0, 0, 1, 0,
                                     0, 0, 0, 1);