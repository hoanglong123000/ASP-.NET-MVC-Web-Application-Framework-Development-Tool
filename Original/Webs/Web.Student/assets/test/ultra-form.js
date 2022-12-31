
(function ($) {
    $.fn.ultraForm = function (options) {
        var s = this;
        var form = this.selector;
        var setting = $.extend({
            uiType: null,
            props: null,
            autoSubmit: null,
            beforeSubmit: null,
            afterSubmit: null,
            validCallback: null,
            invalidCallback: null,
            initCallback: null
        },
            options);

        s.hasError = function () {
            var isValid = true;
            var hasError = false;
            $(setting.props).each(function () {
                isValid = s.isPropValid(this);
                if (!isValid) {
                    hasError = true;
                }
            });
            return hasError;
        };

        s.fileUploader = new FileUploader();
        s.getCursorPosition = function (el) {
            var pos = 0;
            if ('selectionStart' in el) {
                pos = el.selectionStart;
            } else if ('selection' in document) {
                el.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -el.value.length);
                pos = Sel.text.length - SelLength;
            }
            return pos;
        };
        s.getPropData = function (prop) {
            var ele = $(form).find('[name="' + prop.name + '"]');
            switch (prop.type) {
                case 'summernote':
                    {
                        return ele.summernote('code');
                    }
                case 'file':
                case 'fileThumb':
                    {
                        return $(form).find('[name="' + prop.name + 'PostFileBase"]').prop('files')[0];
                    }
                case 'checkbox':
                    {
                        return ele.prop('checked');
                    }
                case 'radio':
                    {
                        return $(form).find('[name="' + prop.name + '"]:checked').val();
                    }
                case 'datepicker':
                case 'comboDate':
                    {
                        var d = ele.val();
                        return app.convertVnToEnDate(d);
                    }
                case 'timepicker':
                    {
                        var d = ele.val();
                        return d;
                    }
                case 'money':
                {
                    console.log(ele);
                        var d = ele.val().replace(new RegExp(',', 'g'), '');
                        return d;
                    }
                case 'select2':
                    {
                        return ele.select2("val");
                    }
                case 'suggestionInput':
                    {
                        return $(form).find('[name="' + prop.name + '_Text"]').val();
                    }
                default:
                    {
                        return ele.val();
                    }
            }
        };
        s.isPropValid = function (prop) {
            var ele = $(form).find('[name="' + (prop.type == 'file' ? prop.name + 'PostFileBase' : prop.name) + '"]');
            var val = s.getPropData(prop);
            var fg = ele.closest('.form-group');
            var hm = fg.find('.help-msg');
            if (prop.required) {
                if (prop.type == 'file' || prop.type == 'fileThumb') {
                    var uploaded = $(form).find('[name="' + prop.name + 'Uploaded"]').val();

                    if (uploaded == '' && !app.hasValue(val)) {
                        fg.addClass('has-error');
                        hm.text(prop.required.message).css('display', 'block');
                        return false;
                    }
                } else {
                    if (val == '' || val == null || val == '00000000-0000-0000-0000-000000000000') {
                        if (prop.type == 'comboDate') {
                            var hf = ele.closest('.has-feedback');
                            hf.addClass('has-error');
                            hf.find('.help-msg').text(prop.required.message).css('display', 'block');
                        } else {
                            fg.addClass('has-error');
                            hm.text(prop.required.message).css('display', 'block');
                        }

                        return false;
                    }
                }
            }
            if (prop.minLength != null) {
                if (val.length < prop.minLength.val) {
                    fg.addClass('has-error');
                    hm.text(prop.minLength.message).css('display', 'block');
                    return false;
                }
            }
            if (prop.maxLength != null) {
                if (val.length > prop.maxLength.val) {
                    fg.addClass('has-error');
                    hm.text(prop.maxLength.message).css('display', 'block');
                    return false;
                }
            }
            if (prop.min != null) {
                if (parseFloat(val) < prop.min.val) {
                    fg.addClass('has-error');
                    hm.text(prop.min.message).css('display', 'block');
                    return false;
                }
            }
            if (prop.max != null) {
                if (parseFloat(val) > prop.max.val) {
                    fg.addClass('has-error');
                    hm.text(prop.max.message).css('display', 'block');
                    return false;
                }
            }
            if (prop.email != null) {
                if (app.hasValue(val)) {
                    var emailPattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
                    if (!emailPattern.test(val)) {
                        fg.addClass('has-error');
                        hm.text(prop.email.message).css('display', 'block');
                        return false;
                    }
                }
            }
            if (prop.acceptFormats != null) {
                ele = $(form).find('[name="' + prop.name + 'PostFileBase"]');
                var fs = ele.prop('files');
                if (fs.length > 0) {
                    var fn = ele.prop('files')[0].name;
                    var ext = fn.replace(/^.*\./, '');
                    if (jQuery.inArray(ext, prop.acceptFormats) < 0) {
                        fg.addClass('has-error');
                        hm.text('Định dạng file không hợp lệ').css('display', 'block');
                        return false;
                    }
                }
            }
            fg.removeClass('has-error');
            hm.css('display', 'none');
            return true;
        };
        s.getFormData = function () {
            var data = new FormData();
            $(setting.props).each(function () {
                switch (this.type) {
                    case 'file':
                    case 'fileThumb':
                        {
                            if (this.option.uploadFirst != null && this.option.uploadFirst) {
                                data.append(this.name, $(form).find('[name="' + this.name + 'Uploaded"]').val());
                            } else {
                                data.append(this.name + 'PostFileBase', s.getPropData(this));
                                data.append(this.name, $(form).find('[name="' + this.name + 'Uploaded"]').val());
                            }

                        }
                        break;
                    case 'suggestionInput':
                        {
                            data.append(this.name + '_Text', s.getPropData(this));
                            data.append(this.name + '_Id', $(form).find('[name="' + this.name + '_Id"]').val());
                        }
                        break;
                    case 'compoDate':
                        {
                            data.append(this.name + 'From', $(form).find('[name="' + this.name + 'From"]').val());
                            data.append(this.name + 'To', $(form).find('[name="' + this.name + 'To"]').val());
                        }
                        break;
                    default:
                        {
                            data.append(this.name, s.getPropData(this));
                        }
                        break;
                };
            });
            return data;
        };
        s.submit = function (btn, callback) {
            if (!s.hasError()) {
                if (setting.actionType == 'ajax') {
                    var data;
                    var isOk = true;
                    if (setting.beforeSubmit != null) {
                        isOk = setting.beforeSubmit();
                    }
                    if (isOk) {
                        if (setting.autoSubmit == null || setting.autoSubmit == true) {
                            btn.button('loading');
                            data = s.getFormData();
                            $.ajax(
                                {
                                    url: setting.action,
                                    type: "POST",
                                    data: data,
                                    processData: false,
                                    contentType: false,
                                    success: function (result) {
                                        btn.button('reset');
                                        if (setting.afterSubmit != null) {
                                            setting.afterSubmit(result);
                                            if (callback != null) {
                                                callback();
                                            }
                                        }
                                    },
                                    error: function () {
                                        if (typeof webaby !== "undefined") {
                                            webaby.hideModalLoading();
                                        }
                                        $(".alf-table-overlay span").text("Sorry! Cannot connect to server.");
                                        $(".alf-table-overlay button").show();
                                        //if fails
                                    }
                                });
                        } else {
                            data = s.getFormData();
                            if (setting.validCallback != null) {
                                setting.validCallback(data, btn, callback);
                            }
                        }
                    }
                } else {
                    if (typeof $(form).attr('action') == 'undefined') {
                        $(form).attr('action', setting.action);
                    }
                    if (setting.autoSubmit == null || setting.autoSubmit == true) {
                        $(form).submit();
                    }
                }
            } else {
                if (setting.invalidCallback != null) {
                    setting.invalidCallback(btn, callback);
                }
            }
        };
        s.events = function () {
            $(setting.props).each(function () {
                var prop = this;
                var ele = $(form).find('[name="' + prop.name + '"]');
                switch (prop.type) {
                    case 'summernote':
                        {
                            ele.on("summernote.change",
                                function (e) {
                                    s.isPropValid(prop);
                                });
                        }
                        break;
                    case 'file':
                        {
                            ele = $(form).find('[name="' + prop.name + 'PostFileBase"]');
                            ele.change(function () {
                                if (s.isPropValid(prop)) {
                                    if (prop.onChange != null) {
                                        prop.onChange(s.getPropData(prop));
                                    }
                                }
                                var input = this;
                                if (input.files && input.files[0]) {
                                    if (prop.option != null && prop.option.uploadFirst != null && prop.option.uploadFirst) {
                                        s.fileUploader.upload(input.files,
                                            'file',
                                            function (fs) {
                                                if (fs.length > 0) {
                                                    $(form).find('input[name="' + prop.name + 'Uploaded"]').val(fs[0].path);
                                                    $(form).find('input[name="' + prop.name + '"]').val(fs[0].path);
                                                }
                                                if (s.isPropValid(prop)) {
                                                    if (prop.onChange != null) {
                                                        prop.onChange(fs);
                                                    }
                                                }
                                            });
                                    } else {
                                        if (s.isPropValid(prop)) {
                                            if (prop.onChange != null) {
                                                prop.onChange(s.getPropData(prop));
                                            }
                                        }
                                    }
                                }
                            });
                        }
                        break;
                    case 'fileThumb':
                        {
                            ele = $(form).find('[name="' + prop.name + 'PostFileBase"]');
                            ele.change(function () {
                                var input = this;
                                if (input.files && input.files[0]) {
                                    if (prop.option != null && prop.option.uploadFirst != null && prop.option.uploadFirst) {
                                        var iwt = $(input).closest('.input-with-thumb');
                                        iwt.find('.thumbnail').addClass('uploading');
                                        s.fileUploader.upload(input.files,
                                            'image',
                                            function (fs) {
                                                iwt.find('.thumbnail').removeClass('uploading');
                                                iwt.find('img').attr('src', fs[0].path);
                                                iwt.find('input[name="' + prop.name + 'Uploaded"]').val(fs[0].path);
                                                if (s.isPropValid(prop)) {
                                                    if (prop.onChange != null) {
                                                        prop.onChange(fs);
                                                    }
                                                }
                                            });
                                    } else {
                                        var reader = new FileReader();
                                        reader.onload = function (e) {
                                            $(input).closest('.input-with-thumb').find('img')
                                                .attr('src', e.target.result);
                                            if (s.isPropValid(prop)) {
                                                if (prop.onChange != null) {
                                                    prop.onChange(s.getPropData(prop));
                                                }
                                            }
                                        };
                                        reader.readAsDataURL(input.files[0]);
                                    }
                                }
                            });
                            var btn = ele.closest('.inputs').find('.btn');
                            btn.unbind().click(function () {
                                ele.trigger('click');
                            });
                        }
                        break;
                    case 'imageCropper':
                        {
                            ele = $(form).find('[name="' + prop.name + '"]');
                            ele.imageCropper({
                                src: ele.val(),
                                cropCallback: function () { }
                            });
                        }
                        break;
                    case 'select2':
                        {
                            ele.change(function () {
                                s.isPropValid(prop);
                                if (prop.onChange != null) {
                                    prop.onChange($(this).val());
                                }
                            });
                            if (prop.relateOption != null) {
                                var ro = prop.relateOption;
                                $(form).find('[name="' + ro.prop + '"]').unbind().change(function () {
                                    ele.val('').trigger('change');
                                    ele.empty();
                                    ele.select2('data', null);
                                    ele.select2('val', null).trigger('change');
                                    var id = $(this).val();
                                    if (app.hasValue(id)) {
                                        var p = {
                                            cache: true,
                                            unlimited: true
                                        };
                                        p[ro.prop] = id;
                                        if (ro.beforeSearch != null) {
                                            p = ro.beforeSearch(p, id);
                                        }
                                        app.loadData(ro.url,
                                            p,
                                            null,
                                            function (result) {
                                                var lst = result.Many != null ? result.Many : result;
                                                $(lst).each(function () {
                                                    var opt = new Option(this[ro.attr.text],
                                                        this[ro.attr.id],
                                                        true,
                                                        true);
                                                    ele.append(opt);
                                                });
                                            });
                                    }
                                });
                            }


                        }
                        break;
                    default:
                        {
                            ele.change(function () {
                                s.isPropValid(prop);
                                if (prop.onChange != null) {
                                    prop.onChange($(this).val());
                                }
                            });
                        }
                }

                if (prop.viewMore != null) {

                    var vm = prop.viewMore;
                    $(form).find('.view-more-' + prop.name).unbind().click(function () {

                        var btn = $(this);
                        btn.button('loading');

                        app.loadData(vm.url,
                            {
                                dataType: 'html'
                            },
                            null,
                            function (html) {
                                btn.button('reset');
                                var mid = 'view_more_' + prop.name + '_modal';
                                var tt = vm.title;
                                if ($('#' + mid).length == 0) {
                                    app.createEmptyModal({ id: mid, title: tt, width: vm.width });
                                    var footer =
                                        $('<div class="modal-footer" style="padding: 0 15px 15px 15px;"></div>');
                                    footer
                                        .append(
                                            '<button class="btn btn-sm btn-default" data-dismiss="modal"><i class="icon-x position-left"></i>Đóng</button>')
                                        .append(
                                            '<button class="btn btn-sm btn-primary select-option"><i class="icon-check position-left"></i>Chọn</button>');
                                    $('#' + mid + ' .modal-content').append(footer);
                                }
                                $('#' + mid + ' .modal-body').html(html);
                                $('#' + mid).modal('show');

                                var opt = {};
                                if (prop.relateOption != null) {
                                    opt[prop.relateOption.prop] =
                                        $(form).find('[name="' + prop.relateOption.prop + '"]').val();
                                }
                                var tb = vm.initView(opt);
                                $('#' + mid + ' .select-option').unbind().click(function () {
                                    var data = tb.getSelectedDatas();
                                    if (data.length == 0) {
                                        app.notify('warning', 'Vui lòng chọn ' + tt);
                                    } else {
                                        data = data[0];
                                        var val = data[vm.attr.id];
                                        if (ele.find('option[value="' + val + '"]').length == 0) {
                                            if (prop.option.ajax != null) {
                                                ele.select2('data',
                                                    { id: data[vm.attr.id], text: data[vm.attr.text] });
                                            } else {
                                                var opt = new Option(data[vm.attr.text],
                                                    data[vm.attr.id],
                                                    true,
                                                    true);
                                                ele.append(opt).trigger('change');
                                                ele.trigger({
                                                    type: 'select2:select',
                                                    params: {
                                                        data: data
                                                    }
                                                });
                                            }
                                        } else {
                                            ele.val(val).trigger("change");
                                        }

                                        $('#' + mid).modal('hide');
                                    }
                                });
                            });
                    });
                }
            });
            $(form + ' .view-pass').on('mousedown',
                function () {
                    var input = $(this).closest('.input-group').find('input');
                    input.attr('type', 'text');
                }).on('mouseup mouseleave',
                    function () {
                        var input = $(this).closest('.input-group').find('input');
                        input.attr('type', 'password');
                    });
            $(form + ' .btn-submit').unbind().click(function () {
                s.submit($(this).button());
            });
            if (setting.initCallback != null) {
                setting.initCallback();
            }

            $(document).on("keypress",
                "form", function (e) {
                    if (e.keyCode == 13) {
                        var tag = e.target.tagName.toLowerCase();
                        return tag == 'textarea';
                    }
                    return true;
                });
        };
        s.init = function () {
            var hm = '<span class="help-block help-msg" style="display: none"></span>';
            $(setting.props).each(function () {
                var prop = this;
                var ele;
                if (prop.type == 'file') {
                    ele = $(form).find('[name="' + prop.name + 'PostFileBase' + '"]');
                } else if (prop.type == 'suggestionInput') {
                    ele = $(form).find('[name="' + prop.name + '_Text' + '"]');
                } else {
                    ele = $(form).find('[name="' + prop.name + '"]');
                }
                var fg = $(ele).closest('.form-group');
                if (setting.uiType == 0) { // vertical
                    fg.append(hm);
                } else {
                    if (prop.type == 'comboDate') {
                        ele.closest('.has-feedback').append(hm);
                    } else {
                        fg.find(' > div').eq(0).append(hm);
                    }

                }

                switch (this.type) {
                    case 'datepicker':
                    case 'comboDate':
                        {
                            var opt = prop.option != null
                                ? prop.option
                                : {
                                    singleDatePicker: true,
                                    autoUpdateInput: false,
                                    locale: {
                                        format: 'DD/MM/YYYY'
                                    }
                                };
                            opt.locale.daysOfWeek = daysOfWeek;
                            opt.locale.monthNames = monthNames;
                            ele.daterangepicker(opt,
                                function (d) {
                                    var rf = 'DD/MM/YYYY';
                                    if (prop.option != null && prop.option.returnFormat != null) {
                                        rf = prop.option.returnFormat;
                                    }

                                    $(this.element[0]).val(d.format(rf));
                                    if (prop.onChange != null) {
                                        prop.onChange(d.format(rf), this.element[0]);
                                    }
                                });
                        }
                        break;
                    case 'datetime':
                        {
                            var opt = prop.option != null
                                ? prop.option
                                : {};

                            opt.locale = 'vi';
                            ele.datetimepicker(opt).on('dp.change',
                                function (e) {
                                    if (prop.onChange != null) {
                                        prop.onChange(e.date);
                                    }
                                });
                        }
                        break;
                    case 'timepicker':
                        {
                            var opt = prop.option != null
                                ? prop.option
                                : {
                                    format: 'HH:mm'
                                };
                            ele.datetimepicker(opt).on('dp.change',
                                function (e) {
                                    var v = '';
                                    if (ele.val() != '') {
                                        v = e.date.format(e.date._f);
                                    }

                                    if (prop.onChange != null) {
                                        prop.onChange(v, e);
                                    }
                                });
                        }
                        break;
                    case 'file':
                        {
                            $(form).find('[name="' + prop.name + 'PostFileBase"]').uniform({
                                fileButtonClass: 'action btn bg-slate btn-sm',
                                fileButtonHtml: '<i class="icon-file-plus position-left"></i> Chọn file'
                            });
                        }
                        break;
                    case 'number':
                        {
                            ele.TouchSpin(prop.option);
                        }
                        break;
                    case 'mask':
                        {
                            ele.mask(prop.option.format);
                        }
                        break;
                    case 'formatter':
                        {
                            ele.formatter(prop.option);
                        }
                        break;
                    case 'money':
                        {
                            ele.mask("#,##0", { reverse: true });
                        }
                        break;
                    case 'checkbox':
                    case 'radio':
                        {
                            $(".styled").uniform({
                                radioClass: 'choice'
                            });
                        }
                        break;
                    case 'select2':
                        {
                            ele.select2(prop.option);
                        }
                        break;

                    case 'summernote':
                        {
                            initSummernote({
                                system: false
                            },
                                prop.option);
                        }
                        break;
                    case 'compoTree':
                        {
                            prop.option.selectCallback = function () {
                                s.isPropValid(prop);
                                if (prop.onChange != null) {
                                    prop.onChange(s.getPropData(prop));
                                }
                            };
                            ele.compoTree(prop.option);
                        }
                        break;
                    case 'suggestionInput':
                        {
                            prop.option.selectCallback = function (data) {
                                var item = prop.option.item;
                                $(form).find('[name="' + prop.name + '_Id"]').val(data[item.value]);
                            };
                            prop.option.beforeSuggest = function () {
                                $(form).find('[name="' + prop.name + '_Id"]').val('');
                            };
                            ele.suggestionInput(prop.option);
                        }
                        break;
                    case 'compoDate':
                        {
                            ele.compoDate({
                                placeHolder: 'Tất cả',
                                selectCallback: function (arr, ctr) {
                                    $(form).find('[name="' + prop.name + 'From"]').val(arr.from != null ? app.convertVnToEnDate(arr.from) : null);
                                    $(form).find('[name="' + prop.name + 'To"]').val(arr.to != null ? app.convertVnToEnDate(arr.to) : null);
                                    if (prop.option.onChange != null) {
                                        prop.option.onChange(arr);
                                    }
                                }
                            });
                        }
                        break;
                }
            });
            s.events();
        };
        s.init();
        return s;
    };
}(jQuery));