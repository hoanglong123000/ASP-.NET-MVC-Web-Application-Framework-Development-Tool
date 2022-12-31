var params = {
    hasCount: true,
    limit: vt == 'grid' ? 24 : 20

};

var grid,
    table,
    tp = '.tree-panel',
    tree = tp + ' .tree-ajax';

function EditThongTinCaNhan(id) {
    var m = 'ThongTinCaNhanModal';
    if ($('#' + m).length == 0) {
        app.createEmptyModal({
            id: m, title: 'Cập nhật thông tin cá nhân',
            width: 1200,
            headerClass: 'bg-primary'
        });
    }

    if (!$('#' + m).hasClass('excuting')) {
        $('#' + m).addClass('excuting');
        table.showTableLoading();
        app.loadData('/employee/quickedit',
            {
                id: id,
                dataType: 'html',
                form: 'ThongTinCaNhan'
            }, null, function (html) {
                table.hideTableLoading();
                $('#' + m).removeClass('excuting');
                $('#' + m + ' .modal-body').html(html);
                $('#' + m).modal('show');
                initEmployeeForm1(function () {
                    $('#' + m).modal('hide');
                    table.loadData();
                });
            });
    }
}

function events(ele) {
    $('#create_btn').click(function () {
        var btn = $(this);
        btn.button('loading');
        ele.createOrUpdateObject(null, function () {
            btn.button('reset');
        });
    });

    $('.btn_import').unbind().click(function () {
        var type = $(this).attr('type');
        initImportForm({
            title: 'Import hồ sơ',
            importType: type
        });
    });

    $('#view_btn').click(function () {
        var id = ele.getSelectedIds()[0];
        window.open('/employee/detail?id=' + id, '_blank');
    });

    $('#export_filter_items').click(function () {
        var url = '/employee/export?' + jQuery.param(params);
        window.open(url, '_blank');
    });

    $('#export_select_items').click(function () {
        var ids = ele.getSelectedIds();
        var url = '/employee/export?idStr= ' + ids.join(';');
        window.open(url, '_blank');
    });

    $('#send_email_btn').click(function () {
        var ids = ele.getSelectedIds();
        var btn = $(this);
        btn.button('loading');
        postData('/email/GetSendEmailForm',
            {
                receivers: ids,
                dataType: 'html'
            },
            function (html) {
                btn.button('reset');
                var m = '#email_compose_modal';
                $(m).html(html);
                $(m).fadeIn('fast');
                initEmailComposeForm(function () {

                });
            });
    });

    $('.btn_document_template_view').unbind().click(function () {
        var dtm = 'document_template_modal';
        if ($('#' + dtm).length == 0) {
            app.createEmptyModal({ id: dtm, title: 'Tài liệu mẫu', width: 750 });
        }
        app.loadData('/general/documentTemplateView',
            {
                dataType: 'html'
            },
            null,
            function (html) {
                $('#' + dtm + ' .modal-body').html(html);
                initDocumentTemplateView(7354);
            });

        $('#' + dtm).modal('show');
    });

    $('.btn_add_quick').unbind().click(function () {
        var m = 'addQuickModal';
        if ($('#' + m).length == 0) {
            app.createEmptyModal({
                id: m,
                title: 'Tạo nhân hồ sơ nhân viên',
                width: 1200,
                headerClass: 'bg-primary'
            });
        }
        if (vt == 'grid') {
            ele.showLoading();
        } else {
            ele.showTableLoading();
        }
        app.loadData('/employee/QuickCreate',
            { dataType: 'html' },
            null,
            function (html) {
                if (vt == 'grid') {
                    ele.hideLoading();
                } else {
                    ele.hideTableLoading();
                }

                $('#' + m + ' .modal-body').html(html);
                $('#' + m).modal('show');
                initEmployeeForm1(function () {
                    $('#' + m).modal('hide');
                    ele.loadData();
                });
            });
    });

    $(window).resize(function () {
        resize();
    });

    $('#showDeleted').change(function () {
        if ($(this).prop('checked') == true) {
            params.IncludeDeleted = true;
        } else {
            params.IncludeDeleted = null;
        }
        ele.search(params);
    });
}

function EditStaffCode(id, initCallback, callback) {
    var imd = 'StaffCodeModal';
    app.createPartialModal({
        modal: {
            title: 'Cập nhật mã NV',
            width: '500px',
            id: imd
        },
        url: '/employee/UpdateEmployeeStaffCodeView',
        data: {
            dataType: 'html',
            employeeId: id,
            module: 'employee',
            partialName: '/edit/EmployeeEdit_StaffCode'
        }
    },
        function () {
            initCallback();
            initStaffCodeForm(function () {
                $('#' + imd).modal('hide');
                callback();
            });
        });
}

function initTable() {
    table = $("#advance_grid").advanceGrid({
        dataUrl: '/employee/EmployeeList',
        model: "Employee", // ten table,
        editController: '/employee',
        checkAll: true,
        height: {
            top: 150
        },
        width: {},
        autoLoad: false,
        modal: {
            type: 1,
            title: 'hồ sơ nhân viên',
            width: '1200px',
            headerClass: 'bg-primary',
            noPaddingBody: true
        },
        toolbars: {
            create: {
                ele: '.main-toolbar .btn-add'
            },
            edit: {
                ele: '.main-toolbar .btn-edit',
                click: function () {
                    var ids = table.getCheckedRowIds();
                    if (ids.length > 0) {
                        window.open('/employee/edit/id=' + ids[0], '_blank');
                    }
                }
            },
            delete: {
                ele: '.main-toolbar .btn-delete'
            }
        },
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            initUserForm(table);
        },
        loadDataCallback: function (data, reload) {
            $('#test').click(function () {
                $('.filter-option').trigger('click');
            });
            var tr = $("#advance_grid .area-br tbody tr").eq(0);
            if (tr.length > 0) {
                table.selectRow(tr, reload);
            }

            $('.btn_edit_quick').unbind().click(function () {
                var ids = table.getCheckedRowIds();
                if (ids.length > 0) {
                    EditThongTinCaNhan(ids[0]);
                } else {
                    app.notify('warning', 'Vui lòng chọn nhân sự để cập nhật');
                }


            });
            $('.btn_edit_full').unbind().click(function () {
                var ids = table.getCheckedRowIds();
                if (ids.length > 0) {
                    window.open('/employee/edit?id=' + ids[0], '_blank');
                } else {
                    app.notify('warning', 'Vui lòng chọn nhân sự để cập nhật');
                }
            });
        },
        selectRowCallback: function (tr) {

        },
        params: {
            search: params
        },
        skipCols: 3,
        filterable: true,
        head: {
            groups: [100, 260, 200 ]
        },
        rowStyle: function (row) {
            if (row.Status < 0)
                return 'bg-warning';
            return '';
        },
        cols: {
            left: [[
                {
                    title: "Mã NV",
                    filter: {
                        type: 'number'
                    }
                },
                {
                    title: "Họ và tên",
                    sort: 'FullName',
                    filter: {
                        type: 'text'
                    }
                }]],
            right: [
                [ 
                    {
                        title: "Email"
                    } 
                ]
            ]
        },
        contextMenu: [
            {
                class: 'sub',
                text: 'Cập nhật thông tin cá nhân',
                icon: 'icon-pencil3',
                click: function (tr) {
                    EditThongTinCaNhan($(tr).attr('dataid'));
                }
            },
            {
                class: 'login',
                text: 'Thông tin đăng nhập',
                icon: 'icon-enter3',
                click: function (tr) {
                    var m = 'ThongTinDangNhapModal';
                    if ($('#' + m).length == 0) {
                        app.createEmptyModal({
                            id: m, title: 'Cập nhật thông tin đăng nhập',
                            width: 600,
                            headerClass: 'bg-primary'
                        });
                    }

                    if (!$('#' + m).hasClass('excuting')) {
                        $('#' + m).addClass('excuting');
                        var id = $(tr).attr('dataid');
                        table.showTableLoading();
                        app.loadData('/employee/quickedit',
                            {
                                id: id,
                                dataType: 'html',
                                form: 'BaoMat'
                            }, null, function (html) {
                                table.hideTableLoading();
                                $('#' + m).removeClass('excuting');
                                $('#' + m + ' .modal-body').html(html);
                                $('#' + m).modal('show');
                                initEmployeeForm6(function () {
                                    $('#' + m).modal('hide');
                                    table.loadData();
                                });
                            });
                    }
                }
            },
            '-',
            'delete'
        ],
        rows: [
            {
                type: "text",
                attribute: 'StaffCode',
                sortable: true,
                filter: {
                    type: 'contains',
                    attr: 'StaffCode'
                }
            },
            {
                type: "text",
                attribute: 'FullName',
                class: 'text-bold',
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },

            {
                type: 'text',
                attribute: 'Email',
                filter: {
                    type: 'contains',
                    attr: 'Email'
                }
            } 
        ]
    });

    if (searchModel.OrganizationId == null) {
        table.loadData();
    }
    events(table);
}

$(document).ready(function () {

    initTable();

    $('.btn_import').unbind().click(function () {
        var type = $(this).attr('type');
        initImportForm({
            title: 'Import hồ sơ',
            importType: type
        });
    });

    $('.panel-filter .cus-collapse').click(function () {
        var c = $(this).closest('fieldset').find('.collapse');
        if (c.hasClass('in')) {
            c.removeClass('in');
            $(this).find('i').removeClass('icon-circle-up2').addClass('icon-circle-down2');
        } else {
            c.addClass('in');
            $(this).find('i').removeClass('icon-circle-down2').addClass('icon-circle-up2');
        }
    });
});

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn(200) : $(element).fadeOut(200);
    }
};