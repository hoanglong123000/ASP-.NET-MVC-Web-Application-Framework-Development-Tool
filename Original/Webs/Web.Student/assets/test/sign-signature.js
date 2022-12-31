
(function ($) {
    $.fn.signSignature = function (options) {
        var s = this;
        var sel = this.selector;
        s.searchParams = {
            keyword: "",
            page: 1,
            limit: null
        };

        var set = $.extend({
            url: '',
            data: null,
            img: null,
            signed: null,
            allowUpdate: null,
            signedDate: null,
            callback: null,
            before: null,
            after: null,
            requesterId: null
        }, options);
        s.set = set;

        s.getSignData = function () {
            var data;
            if (set.before != null) {
                data = set.before();
            } else {
                data = set.state;
            }
            if (data != null) {
                data.requesterId = set.requesterId;
                if (set.data != null) {
                    $.extend(data, set.data);
                }

                if (data.ObjApprover != null) {
                    data.ObjApprover = null;
                }
            }
            return data;
        };

        s.updateSigned = function (date) {
            var ele = $(sel).find('.sign-signature');
            ele.html('');
            var signature = '<div class="signature">';

            if (app.hasValue(set.img)) {
                signature += '<img style="max-height: 90px" src="' + set.img + '" />';
            } else {
                if (set.allowUpdate) {
                    var portal = typeof PORTAL_API != 'undefined' ? PORTAL_API : '';
                    signature +=
                        '<div class="alert alert-warning no-border">Anh/Chị chưa có chữ ký scan. <a target="_blank" href="' + portal +'/employee/edit?tab=signature" style="">Cập nhật chữ ký</a></div>';
                } else {
                    signature +=
                        '<div class="p-20" style="background: #f5f5f5; width: 120px; margin: auto"><i class="icon-quill2 icon-3x" style="color: #dfdfdf"></i></div>';
                }
            }
            signature += '</div>'; 
            ele.append(signature);
            if (set.state.ObjApprover != null) {
                ele.append('<p  class="mt-15 text-bold no-margin-bottom">' + set.state.ObjApprover.FullName + '</p>');
            } 
            ele.append('<p style="margin-top: 5px">Ngày: ' + date + '</p>');
        };
        s.updateUnapprove = function (st) {
            var ele = $(sel).find('.sign-signature');
            ele.html('');
            var signature = $('<div class="signature"></div>');
            signature.append('<div class="alert alert-danger alert-bordered">'
                + '<span class="text-semibold">Không đồng ý duyệt !</span> Vì lý do: '
                + st.LyDoKhongDuyet
                + '</div > ');
            ele.append(signature);
            console.log(set.state.ObjApprover);
            if (set.state.ObjApprover != null) {
                ele.append('<p  class="mt-15 text-bold no-margin-bottom">' + set.state.ObjApprover.FullName + '</p>');
            } 
            ele.append('<p style="margin-top: 5px">Ngày: ' + app.formatDate(st.ApproveDate) + '</p>');
        };

        s.events = function () {
            $(sel).find('.btn-sign').unbind().click(function () {
                var btn = $(this);
                var data = s.getSignData();
                if (data != null) {
                    btn.button('loading');
                    app.postData(set.url, data,
                        function (result) {
                            btn.button('reset');
                            if ($.isArray(result)) {
                                s.showMessages(result);
                                s.updateSigned(moment().format('DD/MM/YYYY'));
                            } else {
                                if (result.Success) {
                                    s.updateSigned(moment().format('DD/MM/YYYY'));
                                } else {
                                    app.notify('warning', result.Message);
                                }
                            }
                            if (set.after != null) {
                                set.after(result.Data);
                            }
                        });
                }
            });
            $(sel).find('.btn-approve').unbind().click(function () {
                var btn = $(this);
                var data = s.getSignData();
                if (data != null) {
                    app.confirm('warning',
                        null,
                        null,
                        function () {
                            btn.button('loading');
                            $(sel).find('.btn-unapprove').prop('disabled', true);
                            data.Status = 2;
                            app.postData(set.url, data,
                                function (result) {
                                    btn.button('reset');
                                    if ($.isArray(result)) {
                                        s.showMessages(result);
                                        s.updateSigned(moment().format('DD/MM/YYYY'));
                                    } else {
                                        if (result.Success) {
                                            s.updateSigned(moment().format('DD/MM/YYYY'));
                                        } else {
                                            app.notify('warning', result.Message);
                                        }
                                    }
                                    if (set.after != null) {
                                        set.after(result.Data);
                                    }
                                });
                        });

                }
            });
            $(sel).find('.btn-unapprove').unbind().click(function () {
                var btn = $(this);
                var data = s.getSignData();
                if (data != null) {
                    var guid = app.newGuid(10);
                    swal({
                        title: "Không đồng ý duyệt",
                        text: '<p>Anh/Chị vui lòng cho biết lý do không đồng ý duyệt</p>' +
                            '<textarea id="confirm_' + guid + '" class="form-control" placeHolder="Lý do không đồng ý duyệt"></textarea>',
                        html: true,
                        showCancelButton: true,
                        closeOnConfirm: false,
                        confirmButtonColor: "#ff5722",
                        cancelButtonText: "Để sau",
                        confirmButtonText: "Hoàn tất",
                        showLoaderOnConfirm: true
                    }, function () {
                        var cause = $('#confirm_' + guid).val();
                        if (cause === "") {
                            swal.showInputError("Anh/Chị vui lòng nhập lý do không đồng ý duyệt !");
                            return false;
                        }
                        data.LyDoKhongDuyet = cause;
                        data.Status = 3;
                        app.postData(set.url,
                            data,
                            function (result) {
                                swal.close();
                                btn.button('reset');
                                s.updateUnapprove(result);

                                if ($.isArray(result)) {
                                    s.showMessages(result);
                                    s.updateSigned(moment().format('DD/MM/YYYY'));
                                } else {
                                    if (result.Success) {
                                        s.updateSigned(moment().format('DD/MM/YYYY'));
                                    } else {
                                        app.notify('warning', result.Message);
                                    }
                                }
                                if (set.after != null) {
                                    set.after(result.Data);
                                }
                            });
                    });
                }
            });
        };
        s.showMessages = function (messages) {
            var m = 'signature_message_modal';
            if ($('#' + m).length == 0) {
                var h =
                    '<div class="modal fade" id="signature_message_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
                    '<div class="modal-dialog" role="document">' +
                    '<div class="modal-content"> ' +
                    '<div class="modal-body"></div>' +
                    '<div class="modal-footer text-center">' +
                    '<button type="button" class="btn btn-default" style="margin: auto" data-dismiss="modal">Đóng</button> ' +
                    '</div></div></div></div>';
                $('body').append(h);
            }
            $('#' + m + ' .modal-body').html('');
            $(messages).each(function () {
                if (this.Success) {
                    $('#' + m + ' .modal-body').append('<div class="alert bg-success alert-styled-left"> ' + this.Message + '</div>');
                } else {
                    $('#' + m + ' .modal-body').append('<div class="alert bg-warning alert-styled-left"> ' + this.Message + '</div>');
                }
            });

            $('#' + m).modal('show');
        };

        s.init = function () {
            var ele = $('<div class="sign-signature"></div>');
            $(sel).append(ele);
            var st = set.state;
            if (set.mode == 1) {
                if (st.Status > 0) {
                    s.updateSigned(app.formatDate(st.ApproveDate));
                } else {
                    var allowSign = set.allowSign || set.allowSign == null;
                    if (allowSign) {
                        ele.append('<button type="button" style="min-width: 150px" data-loading-text="<i class=' +
                            "'" +
                            'icon-spinner4 fa-spin position-left' +
                            "'" +
                            '></i>Ký tên" class="btn btn-primary btn-rounded btn-sign"><i class="icon-quill4 position-left"></i>Ký tên</button');
                    } else {
                        ele.append('<span class="label label-default">Đang chờ ký tên</span>');
                    }
                }
            } else {
                switch (st.Status) {
                    case 0: { } break;
                    case 1:
                        {
                            if (set.allowSign) {
                                ele.append('<button type="button" data-loading-text="<i class=' +
                                    "'" +
                                    'icon-spinner4 fa-spin position-left' +
                                    "'" +
                                    '></i>Duyệt" class="btn mb-10 btn-success btn-rounded btn-approve"><i class="icon-checkmark3 position-left"></i>Duyệt</button');
                                ele.append('<button type="button" data-loading-text="<i class=' +
                                    "'" +
                                    'icon-spinner4 fa-spin position-left' +
                                    "'" +
                                    '></i>Không duyệt" class="btn mb-10 btn-warning btn-rounded btn-unapprove ml-10"><i class="icon-blocked position-left"></i>Không duyệt</button');
                            } else {
                                ele.append('<span class="label label-default">Đang chờ duyệt</span>');
                            }
                        }
                        break;
                    case 2:
                        {
                            s.updateSigned(app.formatDate(st.ApproveDate));
                        }
                        break;
                    case 3:
                        {
                            s.updateUnapprove(st);
                        }
                        break;
                }
            }
            s.events();
        };
        s.init();
        return this;
    };
}(jQuery));