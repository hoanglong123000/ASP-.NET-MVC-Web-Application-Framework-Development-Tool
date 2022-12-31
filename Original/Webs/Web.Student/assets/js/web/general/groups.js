
var panel = '#group_panel';

$(document).ready(function () {
    var table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/general/grouplist',
        model: "Group", // ten table,
        editController: '/general',
        checkAll: true,
        width: {},
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '900px',
            title: 'nhóm người dùng',
            noPaddingBody: true
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
        contextMenu: ['edit', 'delete'],
        paging: {
            options: [10, 20, 30, 50]
        },
        filterable: true,
        loadModalCallback: function () {
            initGroupForm(table);
        },
        loadDataCallback: function () {
            $('[data-popup="tooltip"]').tooltip();
        },
        selectRowCallback: function (tr) {

        },
        params: {
            search: {
                limit: 20,
                hasCount: true
            }
        },
        skipCols: 0,
        head: {
            groups: [50, 150, 350, 200, 100]
        },
        cols: {
            left: [],
            right: [
                [
                    {
                        title: "STT",
                        style: 'width: 50px'
                    },
                    {
                        title: "Mã nhóm",
                        sortable: 'Icon'
                    },
                    {
                        title: "Tên nhóm",
                        sortable: 'Name'
                    },
                    {
                        title: "Mô tả"
                    },
                    {
                        title: "Thứ tự"
                    }
                ]
            ]
        },
        rows: [
            {
                type: "ai",
                style: '50px'
            },
            {
                type: "text",
                attribute: 'Code'
            },
            {
                type: "text",
                attribute: 'Name',
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },
            {
                type: "text",
                attribute: 'Description'
            },
            {
                type: "text",
                style: 'text-align: center',
                attribute: 'Priority'
            }
        ]
    });

});
