
var table;

$(document).ready(function () {
    var panel = '#Cloth_panel';

    $.ajax({
        url: "/Education/ViewClothList",
        get: "GET",
        data: {},
        success: function (clothproduct) {
            console.log(clothproduct);
        }
    })


    table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/Education/ViewClothList',
        model: "Cloth", 
        editController: '/Education',
        checkAll: true,
        width: {},
        filterable: true,
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '1000px',
            title: 'Cloth'
        },
        toolbars: {
            reload: {
                ele: panel + ' .main-toolbar .btn-reload'
            }
        },
        contextMenu: [
            {
                text: 'Update',
                icon: 'icon-pencil7',
                class: 'menu-capnhat',
                action: 'capnhat',
                click: function (tr) {
                    var id = $(tr).attr('dataid');
                    console.log(id);
                    table.showTableLoading();
                    editCloth(id,
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
                initClothForm(function () {
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
            height: 60,
            groups: [100, 150, 100, 100, 100, 140, 140, 140, 100]
        },
        skipCols: 3,
        cols: {
            left: [
                [
                    { title: 'Số thứ tự', style:"height: 59px;"},
                    { title: 'Tên quần áo' },
                ]
            ],
            right: [
                [
                    { title: 'Kích cỡ' },
                    { title: 'Hãng' },
                    { title: 'Loại' },
                    { title: 'Tạo bởi' },
                    { title: 'Thời gian tạo' },
                    { title: 'Thời gian cập nhật' },
                    { title: 'Cập nhật bởi' }
                ]
            ]
        },
        rows: [
            { type: 'ai', style: 'text-align: center;' },

            {
                type: 'text', attribute: 'Name',

                filter: { type: 'contains', attr: 'keyword' }
            },

            /*Show Size.*/
            {
                type: 'text', attribute: 'SizeId',
                render: function (row) {
                    if (row.ObjSize != null)
                        return row.ObjSize.Name
                    return '';
                },
                /*Search SizeId.*/
                filter: {
                    type: 'option',
                    
                    ajax: {      
                        url: "/Education/SizeClothesList",
                        data: {},
                        attr: { id: "Code", text: "Name" },
                        success: function (list) {
                            console.log(list);
                        }
                    }
                }

            },

            /*Show Brand.*/
            {
                type: 'text', attribute: 'BrandId',
                render: function (row) {
                    if (row.ObjBrand != null)
                        return row.ObjBrand.Name
                    return '';
                },

                /*Search Brand Id.*/
                filter: {
                    type: 'option',

                    ajax: {
                        url: "/Education/SearchBrandList",
                        data: {},
                        /*attr: { id: "Code", text: "Name" },*/
                        success: function (list) {
                            console.log(list);
                            
                        }
                    }
                }
            },

            /*Show Type.*/
            {
                type: 'text', attribute: 'TypeId',
                render: function (row) {
                    if (row.ObjType != null)
                        return row.ObjType.Name
                    return '';
                }
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
        editCloth(
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
                url: '/Education/DeleteClothByIds',
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


function detailCloth(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'Update' : 'Add';
    var mid = 'editClothModal';
    app.createPartialModal({
        url: '/Education/ClothEdit',
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

function editCloth(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'Update' : 'Add';
    var mid = 'editClothModal';
    app.createPartialModal({
        url: '/Education/ClothEdit',
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