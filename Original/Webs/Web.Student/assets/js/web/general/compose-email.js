
var lastResults = [];

(function ($) {
    $.fn.emailCompose = function (options) {
        var e = this;
        e.m = '#email_compose_modal',
            e.f = e.m + ' #emailComposeForm',
            e.aEle = e.f + ' .attachs',
            e.atts = [];

        var sel = this.selector;
        var set = $.extend({
            receiverUrl: null,
            ccUrl: null,
            tags: false
        },
            options);

        e.sendCallback = null;

        function FileAttach() {
            var s = this;
            s.attachs = [];
            s.files = [];
            s.result = [];
            s.postNumber = 0;
            s.events = function (files) {
                $(e.aEle + ' a span').text(files.length + ' file được đính kèm');
                $(e.aEle + ' .list-group').html('');
                if (files.length > 0) {
                    $(e.aEle).css('display', 'block');
                }
                var paths = [];
                $(files).each(function () {
                    var h = '<li class="list-group-item">' +
                        '<i class="icon-file-text2"></i> ' +
                        this.name + (this.size != null ? ' (' + this.size + ')' : '') +
                        '<button data-path="' +
                        this.path +
                        '" type="button" class="btn btn-link btn-xs no-margin-top no-padding pull-right btn-remove-attach"> ' +
                        '<i class="icon-x" ></i> ' +
                        '</button> ' +
                        '</li>';
                    $(e.aEle + ' .list-group').append(h);
                    paths.push(this.path);
                });
                $(e.f + ' input[name="attachs"]').val(paths.join(';'));
                $(e.f + ' .btn-remove-attach').unbind().click(function () {
                    e.removeAttach(this);
                });

                $('html').unbind().click(function (e) {
                    if (!$(e.target).hasClass('attachs-dropdown')) {
                        $(e.f + ' .attachs-dropdown').dropdown('toggle');
                    }
                });
            }

            s.Unit = function (file) {
                var u = this;
                u.id = 0;
                u.name = file.name;
                u.size = 0;
                u.ext = u.name.substr((u.name.lastIndexOf('.') + 1));
                // get size
                var sizeStr = "";
                var sizeKB = file.size / 1024;
                if (parseInt(sizeKB) > 1024) {
                    var sizeMB = sizeKB / 1024;
                    sizeStr = sizeMB.toFixed(2) + " MB";
                } else {
                    sizeStr = sizeKB.toFixed(2) + " KB";
                }
                u.size = sizeStr;

                u.uploadPercent = 0;
                u.status = 0;
                u.posted = false;
                u.callback = null;
                var BYTES_PER_CHUNK = 1000000;

                u.uploadComplete = function (fileObj) {
                    $.ajax({
                        url: DOMAIN_API + "/apiMedia/SaveChunksForUpload",
                        type: "POST",
                        data: {
                            count: fileObj.count,
                            fileCode: fileObj.fileCode,
                            fileName: u.name
                        },
                        success: function (result) {

                            if (result == 'folder_has_been_full') {
                                app.alert('<i class="fa fa-warning"></i> Quá trình tải thất bại do ổ cứng hệ thống đã đầy. Vui lòng liên hệ người quản trị để được hỗ trợ. Xin cám ơn !');
                            } else {
                                u.posted = true;
                                if (u.callback != null) {

                                    u.callback({
                                        name: u.name,
                                        path: result,
                                        type: fileObj.type,
                                        size: u.size
                                    });
                                }
                            }
                        }
                    });
                }
                u.postChunk = function (fileObj, formData) {
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        fileObj.completed = fileObj.completed + 1;
                        var percent = Math.floor(fileObj.completed / fileObj.count * 100);
                        if (fileObj.completed === fileObj.count) {
                            u.uploadPercent = 99;
                            $(e.aEle + ' .progress-bar').css('width', u.uploadPercent + '%');
                            u.uploadComplete(fileObj);
                        } else {
                            u.uploadPercent = percent;
                            $(e.aEle + ' .progress-bar').css('width', u.uploadPercent + '%');
                            u.analyst(fileObj);
                        }
                    };
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                fileObj.fileCode = xhr.responseText;
                            }
                        }
                    };
                    xhr.open("POST", DOMAIN_API + "/apiMedia/PostChunk", true);
                    xhr.send(formData);
                };
                u.analyst = function (fileObj) {
                    if (fileObj.start < fileObj.size) {
                        var chunk;
                        if (typeof fileObj.blob.slice === 'function') {
                            chunk = fileObj.blob.slice(fileObj.start, fileObj.end);// if mozill,opera and chrome this condition call
                        } else if (typeof fileObj.blob.webkitSlice === 'function')//this not perform condition use safari
                        {
                            chunk = fileObj.blob.webkitSlice(fileObj.start, fileObj.end);
                        }
                        var formData = new FormData();
                        formData.append("chunk", chunk);
                        formData.append("index", fileObj.completed);
                        formData.append("fileCode", fileObj.fileCode);
                        formData.append("type", fileObj.type);
                        u.postChunk(fileObj, formData);
                        fileObj.start = fileObj.end;
                        fileObj.end = fileObj.start + BYTES_PER_CHUNK;
                    }
                }
                u.newGuid = function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }

                    return s4() + s4();
                }
                u.post = function (callback) {
                    u.callback = callback;
                    var fileObj = {
                        blob: file,
                        size: file.size,
                        end: BYTES_PER_CHUNK,
                        start: 0,
                        completed: 0,
                        success: false,
                        type: u.ext,
                        extension: file.name.replace(/^.*\./, ''),
                        //uploadElement: $(e).parents(".file-upload"),
                        fileCode: u.newGuid(),
                        count: file.size % BYTES_PER_CHUNK == 0 ? file.size / BYTES_PER_CHUNK : Math.floor(file.size / BYTES_PER_CHUNK) + 1
                    };
                    u.analyst(fileObj);
                }
            }
            s.upload = function (files, callback) {
                s.files = [];
                for (var i = 0; i < files.length; i++) {
                    var u = new s.Unit(
                        files[i]
                    );
                    s.files.push(u);
                }
                var posting = false;
                $(e.aEle + ' .progress-bar').css('display', 'block');
                var interval = setInterval(function () {
                    if (!posting) {
                        $.each(s.files, function (k, i) {
                            if (!i.posted) {
                                posting = true;
                                i.post(function (result) {
                                    s.postNumber++;
                                    posting = false;
                                    e.atts.push(result);
                                });
                                return false;
                            }
                        });
                    }
                    if (s.postNumber == s.files.length) {
                        $(e.aEle + ' .progress-bar').css('display', 'none').css('width', '0%');
                        s.postNumber = 0;
                        $('#mediaUploadingModal').modal('hide');
                        clearInterval(interval);
                        s.events(e.atts);
                        if (callback != null) {
                            callback(e.atts);
                        }
                    }
                }, 100);
            }

            s.init = function () {
                e.atts = [];
                var str = $(e.f + ' input[name="attachs"]').val();
                if (str.length > 0) {
                    var arr = str.split(';');
                    for (var i = 0; i < arr.length; i++) {
                        var n = arr[i].split('/').pop();
                        e.atts.push({
                            name: n,
                            path: arr[i],
                            size: null
                        });
                    }
                    s.events(e.atts);
                }
            }
            s.init();
        }

        e.setPanelSize = function () {
            var w = $(window).width();
            var h = $(window).height();
            var ecm = '.email-compose-modal';
            var ctr = ecm + ' .panel-body > .form-horizontal';
            if ($(ecm).length > 0) {
                var fw = w < 700 ? w : 700;
                var fh = h < 650 ? h : 650;
                $(ecm).css('width', fw + 'px').css('height', fh + 'px');
                var eh = fh - $(ctr).height() - 179;
                console.log(eh);
                $(ecm + ' .note-editable').css('height', eh + 'px');
            }
        };
        e.removeAttach = function (btn) {
            var paths = $(e.f + ' input[name="attachs"]').val().split(';');
            var p = $(btn).attr('data-path');
            e.atts = jQuery.grep(e.atts,
                function (obj) {
                    return obj.path != p;
                });
            paths = jQuery.grep(paths,
                function (item) {
                    return item != p;
                });
            var li = $(btn).closest('li');
            li.remove();
            if (paths.length > 0) {
                $(e.aEle + ' a span').text(paths.length + ' file được đính kèm');
            } else {
                $(e.aEle).css('display', 'none');
            }

            $(e.f + ' input[name="attachs"]').val(paths.join(';'));
        };

        e.events = function (emails) {

            var fa = new FileAttach();
            var form = $(e.f).unbind().ultraForm({
                uiType: 1,
                actionType: 'ajax',
                action: '/email/send',
                props: [
                    {
                        name: 'attachs',
                        type: 'hidden'
                    },
                    {
                        name: 'ModuleCode',
                        type: 'hidden'
                    },
                    {
                        name: 'receivers',
                        type: 'select2',
                        option: { 
                            multiple: true,
                            placeholder: "Người nhận",
                            tokenSeparators: [","],
                            initSelection: function (element, callback) {
                                var data = [];
                                $(element.val().split(",")).each(function () {
                                    data.push({
                                        id: this,
                                        text: this
                                    });
                                });
                                callback(data);
                            }, 
                            data: [],
                            createSearchChoice: function (term) {
                                var text = term;
                                return {
                                    id: term,
                                    text: text
                                };
                            }
                        },
                        required: {
                            message: 'Vui lòng nhập email người nhận'
                        },
                        onChange: function () {
                            e.setPanelSize();
                        }
                    },
                    {
                        name: 'cc',
                        type: 'select2',
                        option: {
                            multiple: true,
                            placeholder: "Cc",
                            tokenSeparators: [","],
                            initSelection: function (element, callback) {
                                var data = [];
                                $(element.val().split(",")).each(function () {
                                    data.push({
                                        id: this,
                                        text: this
                                    });
                                });
                                callback(data);
                            },
                            data: [],
                            createSearchChoice: function (term) {
                                var text = term;
                                return {
                                    id: term,
                                    text: text
                                };
                            }
                        },
                        onChange: function () {
                            e.setPanelSize();
                        }
                    },
                    {
                        name: 'subject',
                        type: 'text',
                        required: {
                            message: 'Vui lòng nhập tiêu đề'
                        }
                    },
                    {
                        name: 'body',
                        type: 'summernote',
                        option: {
                            toolbar: [
                                ['style', ['style']],
                                ['font', ['bold', 'underline', 'clear']],
                                ['fontname', ['fontname']],
                                ['color', ['color']],
                                ['para', ['ul', 'ol', 'paragraph']],
                                ['table', ['table']],
                                ['insert', ['link', 'picture', 'video']]
                            ],
                            disableResizeEditor: true
                        }
                    }
                ],
                afterSubmit: function (result) {
                    if (result.Success) {
                        app.notify('success', 'Gửi thành công');
                        $(e.m).fadeOut('fast');
                        $(e.m).html('');
                    } else {
                        app.notify('warning', result.Message);
                        $(e.m).fadeOut('fast');
                        $(e.m).html('');
                    }
                    if (e.sendCallback != null) {
                        e.sendCallback();
                    }
                },
                initCallback: function () {
                    //if (emails.length > 0) {
                    //    $(e.f + ' input[name="receivers"]').select2("val", emails);
                    //}
                    // var cc = $(e.f + ' input[name="cc"]').attr('data-values');
                    //if (cc.length > 0) {
                    //    var arr = cc.split(';');
                    //    $(e.f + ' input[name="cc"]').select2("val", arr);
                    //}
                }
            });

            $(e.f + ' .heading-elements a[data-action="close"]').unbind().click(function () {
                $(e.m).fadeOut('fast');
            });
            $(e.f + ' .heading-elements a[data-action="collapse"]').unbind().click(function () {
                if ($(e.m).hasClass('collapse')) {
                    $(e.m).removeClass('collapse');
                    e.setPanelSize();
                    $(this).removeClass('rotate-180');
                } else {
                    $(e.m).addClass('collapse');
                    $(e.m).css('width', '200px').css('height', '44px');
                    $(this).addClass('rotate-180');
                }
            });

            $(e.f + ' .btn-attach').unbind().click(function () {
                $(e.f + ' input[name="attach_control"]').click();
            });
            $(e.f + ' input[name="attach_control"]').unbind().change(function () {
                console.log(5);
                $(e.aEle).css('display', 'block');
                fa.upload($(this).prop('files'), function (files) {

                });
            });
            $(e.aEle + ' > li').unbind().on({
                "shown.bs.dropdown": function () { this.closable = false; },
                "click": function (even) {
                    var target = $(even.target);
                    var li = target.closest('li.list-group-item');
                    if (li.length > 0 || target.hasClass('list-group-item')) {
                        this.closable = false;
                    } else
                        this.closable = true;
                },
                "hide.bs.dropdown": function () { return this.closable; }
            });

            $(e.f + ' .btn-mail-template-view').unbind().click(function () {
                var mtvm = 'mail_template_modal';
                if ($('#' + mtvm).length == 0) {
                    app.createEmptyModal({
                        id: mtvm,
                        title: 'Email mẫu',
                        width: 700
                    });
                }
                app.loadData('/email/emailTemplateView', {
                    dataType: 'html'
                },
                    null,
                    function (html) {
                        $('#' + mtvm + ' .modal-body').html(html);
                        $('#' + mtvm).modal('show');
                    });
            });
            $(e.f + ' .btn-email-signature-edit').unbind().click(function () {
                console.log(5);
            });
            e.setPanelSize();
            $(window).resize(function () {
                e.setPanelSize();
            });

            $(document).off('focusin.modal');
        };

        e.init = function (obj, callback, sendCallback) {
            e.sendCallback = sendCallback;
            if ($(e.m).length == 0) {
                $('body').append('<div class="email-compose-modal" id="email_compose_modal"></div>');
            }
            var url = obj.url != null ? obj.url : '/email/GetSendEmailForm';
            var data = obj.data != null ? obj.data : { dataType: 'html' };
            data.dataType = 'html';

            app.loadData(url, data, null,
                function (html) {
                    $(e.m).html(html);
                    $(e.m).fadeIn('fast');
                    e.events(obj.receivers);
                    if (callback != null) {
                        callback();
                    }
                });
        };

        return e;
    };
})(jQuery);

function formatResult(data) {
    return data.text;
}

function formatSelection(data) {
    return data.text;
}