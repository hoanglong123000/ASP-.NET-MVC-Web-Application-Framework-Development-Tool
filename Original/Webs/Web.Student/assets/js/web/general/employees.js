
$(document).ready(function () {
    var panel = '#emp_panel';
    var table = $(" .apply-table").advanceGrid({
        dataUrl: '/general/LocalEmployeeMany',
        model: "Employee", // ten table,
        editController: '/general',
        checkAll: false,
        width: {},
        filterable: true,
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '600px',
            title: 'người dùng'
        },
        toolbars: {
            create: {
                ele: panel + ' .main-toolbar .btn-add'
            },
            reload: {
                ele: panel + ' .main-toolbar .btn-reload'
            }
        },
        contextMenu: ['edit',
            'delete'],
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            initEmployeeForm(function () {
                table.hideModal();
                table.loadData();
            });
        },
        loadDataCallback: function () {
            app.lazyLoader();
        },
        params: {
            search: {
                hasCount: true,
                limit: 20 
            }
        },
        head: {
            height: 80,
            groups: [50, 260, 180, 230, 230,  100,
                100, 140,
                250, 140, 250, 140]
        },
        skipCols: 2,
        cols: {
            left: [[
                { title: 'STT', rowspan: 2 },
                { title: 'Nhân viên', rowspan: 2, style: 'height: 79px' }
            ]],
            right: [
                [
                    { title: 'Email', rowspan: 2 },
                    { title: 'Vị trí công tác', rowspan: 2 },
                    { title: 'Bộ phận', rowspan: 2 },
                    { title: 'Điện thoại', rowspan: 2 }, 
                    { title: 'Truy cập', colspan: 2 },

                    { title: 'Người tạo', rowspan: 2 },
                    { title: 'Ngày tạo', rowspan: 2 },
                    { title: 'Người cập nhật', rowspan: 2 },
                    { title: 'Ngày cập nhật', rowspan: 2 }
                ],
                [
                    { title: 'Cho phép' },
                    { title: 'Tên đăng nhập' }
                ]
            ]
        },
        rows: [
            {
                type: 'ai',
                style: 'text-align: center'
            },
            {
                type: 'text', attribute: 'Name',
                render: function (row) {
                    var str = '<div class="media no-margin stack-media-on-mobile">' +
                        '<div class="media-left  pr-15" >' +
                        '<div class="img-circle img-lg" ><img class="lazy" data-src="' + row.Avatar + '" src="/assets/file/1px.svg" /></div>' +
                        '</div>' +
                        '<div class="media-body">' +
                        '<h6 class="media-heading text-bold" >' + row.FullName + '</h6> ' +
                        '<span class="text-muted" style="font-size: 12px" ><i class="icon-user position-left"></i>' + row.StaffCode + '</span> <br/> ' +
                        '</div> ' +
                        '</div>';
                    return str;
                },
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },
            {
                type: 'text', attribute: 'EmailCongTy',
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },
            {
                type: 'text', attribute: 'JobPositionName'
            },
            {
                type: 'text', attribute: 'OrganizationName'
            },
            {
                type: 'text', attribute: 'DiDong'
            }, 
            {
                type: 'text',
                attribute: 'Locked',
                render: function (row) {
                    console.log(44);
                    if (row.Locked)
                        return '<span class="label label-danger">Không cho phép</span>';
                    return '<span class="label label-success">Cho phép</span>';
                },
                filter: {
                    type: 'option',
                    lst: function () {
                        var ls = [
                            { id: true, text: 'Cho phép' },
                            { id: false, text: 'Không cho phép' }
                        ];
                        return ls;
                    }
                }
            },
            {
                type: 'text', attribute: 'LoginName'
            },
            
            {
                type: 'text',
                attribute: 'CreatedBy',
                render: function (row) {
                    if (row.ObjCreatedBy != null)
                        return row.ObjCreatedBy.FullName;
                    return '';
                }
            },
            {
                type: 'datetime',
                attribute: 'CreatedDate'
            },
            {
                type: 'text',
                attribute: 'UpdatedBy',
                render: function (row) {
                    if (row.ObjUpdatedBy != null)
                        return row.ObjUpdatedBy.FullName;
                    return '';
                }
            },
            {
                type: 'datetime',
                attribute: 'UpdatedDate'
            }
        ]
    });
});

function RequestDetail(id, tb) {
    var title = 'Thông tin phiếu lớp';

    var m = 'request_info_modal';
    if ($('#' + m).length == 0) {
        app.createEmptyModal({
            title: title,
            width: 1200,
            headerClass: 'bg-primary',
            id: m
        });
    } else {
        $('#' + m + ' .modal-title').text(title);
    }
    tb.showTableLoading();
    app.loadData('/Edutcation/ClassDetail',
        {
            id: id,
            dataType: 'html'
        },
        null,
        function (result) {
            tb.hideTableLoading();
            $('#' + m + ' .modal-body').html(result);
            $('#' + m).modal('show');
            initClassDetailForm(function () {
                $('#' + m).modal('hide');
                tb.loadData();
                LoadApproveStatus();
            });
        });
}