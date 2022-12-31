
var table;

$(document).ready(function () {
    var panel = '#Student_panel';

    table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/education/StudentList',
        model: "Student", // ten table,
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
            title: 'học sinh'
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
                    table.showTableLoading();
                    editStudent(id,
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
                initStudentForm(function () {
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
            groups: [50, 80, 240, 200,
                100, 100,
                150, 250,
                250, 130, 250, 130]
        },
        skipCols: 3,
        cols: {
            left: [
                [
                    { title: 'STT' },
                    { title: 'Ảnh <br/> đại diện' },
                    { title: 'Họ tên' }
                ]
            ],
            right: [
                [
                   
                    { title: 'Email', style: 'height: 58px' },
                    { title: 'Ngày sinh' },
                    { title: 'Giới tính' },
                    { title: 'Nhóm học sinh' },
                    { title: 'Tóm tắt' },
                    { title: 'Người tạo' },
                    { title: 'Ngày tạo' },
                    { title: 'Người cập nhật' },
                    { title: 'Ngày cập nhật' }
                ]
            ]
        },
        rows: [
            { type: 'ai', style: 'text-align: center; height: 80px' },
            {
                type: 'text',
                attribute: 'Avatar',
                render: function (row) {
                    if (row.Avatar != null) {
                        return '<img style="height: 60px" src="' + row.Avatar + '" />';
                    }
                    return '';
                }
            },
            {
                type: 'text', attribute: 'Name',
                render: function (row) {
                    var str = '<a href="#" class="text-bold btn-view-detail" dataid="'+ row.Id +'">' + row.Name + '</a>';
                    return str;
                },
                filter: { type: 'contains', attr: 'keyword' }
            },
            
           
            {
                type: 'text', attribute: 'Email'
            },
            {
                type: 'date', attribute: 'NgaySinh',
                filter: { type: 'date' }
            },
            {
                type: 'text', attribute: 'GioiTinh',
                render: function (row) { // sửa giá trị theo ý mình
                    switch (row.GioiTinh) {
                        case 1:
                            return 'Nam';
                        case 2:
                            return 'Nữ'
                    }
                    return '';
                },
                filter: {
                    type: 'option',
                    lst: function () {
                        var ls = [
                            { id: 1, text: 'Nam' },
                            { id: 2, text: 'Nữ' }
                        ];
                        return ls;
                    }
                }
            },
            {
                type: 'text', attribute: 'GroupId',
                render: function (row) {
                    switch (row.GroupId) {
                        case 1:
                            return 'Nhóm 1';
                        case 2:
                            return 'Nhóm 2'
                        case 3:
                            return 'Nhóm 3'
                    }
                    return '';
                },
                filter: {
                    type: 'option',
                    ajax: {
                        url: '/education/GroupList',
                        data: {},
                        attr: {
                            id: 'Id',
                            text: 'Name'
                        }
                    }
                }

            },
            { type: 'text', attribute: 'TomTat' },
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
        editStudent(
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
            app.notify('warning', 'Chọn học sinh cần xóa');
        } else {
            app.confirmAjax({
                url: '/education/deleteStudentByIds',
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


function detailStudent(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'Cập nhật học sinh' : 'Thêm mới học sinh';
    var mid = 'editStudentModal';
    app.createPartialModal({
        url: '/education/studentedit',
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
        initStudentForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}

function editStudent(id, initCallback, editCallback) {
    var modalTitle = id != null ? 'Cập nhật học sinh' : 'Thêm mới học sinh';
    var mid = 'editStudentModal';
    app.createPartialModal({
        url: '/education/studentedit',
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
        initStudentForm(function () {
            $('#' + mid).modal('hide');
            editCallback();
        })
    })
}