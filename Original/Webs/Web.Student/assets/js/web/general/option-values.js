
var t1, t2, t3, t4, t5;

function initTable1() {
    var p = '#bottom-tab1';
    t1 = $(p + " .apply-table").advanceGrid({
        dataUrl: '/general/OptionValueList',
        model: "OptionValue", 
        editController: '/general',
        checkAll: true,
        width: {},
        border: true,
        height: {
            top: 193
        },
        modal: {
            type: 1,
            width: '600px',
            title: 'OptionValue'
        },
        toolbars: {
            create: {
                ele: p + ' .main-toolbar .btn-add'
            },
            reload: {
                ele: p + ' .main-toolbar .btn-reload'
            },
            reorder: {
                ele: p + ' .main-toolbar .btn-reorder'
            }
        },
        contextMenu: ['edit', 'delete'],
        filterable: true,
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            initOptionValueForm(t1);
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
            search: {
                hasCount: true,
                limit: 20
            }
        },
        skipCols: 0,
        head: {
            height: 60,
            groups: [60, 200, 180, 300, 110,
                110, 110, 110, 110, 100,
                100, 120]
        },
        cols: {
            left: [],
            right: [[
                {
                    title: "Id",
                    style: 'height: 60px'
                }, {
                    title: "Loại danh mục"
                },
                {
                    title: "Mã danh mục"
                },
                {
                    title: "Tên danh mục"
                },

                {
                    title: "Thuộc tính mở rộng 1"
                },
                {
                    title: "Thuộc tính mở rộng 2"
                },
                {
                    title: "Thuộc tính mở rộng 3"
                },
                {
                    title: "Thuộc tính mở rộng 4"
                },
                {
                    title: "Thuộc tính mở rộng 5"
                },
                {
                    title: "Thứ tự"
                },
                {
                    title: "Áp dụng"
                }, {
                    title: "Ghi chú"
                }
            ]]
        },
        rows: [
            {
                type: "text",
                attribute: 'Id'
            },
            {
                type: "text",
                attribute: 'Type',
                editInline: true,
                filter: {
                    type: 'option',
                    ajax: {
                        url: DOMAIN_API + '/general/optionvaluelist',
                        data: {
                            type: 'LoaiDanhMuc',
                            cache: true,
                            unlimited: true
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
                attribute: 'Code',
                editInline: true,
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
                },
                editInline: true
            },
            {
                type: "text",
                attribute: 'MoRong1',
                editInline: true
            }, {
                type: "text",
                attribute: 'MoRong2',
                editInline: true
            },
            {
                type: "text",
                attribute: 'MoRong3',
                editInline: true
            },
            {
                type: "text",
                attribute: 'MoRong4',
                editInline: true
            },
            {
                type: "text",
                attribute: 'MoRong5',
                editInline: true
            },
            {
                type: "text",
                attribute: 'Priority',
                render: function (row) {
                    var html = '';
                    if (row.Priority < _maxInt)
                        return '<span>' + row.Priority + '</span>';
                    return '<span></span>';
                },
                editInline: true
            }, {
                type: "checkbox",
                attribute: 'Status',
                style: 'text-align: center',
                editInline: true
            }, {
                type: "text",
                attribute: 'Note',
                editInline: true
            }
        ]
    });
}
 
$(document).ready(function () {
    initTable1(); 
    $('a[data-toggle="tab"]').on('shown.bs.tab',
        function (e) {
            e.target // newly activated tab 
            var i = parseInt($(e.target).attr('index'));
            switch (i) {
                case 1:
                    {
                        t1.resize();
                        t1.loadData();
                    }
                    break;
                case 2:
                    {
                        t2.resize();
                    } break;
                case 3:
                    {
                        t3.resize();
                        t3.loadData();
                    } break;
            }
        });
}); 