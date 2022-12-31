
(function ($) {
    $.fn.gridView = function(options) {
        var s = this;
        var sel = this.selector;
        s.currentPage = 1;
        s.loading = false;
        s.searchParams = {
            keyword: "",
            page: 1,
            limit: null
        };
        s.editParams = {};
        s.sourceData = [];
        s.count = 0;
        s.formId = '';
        s.sumarray = [];
        // Establish our default settings
        var set = $.extend({
                header: null,
                footer: null,
                tableSize: null,
                rootUrl: null,
                dataUrl: null,
                paging: null,
                params: null,
                autoLoad: null,
                selectRow: null,
                idAttribute: null,
                columns: [],
                editController: null,
                model: "",
                checkAll: null,
                searchElement: null,
                beforeSubmit: null,
                hasCkeditor: false,
                detailRow: null,
                autoSubmit: true,
                childs: null,
                responsive: false,
                modal: null,
                loadDataCallback: null,
                loadModalCallback: null,
                selectItemCallback: null,
                submitFormCallback: null,
                sumInfo: null
            },
            options);

        s.searchParams.page = set.paging.page != null ? set.paging.page : 1;
        s.searchParams.limit = set.paging.limit != null ? set.paging.limit : 24;

        if (set.params != null) {
            if (typeof set.params.search != 'undefined') {
                $.extend(s.searchParams, set.params.search);
            }
            if (typeof set.params.edit != 'undefined') {
                $.extend(s.editParams, set.params.edit);
            }
        }
        s.showLoading = function() {

        };

        s.hideLoading = function() {
            $(sel).find(".webaby-table-loading").hide();
        };
        s.hideModal = function() {
                var type = parseInt($('#formEditModal').attr('data-type'));
                if (type == 2) {
                    $('#formEditModal').fadeOut('fast',
                        function() {
                            $('#formEditModal').remove();
                        });
                } else {
                    $("#formEditModal").modal("hide");
                }
                $('body').removeClass('overflow-hidden');
            },
            s.showModal = function() {
                var type = parseInt($('#formEditModal').attr('data-type'));
                if (type == 2) {

                    $("#formEditModal").fadeIn('fast');
                } else {
                    $("#formEditModal").modal("show");
                }
                $('body').addClass('overflow-hidden');
            }
        s.eventModal = function() {
            $(".form-submit").unbind().click(function() {
                var btn = $(this);
                if (btn.hasClass('button-loading')) {
                    $('.form-cancel').attr('disabled', 'disabled').css('disabled');
                    btn.button('loading');
                }
                s.setSubmitEvent("edit");
            });
            $('.form-cancel').unbind().click(function() {
                s.hideModal();
            });
            $("#formEditModal form input").keypress(function(e) {
                var key = e.which;
                if (key == 13) // the enter key code
                {
                    s.setSubmitEvent("edit");
                    return false;
                }
            });

            if (set.hasCkeditor) {
                $.each($(".ckeditor"),
                    function() {
                        var _eid = $(this).attr("id");
                        var editor = CKEDITOR.replace(
                            _eid,
                            {
                                toolbarGroups: [
                                    {
                                        name: 'document',
                                        groups: ['mode', 'document']
                                    }, // Displays document group with its two subgroups.			// Group's name will be used to create voice label.
                                    //'/',																// Line break - next group will be placed in new line.
                                    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                                    { name: 'insert', items: ['image', 'table', 'horizontalRule', 'specialChar'] },
                                    { name: 'links' },
                                    { name: 'styles' },
                                    { name: 'colors' }
                                ],
                                height: 400
                            });
                    });
            }

            var wh = $(window).height();
            var fem = '#formEditModal';
            var h = $(fem + ' form').height();
            h += 57 + 60;
            var t = (wh - h) / 4;
            if (wh < h) {
                t = 0;
                h = wh;
            }
            $(fem + ' .wtable-epanel-content')
                .css('height', h + 'px')
                .css('top', t + 'px');

            $(window).resize(function() {
                var modal = set.modal;
                if (modal.type == 2) {
                    var ww = $(window).width();
                    var mw = modal.width;
                    var l = '';
                    if (mw.indexOf('%') > -1) {
                        mw = mw.substr(0, mw.length - 1);
                        l = ((100 - parseInt(mw)) / 2) + '%';
                    } else if (mw.indexOf('px') > -1) {
                        mw = mw.substr(0, mw.length - 2);
                        mw = parseInt(mw);
                        if (ww > mw) {
                            l = ((ww - mw) / 2) + 'px';
                        } else {
                            l = '0px';
                        }
                    }
                    var h = $(fem + ' form').height();
                    h += 57 + 60;
                    t = (wh - h) / 4;
                    if (wh < h) {
                        t = 0;
                        h = wh;
                    }
                    $(fem + ' .wtable-epanel-content')
                        .css('left', l)
                        .css('height', h + 'px')
                        .css('top', t + 'px');
                }
            });
        }
        s.initModal = function(modal, content) {
            var html = '';
            if (modal.type == 2) {
                var ww = $(window).width();
                var mw = modal.width;
                var l = '';
                if (mw.indexOf('%') > -1) {
                    mw = mw.substr(0, mw.length - 1);
                    l = ((100 - parseInt(mw)) / 2) + '%';
                } else if (mw.indexOf('px') > -1) {
                    mw = mw.substr(0, mw.length - 2);
                    mw = parseInt(mw);
                    if (ww > mw) {
                        l = ((ww - mw) / 2) + 'px';
                    }
                }

                html = '<div class="wtable-epanel" id="formEditModal" data-type="' + modal.type + '">';
                if (modal.width != "") {
                    html += '<div class="wtable-epanel-content" style="width:' + modal.width + ';left: ' + l + '">';
                } else {
                    html += '<div class="wtable-epanel-content">';
                }
                html += '<div class="panel panel-flat wtable-panel">';
                html += content;
                html += '</div></div></div>';
                $("body").append(html);
            } else {
                html = '<div class="modal" id="formEditModal" data-type="' +
                    modal.type +
                    '" data-backdrop="static"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
                if (modal.width != "") {
                    html += '    <div class="modal-dialog" style="width:' + modal.width + '">';
                } else {
                    html += '    <div class="modal-dialog" >';
                }
                html += '<div class="modal-content">';
                html += '      <div class="modal-header">';
                html +=
                    '          <button class="close" aria-hidden="true" data-dismiss="modal" type="button">×</button>';
                html += '              <h4 class="modal-title">' + modal.title + '</h4>';
                html += '          </div><div class="modal-body card">';
                html += content;
                html += '</div></div></div></div>';
                $("body").append(html);
                $('#formEditModal').on('hidden.bs.modal',
                    function(e) {
                        $('body').removeClass('overflow-hidden');
                        $('#formEditModal').remove();
                    });
            }
        }
        s.createOrUpdateObject = function(id, callback) {
            s.showLoading();
            var url = set.editController != null ? set.editController + '/' : '/admin/';
            url += set.model + "Edit";
            $.extend(s.editParams,
                {
                    id: id
                });
            $.ajax({
                url: url,
                type: "GET",
                data: s.editParams,
                dataType: "html",
                success: function(result) {
                    s.hideLoading();
                    s.initModal({
                            title: (id != null ? 'Cập nhật ' : 'Thêm mới ') + set.modalTitle,
                            width: set.modal.width,
                            type: set.modal.type != null ? set.modal.type : 1
                        },
                        result);
                    s.eventModal();
                    s.showModal();

                    if (set.loadModalCallback != null) {
                        set.loadModalCallback();
                    }
                    if (callback != null) {
                        callback();
                    }
                }
            });
        };
        s.setPagination = function(total) {
            if (total == 0) {
                $(sel).find(".pagination").css('display', 'none');
            } else {
                var limit = s.searchParams.unlimited ? total : s.searchParams.limit;
                $(sel).find(".pagination").css('display', 'block');
                var pagination = $(sel).find(".pagination");
                $(pagination).html('');
                var startPageIndex;
                var numPage = parseInt(total / limit);
                var li;
                if (total % limit != 0) {
                    numPage++;
                }
                if (s.searchParams.page <= 4) {
                    startPageIndex = 1;
                } else if (s.searchParams.page >= numPage - 3) {
                    startPageIndex = numPage - 6;
                    if (startPageIndex < 1) {
                        startPageIndex = 1;
                    }
                } else {
                    startPageIndex = s.searchParams.page - 3;
                }

                var length = startPageIndex + 7;
                if (numPage < 7) {
                    length = startPageIndex + numPage;
                }
                if (length > 1) {
                    if (length > 2) {
                        $(pagination).append('<li><a href="#" class="pre"><span>←</span></a></li>');
                    }
                    for (var i = startPageIndex; i < length; i++) {
                        li = '<li>';
                        if (i == s.searchParams.page) {
                            li = '<li class="active">';
                        }
                        li += '<a href="#" page=' + i + '>' + i + '</a></li>';
                        $(pagination).append(li);
                    }
                    if (length > 2) {
                        $(pagination).append('<li><a href="#" class="next"><span>→</span></a></li>');
                    }
                }
                $(pagination).find("a").unbind().click(function() {
                    s.searchParams.page = $(this).attr("page");
                    s.loadData();
                    return false;
                });
                $(pagination).find(".pre").unbind().click(function() {
                    if (s.searchParams.page > 1) {
                        s.searchParams.page--;
                        s.loadData();
                    }
                    return false;
                });
                $(pagination).find(".next").unbind().click(function() {
                    if (s.searchParams.page < numPage) {
                        s.searchParams.page++;
                        s.loadData();
                    }
                    return false;
                });
            }
        }
        s.getSelectedIds = function() {
            var ids = [];
            $.each($(sel).find(".thumbnail"),
                function(k, tr) {
                    if ($(tr).hasClass("active")) {
                        ids.push($(tr).attr("dataid"));
                    }
                });
            return ids;
        }
        s.bulkDelete = function() {
            var ids = s.getSelectedIds();
            if (ids.length > 0) {
                s.deleteObjects("bulk", ids);
            } else {
                alert("Vui lòng chọn đối tượng cần xóa.");
            }
        }
        s.deleteObjects = function(type, ids) {
            app.confirm("warning",
                null,
                null,
                function() {
                    if (typeof webaby !== "undefined") {
                        webaby.showModalLoading();
                    }
                    var url = set.editController != null ? set.editController : '/admin';
                    if (type == "bulk") {
                        $.ajax({
                            url: url + "/bulkDelete",
                            type: "POST",
                            data: {
                                ids: ids,
                                model: set.model,
                                isDelete: $('#app_comfirm_modal #delete').prop('checked')
                            },
                            success: function() {
                                if (typeof webaby !== "undefined") {
                                    webaby.hideModalLoading();
                                }
                                $("#deleteModal").modal("hide");
                                s.loadData();
                            }
                        });
                    } else {

                        $.ajax({
                            url: url + "/delete" + set.model,
                            type: "POST",
                            data: {
                                model: set.model,
                                id: ids[0],
                                isDelete: $('#app_comfirm_modal #delete').prop('checked')
                            },
                            success: function() {
                                if (typeof webaby !== "undefined") {
                                    webaby.hideModalLoading();
                                }
                                $("#deleteModal").modal("hide");
                                s.loadData();
                            }
                        });
                    }
                    $(sel).find(".checkAll").prop("checked", false);
                    $.uniform.update();
                });
        }
        s.setEvents = function() {

            $(sel).find('.limitation').unbind().change(function() {
                var v = $(this).val();
                if (v == 'all') {
                    s.searchParams.unlimited = true;

                } else {
                    s.searchParams.unlimited = null;
                    s.searchParams.limit = v;
                    s.searchParams.page = 1;
                }

                s.loadData();
            });

            $(sel).find('.thumbnail').click(function(e) {
                if (e.target !== this)
                    return;

                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
                if (set.selectItemCallback != null) {
                    set.selectItemCallback($(this));
                }
            });

            $(sel).find('.btn-load-more').unbind().click(function() {
                var btn = $(this);
                var p = s.searchParams;
                s.currentPage++;
                $.extend(p,
                    {
                        page: s.currentPage
                    });
                btn.button('loading');
                if (s.loading == false) {
                    s.loading = true;
                    s.loadData(p,
                        function() {
                            btn.button('reset');
                            s.loading = false;
                        },
                        true);
                }
            });

            $(window).scroll(function() {
                if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                    var btn = $(sel).find('.btn-load-more');
                    if (btn.css('display') != 'none') {
                        btn.trigger("click");
                    }
                }
            });

            var il = $(sel).find('.thumbnail .icons-list');
            il.find('.btn-view-detail').unbind().click(function() {
                var id = $(this).closest('.thumbnail').attr('dataid');
                window.open('/employee/profile?id=' + id, '_blank');
            });
            il.find('.btn-edit').unbind().click(function() {
                var id = $(this).closest('.thumbnail').attr('dataid');
                window.open('/employee/edit?id=' + id, '_blank');
            });
            il.find('.btn-delete').unbind().click(function() {
                var id = $(this).closest('.thumbnail').attr('dataid');
                app.confirm('warning',
                    null,
                    null,
                    function() {
                        app.postData('/employee/deleteEmployeeByIds',
                            {
                                ids: [id]
                            },
                            function(result) {
                                s.search();
                            });
                    });
            });
        };
        s.initModal = function(content) {
            var html =
                '<div class="modal" id="UserFormEditModal" data-type="0" data-backdrop="static"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
            html += '    <div class="modal-dialog" style="width:80%">';
            html += '<div class="modal-content">';
            html += '      <div class="modal-header pt-10 pl-15 pr-15 pb-10 bg-primary">';
            html += '          <button class="close" aria-hidden="true" data-dismiss="modal" type="button">×</button>';
            html += '              <h6 class="modal-title text-bold">Cập nhật hồ sơ nhân sự</h6>';
            html += '          </div><form id="UserForm" class="form-horizontal">' +
                '<div class="modal-body pt-15 pl-15 pr-15 pb-5">';
            html += content;
            html += '</div>';
            html += '<div class="panel-footer panel-footer p-15">' +
                '<div class="pull-right">' +
                '<button class="btn btn-sm btn-default form-cancel mr-10" data-dismiss="modal">' +
                '<i class="fa fa-remove"></i> Thoát' +
                '</button>' +
                '<button class="btn btn-sm btn-fill btn-primary m-r-5 btn-submit" type="button" ' +
                'data-loading-text="<i class=' +
                "'icon-spinner4 fa-spin'" +
                '></i> Đang xử lý ...">' +
                '<i class="fa fa-save"></i> Lưu lại' +
                '</button>' +
                '</div>' +
                '</div>';
            html += '</form></div></div></div>';
            $("body").append(html);
            $('#UserFormEditModal').on('hidden.bs.modal',
                function(e) {
                    $('body').removeClass('overflow-hidden');
                    $('#UserFormEditModal').remove();
                });
        }
        s.filterEvents = function() {
            if (set.filterPanel != null) {
                var fp = $(set.filterPanel);
                $(fp).find('.search').each(function() {
                    var globalTimeout = null;
                    var inp = $(this);
                    inp.unbind().keyup(function() {
                        var key = $(this).val();
                        if (globalTimeout != null) {
                            clearTimeout(globalTimeout);
                        }
                        globalTimeout = setTimeout(function() {
                                var p = {};
                                p[inp.attr('name')] = key;
                                $.extend(s.searchParams, p);
                                if (s.searchParams.page != 1) {
                                    s.searchParams.page = 1;
                                }
                                s.loadData({},
                                    function() {

                                    },
                                    false);
                                clearTimeout(globalTimeout);
                            },
                            300);
                    });
                });

                $(fp).find('.datepicker').daterangepicker({
                    autoUpdateInput: false,
                    startDate: moment().startOf('hour'),
                    endDate: moment().startOf('hour').add(32, 'hour'),
                    applyClass: 'btn-primary',
                    locale: {
                        format: 'DD/MM/YYYY',
                        applyLabel: 'Tìm kiếm',
                        cancelLabel: 'Đóng'
                    }
                }).on('apply.daterangepicker',
                    function(ev, picker) {
                        var fd = picker.startDate;
                        var td = picker.endDate;
                        console.log(ev.target);
                        var inp = ev.target;
                        $(inp).val(fd.format('DD/MM/YYYY') + ' - ' + td.format('DD/MM/YYYY'));
                        var p = {};
                        p[$(inp).attr('name') + 'From'] = fd.format('MM/DD/YYYY');
                        p[$(inp).attr('name') + 'To'] = td.format('MM/DD/YYYY');
                        s.search(p,
                            function() {

                            });
                    }).on('cancel.daterangepicker',
                    function(ev, picker) {
                        var inp = ev.target;
                        $(inp).val('');
                    });
                $(fp).find('.datepicker').change(function() {
                    var v = $(this).val();
                    var inp = this;
                    if (v == '') {
                        var p = {};
                        p[$(inp).attr('name') + 'From'] = null;
                        p[$(inp).attr('name') + 'To'] = null;
                        s.search(p,
                            function() {

                            });
                    }
                });
                $(fp).find('.select2').unbind().select2({
                    placeholder: "Tất cả"
                }).on("change",
                    function(e) {
                        var t = $(e.currentTarget);
                        var p = {};
                        p[t.attr('name')] = e.val;
                        console.log(p);
                        s.search(p,
                            function() {

                            });
                    });
            }
        };
        s.displayChilds = function(pid, display) {
            $(sel).find('tr').each(function() {
                var p = $(this).attr('parent');
                if (p == pid) {
                    $(this).css('display', display);
                    s.displayChilds($(this).attr('dataid'), display);
                }
            });
        };
        s.selectRow = function(tr) {
            if (settings == false) {
                if ($(tr).hasClass('active')) {
                    $(tr).removeClass('active');
                    $(tr).parent().find('tr[class="detail-row"]').css('display', 'none');
                } else {
                    $(tr).parent().find('tr[class="active"]').removeClass('active');
                    $(tr).parent().find('tr[class="detail-row"]').css('display', 'none');
                    if (!$(tr).hasClass('active')) {
                        $(tr).addClass('active');
                    }
                }
            } else {
                if ($(tr).hasClass('active')) {
                    $(tr).removeClass('active');
                    $(tr).find(".first-col input").prop("checked", false);
                    $(sel).find(".checkAll").prop("checked", false);
                } else {
                    $(tr).addClass('active');
                    $(tr).find(".first-col input").prop("checked", true);
                }
                $.uniform.update();
            }

            if (set.selectRowCallback != null) {
                set.selectRowCallback(tr);
            }

            if (set.detailRow != null) {
                var next = $(tr).next();
                if (!next.hasClass('detail-row')) {
                    $(tr).after('<tr class="detail-row" style="display: table-row"><td colspan="' +
                        (set.columns.length + 1) +
                        '"><i class="icon-spinner10 spinner" style="margin:5px"></i></td></tr>');

                    s.loadDetailRow(tr);
                }
                if ($(tr).hasClass('active')) {
                    $(next).css('display', 'table-row');
                    $('html, body').animate({
                            scrollTop: $(tr).offset().top - 10
                        },
                        300);
                } else {
                    $(next).css('display', 'none');
                }
            }
        }
        s.getSelectedRow = function(handle) {
            if (handle != null) {
                var tr = $(handle).parent('tr');
                return {
                    id: $(tr).attr("dataid"),
                    code: $(tr).attr("datacode")
                }
            } else {
                var active;
                $.each($(sel).find('tbody tr'),
                    function(k, i) {
                        if ($(i).hasClass('active')) {
                            active = i;
                            return false;
                        }
                    });
                if (active != null) {
                    return {
                        id: $(active).attr("dataid"),
                        code: $(active).attr("datacode")
                    }
                }
            }
            return null;
        }
        s.getDataRow = function(dataId) {
            var idAttr = "Id";
            if (set.idAttribute != null) {
                idAttr = set.idAttribute;
            }
            for (var i = 0; i < s.sourceData.length; i++) {
                if (s.sourceData[i][idAttr] == dataId) {
                    return s.sourceData[i];
                }
            };
            return null;
        }
        s.getAllData = function() {
            return {
                many: s.sourceData,
                count: s.count
            };
        }
        s.search = function(conditions, callback) {
            s.searchParams.page = 1;
            $.extend(s.searchParams, conditions);
            s.loadData(null, callback);
        };
        s.drawGrid = function(item, idAttr) {
            var html = '<div class="col-lg-3 col-md-4 grid-item" dataid="' +
                item[idAttr] +
                '" ai="" >' +
                '<div class="thumbnail no-padding" dataid="' +
                item.Id +
                '" data-code="' +
                item.StaffCode +
                '" style="">' +
                '<div class="media-right media-middle">' +
                '<ul class="icons-list">' +
                '<li class="dropdown">' +
                '<a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">' +
                '<i class="icon-more2"></i>' +
                '</a>' +
                '<ul class="dropdown-menu dropdown-menu-right">' +
                '<li><a href="javascript:void(0)" class="btn-view-detail"><i class="icon-vcard"></i> Xem hồ sơ</a></li>' +
                '<li><a href="javascript:void(0)" class="btn-edit"><i class="icon-pencil7"></i> Sửa</a></li>' +
                '<li><a href="javascript:void(0)" class="btn-delete"><i class="icon-x"></i> Xóa</a></li>' +
                '<li class="divider"></li>' +
                '<li><a href="javascript:void(0)" class="btn-send-email"><i class="icon-mail5"></i> Gửi email</a></li>' +
                '</ul>' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '<div class="thumb pt-20 pl-20 pr-20">' +
                '<img style="height: 200px" src="/assets/file/default-user.png" data-src="' +
                item.Avatar +
                '"  alt="">' +
                '</div>' +
                '<div class="caption text-center p-10">' +
                '<h6 class=" no-margin"><span class="text-semibold">' +
                item.FullName +
                '</span>' +
                '<small class="display-block ell">' +
                (item.ObjJobPosition != null ? item.ObjJobPosition.Name : '&nbsp;') +
                '</small>' +
                '<small class="display-block ell">' +
                item.StaffCode +
                '</small>' +
                '</h6>' +
                '</div></div></div>';
            return html;
        };
        s.loadAvatar = function() {
            var imgs = $(sel).find(".grid-list .thumb img");
            $(imgs).each(function() {
                var img = $(this);
                if (!img.hasClass('loaded')) {
                    var avatar = img.attr('data-src');
                    var image = new Image();
                    image.onload = function() {
                        img.attr('src', avatar);
                        img.addClass('loaded');
                    };
                    image.onerror = function() {
                        img.addClass('loaded');
                    };
                    image.src = avatar;
                }
            });
        };
        s.loadData = function(params, callback, more) {
            if (params != null) {
                $.extend(s.searchParams, params);
            }
            var btn = $(sel).find('.btn-load-more');
            btn.button('loading');
            var url = set.dataUrl != null ? set.dataUrl : '/api/' + set.model + "List";
            app.loadData(url,
                s.searchParams,
                s.currentPage,
                function (result) {
                    btn.button('reset');
                    var tr;
                    var count = result.Count != null ? result.Count : 0;
                    var list = result.Many != null ? result.Many : result.length > 0 ? result : null;
                    if (!more) {
                        $(sel).find(".grid-list").html('');
                    }

                    s.sourceData = list;
                    s.count = result.Count;
                    var html = '';
                    if (list != null && list.length > 0) {
                        var idAttr = "Id";
                        if (set.idAttribute != null) {
                            idAttr = set.idAttribute;
                        }
                        $.each(list,
                            function(k, item) {
                                html += s.drawGrid(item, idAttr);
                            });
                        $(sel).find(".grid-list").append(html);
                        s.loadAvatar();
                    }

                    if (count < 24) {
                        $(sel).find('.btn-load-more').css('display', 'none');
                    } else {
                        $(sel).find('.btn-load-more').css('display', 'block');
                    }

                    s.setEvents();
                    s.hideLoading();
                    if (set.loadDataCallback != null) {
                        set.loadDataCallback(result);
                    }
                    if (callback != null) {

                        callback(result);
                    }
                });
        };
        s.search = function(params, callback) {
            s.currentPage = 1;
            s.searchParams.page = s.currentPage;
            $.extend(s.searchParams, params);
            var btn = $(sel).find('.btn-load-more');
            btn.button('loading');
            if (s.loading == false) {
                s.loading = true;
                s.loadData(s.searchParams,
                    function() {
                        btn.button('reset');
                        s.loading = false;
                    },
                    false);
            }
        };
        s.init = function() {
            //$(sel).addClass('table-responsive');
            var html = '<div class="row grid-list"></div>';
            html += '<div class="row mb-20"><div class="col-md-12 text-center">' +
                '<button type="button" ' +
                'data-loading-text="<i class=' +
                "'" +
                'icon-spinner4 spinner position-left' +
                "'" +
                '></i> Đang tải  ..." ' +
                'class="btn btn-default btn-load-more">' +
                'Tải thêm</button>' +
                '</div></div>';
            $(sel).append(html);
            s.filterEvents();
            s.loadData();

        };
        s.init();
        return s;
    }; 
}(jQuery));