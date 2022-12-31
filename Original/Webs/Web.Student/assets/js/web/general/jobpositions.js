
$(document).ready(function () {
    var panel = '#job_position_panel';

    var table = $(panel + " .apply-table").unbind().advanceGrid({
        dataUrl: '/general/jobPositionList',
        model: "JobPosition", // ten table,
        editController: '/general',
        checkAll: true,
        width: {},
        height: {
            top: 145
        },
        modal: {
            type: 1,
            width: '600px',
            title: 'Chức danh',
            headerClass: 'bg-primary'
        },
        toolbars: {
            create: {
                ele: panel + ' .main-toolbar .btn-add'
            },
            edit: {
                ele: panel + ' .main-toolbar .btn-edit'
            },
            delete: {
                ele: panel + ' .main-toolbar .btn-delete'
            },
            reload: {
                ele: panel + ' .main-toolbar .btn-reload'
            }
        },
        contextMenu: ['edit',
            '-',
            {
                text: 'Kích hoạt',
                icon: 'icon-check text-success',
                action: 'active-1',
                class: 'active-1',
                click: function (tr) {
                    var id = $(tr).attr('dataid');
                    table.showTableLoading();
                    app.postData('/general/ActiveJobPosition',
                        {
                            active: true,
                            id: id
                        }, function (result) {
                            table.loadData();
                        });
                }
            },
            {
                text: 'Vô hiệu',
                icon: 'icon-x text-danger',
                action: 'active-2',
                class: 'active-2',
                click: function (tr) {
                    var id = $(tr).attr('dataid');
                    table.showTableLoading();
                    app.postData('/general/ActiveJobPosition',
                        {
                            active: false,
                            id: id
                        }, function (result) {
                            table.loadData();
                        });
                }
            },
            '-',
            'delete'],
        filterable: true,
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            initJobPositionForm(table);
        },
        loadDataCallback: function () {
            $('#test').click(function () {
                $('.filter-option').trigger('click');
            });
            var tr = $(panel + " .apply-table  .area-br tbody tr").eq(0);
            if (tr.length > 0) {
                table.selectRow(tr);
            }
        },
        selectRowCallback: function (tr) {

        },
        params: {
            search: {
                limit: 20,
                hasCount: true
            }
        },
        skipCols: 3,
        head: { 
            groups: [50, 250, 200, 200,
                110, 140]
        },
        cols: {
            left: [[
                {
                    title: "STT" 
                },
                {
                    title: "Tên vị trí"
                }]],
            right: [[  
                {
                    title: "Chức danh"
                },
                {
                    title: "Nhóm người dùng"
                },
                {
                    title: "Áp dụng"
                },  
               
                {
                    title: "Ngày tạo"
                } 
            ]]
        },
        rows: [
            {
                type: "text",
                style: 'text-align: center',
                attribute: 'Priority'
            },
            {
                type: "text",
                attribute: 'Name',
                class: 'text-bold',
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },  
            {
                type: "text",
                attribute: 'JobTitle',
                render: function (row) {
                    if (row.JobTitle != null)
                        return row.JobTitle.Name;
                    return '';
                },
                filter: {
                    type: 'option',
                    prop: 'JobTitleId',
                    ajax: {
                        url: DOMAIN_API + '/general/JobTitlelist',
                        data: {
                            cache: true,
                            unlimited: true
                        },
                        attr: {
                            id: 'Id',
                            text: 'Name'
                        }
                    }
                }
            }, 

            {
                type: "text",
                attribute: 'GroupId',
                render: function (row) {
                    if (row.ObjGroup != null)
                        return row.ObjGroup.Name;
                    return '';
                }, filter: {
                    type: 'option',
                    prop: 'GroupId',
                    ajax: {
                        url: '/general/grouplist',
                        data: {
                            cache: true,
                            unlimited: true
                        },
                        attr: {
                            id: 'Id',
                            text: 'Name'
                        }
                    }
                }
            },  
            {
                type: "text",
                attribute: 'active',
                style: 'text-align: center',
                render: function (row) {
                    if (row.Active) {
                        return '<i class="icon-check text-success"></i>';
                    }
                    return '<i class="icon-x text-danger"></i>';
                },
                filter: {
                    type: 'option',
                    lst: function () {
                        var ls = [
                            { id: 'true', text: 'Kích hoạt' },
                            { id: 'false', text: 'Vô hiệu' }
                        ];
                        return ls;
                    }
                }
            },
            
            {
                type: "datetime",
                attribute: 'CreatedDate'
            } 
        ]
    });

});

function RequestDetail(id, tb) {
    var title = 'Thông tin phiếu lớp';

    var m = 'request_info_modal';
    if ($('#' + m).length == 0) {
        app.createEmptyModal({
            title: title,
            width: 1200,
            headerClass: 'bg-primary',
            id: m
        });
    } else {
        $('#' + m + ' .modal-title').text(title);
    }
    tb.showTableLoading();
    app.loadData('/Edutcation/ClassDetail',
        {
            id: id,
            dataType: 'html'
        },
        null,
        function (result) {
            tb.hideTableLoading();
            $('#' + m + ' .modal-body').html(result);
            $('#' + m).modal('show');
            initClassDetailForm(function () {
                $('#' + m).modal('hide');
                tb.loadData();
                LoadApproveStatus();
            });
        });
}