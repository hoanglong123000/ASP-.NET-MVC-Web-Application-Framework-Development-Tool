
function initEmployeeSuggestionView(param, callback) {
    param.hasOrg = true; 
    param.hasCount = true;
    var pa = '#EmployeeSuggestion_panel';
    var frTable = $(pa + " .apply-table").advanceGrid({
        dataUrl: DOMAIN_API + '/employee/suggestions',
        model: "", // ten table,
        editController: '/employee',
        checkAll: true,
        top: 0,
        width: {

        },
        height: {
            top: 220
        },
        modal: {

        },
        toolbars: {
            create: {
                ele: pa + ' .btn-add'
            },
            edit: {
                ele: pa + ' .btn-edit'
            },
            delete: {
                ele: pa + ' .btn-delete'
            }
        },
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            InitFamilyRelationForm(frTable);
        },
        loadDataCallback: function () {
            $(document).off('focusin.modal');
        },
        selectRowCallback: function (tr) {

        },
        params: {
            search: param
        },
        skipCols: 0,
        filterable: true,
        head: {
            groups: [50, 100, 200, 150, 200, 200, 100
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
                        title: "Vị trí công tác"
                    },
                    {
                        title: "Phòng ban/Công trường"
                    },
                    {
                        title: "Email công ty"
                    },
                    {
                        title: "Điện thoại"
                    }
                ]
            ]
        },
        rows: [
            {
                type: "ai"
            },
            {
                type: "text",
                attribute: 'StaffCode',
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },
            {
                type: "text",
                attribute: 'FullName',
                render: function(row) {
                    return '<a href="/employee/profile/' + row.Id + '" target="_blank">' + row.FullName + '</a>';
                },
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },
            {
                type: "text",
                attribute: 'JobPositionId',
                render: function (row) {
                    if (row.MainOrg != null)
                        return row.MainOrg.ObjJobPosition.Name;
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
                type: 'text',
                attribute: 'OrganizationId',
                render: function (row) {
                    if (row.MainOrg != null)
                        return row.MainOrg.ObjOrganization.Name;
                    return '';
                     
                },
                filter: {
                    type: 'compoTree',
                    option: {
                        url: '/general/Organizationlist',
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
                type: 'text',
                attribute: 'EmailCongTy',
                filter: {
                    type: 'contains',
                    attr: 'keyword'
                }
            },
            {
                type: 'text',
                attribute: 'DiDong',
                filter: {
                    type: 'contains',
                    attr: 'DiDong'
                }
            }
        ]
    });

    $(pa + ' .btn-select-option').unbind().click(function () { 
        var tdata = frTable.getCheckedDatas();
        if (tdata.length == 0) {
            app.notify('warning', 'Vui lòng chọn nhân sự');
        } else {
            callback(tdata);
        }
    }); 
}
