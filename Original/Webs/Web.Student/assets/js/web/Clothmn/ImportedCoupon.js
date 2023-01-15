

var table;

$(document).ready(function () {
    var panel = '#ImportedCoupon_panel';

    $.ajax({
        url: "/ImportedCoupon/ViewImportedCouponList",
        type: "GET",
        data: {},
        success: function (ImportedCoupon) {
            console.log(ImportedCoupon);
        }
    })


    table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/ImportedCoupon/ViewImportedCouponList',
        model: "ImportedCoupon",
        editController: '/ImportedCoupon',
        checkAll: true,
        width: {},
        filterable: true,
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '1000px',
            title: 'PHIẾU NHẬP HÀNG'
        },
        toolbars: {
            reload: {
                ele: panel + ' .main-toolbar .btn-reload'
            }
        },
        contextMenu: [
            {
                text: 'Cập nhật',
                icon: 'icon-pencil7',
                class: 'menu-capnhat',
                action: 'capnhat',
                /*Condition to enable Update button on right-click*/
                visible: function (row) {
                    return row.Status == 2;
                },
                click: function (tr) {
                    var id = $(tr).attr('dataid');
                    console.log(id);
                    table.showTableLoading();
                    editSoldCoupon(id,
                        function () {
                            table.hideTableLoading();
                        },
                        function () {
                            table.loadData();
                        },
                    );

                }
            },
            {
                text: 'Xóa',
                icon: 'icon-bin',
                class: 'delete',
                action: 'delete',
                /*Condition to enable Delete button on right-click*/
                visible: function (row) {
                    return row.Status == 2;
                },
                click: function (tr) {
                    var id = $(tr).attr('dataid');
                    deleteSoldCoupon(id,
                        function () {
                        },
                        function () {
                            table.loadData();
                        },
                    );

                }

            },
        ],
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {

            setTimeout(function () {
                initSoldCouponForm(function () {
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
            height: 59,
            groups: [50, 160, 100, 170, 100, 100, 100, 100, 100, 100],
        },
        skipCols: 3,
        cols: {
            left: [
                [
                    { title: 'Mã số' },
                    { title: 'Nhà cung cấp' },
                ]
            ],
            right: [
                [
                    { title: 'Tổng tiền' },
                    { title: 'Ghi chú' },
                    { title: 'Trạng thái' },
                    { title: 'Ngày bán' },
                    { title: 'Người tạo' },
                    { title: 'Ngày tạo' },
                    { title: 'Người cập nhật' },
                    { title: "Ngày cập nhật" }

                ]
            ]
        },
        rows: [
            { type: 'ai', style: 'text-align: center;' },

            {
                type: 'text', attribute: 'Name',

                /*filter: { type: 'contains', attr: 'keyword' },*/
                render: function (row) {
                    if (row.ObjName != null)
                        return row.ObjName.Name
                    return '';
                },
                /*Search Name.*//*
                filter: {
                    type: 'option',

                    ajax: {
                        url: "/ImportedCoupon/SearchName",
                        data: {},
                        attr: { id: "Id", text: "Name" },

                    }
                }*/
            },



            {
                type: 'price', attribute: 'TotalPrice',
                style: 'text-align: center; '
            },


            {
                type: 'text', attribute: 'IsOnlineShop',
                render: function (row) {
                    if (row.ObjMethodToShop != null)
                        switch (row.IsOnlineShop) {
                            // Status: Shop.
                            case 0:
                                return "<span class='label text-pink-800' >" + row.ObjMethodToShop.Name + "</span>";

                            // Status: Online website.
                            case 1:
                                return "<span class='label text-teal-600' >" + row.ObjMethodToShop.Name + "</span>";



                        }
                    return row.ObjMethodToShop.Name
                    return '';
                },
                /*Filtering list through Method.*//*
                filter: {
                    type: 'option',
                    ajax: {
                        url: "/ImportedCoupon/SearchMethodsToShopList",
                        data: {},
                        attr: { id: "Code", text: "Name" },
                    }
                },*/
                style: 'text-align: center; '



            },

            {
                type: 'text', attribute: 'Status',
                render: function (row) {
                    /*if (row.ObjStatus != null)
                        switch (row.Status) {
                            // Status: Cancel.
                            case 0:
                                return "<span class='label text-danger-600'>" + row.ObjStatus.Name + "</span>";

                            // Status: Sold.
                            case 1:
                                return "<span class='label text-success' style='border-style: solid; border-color: green;'>" + row.ObjStatus.Name + "</span>";

                            // Status: Save Temp.
                            case 2:
                                return "<span class='label text-orange-600' >" + row.ObjStatus.Name + "</span>";

                        }


                    return '';


                },
                *//*Search StatusList.*//*
                filter: {
                    type: 'option',

                    ajax: {
                        url: "/SoldCoupon/SearchStatusList",
                        data: {},
                        attr: { id: "Code", text: "Name" },

                    }
                },*/
                style: 'text-align: center; '
            },

            {
                type: 'datetime',
                attribute: 'ImportedDate',
                style: 'text-align: center; '
            },



            /**/
            {
                type: 'text',
                attribute: 'CreatedBy',
                render: function (row) {
                    if (row.ObjCreatedBy != null)
                        return row.ObjCreatedBy.FullName;
                    return '';
                },
                style: 'text-align: center; '
            },


            {
                type: 'datetime',
                attribute: 'CreatedDate',
                style: 'text-align: center; '
            },

            {
                type: 'text',
                attribute: 'UpdatedBy',
                render: function (row) {
                    if (row.ObjUpdatedBy != null)
                        return row.ObjUpdatedBy.FullName;
                    return '';
                },
                style: 'text-align: center; '

            },
            {
                type: 'datetime',
                attribute: 'UpdatedDate',
                style: 'text-align: center; '
            },
        ]
    });


    $('.btn-add').click(function () {
        var btn = $(this);
        btn.button('loading');
        editSoldCoupon(
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
                url: '/ImportedCoupon/DeleteImportedCouponByIds',
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


function detailSoldCoupon(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'PHIẾU NHẬP HÀNG' : 'PHIẾU NHẬP HÀNG';
    var mid = 'editImportedCouponModal';
    app.createPartialModal({
        url: '/ImportedCoupon/ImportedCouponEdit',
        data: {
            id: id
        },
        modal: {
            title: modalTitle,
            width: '1300px',
            id: mid
        }
    }, function () {
        initCallback();
        initSoldCouponForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}

// Right-click Update method.
function editSoldCoupon(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'PHIẾU NHẬP HÀNG' : 'PHIẾU NHẬP HÀNG';
    var mid = 'editImportedCouponModal';
    app.createPartialModal({
        url: '/ImportedCoupon/ImportedCouponEdit',
        data: {
            id: id
        },
        modal: {
            title: modalTitle,
            width: '1300px',
            id: mid
        }
    }, function () {
        initCallback();
        initSoldCouponForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })

}
function deleteImportedCoupon(id, initCallback, editCallback) {
    app.confirmAjax({
        url: '/ImportedCoupon/DeleteImportedCouponByIds',
        data: {
            ids: [id]
        },
        callback: function () {
            table.loadData();
        }
    })
}

