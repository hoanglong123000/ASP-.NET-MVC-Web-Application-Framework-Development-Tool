
var _suggestJobPos = null;
var _employeeData = null;
var uf;
var EmployeeDefault = {
    Id: null,
    FullName: '',
    Avatar: '',
    StaffCode: '',
};
var JobTitle = function (obj) {
    var s = this;
    if (obj != null) {
        s.Id = ko.observable(obj.Id);
        s.Name = ko.observable(obj.Name);
    } else {
        s.Id = ko.observable(0);
        s.Name = ko.observable('');
    }
};
var Job = function (obj) {
    var s = this;
    s.listJobs = ko.observableArray([]);
    if (obj != null) {
        s.Id = ko.observable(obj.Id);
        s.Code = ko.observable(obj.Code);
        s.Name = ko.observable(obj.Name);
        s.Jobs = ko.observable(obj.Jobs);
        s.ExternalTitle = ko.observable(obj.ExternalTitle);
        s.JobTitleId = ko.observable(obj.JobTitleId);
        s.JobTitle = ko.observable(new JobTitle(obj.JobTitle));

        if (obj.Jobs != null) {
            var jIds = obj.Jobs.split(',');
            for (var i = 0; i < jIds.length; i++) {
                $(lstCongViec).each(function () {
                    if (this.Id == parseInt(jIds[i])) {
                        s.listJobs.push(this);
                    }
                });
            }
        }
    } else {
        s.Id = ko.observable(0);
        s.Name = ko.observable('');
        s.Code = ko.observable('');
        s.ExternalTitle = ko.observable('');
        s.JobTitleId = ko.observable(null);
        s.JobTitle = ko.observable(new JobTitle(null));
        s.Jobs = ko.observable('');
    }

};
var Indirect = function (id, index) {
    var s = this;
    s.index = ko.observable(index);
    s.id = ko.observable(id);

    s.listJobPositions = ko.observableArray(josPositions);

    setTimeout(function () {
        $('#indirect_' + s.index()).unbind().select2({
            placeholder: 'Chọn vị trí công tác'
        }).change(function (v) {
            s.id($('#indirect_' + s.index()).val());
        });
        $('#indirect_' + s.index()).val(id).trigger("change");

        //$('#indirect_' + s.index()).unbind().compoTree({
        //    url: '/general/Organizationlist',
        //    placeHolder: 'Chọn QL gián tiếp',
        //    valueType: 1,
        //    params: {
        //        unlimited: true,
        //        cache: true
        //    },
        //    item: {
        //        value: 'Id',
        //        text: 'Name',
        //        parent: 'ParentId'
        //    },
        //    selectCallback: function (d) {
        //        s.id(d);
        //    }
        //});
    }, 200);
};
var OrgPos = function (obj) {
    var s = this;
    if (obj != null) {
        s.Id = ko.observable(obj.Id);
        s.OrganizationId = ko.observable(obj.OrganizationId);
        s.JobPositionId = ko.observable(obj.JobPositionId);
        s.IsOwner = ko.observable(obj.IsOwner);
        s.IsSecretary = ko.observable(obj.IsSecretary);
        s.JobPosition = ko.observable(new Job(obj.JobPosition));
    } else {
        s.Id = ko.observable(0);
        s.OrganizationId = ko.observable(0);
        s.JobPositionId = ko.observable(0);
        s.IsOwner = ko.observable(false);
        s.IsSecretary = ko.observable(false);
        s.JobPosition = ko.observable(new Job(null));
    }
    s.isDelete = ko.observable(false);
    s.titles = ko.observableArray(JobTitles);
    s.JobTitleName = ko.computed(function () {
        if (s.JobPosition().JobTitle() != null)
            return s.JobPosition().JobTitle().Name();
        return '';
    });
};
var EmployeeOrg = function (obj, index) {
    var s = this;
    s.STT = ko.observable(index);
    if (obj != null) {
        s.Id = ko.observable(obj.Id);
        s.EmployeeId = ko.observable(obj.EmployeeId);
        s.JobPositionId = ko.observable(obj.JobPositionId);
        s.ObjJobPosition = ko.observable(new Job(obj.ObjJobPosition));
        s.Employee = ko.observable(obj.Employee != null ? obj.Employee : EmployeeDefault);
        s.isNew = ko.observable(false);
        s.Concurrently = ko.observable(obj.Concurrently);
    } else {
        s.EmployeeId = ko.observable(null);
        s.JobPositionId = ko.observable(null);
        s.ObjJobPosition = ko.observable(new Job(null));
        s.Id = ko.observable(null);
        s.Employee = ko.observable(EmployeeDefault);
        s.isNew = ko.observable(true);
        s.Concurrently = ko.observable(false);
    }

    s.isDelete = ko.observable(false);
};

var Package = function (obj, index) {
    var s = this;
    s.index = index;
    if (obj != null) {
        s.Id = ko.observable(obj.Id);
        s.Name = ko.observable(obj.Name);
        s.GiaTri_XD = ko.observable(obj.GiaTri_XD);
        s.GiaTri_ME = ko.observable(obj.GiaTri_ME);
        s.GiaTri_NSC = ko.observable(obj.GiaTri_NSC);
        s.TGBatDau = ko.observable(moment(obj.TGBatDau).format('MM/YYYY'));
        s.TienDo = ko.observable(obj.TienDo + ' tháng');
    } else {
        s.Id = ko.observable('');
        s.Name = ko.observable('');
        s.GiaTri_XD = ko.observable('');
        s.GiaTri_ME = ko.observable('');
        s.GiaTri_NSC = ko.observable('');
        s.TGBatDau = ko.observable('');
        s.TienDo = ko.observable('');
    }

}

function PackageEdit(id, initCallback, resultCallback) {
    var im = 'package_edit_modal';
    app.createPartialModal({
        modal: {
            title: 'BIỂU ĐỒ NHÂN SỰ BAN CHI HUY',
            headerClass: 'bg-primary text-bold',
            id: im,
            width: '1200px'
        },
        url: '/general/BiddingPackageEdit',
        data: {
            id: id,
            dataType: 'html'
        }
    }, function () {
        initBiddingPackageForm(app.formDataToJson(uf.getFormData()),
            function (result) {
                $('#' + im).modal('hide');
                resultCallback(result);
            });
        initCallback();
    });
}

var PositionViewModel = function () {
    var s = this;
    s.positions = ko.observableArray([]);
    s.employees = ko.observableArray([]);
    s.activeOrgPos = ko.observable(new OrgPos(null));
    s.activePosId = ko.observable(0);
    s.jobState = ko.observable(0);
    s.empState = ko.observable(0);
    s.isSubmitPosition = ko.observable(false);
    s.isSubmitForm = ko.observable(false);
    s.isChosenEmployee = ko.observable(false);
    s.activeEmployee = ko.observable(new EmployeeOrg(null, 0));
    s.getNewJobCode = function () {
        app.loadData('/category/getNewJobPositionCode',
            {},
            null,
            function (result) {
                s.activeOrgPos().JobPosition().Code(result);
            });
    };
    s.changeOwner = function () {
        $.each(s.positions(),
            function () {
                if (this.IsOwner() && this.JobPosition().Id() != s.activeOrgPos().JobPosition().Id()) {
                    this.IsOwner(false);
                }
            });
    };
    s.addJobPosition = function (obj, e) {
        var btn = $(e.currentTarget);
        s.isSubmitPosition(true);
        var j = s.activeOrgPos().JobPosition;
        var job = ko.toJS(j);
        if (job.Code != '' && job.Name != '') {
            var isExist = false;
            $.each(s.positions(), function () {
                if (this.isDelete() == false && this.JobPosition().Id() == s.activeOrgPos().JobPosition().Id()) {
                    isExist = true;
                    return false;
                }
            });
            if (!isExist) {
                s.isSubmitPosition(false);
                if (s.activeOrgPos().IsOwner()) {
                    s.changeOwner();
                }
                s.positions.push(s.activeOrgPos());
                s.activeOrgPos(new OrgPos(null));
            } else {
                app.notify('warndig', 'Vị trí đã được thêm vào danh sách.');
            }
            $('#select_job_position').select2().val('').trigger("change");
            $('#select_job_option').select2().val([]).trigger("change");
        }
        s.jobState(0);
    };
    s.editJobPosition = function (obj, e) {
        var btn = $(e.currentTarget);
        s.isSubmitPosition(true);
        var j = s.activeOrgPos().JobPosition();
        var job = ko.toJS(j);
        if (job.Code != '' && job.Name != '') {
            btn.button('loading');
            app.postData('/category/JobPositionEdit',
                job,
                function (result) {
                    btn.button('reset');
                    if (result.Success) {
                        app.notify('success', 'Cập nhật thành công.');
                        s.isSubmitPosition(false);

                        if (s.activeOrgPos().IsOwner()) {
                            s.changeOwner();
                        }

                        $.each(s.positions(),
                            function () {
                                if (this.JobPosition().Id() == result.Data.Id) {
                                    this.JobPosition(new Job(result.Data));
                                    this.IsOwner(s.activeOrgPos().IsOwner());
                                }
                            });

                        s.activeOrgPos(new OrgPos(null));
                        s.getNewJobCode();
                        s.activePosId(0);
                    } else {
                        app.notify('warning', result.Message);
                    }
                });
        }
        $('#select_job_option').select2().val([]).trigger("change");
        s.jobState(0);
    };
    s.selectOwner = function () {
        var io = s.activeOrgPos().IsOwner();
        s.activeOrgPos().IsOwner(!io);
    };
    s.selectSecretary = function () {
        var io = s.activeOrgPos().IsSecretary();
        s.activeOrgPos().IsSecretary(!io);
    };
    s.editOrgPos = function (obj) {
        s.activeOrgPos(obj);
        s.jobState(1);
        s.activePosId(s.activeOrgPos().JobPositionId());
        var jIds = [];
        if (s.activeOrgPos().JobPosition().listJobs().length > 0) {
            $.each(s.activeOrgPos().JobPosition().listJobs(),
                function () {
                    jIds.push(this.Id);
                });
        }
        $('#select_job_position').select2().val(s.activePosId()).trigger("change");
        $('#select_job_option').select2().val(jIds).trigger("change");
    };
    s.removeOrgPos = function (obj) {
        if (obj.Id() > 0) {
            obj.isDelete(true);
        } else {
            s.positions.remove(obj);
        }
    };
    s.changeConcurrently = function () {
        var f = s.activeEmployee().Concurrently();
        s.activeEmployee().Concurrently(!f);
    };
    s.pushEmployee = function (emp) {
        s.employees.push(emp);
        s.activeEmployee(new EmployeeOrg(null, 0));
        s.isChosenEmployee(false);
        s.empState(0);
        $('#select_emp_pos').val('');
        $('#select_emp_option').select2('data', null).trigger('change');
    };
    s.addEmployee = function (obj, e) {
        var btn = $(e.currentTarget);
        s.isChosenEmployee(true);
        if (s.activeEmployee().EmployeeId() != null
            && s.activeEmployee().JobPositionId() != ''
            && s.activeEmployee().JobPositionId() != null) {
            var emp = new EmployeeOrg(null, s.employees().length + 1);

            $(_employeeData).each(function () {
                if (this.Id == s.activeEmployee().EmployeeId()) {

                    emp.EmployeeId(this.Id);
                    emp.JobPositionId(s.activeEmployee().JobPositionId());
                    emp.isNew(s.activeEmployee().isNew());
                    emp.Employee(this);
                    emp.Concurrently(s.activeEmployee().Concurrently());
                    $(s.positions()).each(function () {
                        if (this.JobPositionId() == s.activeEmployee().JobPositionId()) {
                            emp.ObjJobPosition(this.JobPosition());
                        }
                    });

                }
            });

            if (!s.activeEmployee().Concurrently()) {
                btn.button('loading');
                app.loadData('/employee/employeeOrganizationList',
                    {
                        employeeId: s.activeEmployee().EmployeeId(),
                        HasOrg: true,
                        Concurrently: false
                    },
                    null,
                    function (result) {
                        btn.button('reset');
                        if (result.Many.length > 0) {
                            var org = result.Many[0];

                            if (org.OrganizationId != orgId) {
                                var text = '';
                                if (org.ObjOrganization != null) {
                                    text = 'Nhân sự ' +
                                        emp.Employee().FullName +
                                        ' đang làm việc tại đơn vị ' +
                                        org.ObjOrganization.Name +
                                        '. Anh/Chị chắc chắn muốn điều chuyển nhân sự qua đơn vị mới ?';
                                } else {
                                    text = 'Nhân sự ' +
                                        emp.Employee().FullName +
                                        ' đang làm việc tại đơn vị khác . Anh/Chị chắc chắn muốn điều chuyển nhân sự qua đơn vị mới ?';
                                }
                                app.confirm('warning',
                                    null,
                                    text,
                                    function () {
                                        s.pushEmployee(emp);
                                    });
                            } else {
                                s.pushEmployee(emp);
                            }

                        } else {
                            s.pushEmployee(emp);
                        }
                    });
            } else {
                s.pushEmployee(emp);
            }
        }
    };
    s.removeEmp = function (obj) {
        if (obj.isNew()) {
            s.employees.remove(obj);
        } else {
            obj.isDelete(true);
        }
    };
    s.editEmp = function (obj) {
        s.activeEmployee(obj);
        $('#select_emp_pos').val(s.activeEmployee().JobPositionId());
        $('#select_emp_option').select2('data',
            {
                id: s.activeEmployee().EmployeeId(), text: s.activeEmployee().Employee().StaffCode + ' - ' + s.activeEmployee().Employee().FullName
            }).trigger('change');
        $('#select_emp_option').select2("enable", false);
        s.empState(1);
    };
    s.saveEditEmp = function (o, e) {
        s.isChosenEmployee(true);
        var btn = $(e.currentTarget);
        if (!s.activeEmployee().Concurrently()) {
            btn.button('loading');
            app.loadData('/employee/employeeOrganizationList',
                {
                    employeeId: s.activeEmployee().EmployeeId(),
                    HasOrg: true,
                    Concurrently: false
                },
                null,
                function (result) {
                    btn.button('reset');
                    if (result.Many.length > 0) {
                        var org = result.Many[0];
                        if (org.OrganizationId != orgId) {
                            app.confirm('warning',
                                null,
                                'Nhân sự ' +
                                s.activeEmployee().Employee().FullName +
                                ' đang làm việc tại đơn vị ' +
                                org.ObjOrganization.Name +
                                '. Anh/Chị chắc chắn muốn điều chuyển nhân sự qua đơn vị mới ?',
                                function () {
                                    s.updateEmpAfterEdit();
                                });
                        } else {
                            s.updateEmpAfterEdit();
                        }
                    } else {
                        s.updateEmpAfterEdit();
                    }
                });
        } else {
            s.updateEmpAfterEdit();
        }


        $('#select_emp_option').select2("enable", true);
    };
    s.activePackage = ko.observable(new Package(null));
    s.updateEmpAfterEdit = function () {
        $.each(s.employees(),
            function () {
                var e = this;
                if (e.STT() == s.activeEmployee().STT()) {
                    e.JobPositionId(s.activeEmployee().JobPositionId());
                    $(s.positions()).each(function () {
                        if (this.JobPositionId() == s.activeEmployee().JobPositionId()) {
                            e.ObjJobPosition(this.JobPosition());
                        }
                    });
                    e.Concurrently(s.activeEmployee().Concurrently());
                    s.activeEmployee(new EmployeeOrg(null, 0));
                    s.isChosenEmployee(false);
                    s.empState(0);
                    $('#select_emp_pos').val('');
                    $('#select_emp_option').select2('data', null).trigger('change');
                }
            });
    }
    s.selectEmpPos = function (id) {
    };

    s.isErrorIndirect = ko.observable(false);
    s.isErrorPackage = ko.observable(false);

    // quan ly gian tiep
    s.indirects = ko.observableArray([]);

    s.addIndirect = function () {
        s.indirects.push(new Indirect(null, s.indirects().length + 1));
    };
    s.removeIndirect = function (obj) {
        s.indirects.remove(obj);
        $.each(s.indirects(), function (o, i) {
            this.index(o + 1);
        });
    };
    s.addDefaultPos = function (o, e) {
        var btn = $(e.target);
        btn.button('loading');
        app.loadData(DOMAIN_API + '/general/OrgJobPositionDetaulList',
            {},
            null,
            function (result) {
                btn.button('reset');
                $(result).each(function () {
                    var isExist = false;
                    var p = this;
                    $.each(s.positions(),
                        function () {
                            if (this.isDelete() == false &&
                                this.JobPosition().Id() == p.Id) {
                                isExist = true;
                                return false;
                            }
                        });
                    if (!isExist) {
                        s.positions.push(new OrgPos({
                            JobPositionId: p.Id,
                            JobPosition: p
                        }));
                    }
                });
            });
    }
    // goi thau
    s.packages = ko.observableArray([]);

    s.addPackage = function (obj, e) {
        var btn = $(e.target);
        btn.button('loading');
        PackageEdit(null, function () {
            btn.button('reset');
        }, function (result) {
            s.packages.push(new Package(result, s.packages().length + 1));
        });
    };

    s.removePackage = function (obj) {
        app.confirm('warning',
            null,
            null,
            function (ok) {
                if (ok) {
                    app.postData('/general/DeleteBiddingPackageByIds',
                        {
                            id: obj.Id
                        },
                        function (result) {
                            s.packages.remove(obj);
                        });
                }
            });
    };

    s.editPackage = function (obj, e) {
        s.activePackage(obj);
        var btn = $(e.target);
        btn.button('loading');
        PackageEdit(obj.Id, function () {
            btn.button('reset');
        }, function (result) {
            s.activePackage().Name(result.Name);
            s.activePackage().TGBatDau(moment(result.TGBatDau).format('MM/YYYY'));
            s.activePackage().TienDo(result.TienDo + ' tháng');
        });
    }

    s.real = ko.computed(function () {
        s.isErrorIndirect(false);
        $.each(s.indirects(), function () {
            if (!app.hasValue(this.id())) {
                s.isErrorIndirect(true);
                return false;
            }
        });

    });

    s.init = function () {
        if (positions != null) {
            $(positions).each(function () {

                s.positions.push(new OrgPos(this));
            });
        }

        if (employees != null) {
            $(employees).each(function () {
                s.employees.push(new EmployeeOrg(this, s.employees().length + 1));
            });
        }

        s.getNewJobCode();

        //$('#position_name').suggestionInput({
        //    url: DOMAIN_API + '/category/jobpositionlist',
        //    item: {
        //        text: 'Name',
        //        value: 'Id'
        //    },
        //    beforeSuggest: function (k) {
        //        var isNew = true;
        //        if (_suggestJobPos != null) {
        //            $.each(_suggestJobPos, function () {
        //                console.log(this);
        //            });
        //        }

        //        if (isNew) {
        //            s.activeOrgPos().JobPositionId(0);
        //            console.log('mới');
        //        } else {
        //            console.log('cũ');
        //        }
        //    },
        //    selectCallback: function (data) {
        //        _suggestJobPos = data;
        //        if (data != null) {
        //            if (s.activeOrgPos().Id() > 0 && s.activePosId() != data.Id) {
        //                $(s.employees()).each(function () {
        //                    if (this.JobPositionId() == s.activePosId()) {
        //                        this.JobPositionId(data.Id);
        //                        this.ObjJobPosition(new Job(data));
        //                    }
        //                });
        //            }
        //            s.activeOrgPos().JobPosition(new Job(data));
        //            s.activeOrgPos().JobPositionId(data.Id); 
        //        }
        //    }
        //});
        $('#select_job_position').unbind().select2({
            placeholder: "Chọn vị trí công tác"
        }).change(function () {
            var v = $('#select_job_position').val(); 
            if (app.hasValue(v)) {
                v = parseInt(v);
                var data;
                $(josPositions).each(function() {
                    if (this.Id == v) {
                        data = this;
                        if (s.activeOrgPos().Id() > 0 && s.activePosId() != v) {
                            $(s.employees()).each(function () {
                                if (this.JobPositionId() == s.activePosId()) {
                                    this.JobPositionId(v);
                                    this.ObjJobPosition(new Job(data));
                                }
                            });
                        }
                        s.activeOrgPos().JobPosition(new Job(data));
                        s.activeOrgPos().JobPositionId(data.Id);
                    }
                }); 
            }
            //s.activeEmployee().EmployeeId($('#select_emp_option').val());
        });
        $('#select_emp_option').unbind().select2({
            dropdownCssClass: "bigdrop",
            ajax: {
                url: DOMAIN_API + "/employee/suggestionsForWeb",
                dataType: 'json',
                quietMillis: 250,
                data: function (term, page) {
                    return {
                        keyword: term,
                        trangThaiCongViecStr: '0,1,4',
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
                        _employeeData = result;
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
            placeholder: "Chọn nhân sự"
        }).change(function (v) {
            s.activeEmployee().EmployeeId($('#select_emp_option').val());
        });

        $('#select_job_option').unbind().select2({
            placeholder: "Chọn công việc"
        }).change(function (v) {
            var jIds = v.val;
            if (app.hasValue(jIds)) {
                s.activeOrgPos().JobPosition().listJobs.removeAll();
                for (var i = 0; i < jIds.length; i++) {
                    $(lstCongViec).each(function () {
                        if (this.Id == parseInt(jIds[i])) {
                            s.activeOrgPos().JobPosition().listJobs.push(this);
                        }
                    });
                }
                s.activeOrgPos().JobPosition().Jobs(jIds.join(','));
            }
        });


        $('#select_emp_pos').unbind().change(function () {
            s.activeEmployee().JobPositionId($(this).val());
        });
         
    };

    s.init();
};

function initOrganizationForm(callback) {
    var pvm = new PositionViewModel();

    var f = '#OrganizationForm', send = false;

    uf = $(f).unbind().ultraForm({
        uiType: 1,
        action: '/general/OrganizationEdit',
        actionType: 'ajax',
        props: [
            {
                name: 'Id',
                type: 'hidden'
            },
            {
                name: 'Code',
                type: 'text'
            },
            {
                name: 'Name',
                type: 'text',
                required: {
                    message: 'Vui lòng nhập tên tổ chức'
                }
            },
            {
                name: 'OrgLevelId',
                type: 'select2',
                option: {}
            },
            {
                name: 'ParentId',
                type: 'compoTree',
                option: {
                    url: DOMAIN_API + '/general/Organizationlist',
                    placeHolder: 'Chọn trực thuộc',
                    valueType: 1,
                    params: {
                        unlimited: true
                    },
                    item: {
                        value: 'Id',
                        text: 'Name',
                        parent: 'ParentId'
                    }
                }
            },  
            {
                name: 'DirectManager',
                type: 'select2',
                option: {}
            }     
        ],
        autoSubmit: false,
        validCallback: function (data, btn) {
            pvm.isSubmitForm(true);
            if (!pvm.isErrorIndirect() && !pvm.isErrorPackage()) {
                data = app.formDataToJson(data);

                data.packages = [];
                if (pvm.packages().length > 0) {
                    $.each(pvm.packages(), function () {
                        var p = ko.toJS(this);
                        p.__ko_mapping__ = null;
                        p.__proto__ = null;
                        data.packages.push(p);
                    });
                }

                data.positions = [];
                if (pvm.positions().length > 0) {
                    $.each(pvm.positions(),
                        function () {
                            var p = ko.toJS(this);
                            p.__ko_mapping__ = null;
                            p.__proto__ = null;
                            p.titles = null;
                            data.positions.push(p);
                        });
                }
                data.employees = [];
                if (pvm.employees().length > 0) {
                    $.each(pvm.employees(),
                        function () {
                            var p = ko.toJS(this);
                            p.__ko_mapping__ = null;
                            p.__proto__ = null;
                            data.employees.push(p);
                        });
                }
                data.IndirectManagers = '';
                if (pvm.indirects().length > 0) {
                    var arr = [];
                    $.each(pvm.indirects(),
                        function () {
                            arr.push(this.id());
                        });
                    data.IndirectManagers = ';' + arr.join(';') + ';';
                }

                data.send = send;


                btn.button('loading');
                app.postData('/general/OrganizationEdit', data, function (result) {
                    btn.button('reset');
                    if (result.Success) {
                        app.notify('success', 'Lưu thành công');
                        $('#OrgEditModal').modal('hide');
                        if (callback != null) {
                            callback(result.Data);
                        }
                    } else {
                        app.notify('warning', result.Message);
                    }
                });

            } else {
                app.notify('warning', 'Thông tin đơn vị chưa đầy đủ');
            }
        },
        invalidCallback: function (btn, callback) {
            $('#org_edit_tabs li:eq(0) a').tab('show');
        },
        beforSubmit: function (form) {

        },
        afterSubmit: function (form) {
            table.hideModal();
            table.loadData();
        }
    });
     
    $('#btn_save_and_send').unbind().click(function () {
        send = true;
        uf.submit($(this));
    });

    ko.applyBindings(pvm, $('#apply_element')[0]);

    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
}