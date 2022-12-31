
(function ($) {
    $.fn.suggestionInput = function (options) {
        var s = this;
        var sel = this.selector;
        var ct;
        var set = $.extend({
            url: null,
            item: null,
            selectCallback: null,
            beforeSuggest: null
        }, options);
        s.set = set;
        s.data = [];
        s.keyword = '';
        s.loadData = function () {
            var sug = $(ct).find('.suggests');
            $(ct).find('.form-control-feedback').css('display', 'block');

            app.loadData(set.url,
                {
                    keyword: s.keyword,
                    limited: 20
                },
                null,
                function (result) {
                    $(ct).find('.form-control-feedback').css('display', 'none');
                    sug.html('');
                    if (result.Many != null) {
                        s.data = result.Many;
                    } else {
                        s.data = result;
                    }
                    if (s.data.length > 0) {
                        if (sug.css('display') == 'none') {
                            sug.css('display', 'block');
                        }
                        $.each(s.data, function (o, i) {
                            sug.append('<a href="#" class="list-group-item" dataid="' + this[set.item.value] + '" index="' + o + '">' + this[set.item.text] + '</a>');
                        });
                        sug.find('a').unbind().click(function () {
                            sug.find('a.active').removeClass('active');
                            $(this).addClass('active');
                            s.selectSuggest();
                        });
                    } else {
                        sug.css('display', 'none');
                    }
                });
        };
        s.focusSuggest = function (key) {
            var sug = $(ct).find('.suggests');
            var length = sug.find('a').length;
            var act = sug.find('a.active:eq(0)');
            var i;
            if (key == 40) {
                if (act == null) {
                    i = 0;
                } else {
                    i = parseInt(act.attr('index'));
                    if (i < length - 1) {
                        i++;
                    } else {
                        i = 0;
                    }
                }
            } else {
                if (act == null) {
                    i = length - 1;
                } else {
                    i = parseInt(act.attr('index'));
                    if (i > 0) {
                        i--;
                    } else {
                        i = length - 1;
                    }
                }
            }
            act.removeClass('active');
            sug.find('a[index="' + i + '"]').addClass('active');
        };
        s.selectSuggest = function () {
            var sug = $(ct).find('.suggests');
            var v = sug.find('a.active').attr('dataid');
            var obj;
            if (v != null) {
                $.each(s.data, function () {
                    if (this[set.item.value] == v) {
                        obj = this;
                        $(sel).val(this[set.item.text]);
                        sug.html('');
                        sug.css('display', 'none');
                        return false;
                    }
                });
            }
            set.selectCallback(obj);
        };

        s.events = function () {
            var sug = $(ct).find('.suggests');
            var globalTimeout = null;
            $(sel).unbind().keyup(function (e) {
                if (e.which == 40 || e.which == 38) {
                    s.focusSuggest(e.which);
                } else if (e.which == 13) {
                    s.selectSuggest();
                } else {
                    s.keyword = $(this).val();
                    if (set.beforeSuggest != null) {
                        set.beforeSuggest(val);
                    }
                    if (globalTimeout != null) {
                        clearTimeout(globalTimeout);
                    }
                    globalTimeout = setTimeout(function () {
                        if (s.keyword != '') {
                            s.loadData();
                        } else {

                            sug.html('');
                            sug.css('display', 'none');
                        }
                        clearTimeout(globalTimeout);
                    }, 200);
                }
            });

            $(sel).focus(function () {
                if ($(sug).html() != '') {
                    $(sug).css('display', 'block');
                }
            }).blur(function (e) {
                if ($(e.relatedTarget).attr('class') != 'list-group-item') {
                    if ($(sug).html() != '') {
                        $(sug).css('display', 'none');
                    }
                }
            });
        };

        s.init = function () {
            var p = $(sel).closest('div');
            var html = $('<div class="suggestion-input has-feedback">' +
                '<div class="form-control-feedback" style="display: none"><i class= "icon-spinner4 spinner"></i></div >' +
                '</div>');
            $(html).append('<div class="suggests list-group" style="display: none"></div>');
            $(html).prepend($(sel));
            p.append(html);
            ct = html;

            s.events();
        };
        s.init();
        return this;
    };
}(jQuery));