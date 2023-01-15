
var table;

$(document).ready(function () {
    var panel = '#SoldCoupon_panel';

    $.ajax({
        url: "/SoldCoupon/ViewSoldCouponList",
        type: "GET",
        data: {},
        success: function (SoldCoupon) {
            console.log(SoldCoupon);
        }
    })


    table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/SoldCoupon/ViewSoldCouponList',
        model: "SoldCoupon",
        editController: '/SoldCoupon',
        checkAll: true,
        width: {},
        filterable: true,
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '1000px',
            title: 'PHIẾU BÁN HÀNG'
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
                    )
                }
            },
            'delete'],
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
            groups: [50, 140, 150, 130, 100, 100, 100, 100, 100, 100],
        },
        skipCols: 3,
        cols: {
            left: [
                [
                    { title: 'Mã số'},
                    { title: 'Họ tên người mua' },
                ]
            ],
            right: [
                [
                    { title: 'Tổng tiền' },
                    { title: 'Phương thức mua hàng' },
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
                type: 'text', attribute: 'BuyerName',

                filter: { type: 'contains', attr: 'keyword' },
                render: function (row) {
                    if (row.ObjNameBuyer != null)
                        return row.ObjNameBuyer.Name
                            return '';
                },
                /*Search StatusList.*/
                filter: {
                    type: 'option',

                    ajax: {
                        url: "/SoldCoupon/SearchBuyerName",
                        data: {},
                        attr: { id: "Id", text: "Name" },

                    }
                }
            },



            {
                type: 'text', attribute: 'TotalPrice'
            },


            {
                type: 'text', attribute: 'IsOnlineShop',
                render: function (row) {
                    if (row.ObjMethodToShop != null)
                        return row.ObjMethodToShop.Name
                    return '';
                },
                /*Filtering list through Method.*/
                filter: {
                    type: 'option',
                    ajax: {
                        url: "/SoldCoupon/SearchMethodsToShopList",
                        data: {},
                        attr: { id: "Code", text: "Name" },
                    }
                }


            },

            {
                type: 'text', attribute: 'Status',
                render: function (row) {
                    if (row.ObjStatus != null)
                        return row.ObjStatus.Name
                    return '';
                },
                /*Search StatusList.*/
                filter: {
                    type: 'option',

                    ajax: {
                        url: "/SoldCoupon/SearchStatusList",
                        data: {},
                        attr: { id: "Code", text: "Name" },

                    }
            },

            {
                type: 'datetime',
                attribute: 'SoldDate',

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
                url: '/SoldCoupon/DeleteSoldCouponByIds',
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
    var modalTitle = id != null ? 'PHIẾU BÁN HÀNG' : 'PHIẾU BÁN HÀNG';
    var mid = 'editSoldCouponModal';
    app.createPartialModal({
        url: '/SoldCoupon/SoldCouponEdit',
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
    var modalTitle = id != null ? 'PHIẾU BÁN HÀNG' : 'PHIẾU BÁN HÀNG';
    var mid = 'editSoldCouponModal';
    app.createPartialModal({
        url: '/SoldCoupon/SoldCouponEdit',
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