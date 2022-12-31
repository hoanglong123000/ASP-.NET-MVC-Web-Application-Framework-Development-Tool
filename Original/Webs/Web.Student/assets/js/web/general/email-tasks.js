 
$(document).ready(function () {
    var params = {
        hasCount: true,
        limit: 20
    }
    var panel = '#email_task_panel';
    var table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/general/EmailTaskList',
        model: "OptionValue", // ten table,
        editController: '/general',
        checkAll: false,
        border: true,
        width: {},
        height: {
            top: 240
        },
        modal: {
        },
        toolbars: {
            reload: {
                ele: panel + ' .main-toolbar .btn-reload'
            }
        },
        filterable: true,
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            initOptionValueForm(table);
        },
        loadDataCallback: function () {
            $('.control-realtime').keyup(function (e) {
                var tr = $(this).closest('tr');
                var val = $(this).val();
                var attr = $(this).attr('attr');
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    app.postData('/developer/OptionValueEdit',
                        {
                            id: tr.attr('dataid'),
                            value: val,
                            attr: attr
                        },
                        function () {

                        });
                }
            });
        },
        selectRowCallback: function (tr) {

        },
        params: {
            search: params
        },
        skipCols: 2,
        head: {
            groups: [40, 350, 230,
                230, 110, 130, 130, 126,
                130, 120, 380, 300]
        },
        cols: {
            left: [[
                {
                    title: "STT",
                }, 
                {
                    title: "Tiêu đề"
                }
            ]],
            right: [[
              
                {
                    title: "Người nhận"
                },
                {
                    title: "CC"
                },
                {
                    title: "Nội dung"
                },
                {
                    title: "Đính kèm"
                },
                {
                    title: "Ngày tạo email"
                },
                {
                    title: "Trạng thái"
                },
                {
                    title: "Ngày gửi"
                },
                {
                    title: "Số lần gửi"
                },
                {
                    title: "Thông báo"
                },
                {
                    title: "Ghi chú"
                }
            ]]
        },
        rows: [
            {
                type: "ai",
                style: 'text-align: center'
            }, 
            {
                type: "text",
                attribute: 'Subject',
                class: 'text-bold',
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },
            {
                type: "text",
                attribute: 'Receivers',
                render: function (row) {
                    if (row.Receivers != null)
                        return row.Receivers.replace(/;/g, "\n");
                    return '';
                },
                filter: {
                    type: 'contains',
                    attr: 'Receivers',
                    email: true
                }
            },
            {
                type: "text",
                attribute: 'CC',
                render: function (row) {
                    if (row.CC != null)
                        return row.CC.replace(/;/g, "\n");
                    return '';
                },
                filter: {
                    type: 'contains',
                    attr: 'CC',
                    email: true
                }
            },
            {
                type: "text",
                attribute: 'BodyPath',
                style: 'text-align: center',
                render: function (row) {
                    return '<a href="' + row.BodyPath + '" target="_blank">Xem nội dung</a>';
                }
            },
            {
                type: "text",
                attribute: 'Attachs',
                style: 'text-align: center',
                render: function (row) {
                    if (row.Attachs != null) {
                        var arr = row.Attachs.split(';');
                        var h = '';
                        $(arr).each(function () {
                            h += '<a href="' + this + '">Xem file</a><br/>';
                        })
                        return h;
                    }
                    return '';
                }
            },
            {
                type: "datetime",
                attribute: 'CreatedDate',
                filter: {
                    type: 'date'
                }
            },
            {
                type: "text",
                attribute: 'Status',
                style: 'text-align: center',
                render: function (row) {
                    switch (row.Status) {
                        case 0:
                            return '<span class="label label-default">Chưa gửi</span>';
                        case 1:
                            return '<span class="label label-success">Đã gửi</span>';
                        case 2:
                            return '<span class="label label-warning">Gửi thất bại</span>';
                        case 3:
                            return '<span class="label bg-purple-400">Không thể gửi</span>';
                        case 4:
                            return '<span class="label label-primary">Review</span>';
                        default:
                    }
                    return '';
                },
                filter: {
                    type: 'option',
                    lst: function () {
                        var arr = [
                            {
                                id: 0,
                                text: 'Chưa gửi'
                            },
                            {
                                id: 1,
                                text: 'Đã gửi'
                            },
                            {
                                id: 2,
                                text: 'Gửi thất bại'
                            },
                            {
                                id: 3,
                                text: 'Không thể gửi'
                            },
                            {
                                id: 4,
                                text: 'Review'
                            }
                        ];
                        return arr;
                    }
                }
            },
            {
                type: "datetime",
                attribute: 'SentDate',
                filter: {
                    type: 'date'
                }
            },

            {
                type: "text",
                attribute: 'SentNumber',
                style: 'text-align: center'
            },

            {
                type: "text",
                attribute: 'Error'
            },
            {
                type: "text",
                attribute: 'AlternateViews'
            }
        ]
    });

    return table;
});
