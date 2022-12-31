
function initDocumentTemplateView(typeId) {

    var panel = '#document_template_panel';
    var table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/general/documentTemplateList',
        model: "DocumentTemplate", // ten table,
        editController: '/general',
        checkAll: true,
        width: {},
        height: {
            top: 120
        },
        modal: {
            type: 1,
            width: '500px',
            title: 'tài liệu mẫu'
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
        filterable: true,
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            initDocumentTemplateForm(table);
        },
        loadDataCallback: function () {
            $('[data-popup="tooltip"]').tooltip();
        },
        selectRowCallback: function (tr) {

        },
        params: {
            search: {
                hasCount: true,
                limit: 20,
                Type: typeId
            },
            edit: {
                Type: typeId
            }
        },
        skipCols: 0,
        head: {
            groups: [50, 300, 120, 120, 70]
        },
        contextMenu: ['edit', 'delete'],
        cols: {
            left: [],
            right: [
                [
                    {
                        title: "STT"
                    },
                    {
                        title: "Tên mẫu",
                        sortable: 'Name'
                    }, {
                        title: "Loại mẫu"
                    }, {
                        title: "Cho phép tải về"
                    },
                    {
                        title: "Tải về"
                    }]
            ]
        },
        rows: [
            {
                type: "ai"
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
                attribute: 'Type',
                render: function (row) {
                    if (row.ObjType != null)
                        return row.ObjType.Name;
                    return '';
                },
                filter: {
                    type: 'option',
                    lst: function () {
                        var data = [];
                        $(types).each(function() {
                            data.push({
                                id: this.Id,
                                text: this.Name
                            });
                        });
                        return data;
                    }
                }
            },
            {
                type: "text",
                attribute: 'AllowDownload',
                style: 'text-align: center',
                render: function (row) {
                    if (row.AllowDownload)
                        return '<i class="icon-check text-success"></i>';
                    return '';
                }
            },
            {
                type: "text",
                attribute: 'Name',
                style: 'text-align: center',
                render: function(row) {
                    if (row.FilePath.length > 0) {
                        return '<a target="_blank" href="' + row.FilePath + '"><i class="icon-download text-info"></i></a>';
                    }
                    return '';
                }
            }
        ]
    });

    return table;
}
