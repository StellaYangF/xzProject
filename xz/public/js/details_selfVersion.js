$(function () {
    if (location.search !== "") {
        var lid = location.search.split("=")[1];
        $.ajax({//向服务器发送请求
            url: "http://localhost:3000/details",
            type: "get",
            data: { lid },//{lid:lid}
            dataType: "json",
            success(res) {
                console.log(res);
                //解构数组
                var { product, specs, pics } = res;
                $("#details>h6:first")
                    .html(product.title)
                    .next()
                    .html(`<a class="small text-dark font-weight-bold" href="javascript:;">${product.subtitle}</a>`)
                    .next()
                    .find("div>h2")
                    .html(`¥${product.price.toFixed(2)}`)
                    .parent().next()
                    .children().last()
                    .html(product.promise);
                /*规格遍历方法*/
                var html = "";
                for (var spec of specs) {
                    html += `<a class="btn btn-sm btn-outline-secondary ${spec.lid == lid ? 'active' : ''}" href="product_details.html?lid=${spec.lid}">${spec.spec}</a>`;
                }
                // 把html内容重新赋值给规格表中
                $("#details>div:eq(1)>div:eq(1)")
                    .html(html);

                /********* 1. 放大镜效果*********/
                // 将获得的商品图片放到对应位置
                var html = "";
                // 所有图片的小图片应该放在底部的<ul>中
                for (var p of pics) {
                    html += `<li class="float-left p-1">
                            <img src="${p.sm}" data-md="${p.md}" data-lg="${p.lg}">
                          </li>`;
                }
                // 将多个<li>的片段放入ul中
                var $ul = $("#preview>div>div:last ul")
                    .html(html)
                    .css({ width: 62 * pics.length });
                // 第一张图片的中图片应该放在上方的img中
                var $mImg = $("#preview>div>img")
                    .attr({ src: pics[0].md });
                var $divLg = $("#div-lg")
                    .css({
                        backgroundImage: `url(${pics[0].lg})`
                    });

                /*********2. 点击按钮*********/
                // 找到按钮
                // 绑定事件
                //   左右按钮移动，查找两个按钮
                var $btnLeft = $("#preview>div>div>img:first");
                var $btnRight = $btnLeft.next().next();
                // 图片少于4张时，右边按钮禁用
                if (pics.length <= 4) {
                    $btnRight.addClass("disabled")
                }
                var moved = 0;
                $btnRight.click(function () {
                    // 只有当前按钮不是.disabled
                    if ($(this).is(":not(.disabled)")) {
                        moved++;
                        $ul.css({ marginLeft: -62 * moved });
                        // 只要当前按钮能用，则启用左边的按钮
                        $btnLeft.removeClass("disabled")
                        if (moved + 4 == pics.length) {
                            //禁用右边按钮
                            $(this).addClass("disabled")
                        }
                    }
                })
                $btnLeft.click(function () {
                    // 如果左边按钮不带有.disabled属性时
                    if ($(this).is(":not(.disabled)")) {
                        // moved数值发生变化
                        moved--;
                        // ul可往左侧移动
                        $ul.css({ marginLeft: -62 * moved });
                        $btnRight.removeClass("disabled");
                        // 如果moved为0时
                        if (moved == 0) {
                            // 左边按钮禁用
                            $(this).addClass("disabled")
                        }
                    }
                })

                /*********3. 鼠标移入小图片img，切换中图片和大图片*********/
                $ul.on("mouseenter", "li>img", function () {
                    var $img = $(this);
                    var src = $img.attr("data-md");
                    $mImg.attr({ src });
                    var backgroundImage = `url(${$img.attr("data-lg")})`;
                    $divLg.css({ backgroundImage });
                })
                // 利用冒泡获取当前img
                /* 
                $ul.on("mouseenter", "li>img", function () {
                    var $img = $(this);
                    // 获取当前img上缓存的data-md/data-lg的地址
                    var src = $img.attr("data-md");
                    $mImg.attr({ src });
                    // 修改divLg的图片
                    var backgroundImage = `url(${$img.attr("data-lg")})`;
                    $divLg.css({ backgroundImage });
                })
                */

                /********* 4. 鼠标进入super-mask和移出时，隐藏和显示mask和div-lg*********/
                var $mask = $("#mask");
                var $smask = $("#super-mask");
                var max = 176;
                $smask
                    .hover(function () {
                        $mask.toggleClass("d-none");
                        $divLg.toggleClass("d-none");
                    })
                    /********* 5. 放大镜最终效果*********/
                    .mousemove(function (e) {
                        var top = e.offsetY - 88;
                        var left = e.offsetX - 88;
                        if (top < 0) top = 0;
                        if (top > max) top = max;
                        if (left < 0) left = 0;
                        if (left > max) left = max;
                        var backgroundPosition = `${-16 / 7 * left}px ${-16 / 7 * top}px`;
                        $mask.css({ left, top });
                        $divLg.css({ backgroundPosition });
                    })
            }
        })
    }
})
