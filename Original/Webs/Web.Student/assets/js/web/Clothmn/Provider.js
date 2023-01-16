
var table;

$(document).ready(function () {
    var panel = '#Provider_panel';

    $.ajax({
        url: "/Provider/ViewProviderList",
        get: "GET",
        data: {},
        success: function (product) {
            console.log(product);
        }
    })


    table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/Provider/ViewProviderList',
        model: "Provider",
        editController: '/Provider',
        checkAll: true,
        width: {},
        filterable: true,
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '1000px',
            title: 'NHÀ CUNG CẤP'
        },
        toolbars: {
            reload: {
                ele: panel + ' .main-toolbar .btn-reload'
            }
        },
        contextMenu: [
            {
                text: 'CẬP NHẬT',
                icon: 'icon-pencil7',
                class: 'menu-capnhat',
                action: 'capnhat',
                click: function (tr) {
                    var id = $(tr).attr('dataid');
                    console.log(id);
                    table.showTableLoading();
                    editProvider(id,
                        function () {
                            table.hideTableLoading();
                        },
                        function () {
                            table.loadData();
                        },
                    )
                }
            },
            'delete'],
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {

            setTimeout(function () {
                initProviderForm(function () {
                    table.hideModal();
                    table.loadData();
                });
            }, 300);

        },

        loadDataCallback: function () {

            $('a.btn-view-detail').click(function () {

                var id = $(this).attr('dataid');

                console.log(id);



            });
        },

        params: {
            search: {
                hasCount: true,
                limit: 20,

            }
        },
        head: {

            groups: [50, 200, 155, 200, 100, 100, 140, 140, 140]
        },
        skipCols: 3,
        cols: {
            left: [
                [
                    { title: 'STT' },
                    { title: 'Nhà cung cấp' },
                ]
            ],
            right: [
                [
                    { title: 'Số điện thoại' },
                    { title: 'Địa chỉ' },
                    { title: 'Nguồn gốc'},
                    { title: 'Người tạo' },
                    { title: 'Người cập nhật' },
                    { title: 'Ngày tạo' },
                    { title: 'Ngày cập nhật' },

                ]
            ]
        },
        rows: [
            { type: 'ai', style: 'text-align: center;' },

            {
                type: 'text', attribute: 'Name',

                filter: { type: 'contains', attr: 'keyword' }
            },

            /*Show Size.*//*
            {
                type: 'text', attribute: 'SizeId',
                render: function (row) {
                    if (row.ObjSize != null)
                        return row.ObjSize.Name
                    return '';
                },
                *//*Search SizeId.*//*
            filter: {
                type: 'option',

                ajax: {
                    url: "/Clothes/SizeClothesList",
                    data: {},
                    attr: { id: "Code", text: "Name" },

                }
            }

        },*/

            /*Show Brand.*//*
            {
                type: 'text', attribute: 'BrandId',
                render: function (row) {
                    if (row.ObjBrand != null)
                        return row.ObjBrand.Name
                    return '';
                },

                *//*Search Brand Id.*//*
            filter: {
                type: 'option',

                ajax: {
                    url: "/Clothes/SearchBrandList",
                    data: {},
                    attr: { id: "Id", text: "Name" },

                }
            }
        },

        *//*Show Type.*//*
            {
                type: 'text', attribute: 'TypeId',
                render: function (row) {
                    if (row.ObjType != null)
                        return row.ObjType.Name
                    return '';
                }
            },*/

            {
                type: 'text', attribute: 'PhoneNumber'

            },

            {
                type: 'text', attribute: 'Address'
            },

            {
                type: 'text', attribute: 'Country'
            },


            /**/
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
                attribute: 'CreatedDate'
            },

            {
                type: 'datetime',
                attribute: 'UpdatedDate'
            }

        ]
    });


    $('.btn-add').click(function () {
        var btn = $(this);
        btn.button('loading');
        editProvider(
            null,
            function () {
                btn.button('reset');
            },
            function () {
                table.loadData();
            }
        );
    });


    $('.btn-delete-multi').click(function () {
        var btn = $(this);

        var selectedIds = table.getCheckedRowIds();

        console.log(selectedIds);

        if (selectedIds.length == 0) {
            app.notify('warning', 'Không tìm thấy thông tin');
        } else {
            app.confirmAjax({
                url: '/Provider/DeleteProviderByIds',
                data: {
                    ids: selectedIds
                },
                callback: function () {
                    table.loadData();
                }
            })
        }
    });
});


function detailProvider(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'DANH SÁCH NHÀ CUNG CẤP' : 'DANH SÁCH NHÀ CUNG CẤP';
    var mid = 'editProviderModal';
    app.createPartialModal({
        url: '/Provider/ProviderEdit',
        data: {
            id: id
        },
        modal: {
            title: modalTitle,
            width: '1000px',
            id: mid
        }
    }, function () {
        initCallback();
        initProviderForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}

function editProvider(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'DANH SÁCH NHÀ CUNG CẤP' : 'DANH SÁCH NHÀ CUNG CẤP';
    var mid = 'editProviderModal';
    app.createPartialModal({
        url: '/Provider/ProviderEdit',
        data: {
            id: id
        },
        modal: {
            title: modalTitle,
            width: '1000px',
            id: mid
        }
    }, function () {
        initCallback();
        initProviderForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}