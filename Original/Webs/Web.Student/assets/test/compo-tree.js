
(function ($) {
    $.fn.compoTree = function (options) {
        var s = this;
        var selector = this.selector; 
        var set = $.extend({
            url: null,
            params: null,
            item: null,
            selectCallback: null,
            groupSize: null,
            placeHolder: null
        }, options);
        var item = set.item;

        s.container = null;
        s.dropdown = null;
        s.drawLis = function(data, parent, level, val) {
            var str = '';
            $(data).each(function() {
                if (this[item.parent] == parent) {
                    var v = val + this[item.value] + ';';
                    this.v = v;
                    str += '<li val="' +
                        v +
                        '" dataid="' +
                        this[item.value] +
                        '" parent="' +
                        this[item.parent] +
                        '">' +
                        '<a href="javascript:void(0)" class="level-' +
                        level +
                        '" title="' +
                        this[item.text] +
                        '"><i class="fa fa-plus-square-o"></i>' +
                        this[item.text] +
                        '</a ></li >';
                    str += s.drawLis(data, this[item.value], level + 1, v);
                     

                }
            });
            return str;
        };
        s.selectOption = function(val) {
            $(selector).val(val);
            var ele = s.dropdown;
            $(ele).find('li').each(function() {
                var id = set.valueType == 0 ? $(this).attr('val') : $(this).attr('dataid');
                if (id == val) {
                    var txt = $(this).find('a').text(); 
                    s.container.find('.btn span').text(txt);
                }
            });
        };
        s.positionDropdown = function() {
            var $dropdown = s.dropdown,
                container = s.container,
                offset = container.offset(),
                height = container.outerHeight(false),
                width = 350,
                dropHeight = 295,
                $window = $(window),
                windowWidth = $window.width(),
                windowHeight = $window.height(),
                viewPortRight = $window.scrollLeft() + windowWidth,
                viewportBottom = $window.scrollTop() + windowHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= $window.scrollTop(),
                dropWidth = 350,
                enoughRoomOnRight = function() {
                    return dropLeft + dropWidth <= viewPortRight;
                },
                enoughRoomOnLeft = function() {
                    return offset.left + viewPortRight + container.outerWidth(false) > dropWidth;
                },
                aboveNow = $dropdown.hasClass("drop-above"),
                bodyOffset,
                above,
                changeDirection,
                css,
                resultsListNode,
                body = $(document.body);
             
            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) {
                    changeDirection = true;
                    above = false;
                }
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) { 
                    changeDirection = true;
                    above = true;
                }
            }

            //if (changeDirection) {
            //    $dropdown.hide();
            //    offset = container.offset();
            //    height = container.outerHeight(false);
            //    width = container.outerWidth(false);
            //    dropHeight = 295;
            //    viewPortRight = $window.scrollLeft() + windowWidth;
            //    viewportBottom = $window.scrollTop() + windowHeight;
            //    dropTop = offset.top + height;
            //    dropLeft = offset.left;
            //    dropWidth = $dropdown.outerWidth(false);
            //    $dropdown.show();
            //}

            if (body.css('position') !== 'static') {
                bodyOffset = body.offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }
            if (!enoughRoomOnRight() && enoughRoomOnLeft()) {
                dropLeft = offset.left + container.outerWidth(false) - dropWidth;
            }

            css = {
                left: dropLeft,
                width: width
            };
            if (above) {
                container.addClass("drop-above");
                $dropdown.addClass("drop-above");
                dropHeight = 295;
                css.top = offset.top - dropHeight; 
                css.bottom = 'auto';
            } else {
                css.top = dropTop;
                css.bottom = 'auto';
                container.removeClass("drop-above");
                $dropdown.removeClass("drop-above");
            }

            $dropdown.css(css);
        };
        s.checkChilds = function () {
            var ele = s.dropdown;
            ele.find('li').each(function () {
                var li = $(this);
                var id = li.attr('dataid');
                var childs = $(ele).find('li[parent="' + id + '"]');
                if (childs.length > 0) {
                    li.find('i').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
                } else {
                    li.find('i').css('opacity', 0);
                }
            });
        }
        s.dropEvents = function() {
            $('.compo-tree-mask').unbind().click(function() {
                $('body').find('.compo-tree-drop').remove();
                $(this).remove();
            });
            var val = $(selector).val();
            if (val != '') {
                s.selectOption(val);
            }
             
            var ele = s.dropdown;
            ele.find('.search-control').focus();
            ele.find('li').each(function() {
                var li = $(this);
                li.find('a').unbind().click(function(e) {
                    if (e.target !== this)
                        return;
                    var val = set.valueType == 0 ? li.attr('val') : li.attr('dataid');
                    s.selectOption(val);
                    $('.compo-tree-drop').remove();
                    $('.compo-tree-mask').remove();
                    if (set.selectCallback != null) {
                        set.selectCallback(val, selector);
                    }
                });
                li.find('a > i').unbind().click(function(e) {
                    if (e.target !== this)
                        return;
                    var i = $(this);
                    var id = $(this).closest('li').attr('dataid');
                    if (i.hasClass('fa-minus-square-o')) {
                        s.visibleChilds(id, false);
                        i.removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
                    } else {
                        s.visibleChilds(id, true);
                        i.removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
                    }
                });
            });

            ele.find('.search-control').unbind().keyup(function() {
                var k = $(this).val();
                if (k.length > 0) {
                    var html = '';
                    $(s.data).each(function() {
                        var str = app.toKeyword(this[item.text]);
                        if (str.indexOf(k) > -1) {
                            html += '<li val="' +
                                this.v +
                                '" dataid="' +
                                this[item.value] +
                                '" parent="' +
                                this[item.parent] +
                                '">' +
                                '<a href="javascript:void(0)" class="level-' +
                                1 +
                                '" title="' +
                                this[item.text] +
                                '"><i class="fa fa-plus-square-o"></i>' +
                                this[item.text] +
                                '</a ></li >';
                        }
                    });
                    s.dropdown.find('ul').html(html);
                } else {
                    var lis = s.drawLis(s.data, null, 1, ';');
                    s.dropdown.find('ul').html(lis);
                }
                s.checkChilds();
                s.dropEvents();
            });
        };
        s.visibleChilds = function(id, open) {
            s.dropdown.find('li').each(function() {
                if ($(this).attr('parent') == id) {
                    $(this).css('display', open ? 'block' : 'none');
                    s.visibleChilds($(this).attr('dataid'), open);
                }
            });
        };
        s.containerEvents = function() {
            s.container.find('.btn').unbind().click(function() {
                var btn = $(this);
                s.positionDropdown();
                $('body').append('<div class="compo-tree-mask"></div>');
                $('body').append(s.dropdown);
                s.dropEvents();

            });
        };
        s.data = null;
        s.init = function () { 
            $(selector).css('display', 'none');
            var html = '<div class="compo-tree" style="' + (set.width != null ? 'width:' + set.width + 'px' : '') + '">';
            html += '<div class="btn-group btn-group-' + (set.groupSize != null ?  set.groupSize : 'sm') + '">' +
                '<button type="button" class="btn btn-default">' +
                '<span>' + set.placeHolder + '</span>' +
                '<i class="caret"></i></button>' +
                '</div></div>';
            $(html).insertAfter($(selector));
            s.container = $(selector).next();
            s.dropdown = $('<div class="compo-tree-drop"></div>');

            var search = '<div class="form-group form-group-sm">' +
                '<input class="form-control search-control" placeholder="Tìm kiếm ..."/><div class="form-control-feedback">' +
                '<i class="icon-search4"></i>' +
                '</div></div>';

            s.dropdown.append(search);
            s.dropdown.append('<ul class="dropdown-menu" style="display: block; position: static; width: 100%; margin-top: 0; float: none;"></ul>');
            if (app.hasValue(set.placeHolder)) {
                var df = '<li val="" dataid="" parent="">' +
                    '<a href="javascript:void(0)" class="level-1" title="' + set.placeHolder + '"><i class="fa fa-minus-square-o" style="opacity: 0;"></i>' + set.placeHolder + '</a ></li >';
                s.dropdown.find('ul').html(df);
            }
            loadData(set.url,
                set.params,
                null,
                function (result) {
                    var data;
                    if (result.Many != null) {
                        data = result.Many;
                    } else {
                        data = result;
                    }
                    s.data = data;

                    if (data.length > 0) {
                        var lis = s.drawLis(data, null, 1, ';');
                        s.dropdown.find('ul').append(lis);
                    }

                    s.checkChilds();
                    s.dropEvents();
                    s.containerEvents();
                    if (set.initCallback != null) {
                        set.initCallback();
                    }
                });

        }
        s.init();

        return s;
    }
}(jQuery));