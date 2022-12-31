var t3, t4, p3 = '#tab3', p4 = '#tab4';
var  param3, param4;
function UpdateExpiredStatus(ids, type, expired, callback) {
    var url;
    switch (type) { 
        case 3:
            {
                url = '/recruitment/UpdateEvaluateProbationExpiredStatus';
            }
            break;
        case 4:
            {
                url = '/employee/UpdateContractResignEvaluationExpiredStatus';
            }
            break;
    }
    app.confirm('warning',
        null,
        null,
        function (ok) {
            if (ok) {
                app.postData(url,
                    {
                        ids: ids,
                        expired: expired
                    },
                    function () {
                        callback();
                        LoadApproveStatus();
                    });
            }
        });
}
 
function initTable3() {
    param3 = {
        hasCount: true,
        limit: 20
    };
    t3 = $(p3 + " .apply-table").advanceGrid({
        dataUrl: DOMAIN_API + '/Recruitment/recruitmentProbationReportMany',
        model: "ContractLabor", // ten table,
        editController: '/Employee',
        checkAll: false,
        autoLoad: false,
        width: {
        },
        height: {
            top: 245
        }, 
        toolbars: { 
        },
        contextMenu: [
            {
                text: 'Thông tin phiếu báo cáo',
                icon: 'icon-file-text',
                action: 'edit',
                class: 'btn-info-view',
                click: function (tr) {
                    var id = $(tr).attr('dataid');
                    var data = t3.getDataById(id);
                    ProbationReportView({
                        EmployeeId: data.EmployeeId
                    }, t3);
                }
            },
            {
                text: 'Chuyển sang trạng thái đã xử lý',
                icon: 'icon-blocked text-danger',
                action: 'change-expired-1',
                class: 'change-expired-1',
                click: function (tr) {
                    var id = $(tr).attr('dataid');
                    UpdateExpiredStatus([id], 3, true, function () {
                        t3.loadData();
                    });
                }
            },
            {
                text: 'Chuyển sang trạng thái chờ xử lý',
                icon: 'icon-check text-success',
                action: 'change-expired-0',
                class: 'change-expired-0',
                click: function (tr) {
                    var id = $(tr).attr('dataid');

                    UpdateExpiredStatus([id], 3, false, function () {
                        t3.loadData();
                    });
                }
            },
        ],
        paging: {
            options: [10, 20, 30, 50]
        },
        loadDataCallback: function () {
            $('#show_tab3_expried').unbind().change(function () {
                param3.hasExpired = $(this).is(':checked') ? true : null;
                $.uniform.update();
                t3.search(param3);
            });


            $('.btn-view-probation-report').unbind().click(function () {
                var id = $(this).attr('dataid');
                var data = t3.getDataById(id);
                ProbationReportView({
                    EmployeeId: data.EmployeeId 
                }, t3);
            });
             
        },
        params: {
            search: param3,
            edit: {
            }
        },
        skipCols: 0,
        filterable: true,
        head: {
            groups: [
                50, 120, 200, 300, 300,
                140, 140, 160, 160
            ]
        },
        cols: {
            left: [],
            right: [
                [
                    {
                        title: "STT"
                    },
                    {
                        title: "Mã NV"
                    },
                    {
                        title: "Họ và tên"
                    },
                    {
                        title: "Phòng ban/Công trường"
                    },
                    {
                        title: "Vị trí công tác"
                    },
                    {
                        title: "Trạng thái"
                    },
                    {
                        title: "Ngày cập nhật"
                    },
                    {
                        title: "Kết quả"
                    },
                    {
                        title: "Trạng thái xử lý"
                    }
                ]
            ]
        },
        rows: [
            {
                type: 'ai'
            },
            {
                type: "text",
                attribute: 'Code',
                render: function(row) {
                    if (row.ObjEmployee != null) {
                        return row.ObjEmployee.StaffCode;
                    }
                    return '';
                },
                filter: {
                    type: 'optionRemote',
                    prop: 'EmployeeId',
                    ajax: {
                        url: DOMAIN_API + '/employee/suggestionsforweb',
                        data: {
                            limit: 20
                        },
                        attr: {
                            id: 'Id',
                            text: 'FullName'
                        }
                    }
                }
            },
            {
                type: "text",
                attribute: 'Code',
                render: function(row) {
                    if (row.ObjEmployee != null) {
                        return '<a class="btn-view-probation-report text-bold" href="#" dataid="' +
                            row.Id +
                            '">' +
                            row.ObjEmployee.FullName +
                            '</a>';
                    }
                    return '';
                },
                filter: {
                    type: 'optionRemote',
                    prop: 'EmployeeId',
                    ajax: {
                        url: DOMAIN_API + '/employee/suggestionsforweb',
                        data: {
                            limit: 20
                        },
                        attr: {
                            id: 'Id',
                            text: 'FullName'
                        }
                    }
                }
            },
            {
                type: "text",
                attribute: 'Organization',
                render: function(row) {
                    if (row.ObjOrganization != null)
                        return row.ObjOrganization.Name;
                    return '';
                },
                filter: {
                    type: 'compoTree',
                    option: {
                        url: DOMAIN_API + '/general/Organizationlist',
                        params: {
                            cache: true,
                            unlimited: true
                        },
                        item: {
                            value: 'Id',
                            text: 'Name',
                            parent: 'ParentId'
                        }
                    }
                }
            },
            {
                type: "text",
                attribute: 'ObjJobPosition',
                render: function(row) {
                    if (row.ObjJobPosition != null)
                        return row.ObjJobPosition.Name;
                    return '';
                },
                filter: {
                    type: 'option',
                    prop: 'JobPositionId',
                    ajax: {
                        url: DOMAIN_API + '/category/JobPositionlist',
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
                attribute: 'Status',
                style: 'text-align: center',
                render: function(row) { 
                    switch (row.Status) {
                        case 1:
                            {
                                return '<span class="label label-default">Đang chờ ký duyệt</span>';
                            }
                        case 2:
                            {
                                return '<span class="label label-success">Ký duyệt hoàn tất</span>';
                            }
                    }
                    return '';
                },
                filter: {
                    type: 'option',
                    lst: function () {
                        var ls = [
                            { id: 1, text: 'Đang chờ ký duyệt' },
                            { id: 2, text: 'Ký duyệt hoàn tất' }
                        ];
                        return ls;
                    }
                }
            },
            {
                type: "datetime",
                attribute: 'UpdatedDate',
                style: 'text-align: center'  
            },
            {
                type: "text",
                attribute: 'KQ',
                style: 'text-align: center',
                render: function (row) {
                    var kq = row['V' + row.SoCapDuyet + '_NhanXet'];
                    if (typeof kq != 'undefined') {
                        switch (kq) {
                            case 1:
                                {
                                    return '<span class="label label-success">Đạt thử việc</span>';
                                }
                            case 2:
                                {
                                    return '<span class="label label-warning">Không đạt thử việc</span>';
                                }
                        }
                    }
                    return 'Không xác định';
                }
            },
            {
                type: "text",
                attribute: 'KQ',
                style: 'text-align: center',
                render: function (row) {
                    if (row.Expired)
                        return '<span class="label label-warning">Đã xử lý</span>';
                    return '<span class="label label-default">Chờ  xử lý</span>';
                }
            }
        ]
    });
}

function initTable4() {
    param4 = {
        hasCount: true,
        limit: 20
    };
    t4 = $(p4 + " .apply-table").advanceGrid({
        dataUrl: DOMAIN_API + '/employee/ContractResignEvaluationMany',
        model: "ContractLabor", // ten table,
        editController: '/Employee',
        checkAll: false,
        autoLoad: false,
        width: {
        },
        height: {
            top: 245
        },
        toolbars: { 
        },
        contextMenu: [
            {
                text: 'Thông tin phiếu báo cáo',
                icon: 'icon-file-text',
                action: 'edit',
                class: 'btn-info-view',
                click: function (tr) {
                    var id = $(tr).attr('dataid'); 
                    ContractResignView(id, t4);
                }
            },
            {
                text: 'Chuyển sang trạng thái đã xử lý',
                icon: 'icon-blocked text-danger',
                action: 'change-expired-1',
                class: 'change-expired-1',
                click: function (tr) {
                    var id = $(tr).attr('dataid');
                    UpdateExpiredStatus([id], 4, true, function () {
                        t4.loadData();
                    });
                }
            },
            {
                text: 'Chuyển sang trạng thái chờ xử lý',
                icon: 'icon-check text-success',
                action: 'change-expired-0',
                class: 'change-expired-0',
                click: function (tr) {
                    var id = $(tr).attr('dataid'); 
                    UpdateExpiredStatus([id], 4, false, function () {
                        t4.loadData();
                    });
                }
            },
        ],
        paging: {
            options: [10, 20, 30, 50]
        },
        loadDataCallback: function () {
            $('#show_tab4_expried').unbind().change(function () {
                param3.hasExpired = $(this).is(':checked') ? true : null;
                $.uniform.update();
                t4.search(param3);
            });


            $('.btn-view-contract-resign').unbind().click(function () {
                var id = $(this).attr('dataid'); 
                ContractResignView(id, t4);
            });
        },
        params: {
            search: param3,
            edit: {
            }
        },
        skipCols: 0,
        filterable: true,
        head: {
            groups: [50, 120, 250, 250, 250,
                140, 140, 160, 160
            ]
        },
        cols: {
            left: [],
            right: [
                [
                    { title: "STT" },
                    { title: "Mã NV" },
                    { title: "Họ và tên" },
                    { title: "Vị trí công tác" },
                    { title: "Phòng ban/Công trường" },
                    { title: "Trạng thái" },
                    { title: "Ngày cập nhật" },
                    { title: "Kết quả" },
                    { title: "Trạng thái xử lý" }
                ]
            ]
        },
        rows: [
            {
                type: "ai",
                style: 'text-align:center'
            },
            {
                type: 'text',
                attribute: 'StaffCode',
                render: function (row) {
                    if (row.ObjEmployee != null)
                        return row.ObjEmployee.StaffCode;
                    return '';
                }
            },
            {
                type: 'text',
                attribute: 'FullName',
                render: function (row) {
                    if (row.ObjEmployee != null)
                        return '<a class="text-bold btn-view-contract-resign " href="#" dataid="'+ row.Id +'">' + row.ObjEmployee.FullName  +'</a>';
                    return '';
                }
            },
            {
                type: 'text',
                attribute: 'JobPosition',
                render: function (row) {
                    if (row.ObjJobPosition != null)
                        return row.ObjJobPosition.Name;
                    return '';
                }
            },
            {
                type: 'text',
                attribute: 'Organization',
                render: function (row) {
                    if (row.ObjOrganization != null)
                        return row.ObjOrganization.Name;
                    return '';
                }
            },
            {
                type: "text",
                attribute: 'Status',
                style: 'text-align: center',
                render: function (row) {
                    switch (row.Status) {
                        case 1:
                            {
                                return '<span class="label label-default">Đang chờ ký duyệt</span>';
                            }
                        case 2:
                            {
                                return '<span class="label label-success">Ký duyệt hoàn tất</span>';
                            }
                    }
                    return '';
                },
                filter: {
                    type: 'option',
                    lst: function () {
                        var ls = [
                            { id: 1, text: 'Đang chờ ký duyệt' },
                            { id: 2, text: 'Ký duyệt hoàn tất' }
                        ];
                        return ls;
                    }
                }
            },
            {
                type: "datetime",
                attribute: 'UpdatedDate',
                style: 'text-align: center'
            },
            {
                type: "text",
                attribute: 'KQ',
                style: 'text-align: center',
                render: function (row) {
                    var kq = row['V' + row.SoCapDuyet + '_DongY'];
                    if (typeof kq != 'undefined') {
                        switch (kq) {
                            case 0:
                                {
                                    return '<span class="label label-success">Đồng ý tái ký</span>';
                                }
                            case 1:
                                {
                                    return '<span class="label label-warning">Không đồng ý tái ký</span>';
                                }
                        }
                    }
                    return 'Không xác định';
                }
            },
            {
                type: "text",
                attribute: 'KQ',
                style: 'text-align: center',
                render: function (row) {
                    if (row.Expired)
                        return '<span class="label label-warning">Đã xử lý</span>';
                    return '<span class="label label-default">Chờ  xử lý</span>';
                }
            }
        ]
    });
}

function ProbationReportView(data, tb, step) {
    var m = 'probation_report_modal';
    if ($('#' + m).length == 0) {
        app.createEmptyModal({
            title: 'Báo cáo thử việc',
            width: 1200,
            headerClass: 'bg-primary',
            id: m
        });
    }
    tb.showTableLoading();
    app.loadData(DOMAIN_API + '/recruitment/EvaluateProbationView',
        {
            employeeId: data.EmployeeId,
            dataType: 'html'
        },
        null,
        function (result) {
            tb.hideTableLoading();
            $('#' + m + ' .modal-body').html(result);
            $('#' + m).modal('show');

            setTimeout(function () {
                initProcessStateForm(function () {
                    $('#' + m).modal('hide');
                    tb.loadData();
                });
            }, 500);
        });
}

function ContractResignView(id, tb) {
    var m = 'resign_report_modal';
    if ($('#' + m).length == 0) {
        app.createEmptyModal({
            title: 'Báo cáo tái ký HĐLĐ',
            width: 1100,
            headerClass: 'bg-primary',
            id: m
        });
    }
    tb.showTableLoading();
    app.loadData(DOMAIN_API + '/employee/ContractEvaluationResignView',
        {
            id: id,
            dataType: 'html',
            preview: true
        },
        null,
        function (result) {
            tb.hideTableLoading();
            $('#' + m + ' .modal-body').html(result);
            $('#' + m).modal('show');

            setTimeout(function () {
                initEvaluateForm(function () {

                });
            }, 300);
        });
}

function EditProbationaryEmployee(id, stageCandidateId) {

    var title = id != null ? 'Cập nhật ' : 'Tạo mới ';
    title += 'hợp đồng thử việc';

    var m = 'probationary_employee_modal';
    if ($('#' + m).length == 0) {
        app.createEmptyModal({
            title: title,
            width: 900,
            id: m
        });
    }
    t2.showTableLoading();
    app.loadData('/employee/probationaryEmployeeEdit',
        {
            id: id,
            stageCandidateId: stageCandidateId,
            dataType: 'html'
        },
        null,
        function (result) {
            t2.hideTableLoading();
            $('#' + m + ' .modal-body').html(result);
            $('#' + m).modal('show');
            initProbationaryEmployeeForm(function () {
                $('#' + m).modal('hide');
                t2.loadData();
            });
        });


}

$(document).ready(function () { 
    initTable3();
    initTable4();
    var l3 = l4 = false; 
    if (tab != '') {
        var t = parseInt(tab);
        switch (t) {  
            case 4:
                {
                    $('#main_tab a[index="4"]').tab('show');
                    t4.setMainTableWidth();
                    t4.loadData();
                    l4 = true;
                }
                break;
            default:
                {
                    $('#main_tab a[index="3"]').tab('show');
                    t3.setMainTableWidth();
                    t3.loadData();
                    l3 = true;
                }
                break;
        }
    }
    else {
        $('#main_tab a[index="3"]').tab('show');
        t3.setMainTableWidth();
        t3.loadData();
        l3 = true;
    }

    $('#main_tab a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var t = $(e.target);
        var index = parseInt(t.attr('index')); 
        switch (index) { 
            case 3:
                {
                    if (!l3) {
                        t3.loadData();
                        l3 = true;
                    }
                    t3.setMainTableWidth();
                }
                break;
            case 4:
                {
                    if (!l4) {
                        t4.loadData();
                        l4 = true;
                    }
                    t4.setMainTableWidth();
                }
                break;
        } 
    });
     
});

