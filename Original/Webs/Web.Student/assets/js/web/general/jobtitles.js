
$(document).ready(function () {
    var panel = '#job_title_panel';

    var table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/general/JobTitleList',
        model: "JobTitle", // ten table,
        editController: '/general',
        checkAll: true,
        width: {},
        filterable: true,
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '600px',
            title: 'cấp chức danh'
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
        loadModalCallback: function () {
            initJobTitleForm(table);
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
        head: {
            groups: [50,  250 ]
        },
        cols: {
            left: [],
            right: [
                [
                    {
                        title: "STT"
                    }, 
                    {
                        title: "Tên chức danh"
                    } 
                ]
            ]
        },
        rows: [
            {
                type: "text",
                style: 'text-align: center',
                attribute: 'Priority'
            }, 
            {
                type: "text",
                attribute: 'Name',
                class: 'text-bold',
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            } 
        ]
    });

});
 