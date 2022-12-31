
(function ($) {
    $.fn.compoDate = function (options) {
        var s = this;
        var selector = this.selector;
        var set = $.extend({
            selectCallback: null,
            width: null,
            groupSize: null,
            placeHolder: null,
            name: null
        }, options);
        var item = set.item;
        s.container = null;
        s.dropdown = null;
        s.days = [
            { code: '', text: set.placeHolder != null ? set.placeHolder : 'Tất cả' },
            { code: 'HN', text: 'Hôm nay' },
            { code: 'HQ', text: 'Hôm qua' },
            { code: 'TN', text: 'Tuần này' },
            { code: 'DTDHT', text: 'Đầu tuần đến hiện tại' },
            { code: 'TTR', text: 'Tuần trước' },
            { code: 'THN', text: 'Tháng này' },
            { code: 'THTR', text: 'Tháng trước' },
            { code: 'DTHDHT', text: 'Đầu tháng đến hiện tại' },
            { code: 'QN', text: 'Quý này' },
            { code: 'DQDHT', text: 'Đầu quý đến hiện tại' },
            { code: '6TDN', text: '6 tháng đầu năm' },
            { code: '6TCN', text: '6 tháng cuối năm' },
            { code: 'NN', text: 'Năm nay' },
            { code: 'NTR', text: 'Năm trước' },
            { code: 'DNDHT', text: 'Đầu năm đến hiện tại' },
            { code: 'Q1', text: 'Quý I' },
            { code: 'Q2', text: 'Quý II' },
            { code: 'Q3', text: 'Quý III' },
            { code: 'Q4', text: 'Quý IV' },
            { code: 'T1', text: 'Tháng 1' },
            { code: 'T2', text: 'Tháng 2' },
            { code: 'T3', text: 'Tháng 3' },
            { code: 'T4', text: 'Tháng 4' },
            { code: 'T5', text: 'Tháng 5' },
            { code: 'T6', text: 'Tháng 6' },
            { code: 'T7', text: 'Tháng 7' },
            { code: 'T8', text: 'Tháng 8' },
            { code: 'T9', text: 'Tháng 9' },
            { code: 'T10', text: 'Tháng 10' },
            { code: 'T11', text: 'Tháng 11' },
            { code: 'T12', text: 'Tháng 12' }
        ];

        s.drawLis = function (data, parent, level, val) {
            var str = '';
            $(data).each(function () {
                if (this[item.parent] == parent) {
                    var v = val + this[item.value] + ';';
                    str += '<li val="' + v + '" dataid="' + this[item.value] + '" parent="' + this[item.parent] + '">' +
                        '<a href="javascript:void(0)" class="level-' + level + '" title="' + this[item.text] + '"><i class="fa fa-plus-square-o"></i>' + this[item.text] + '</a ></li >';
                    str += s.drawLis(data, this[item.value], level + 1, v);
                }
            });
            return str;
        }
        s.selectOption = function (arr) {
            if (arr != null) {
                $(selector).find('input[name="' + set.name + 'From"]').val(arr.from);
                $(selector).find('input[name="' + set.name + 'To"]').val(arr.to);
                s.container.find('.btn span').text(arr.from + ' - ' + arr.to);
            } else {
                $(selector).find('input[name="' + set.name + 'From"]').val('');
                $(selector).find('input[name="' + set.name + 'To"]').val('');
                s.container.find('.btn span').text(set.placeHolder);
            }
        }
        s.positionDropdown = function () {
            var $dropdown = s.dropdown,
                container = s.container,
                offset = container.offset(),
                height = container.outerHeight(false),
                width = 400,
                dropHeight = $dropdown.outerHeight(false),
                $window = $(window),
                windowWidth = $window.width(),
                windowHeight = $window.height(),
                viewPortRight = $window.scrollLeft() + windowWidth,
                viewportBottom = $window.scrollTop() + windowHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= $window.scrollTop(),
                dropWidth = 400,
                enoughRoomOnRight = function () {
                    return dropLeft + dropWidth <= viewPortRight;
                },
                enoughRoomOnLeft = function () {
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

            if (changeDirection) {
                $dropdown.hide();
                offset = container.offset();
                height = container.outerHeight(false);
                width = container.outerWidth(false);
                dropHeight = $dropdown.outerHeight(false);
                viewPortRight = $window.scrollLeft() + windowWidth;
                viewportBottom = $window.scrollTop() + windowHeight;
                dropTop = offset.top + height;
                dropLeft = offset.left;
                dropWidth = $dropdown.outerWidth(false);
                $dropdown.show();
                this.focusSearch();
            }

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
                dropHeight = $dropdown.outerHeight(false);
                css.top = offset.top - dropHeight;
                css.bottom = 'auto';
            }
            else {
                css.top = dropTop;
                css.bottom = 'auto';
                container.removeClass("drop-above");
                $dropdown.removeClass("drop-above");
            }

            $dropdown.css(css);
        }
        s.dropEvents = function () {
            $('.compo-date-mask').unbind().click(function () {
                $('body').find('.compo-date-drop').remove();
                $(this).remove();
            });

            var ele = s.dropdown;
            ele.find('.day-item').unbind().click(function (e) {
                if (e.target !== this)
                    return;
                var val = $(this).attr('data');
                s.selectOption(val != '' ? app.convertDateRange(val) : null);
                $('.compo-date-drop').remove();
                $('.compo-date-mask').remove();
                if (set.selectCallback != null) {
                    set.selectCallback(val, selector);
                }
            });

            ele.find('.custom-date').unbind().daterangepicker({
                singleDatePicker: true,
                autoUpdateInput: true,
                locale: {
                    format: 'DD/MM/YYYY',
                    daysOfWeek: daysOfWeek,
                    monthNames: monthNames
                }
            });

            ele.find('.btn-custom-apply').unbind().click(function () {
                var arr = {
                    from: ele.find('.custom-date-from').val(),
                    to: ele.find('.custom-date-to').val()
                }
                s.selectOption(arr);
                $('.compo-date-drop').remove();
                $('.compo-date-mask').remove();
                if (set.selectCallback != null) {
                    set.selectCallback(arr, selector);
                }
            });
        }

        s.containerEvents = function () {
            s.container.find('.btn').unbind().click(function () {
                var btn = $(this);
                s.positionDropdown();
                $('body').append('<div class="compo-date-mask"></div>');
                $('body').append(s.dropdown);
                s.dropEvents();
            });
        }
        s.data = null;
        s.init = function () {
            $(selector).css('display', 'none');

            $(selector).append('<input type="hidden" name="' + set.name + 'From" value="' + $(selector).attr('from') + '" />');
            $(selector).append('<input type="hidden" name="' + set.name + 'To" value="' + $(selector).attr('to') + '" />');

            var html = '<div class="compo-date" style="' + (set.width != null ? 'width:' + set.width + 'px' : '') + '">';
            html += '<div class="btn-group btn-group-sm ' + (set.groupSize != null ? 'btn-group-' + set.groupSize : '') + '">' +
                '<button type="button" class="btn btn-default">' +
                '<i class="icon-calendar2"></i>' +
                '<span>' + set.placeHolder + '</span>' +
                '<i class="caret"></i></button>' +
                '</div></div>';



            $(html).insertAfter($(selector));
            s.container = $(selector).next();

            var from = $(selector).attr('from');
            var to = $(selector).attr('to');

            if (from != '' && to != '') {
                s.selectOption({ from: from, to: to });
            }

            s.dropdown = $('<div class="compo-date-drop"></div>');
            s.dropdown.append('<div class="row"><div class="col-xs-6 no-padding-right"><div class="day-list"></div></div><div class="col-xs-6 pr-20"><div class="custom-days form-horizontal"></div></div></div>');
            s.dropdown.find('.day-list').append('<div class="list-group no-border" style=""></div>');

            var lg = s.dropdown.find('.list-group');
            $(s.days).each(function () {
                lg.append('<a href="javascript:void(0)" data="' + this.code + '" class="list-group-item day-item" title="' + this.text + '">' +
                     this.text + '</a >');
            });

            var cd = s.dropdown.find('.custom-days');
            cd.append('<p class="text-semibold mt-15">Thời gian khác</p>');
            cd.append('<div class="form-group form-group-sm  has-feedback"><label class="control-label col-md-2">Từ</label>' +
                '<div class="col-md-10">' +
                '<input class="form-control custom-date custom-date-from" type="text" name="" placeholder="Từ" value="" />' +
                '<div class="form-control-feedback"><i class="icon-calendar2"></i></div></div></div>');
            cd.append('<div class="form-group form-group-sm  has-feedback"><label class="control-label col-md-2">Đến</label>' +
                '<div class="col-md-10">' +
                '<input class="form-control custom-date custom-date-to" type="text" name="" placeholder="Đến" value="" />' +
                '<div class="form-control-feedback"><i class="icon-calendar2"></i></div></div></div>');
            cd.append('<div class="form-group text-right pr-10">' +
                '<button class="btn btn-primary btn-sm btn-custom-apply">Áp dụng</button></div>');
            s.dropEvents();
            s.containerEvents();

        }
        s.init();
    }
}(jQuery));