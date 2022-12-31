
$(document).ready(function () {
    var panel = '#list_panel';

    table = $(".apply-table").advanceGrid({
        dataUrl: '/general/OrganizationList',
        model: "Organization", // ten table,
        editController: '/general',
        width: {},
        checkAll: false,
        border: true,
        filterable: true,
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '1000px',
            title: 'bộ phận'
        },
        toolbars: {
            create: {
                ele: panel + ' .main-toolbar .btn-add'
            },
            edit: {
                ele: panel + ' .main-toolbar .btn-edit'
            },
            delete: {
                ele: panel + ' .main-toolbar .btn-delete'
            },
            reload: {
                ele: panel + ' .main-toolbar .btn-reload'
            }
        },
        contextMenu: ['edit',
            'delete'
        ],
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            initOrganizationForm(function () {
                table.hideModal();
                table.loadData();
            });
        },
        loadDataCallback: function () {
            $('[data-popup="tooltip"]').tooltip();
        },
        selectRowCallback: function (tr) {

        },
        skipCols: 3,
        params: {
            search: {
                hasCount: true,
                limit: 20,
                Stopped: false
            }
        },
        head: { 
            groups: [
                50, 90, 300, 130, 140,  
                230, 230, 230, 230, 230,
                240, 140, 240, 140
            ]
        },
        cols: {
            left: [
                [
                    { title: "STT" },
                    { title: "Mã BP" },
                    { title: "Tên bộ phận" }
                ]
            ],
            right: [
                [
                    { title: "Loại bộ phận" },
                    { title: "Tình trạng" }, 
                    { title: "Quản lý trực tiếp" },
                    { title: "Quản lý gián tiếp 1" },
                    { title: "Quản lý giám tiếp 2" },
                    { title: "Quản lý gián tiếp 3" },
                    { title: "Quản lý giám tiếp 4" },
                    { title: "Người cập nhật" },
                    { title: "Ngày cập nhật" },
                    { title: "Người tạo" },
                    { title: "Ngày tạo" }
                ]
            ]
        },
        rows: [
            {
                type: "text",
                attribute: 'Priority',
                style: 'text-align: center'
            },
            {
                type: "text",
                attribute: 'Code',
                filter: {
                    type: 'contains',
                    attr: 'Code'
                }
            },
            {
                type: "text",
                attribute: 'Name',
                class: 'text-bold',
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },
            {
                type: "text",
                attribute: 'Type',
               
                render: function (row) {
                    if (row.ObjLoaiBoPhan != null)
                        return row.ObjLoaiBoPhan.Name;
                    return '';
                },
                filter: {
                    type: 'option',
                    prop: 'Type',
                    ajax: {
                        url: '/general/optionvaluelist',
                        data: {
                            cache: true,
                            unlimited: true,
                            type: 'LoaiBoPhan'
                        },
                        attr: {
                            id: 'Code',
                            text: 'Name'
                        }
                    }
                }
            },
            {
                type: "text",
                attribute: 'Stopped',
                style: 'text-align: center',
                render: function (row) {
                    if (row.Stopped)
                        return '<span class="label label-default">Dừng hoạt động</span>';
                    return '<span class="label label-success">Đang hoạt động</span>';
                },
                filter: {
                    type: 'option',
                    selected: true,
                    lst: function () {
                        var ls = [
                            { id: 'false', text: 'Đang hoạt động' },
                            { id: 'true', text: 'Dừng hoạt động' }
                        ];
                        return ls;
                    }
                }
            },
            
            {
                type: "text",
                attribute: 'OwnerId',
                render: function (row) {
                    if (row.Owner != null)
                        return row.Owner.FullName;
                    return '';
                },
                filter: {
                    type: 'optionRemote',
                    prop: 'OwnerId',
                    ajax: {
                        url: DOMAIN_API + '/employee/EmployeeSuggestionViewList',
                        data: { limit: 20 },
                        attr: { id: 'Id', text: 'FullName' }
                    }
                }
            },
            {
                type: "text",
                attribute: 'QLGT',
                render: function (row) {
                    if (row.ObjInOwner1 != null)
                        return row.ObjInOwner1.FullName;
                    return '';
                }
            },
            {
                type: "text",
                attribute: 'QLGT',
                render: function (row) {
                    if (row.ObjInOwner2 != null)
                        return row.ObjInOwner2.FullName;
                    return '';
                }
            },
            {
                type: "text",
                attribute: 'QLGT',
                render: function (row) {
                    if (row.ObjInOwner3 != null)
                        return row.ObjInOwner3.FullName;
                    return '';
                }
            },
            {
                type: "text",
                attribute: 'QLGT',
                render: function (row) {
                    if (row.ObjInOwner4 != null)
                        return row.ObjInOwner4.FullName;
                    return '';
                }
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
 