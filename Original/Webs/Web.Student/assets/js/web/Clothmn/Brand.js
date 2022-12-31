
var table;

$(document).ready(function () {
    var panel = '#Brand_panel';

    table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/Education/ViewBrandList',
        model: "Brand", // ten table,
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
            title: 'BRAND'
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
                    editBrand(id,
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
                initBrandForm(function () {
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
            groups: [80, 240, 250, 130, 250, 130]
        },
        skipCols: 3,
        cols: {
            left: [
                [
                    { title: 'Id' },
                    { title: 'Brand Cloth' },
                ]
            ],
            right: [
                [

                    
                    
                    { title: 'Created by' },
                    { title: 'Created date' },
                    { title: 'Updated date' },
                    { title: 'Updated by' }
                ]
            ]
        },
        rows: [
            { type: 'ai', style: 'text-align: center;' },
            
            {
                type: 'text', attribute: 'Namebrand',
                
                /*filter: { type: 'contains', attr: 'keyword' }*/
            },


            
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
        editBrand(
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
            app.notify('warning', 'No information selected yet!');
        } else {
            app.confirmAjax({
                url: '/Education/DeleteBrandByIds',
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


function detailBrand(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'Update' : 'Add';
    var mid = 'editBrandModal';
    app.createPartialModal({
        url: '/Education/BrandEdit',
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
        initBrandForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}

function editBrand(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'Update' : 'Add';
    var mid = 'editBrandModal';
    app.createPartialModal({
        url: '/Education/BrandEdit',
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
        initBrandForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}