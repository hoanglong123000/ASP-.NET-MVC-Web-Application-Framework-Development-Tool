
var t1, t2;

function initTable1() {
    var p = '#bottom-tab1';
    t1 = $(p + " .apply-table").advanceGrid({
        dataUrl: '/general/OptionValueList',
        model: "OptionValue", // ten table,
        editController: '/general',
        checkAll: true,
        width: {},
        border: true,
        height: {
            top: 192
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
            initOptionValueForm(function () {
                t1.hideModal();
                t1.loadData();
            });
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
                110,
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

function initTable2() {
    var p = '#bottom-tab2';
    t2 = $(p + " .apply-list").listGroup({
        top: 113,
        autoLoad: true,
        groups: [
            {
                width: '25%',
                header: {
                    title: 'Quốc gia',
                    create: true,
                    filter: [
                        {
                            type: 'contains',
                            attr: 'keyword'
                        }
                    ]
                },
                command: {
                    editController: '/general',
                    model: "Nation",
                    param: {
                        unlimited: true
                    },
                    modal: {
                        width: '500px'
                    },
                    loadModalCallback: function (gi, idm) {
                        initNationForm(function () {
                            $('#' + idm).modal('hide');
                            t2.loadData(gi);
                        });
                    }
                },
                type: 'list',
                ajax: {
                    url: '/general/NationBaseList',
                    data: {
                        unlimited: true
                    }
                },
                item: {
                    id: 'Id',
                    relateId: null,
                    body: {
                        render: function (item) {
                            return '<span class="media-heading">' + item.Name + '</span>';
                        }
                    },
                    right: {
                        render: function (item) {
                            return item.MaThue != null ? '#' + item.MaThue : '';
                        }
                    }
                },
                contextMenu: ['edit', 'delete'],
                editable: true
            },
            {
                width: '25%',
                header: {
                    title: 'Tỉnh/thành phố',
                    create: true,
                    filter: [
                        {
                            type: 'contains',
                            attr: 'keyword'
                        }
                    ]
                },
                command: {
                    editController: '/general',
                    model: "Country",
                    param: {},
                    modal: {
                        width: '500px'
                    },
                    loadModalCallback: function (gi, idm) {
                        initCountryForm(function () {
                            $('#' + idm).modal('hide');
                            $('#' + idm).remove();
                            t2.loadData(gi);
                        });
                    }
                },
                type: 'list',
                ajax: {
                    url: '/general/countrylist',
                    data: {
                        unlimited: true
                    }
                },
                item: {
                    id: 'Id',
                    relateId: 'Nation',
                    body: {
                        render: function (item) {
                            return '<span class="media-heading">' + item.Name + '</span>';
                        }
                    },
                    right: {
                        render: function (item) {
                            return item.MaThue != null ? '#' + item.MaThue : '';
                        }
                    }
                },
                contextMenu: ['edit', 'delete'],
                loadCallback: function () {

                }
            },
            {
                width: '25%',
                header: {
                    title: 'Quận/huyện',
                    create: true,
                    filter: [
                        {
                            type: 'contains',
                            attr: 'keyword'
                        }
                    ]
                },
                command: {
                    editController: '/general',
                    model: "District",
                    param: {},
                    modal: {
                        width: '500px'
                    },
                    loadModalCallback: function (gi, idm) {
                        initDistrictForm(function () {
                            $('#' + idm).modal('hide');
                            $('#' + idm).remove();
                            t2.loadData(gi);
                        });
                    }
                },
                type: 'list',
                ajax: {
                    url: '/general/districtlist',
                    data: {
                        unlimited: true
                    }
                },
                item: {
                    id: 'Id',
                    relateId: 'CountryId',
                    body: {
                        render: function (item) {
                            return '<span class="media-heading">' + item.Name + '</span>';
                        }
                    },
                    right: {
                        render: function (item) {
                            return item.MaThue != null ? '#' + item.MaThue : '';
                        }
                    }
                },
                contextMenu: ['edit', 'delete'],
                loadCallback: function () {

                }
            },
            {
                type: 'list',
                width: '25%',
                header: {
                    title: 'Phường/xã',
                    create: true,
                    filter: [
                        {
                            type: 'contains',
                            attr: 'keyword'
                        }
                    ]
                },
                command: {
                    editController: '/general',
                    model: "Ward",
                    param: {},
                    modal: {
                        width: '500px'
                    },
                    loadModalCallback: function (gi, idm) {
                        initWardForm(function () {
                            $('#' + idm).modal('hide');
                            $('#' + idm).remove();
                            t2.loadData(gi);
                        });
                    }
                },
                ajax: {
                    url: '/general/wardlist',
                    data: {
                        unlimited: true
                    }
                },
                item: {
                    id: 'Id',
                    relateId: 'DistrictId',
                    body: {
                        render: function (item) {
                            return '<span class="media-heading">' + item.Name + '</span>';
                        }
                    },
                    right: {
                        render: function (item) {
                            return item.MaThue != null ? '#' + item.MaThue : '';
                        }
                    }
                },
                contextMenu: ['edit', 'delete'],
                loadCallback: function () {

                }
            }
        ]
    });
}

$(document).ready(function () {
    initTable1();
    initTable2();
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
            }
        });
}); 