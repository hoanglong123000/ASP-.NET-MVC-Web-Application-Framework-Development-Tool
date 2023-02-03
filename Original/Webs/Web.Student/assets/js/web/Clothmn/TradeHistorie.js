var table;

$(document).ready(function () {
    var panel = '#TradeHistorie_panel';

    $.ajax({
        url: "/TradeHistorie/ViewTradeHistorieList",
        type: "GET",
        data: {},
        success: function (data) {
            console.log(data);
        }
    })


    table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/TradeHistorie/ViewTradeHistorieList',
        model: "TradeHistorie",
        editController: '/TradeHistorie',
        checkAll: true,
        width: {},
        filterable: true,
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '1000px',
            title: 'LỊCH SỬ GIAO DỊCH'
        },
        toolbars: {
            reload: {
                ele: panel + ' .main-toolbar .btn-reload'
            }
        },
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {

            setTimeout(function () {
                initTradeHistorieForm(function () {
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
            groups: [50, 160, 100, 170, 100],
        },
        skipCols: 3,
        cols: {
            left: [
                [
                    { title: 'Mã số' }, 
                    { title: 'Tên hàng hóa'},
                ]
            ],
            right: [
                [
                    { title: 'Trạng thái', style: 'height: 59px' },
                    { title: 'Thời gian giao dịch', style: 'height: 59px' },
                    { title: 'Số lượng ', style: 'height: 59px' }

                ]
            ]
        },
        rows: [
            { type: 'ai', style: 'text-align: center;' },

            {
                type: 'text', attribute: 'ClothesId',

                /*filter: { type: 'contains', attr: 'keyword' },*/
                render: function (row) {
                    if (row.ObjClothesName != null)
                        return row.ObjClothesName.Name
                    return '';
                },
                /*Search Cloth.*/
                filter: {
                    type: 'option',

                    ajax: {
                        url: "/TradeHistorie/SearchClothesIdList",
                        data: {},
                        attr: { id: "Id", text: "Name" },

                    }
                }
            },


            {
                type: 'text', attribute: 'Status',
                render: function (row) {
                    if (row.ObjStatus != null)
                        switch (row.Status) {
                            // Status: Shop.
                            case 0:
                                return "<span class='label text-pink-800' >" + row.ObjStatus.Name + "</span>";

                            // Status: Online website.
                            case 1:
                                return "<span class='label text-teal-600' >" + row.ObjStatus.Name + "</span>";
                        }
                    return '';
                },
                /*Filtering list through Method.*/
                filter: {
                    type: 'option',
                    ajax: {
                        url: "/TradeHistorie/SearchStatusList",
                        data: {},
                        attr: { id: "Code", text: "Name" },
                    }
                },
                style: 'text-align: center; '



            },

            

            {
                type: 'datetime',
                attribute: 'TradeTime',
                style: 'text-align: center; '
            },

            {
                type: 'text',
                attribute: 'Amount',
                style: 'text-align: center; '
            },



            
        ]
    });


    $('.btn-add').click(function () {
        var btn = $(this);
        btn.button('loading');
        editTradeHistorie(
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
                url: '/TradeHistorie/DeleteTradeHistorieByIds',
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


function detailTradeHistorie(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'LỊCH SỬ GIAO DỊCH' : 'LỊCH SỬ GIAO DỊCH';
    var mid = 'editTradeHistorieModal';
    app.createPartialModal({
        url: '/TradeHistorie/TradeHistorieEdit',
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
        initTradeHistorieForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}

// Right-click Update method.
function editTradeHistorie(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'LỊCH SỬ GIAO DỊCH' : 'LỊCH SỬ GIAO DỊCH';
    var mid = 'editTradeHistorieModal';
    app.createPartialModal({
        url: '/TradeHistorie/TradeHistorieEdit',
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
        initTradeHistorieForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })

}
function deleteTradeHistorie(id, initCallback, editCallback) {
    app.confirmAjax({
        url: '/TradeHistorie/DeleteTradeHistorieByIds',
        data: {
            ids: [id]
        },
        callback: function () {
            table.loadData();
        }
    })
}

