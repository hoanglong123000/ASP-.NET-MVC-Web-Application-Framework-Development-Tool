
var table;

$(document).ready(function () {
    var panel = '#Customer_panel';

    $.ajax({
        url: "/Customer/ViewCustomerList",
        get: "GET",
        data: {},
        success: function (customerproduct) {
            console.log(customerproduct);
        }
    })


    table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/Customer/ViewCustomerList',
        model: "Customer",
        editController: '/Customer',
        checkAll: true,
        width: {},
        filterable: true,
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '1000px',
            title: 'KHÁCH HÀNG'
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
                    editCustomer(id,
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
                initCustomerForm(function () {
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
                    { title: 'Họ và tên' },
                ]
            ],
            right: [
                [
                    { title: 'Số điện thoại' },
                    { title: 'Email' },
                    { title: 'Địa chỉ' },
                    { title: 'Người tạo' },
                    { title: 'Ngày tạo' },
                    { title: 'Người cập nhật' },
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
                type: 'text', attribute: 'Email'
            },

            {
                type: 'text', attribute: 'Address'
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
        editCustomer(
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
                url: '/Clothes/DeleteCustomerByIds',
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


function detailCustomer(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'DANH SÁCH KHÁCH HÀNG' : 'DANH SÁCH KHÁCH HÀNG';
    var mid = 'editCustomerModal';
    app.createPartialModal({
        url: '/Clothes/ClothEdit',
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
        initClothForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}

function editCustomer(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'DANH SÁCH KHÁCH HÀNG' : 'DANH SÁCH KHÁCH HÀNG';
    var mid = 'editCustomerModal';
    app.createPartialModal({
        url: '/Customer/CustomerEdit',
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
        initCustomerForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}