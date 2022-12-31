
var bvr = '#btn_export_export';
var rts = '#report_type_selector';
var f = '#ReportTypeForm';
var rc = '#report_contain';

function setOrgProp(s, obj) {
    s.Id = ko.observable(obj.Id);
    s.Name = ko.observable(obj.Name);
    s.ParentId = ko.observable(obj.ParentId);
    s.PrivateCount = ko.observable(obj.PrivateCount);
    s.OrgLevelId = ko.observable(obj.OrgLevelId);
    s.OrgLevel = ko.observable(obj.OrgLevel);
    s.TotalEmployee = ko.observable(obj.TotalEmployee);
}
function setOrgDefault(s) {
    s.Id = ko.observable(0);
    s.Name = ko.observable('');
    s.ParentId = ko.observable(null);
    s.PrivateCount = ko.observable(false);
    s.OrgLevelId = ko.observable(null);
    s.OrgLevel = ko.observable({
        MoRong1: ''
    });
    s.TotalEmployee = ko.observable(0);
}


var DefaultOrg = {
    Id: 0,
    Name: '',
    ParentId: '',
    PrivateCount: false,
    OrgLevelId: 0,
    OrgLevel: { MoRong1: '' },
    TotalEmployee: 0
};
var ParentOrg = function (obj) {
    var s = this;
    if (obj != null) {
        ko.mapping.fromJS(obj, {}, s);
        s.totalChilds = ko.observable(obj.childs().length);
    }
    else {
        ko.mapping.fromJS(DefaultOrg, {}, s);
        s.totalChilds = ko.observable(0);
    }
    s.isShowChild = ko.observable(true);
    s.active = ko.observable(false);
    s.top = ko.observable(0);
    s.left = ko.observable(0);
    s.focus = ko.observable(false);
    s.orgClass = ko.pureComputed(function () {
        var c = 'panel panel-body no-padding ' + s.OrgLevel.MoRong1();
        return c;
    }, s);
};
var Org = function (obj, parent) {
    var s = this;
    s.childs = ko.observableArray([]);
    if (obj != null) {
        setOrgProp(s, obj);
    } else {
        setOrgDefault(s);
    }
    s.parent = ko.observable(new ParentOrg(parent));
    s.isShowChild = ko.observable(true);
    s.active = ko.observable(false);
    s.isChecked = ko.observable(false);

    if (obj != null && obj.Childs != null) {
        $.each(obj.Childs, function () {
            s.childs.push(new Org(this, s));
        });
    }

};
var OrgTreeViewModel = function () {
    var s = this;
    s.tree = ko.observableArray([]);
    s.activeOrg = ko.observable(new Org(null, null));

    s.selectTreeChild = function (obj) {
        s.activeOrg().active(false);
        s.activeOrg(obj);
        s.activeOrg().active(true);
        $('.btn-select-emp-folder').removeClass('active');
        $('.btn-select-emp-folder label').addClass('text-danger');

        if (vt == 'grid') {
            grid.search({
                privateCount: s.activeOrg().PrivateCount(),
                organizationId: s.activeOrg().Id(),
                TrangThaiCongViecStr: "1,2",
                TrangThaiCongViec: null
            });
        } else {
            table.search({
                privateCount: s.activeOrg().PrivateCount(),
                organizationId: s.activeOrg().Id(),
                TrangThaiCongViecStr: "1,2",
                TrangThaiCongViec: null
            });
        }
    };

    s.checkTreeChild = function (obj) {
        var c = obj.isChecked();
        obj.isChecked(!c);
        if (obj.childs().length > 0) {
            s.checkChilds(obj, !c);
        }
    };

    s.checkChilds = function (p, check) {
        $(p.childs()).each(function () {
            this.isChecked(check);
            if (this.childs().length > 0) {
                s.checkChilds(this, check);
            }
        });
    };

    s.selectParentOrg = function (id) {
        var p = s.findParentOrg(s.tree(), id);
        if (p != null) {
            s.activeOrg().active(false);
            s.activeOrg(p);
            s.activeOrg().active(true);
        }
    };

    s.getCheckedChilds = function (list, p) {
        $(p.childs()).each(function () {
            if (this.isChecked()) {
                list.push(this.Id());

            }
            list = s.getCheckedChilds(list, this);
        });
        return list;
    };

    s.showTreeChild = function (obj) {
        if (obj.isShowChild()) {
            obj.isShowChild(false);
        } else {
            obj.isShowChild(true);
        }
    };

    s.showOrgChild = function (obj) {
        if (obj.isShowChild()) {
            obj.isShowChild(false);
        } else {
            obj.isShowChild(true);
        }
        if (obj.OrgLevelId() == 5 || obj.OrgLevelId() == 6) {
            var pOrg;
            if (s.activeOrg().parent().Id() == obj.ParentId()) {
                pOrg = s.activeOrg().parent();
            } else if (s.activeOrg().Id() == obj.ParentId()) {
                pOrg = s.activeOrg();
            } else {
                pOrg = s.findParentOrg(s.activeOrg().childs(), obj.ParentId());
            }
            if (pOrg != null) {
                var oi = 0;
                for (var i = 0; i < pOrg.childs().length; i++) {
                    if (pOrg.childs()[i].Id() == obj.Id()) {
                        oi = i;
                    } else {
                        if (i > oi) {
                            var t, h = 127;
                            if (obj.isShowChild()) {
                                t = obj.top() + 120;
                                if (obj.childs().length > 0) {
                                    t += obj.childs().length * 110;
                                }
                                h += obj.childs().length * 110;
                            } else {
                                if (i > 0) {
                                    t = obj.top() + 127;
                                } else {
                                    t = pOrg.top() + 127;
                                }
                            }
                            pOrg.childs()[i].top(t);
                            pOrg.childs()[i].verLine().height(h);
                        }
                    }
                }
            }
        }
    };

    s.findParentOrg = function (data, id) {
        if (id == null)
            return null;
        var org;
        $.each(data, function () {
            if (this.Id() == id) {
                org = this;
                return false;
            }
            if (this.childs().length > 0) {
                org = s.findParentOrg(this.childs(), id);
                if (org != null)
                    return false;
            }
        });
        return org;
    };
    s.findOrgById = function (data, id) {
        if (id == null)
            return null;
        var org;
        $.each(data,
            function () {
                if (this.Id() == id) {
                    org = this;
                    return false;
                }
                if (this.childs().length > 0) {
                    org = s.findOrgById(this.childs(), id);
                    if (org != null)
                        return false;
                }
            });
        return org;
    };
    s.loopOrg = function (data, obj) {
        $(data).each(function (o, i) {
            if (this.ParentId == obj.Id()) {
                var org = new Org(this, obj);
                s.loopOrg(data, org);
                obj.childs.push(org);
                org.parent().totalChilds(obj.childs().length);
            }
        });
    };

    s.loadData = function (id) {
        $('.tree-container .overlay').css('display', 'block');
        app.loadData(DOMAIN_API + '/general/OrganizationListForTree',
            {
                unlimited: true,
                cache: true,
                HasSummary: true
            },
            null,
            function (result) {
                $('.tree-container .overlay').css('display', 'none');
                s.activeOrg(new Org(null, null));
                if (s.tree().length > 0) {
                    s.tree.removeAll();
                };
                s.tree.push(new Org(result, null));

                s.events();
            });
    };

    s.events = function () {
        resize();
        $(window).resize(function () {
            resize();
        });

        $('.btn-select-emp-folder').unbind().click(function () {
            var btn = $(this);
            $('.btn-select-emp-folder').removeClass('active');
            $('.btn-select-emp-folder label').addClass('text-danger');
            s.activeOrg().active(false);
            s.activeOrg(new Org(null, null));
            btn.addClass('active');
            btn.find('label').removeClass('text-danger');
            var tt = btn.attr('data-status');
            if (vt == 'grid') {
                grid.search({
                    organizationId: null,
                    TrangThaiCongViec: tt,
                    TrangThaiCongViecStr: null
                });
            } else {
                table.search({
                    organizationId: null,
                    TrangThaiCongViec: tt,
                    TrangThaiCongViecStr: null
                });
            }
        });
    };

    s.init = function () {
        s.loadData();

        //app.loadData('/employee/TrangThaiCongViecSummary',
        //    {},
        //    null,
        //    function (result) {
        //        $(result).each(function () {
        //            $('.btn-select-emp-folder[data-status="' + this.TrangThai + '"] label')
        //                .text('(' + this.Total + ')');
        //        });
    };
    s.init();
};

function resize() {
    $(window).resize(function () {

    });
}

function initTab1() {
    var p1 = '#panel_report_type1';
    var param = {
        hasCount: true,
        limit: 20,
        thangSinh: $(p1 + ' .month-selector').val()
    };

    var t1 = $(p1 + " .apply-table").advanceGrid({
        dataUrl: DOMAIN_API + '/employee/GetNhanSuTheoSinhNhat',
        model: "ContractLabor", // ten table,
        editController: '/employee',
        checkAll: false,
        width: {},
        height: {
            top: 270
        },
        paging: {
            options: [10, 20, 30, 50]
        },
        params: {
            search: param,
            edit: {
            }
        },
        skipCols: 0,
        filterable: true,
        head: {
            groups: [40, 120, 250, 150, 250,
                100, 120, 120, 160, 160
            ]
        },
        cols: {
            left: [],
            right: [
                [
                    { title: "STT" },
                    { title: "Mã NV" },
                    { title: "Họ và tên" },
                    { title: "Chức danh" },
                    { title: "Phòng/Ban/Công trình" },

                    { title: "Ngày sinh" },
                    { title: "Bậc LĐ" },
                    { title: "CĐ công ty" },
                    { title: "Số tài khoản" },
                    { title: "Ngân hàng" }
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
                attribute: 'StaffCode'
            },
            {
                type: 'text',
                attribute: 'FullName'
            },
            {
                type: 'text',
                attribute: 'JobTitleId',
                render: function (row) {
                    if (row.ObjJobTitle != null)
                        return row.ObjJobTitle.Name;
                    return '';
                },
                filter: {
                    type: 'option',
                    ajax: {
                        url: DOMAIN_API + '/general/jobtitlelist',
                        data: {
                            unlimited: true,
                            cache: true
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
                attribute: 'OrganizationId',
                render: function (row) {
                    if (row.ObjOrganization != null)
                        return row.ObjOrganization.Name;
                    return '';
                }, filter: {
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
                attribute: 'NgaySinh',
                style: 'text-align: center',
                render: function (row) {
                    if (row.NgaySinh != null) {
                        var ns = moment(row.NgaySinh);
                        return ns.format('MM/YYYY');
                    }
                    return '';
                }
            },
            {
                type: 'text',
                attribute: 'BacLDDen',
                render: function (row) {
                    if (row.ObjBacLD != null)
                        return row.ObjBacLD.Name;
                    return '';
                },
                filter: {
                    type: 'option',
                    lst: function () {
                        var ls = [
                            { id: 1, text: '<= Bậc 1' },
                            { id: 2, text: '<= Bậc 2' },
                            { id: 3, text: '<= Bậc 3' },
                            { id: 4, text: '<= Bậc 4' },
                            { id: 5, text: '<= Bậc 5' }
                        ];
                        return ls;
                    }
                }
            },
            {
                type: 'text',
                attribute: 'TKNH_NganHang',
                render: function () {
                    return '';
                }
            },
            {
                type: 'text',
                attribute: 'TKNH_So'
            },
            {
                type: 'text',
                attribute: 'TKNH_NganHang'
            }
        ]
    });

    $(p1 + ' .month-selector').change(function () {
        param.thangSinh = $(this).val();
        t1.search(param);
    });

    $(p1 + ' .btn-export').unbind().click(function () {
        app.cleanJson(t1.searchParams);

        var url = DOMAIN_API + '/export/ExcelEmployeeReport_7?' + $.param(t1.searchParams);

        window.open(url, '_blank');
    });
}

function initTab2() {
    var fa = '#AdvanceSearchForm';
    var props = [
        {
            name: 'GioiTinh',
            type: 'select2',
            option: {}
        },
        {
            name: 'NoiSinh',
            type: 'select2',
            option: {}
        },
        {
            name: 'TonGiao',
            type: 'select2',
            option: {}
        },
        {
            name: 'DanToc',
            type: 'select2',
            option: {}
        },
        {
            name: 'NoiDaoTao',
            type: 'select2',
            option: {}
        },
        {
            name: 'TrinhDoDaoTao',
            type: 'select2',
            option: {}
        },
        {
            name: 'ChuyenNganh',
            type: 'select2',
            option: {}
        },
        {
            name: 'HinhThucDaoTao',
            type: 'select2',
            option: {}
        },
        {
            name: 'TinhTrangHonNhan',
            type: 'select2',
            option: {}
        },
        {
            name: 'DiemGoc',
            type: 'select2',
            option: {}
        },
        {
            name: 'ThamGiaCongDoan',
            type: 'select2',
            option: {}
        },
        {
            name: 'KhuVucDonVi',
            type: 'select2',
            option: {}
        },
        {
            name: 'VungMien',
            type: 'select2',
            option: {}
        },
        {
            name: 'WorkIndirectly',
            type: 'select2',
            option: {}
        },
        {
            name: 'JobPositionId',
            type: 'select2',
            option: {}
        },
        {
            name: 'BacLD',
            type: 'select2',
            option: {}
        },
        {
            name: 'LoaiHopDong',
            type: 'select2',
            option: {}
        },
        {
            name: 'CreatedDate',
            type: 'compoDate',
            option: {
                onChange: function (v) {
                    console.log(v);
                }
            }
        },
        {
            name: 'NgayVaoCongTy',
            type: 'compoDate',
            option: {
                onChange: function (v) {
                    console.log(v);
                }
            }
        },
        {
            name: 'QuanLy',
            type: 'select2',
            option: {
                ajax: {
                    url: "/employee/suggestions",
                    dataType: 'json',
                    quietMillis: 250,
                    data: function (term, page) {
                        return {
                            keyword: term,
                            limit: 10
                        };
                    },
                    results: function (result, page) {
                        if (app.hasValue(result.SessionExpired) && result.SessionExpired) {
                            $('#login_modal').modal('show');
                            return {
                                results: []
                            };
                        } else {
                            var data = [];
                            $(result).each(function () {
                                data.push({
                                    id: this.Id,
                                    text: this.StaffCode + ' - ' + this.FullName
                                });
                            });
                            return { results: data };
                        }
                    }
                },
                allowClear: true,
                placeholder: "Chọn quản lý"
            }
        },
        {
            name: 'ThamNien',
            type: 'select2',
            option: {},
            onChange: function (v) {
                var d1, d2 = '';
                if (v != '') {
                    var arr = v.split('-');
                    if (arr[0] != '0') {
                        d1 = arr[0];
                    }
                    if (arr[1]) {
                        d2 = arr[1];
                    }
                }
                $(fa + ' input[name="ThamNienFrom"]').val(d1);
                $(fa + ' input[name="ThamNienTo"]').val(d2);
            }
        },
       
        {
            name: 'TrangThaiCongViec',
            type: 'select2',
            option: {}
        },
        {
            name: 'ThuongTru_Tinh',
            type: 'select2',
            option: {}
        },
        {
            name: 'TamTru_Tinh',
            type: 'select2',
            option: {}
        },
        {
            name: 'QueQuan_Tinh',
            type: 'select2',
            option: {}
        },
        {
            name: 'TamTru_Quan',
            type: 'select2',
            option: {
                allowClear: true,
                placeholder: "Chọn quận/huyện"
            },
            relateOption: {
                prop: 'TamTru_Tinh',
                url: '/general/districtlist',
                beforeSearch: function (p, id) {
                    p.countryId = id;
                    return p;
                },
                attr: {
                    id: 'Id',
                    text: 'Name'
                }
            }
        },
        {
            name: 'ThuongTru_Quan',
            type: 'select2',
            option: {
                allowClear: true,
                placeholder: "Chọn quận/huyện"
            },
            relateOption: {
                prop: 'ThuongTru_Tinh',
                url: '/general/districtlist',
                beforeSearch: function (p, id) {
                    p.countryId = id;
                    return p;
                },
                attr: {
                    id: 'Id',
                    text: 'Name'
                }
            }
        },
        {
            name: 'QueQuan_Quan',
            type: 'select2',
            option: {
                allowClear: true,
                placeholder: "Chọn quận/huyện"
            },
            relateOption: {
                prop: 'QueQuan_Tinh',
                url: '/general/districtlist',
                beforeSearch: function (p, id) {
                    p.countryId = id;
                    return p;
                },
                attr: {
                    id: 'Id',
                    text: 'Name'
                }
            }
        },
        {
            name: 'ThuongTru_Phuong',
            type: 'select2',
            option: {
                allowClear: true,
                placeholder: "Chọn phường/xã"
            },
            relateOption: {
                prop: 'ThuongTru_Quan',
                url: '/general/wardlist',
                beforeSearch: function (p, id) {
                    p.districtId = id;
                    return p;
                },
                attr: {
                    id: 'Id',
                    text: 'Name'
                }
            }
        },
        {
            name: 'TamTru_Phuong',
            type: 'select2',
            option: {
                allowClear: true,
                placeholder: "Chọn phường/xã"
            },
            relateOption: {
                prop: 'TamTru_Quan',
                url: '/general/wardlist',
                beforeSearch: function (p, id) {
                    p.districtId = id;
                    return p;
                },
                attr: {
                    id: 'Id',
                    text: 'Name'
                }
            }
        },
        {
            name: 'QueQuan_Phuong',
            type: 'select2',
            option: {
                allowClear: true,
                placeholder: "Chọn phường/xã"
            },
            relateOption: {
                prop: 'QueQuan_Quan',
                url: '/general/wardlist',
                beforeSearch: function (p, id) {
                    p.districtId = id;
                    return p;
                },
                attr: {
                    id: 'Id',
                    text: 'Name'
                }
            }
        }
    ];
    for (var i = 1; i <= 66; i++) {
        props.push({
            name: 'col_' + i,
            type: 'checkbox'
        });
    }

    var ov = new OrgTreeViewModel();
    ko.applyBindings(ov, $('#tree_panel')[0]);

    var f2 = $(fa).ultraForm({
        uiType: 1,
        actionType: 'ajax',
        props: props,
        autoSubmit: false,
        validCallback: function (data, btn) {
            data = app.formDataToJson(data);
            var param = {};
            var cols = [];
            for (var j = 1; j <= 66; j++) {
                if (data['col_' + j] == 'true') {
                    cols.push(j);
                }
                delete data['col_' + j];
            }
            var orgs = [];

            $(ov.tree()).each(function () {
                if (this.isChecked()) {
                    orgs.push(this.Id());
                }
                orgs = ov.getCheckedChilds(orgs, this);
            });
            data.orgStr = orgs.join(';');

            $('input[name="orgStr"]').val(orgs.join(';'));
            $('input[name="colStr"]').val(cols.join(';'));
             
            if (cols.length == 0) {
                app.notify('warning', 'Vui lòng chọn trường dữ liệu cần xuất báo cáo');
            } else {
                app.cleanJson(data);
                param = data;
                param.colStr = cols.join(';');
               $(fa).submit();
                //window.open(DOMAIN_API + '/export/ExcelAdvanceReport?' + jQuery.param(param), '_blank');
            }
            return null;
        },
        afterSubmit: function (form) {
            table.hideModal();
            table.loadData();
        }
    });

    $('#check_hrm_all').unbind().click(function () {
        $(fa + '  input[type="checkbox"]').prop('checked', true);
        $.uniform.update();
    });
    $('#clear_hrm_all').unbind().click(function () {
        $(fa + ' input[type="checkbox"]').prop('checked', false);
        $.uniform.update();
    });
    $('#btn_2_export').unbind().click(function () {
        f2.submit($(this));
    });
}

$(document).ready(function () {
    switch (type) {
        case 1:
            {
                initTab1();
            }
            break;
        case 2:
            {
                initTab2();
            }
            break;
    }

});

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function (element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn(200) : $(element).fadeOut(200);
    }
};