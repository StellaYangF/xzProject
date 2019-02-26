$(function () {
  //获得从首页传来的商品id
  //http://.../product_details.html?lid=5
  //|              location              |
  //                               |search|
  //                                   |
  //                              [?lid, 5 ]
  //                                [0] [1]
  //获得地址栏中的商品编号lid
  if (!location.search == "") {
    var lid = location.search.split("=")[1];
    // console.log(lid);
    $.ajax({
      //向服务端发送请求
      url: `http://localhost:3000/details`,
      type: "get",
      //{lid:lid}用lid作为查询参数
      data: { lid },
      dataType: "json",
      //得到服务端返回的当前商品的详细信息
      success(result) {
        console.log(result);
        //解构:
        var { pics, product, specs } = result;
        // console.log(pics,product,specs);
        /*将基本信息放在页面右上角部分*/
        $("#details>h6:first").html(product.title)
          //查找title，并设置内容
          .next().html(`<a class="small text-dark font-weight-bold" href="javascript:;">${product.subtitle}</a>`)
          .next()
          .find("div>h2")
          .html(`¥${product.price.toFixed(2)}`)
          .parent().next()
          .children().last()
          .html(product.promise)

        /*将规格列表添加到页面*/
        //准备空字符串拼接多个<a>
        var html = "";
        for (var spec of specs) {
          html += `<a class="btn btn-sm btn-outline-secondary ${spec.lid == lid ? 'active' : ''}" href="product_details.html?lid=${spec.lid}">${spec.spec}</a>`;
        }
        //将HTML放入对应div中
        $("#details>div:eq(1)>div:eq(1)")
          .html(html);

        /*放大镜效果*/
        //1. 将获得的商品图片放到对应位置
        //所有图片的小图片应该放在底部的<ul>中
        //pics:[{图片对象},{图片对象},...]
        //定义空字符串准备累加<li>
        //遍历pics中每个图片对象

        //p:{lid:,sm:url,md:url,lg:url}
        var html = "";
        for (var p of pics) {
          html += `<li class="float-left p-1">
          <img src="${p.sm}" data-md="${p.md}" data-lg="${p.lg}">
          </li>`;
        }
        var $ul = $("#preview>div>div ul")
          .css({ width: 62 * pics.length })
          .html(html);


        //第一张图片的中图片应该放在上方的img中
        $mImg = $("#preview>div>img")
          .attr({ src: pics[0].md })

        //第一张图片的大图片应该放在隐藏的大div中
        $divLg=$("#div-lg")
        .attr({src:pics[0].lg});


        //2. 点击左右按钮，让ul左右移动
        //查找两个按钮:
        var $btnLeft=$("#preview>div>div>img:first");
        var $btnRight=$btnLeft.next().next();
        if(pics.length<4){
          $btnRight.addClass("disabled")
        }
        var moved=0;
        $btnRight.click(function(){
          moved++;
          $ul.css({marginLeft:-62*moved})
        })
        $btnLeft.click(function(){
          moved--;
          $ul.css({marginLeft:-62*moved})
        })

        //如果pics的图片张数<=4张

        //右边按钮禁用


        //记录左移的次数
        //点击右边按钮，ul向左移动一次

        //只有当前按钮不是.disabled

        //左移的次数+1
        //设置ul的margin-left永远等于li的宽 -62*左移的次数moved

        //启用左边按钮

        //如果左移的张数+4张刚好==图片总数

        //禁用右边按钮




        //点击左边按钮，ul向右移动一次

        //只有当前按钮不是.disabled

        //左移的次数-1







        //3. 鼠标移入小图片img，切换中图片和大图片
        //利用冒泡：事件绑定在$ul上，只允许img元素触发事件

        //获得当前img
        //获取当前img上的data-md属性

        //修改中图片的src
        //获取当前img上的data-lg属性


        //修改大图片的backgroundImage


        //4. 鼠标进入superMask，显示遮罩层和大图片
        //   鼠标移出superMask，隐藏遮罩层和大图片


        //superMask352-mask176

        /*.mouseenter(function(){
          $mask.removeClass("d-none");
          $divLg.removeClass("d-none");
        })
        .mouseleave(function(){
          $mask.addClass("d-none");
          $divLg.addClass("d-none");
        })*/
        /*.hover(
          function(){
            $mask.removeClass("d-none");
            $divLg.removeClass("d-none");
          },
          function(){
            $mask.addClass("d-none");
            $divLg.addClass("d-none");
          }
        )*/




        //5. mask跟随鼠标移动，并同步移动大div的背景图片位置












      }
    })
  }
  //在product_details.html中右键live server运行，在地址栏后补充?lid=5，打开控制台
})