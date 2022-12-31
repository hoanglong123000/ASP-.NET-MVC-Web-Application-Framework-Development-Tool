

var principles = [
    { id: 1, name: 'Trung bình' },
    { id: 2, name: 'Cộng dồn' }
];

var tounchTr = null;
var kpiUploader;

(function ($) {
    $.fn.kpiRender = function (options) {
        var pl = this;
        var sel = this.selector;
        var set = $.extend({
            type: null,
            allocationEmpty: null,
            objectEmpty: null,
            detailEmpty: null,
            topHeight: null,
            dataProving: null,
            trongSoTheoNam: null,
            head: null,
            rows: [],
            cols: null,
            initTable: null
        }, options);
        pl.set = set;

        if (set.mode > 0) {
            if (model.ModifyStatus == null) {
                model.ModifyStatus = 0;
            }
        }

        var table = '.render_table';
        var atl = table + ' .area-tl';
        var atr = table + ' .area-tr';
        var abl = table + ' .area-bl';
        var abr = table + ' .area-br';
        var rb = table + ' .resize-bar';
        var vm;
        var wl = 0;

        var KpiObject = function (obj) {
            var s = this;
            if (obj != null) {
                s.Id = ko.observable(obj.Id);
                s.Year = ko.observable(obj.Year);
                s.OrganizationId = ko.observable(obj.OrganizationId);
                s.OwnerId = ko.observable(obj.OwnerId);
                s.NguoiDuyet1 = ko.observable(obj.NguoiDuyet1);
                s.NguoiDuyet2 = ko.observable(obj.NguoiDuyet2);
                s.NgayThanhLap = ko.observable(app.formatDate(obj.NgayThanhLap));
            } else {
                s.Id = ko.observable(0);
                s.Year = ko.observable(0);
                s.OrganizationId = ko.observable(0);
                s.OwnerId = ko.observable('');
                s.NguoiDuyet1 = ko.observable('');
                s.NguoiDuyet2 = ko.observable(null);
                s.NgayThanhLap = ko.observable('');
            }

            s.real = ko.computed(function () {

            });
        }

        var Appraiser = function (obj, index) {
            var s = this;
            s.index = ko.observable(index);
            s.guid = ko.observable(app.newGuid(10));
            s.organizationName = ko.observable('');
            s.ownerName = ko.observable('');
            if (obj != null) {
                s.Id = ko.observable(obj.Id);
                s.KpiCompanyDetailId = ko.observable(obj.KpiCompanyDetailId);
                s.OrganizationId = ko.observable(obj.OrganizationId);
                s.OwnerId = ko.observable(obj.OwnerId);
                if (obj.ObjOrganization != null) {
                    s.organizationName(obj.ObjOrganization.Name);
                }
                if (obj.ObjOwner != null) {
                    s.ownerName(obj.ObjOwner.FullName);
                }

            } else {
                s.Id = ko.observable(0);
                s.KpiCompanyDetailId = ko.observable(null);
                s.OrganizationId = ko.observable(null);
            }

            s.isDelete = ko.observable(false);
        };

        var KpiDetail = function (obj, index) {
            var s = this;
            s.loaded = false;
            s.guid = ko.observable(app.newGuid(10));
            s.childs = ko.observableArray([]);
            s.formulaId = ko.observable(0);
            s.fDesc = ko.observable('');
            s.formula = ko.observable('');
            s.CongThucDoHtml = ko.observable('');
            s.Nam_KeHoachStr = ko.observable('');
            s.appraiserText = ko.observable('');
            s.allocationText = ko.observable('');

            s.Quy1_KeHoach_XStr = ko.observable('');
            s.Quy2_KeHoach_XStr = ko.observable('');
            s.Quy3_KeHoach_XStr = ko.observable('');
            s.Quy4_KeHoach_XStr = ko.observable('');
            s.Quy1_KeHoach_X = ko.observable('');
            s.Quy2_KeHoach_X = ko.observable('');
            s.Quy3_KeHoach_X = ko.observable('');
            s.Quy4_KeHoach_X = ko.observable('');
            s.Quy1_ThucHienStr = ko.observable('');
            s.Quy2_ThucHienStr = ko.observable('');
            s.Quy3_ThucHienStr = ko.observable('');
            s.Quy4_ThucHienStr = ko.observable('');

            s.quy = ko.computed(function () {
                return model.Status >= 15 ? 4 : model.Status >= 11 ? 3 : model.Status >= 7 ? 2 : model.Status >= 3 ? 1 : 0;
            });

            s.updateStr = function () {
                var v1 = CheckKeHoachX(s.PhuongPhapDo(), s.Quy1_KeHoach_X());
                var v2 = CheckKeHoachX(s.PhuongPhapDo(), s.Quy2_KeHoach_X());
                var v3 = CheckKeHoachX(s.PhuongPhapDo(), s.Quy3_KeHoach_X());
                var v4 = CheckKeHoachX(s.PhuongPhapDo(), s.Quy4_KeHoach_X());

                var v5 = CheckKeHoachX(s.PhuongPhapDo(), s.Quy1_ThucHien());
                var v6 = CheckKeHoachX(s.PhuongPhapDo(), s.Quy2_ThucHien());
                var v7 = CheckKeHoachX(s.PhuongPhapDo(), s.Quy3_ThucHien());
                var v8 = CheckKeHoachX(s.PhuongPhapDo(), s.Quy4_ThucHien());

                var vn = CheckKeHoachX(s.PhuongPhapDo(), s.Nam_KeHoach());

                if (s.Quy1_KeHoach_X() != v1) {
                    s.Quy1_KeHoach_X(v1);
                }
                if (s.Quy2_KeHoach_X() != v2) {
                    s.Quy2_KeHoach_X(v2);
                }
                if (s.Quy3_KeHoach_X() != v3) {
                    s.Quy3_KeHoach_X(v3);
                }
                if (s.Quy4_KeHoach_X() != v4) {
                    s.Quy4_KeHoach_X(v4);
                }
                if (s.Quy1_ThucHien() != v5) {
                    s.Quy1_ThucHien(v5);
                }
                if (s.Quy2_ThucHien() != v6) {
                    s.Quy2_ThucHien(v6);
                }
                if (s.Quy3_ThucHien() != v7) {
                    s.Quy3_ThucHien(v7);
                }
                if (s.Quy4_ThucHien() != v8) {
                    s.Quy4_ThucHien(v8);
                }

                if (s.PhuongPhapDo() != 5) {
                    s.Quy1_KeHoach_XStr(v1 != '' ? app.formatPrice(v1) : '');
                    s.Quy2_KeHoach_XStr(v2 != '' ? app.formatPrice(v2) : '');
                    s.Quy3_KeHoach_XStr(v3 != '' ? app.formatPrice(v3) : '');
                    s.Quy4_KeHoach_XStr(v4 != '' ? app.formatPrice(v4) : '');

                    s.Quy1_ThucHienStr(v5 != '' ? app.formatPrice(v5) : '');
                    s.Quy2_ThucHienStr(v6 != '' ? app.formatPrice(v6) : '');
                    s.Quy3_ThucHienStr(v7 != '' ? app.formatPrice(v7) : '');
                    s.Quy4_ThucHienStr(v8 != '' ? app.formatPrice(v8) : '');

                    s.Nam_KeHoachStr(vn != '' ? app.formatPrice(vn) : '');
                } else {
                    s.Quy1_KeHoach_XStr(v1);
                    s.Quy2_KeHoach_XStr(v2);
                    s.Quy3_KeHoach_XStr(v3);
                    s.Quy4_KeHoach_XStr(v4);

                    s.Quy1_ThucHienStr(v5);
                    s.Quy2_ThucHienStr(v6);
                    s.Quy3_ThucHienStr(v7);
                    s.Quy4_ThucHienStr(v8);

                    s.Nam_KeHoachStr(vn);
                }
                s.X(vn);
            }

            if (obj != null) {
                if (obj.ParentId == null && obj.ObjNhomMucTieu != null) {
                    obj.STT = obj.ObjNhomMucTieu.Name;
                }
                s = $.extend(s, ko.mapping.fromJS(obj));

                s.allocationText(obj.AllocationText);

                s.Appraisers = ko.observableArray([]);
                if (obj.Appraisers != null && obj.Appraisers.length > 0) {
                    $(obj.Appraisers).each(function () {
                        s.Appraisers.push(new Appraiser(this, s.Appraisers().length + 1));
                    });
                }

                s.updateStr();
                var ct = s.CongThucDo();
                if (ct != null && ct.indexOf('<br') >= 0) {
                    ct = app.replaceBrToNewLine(ct);
                }
                s.CongThucDoHtml(ct);

            } else {
                s = $.extend(s, ko.mapping.fromJS(set.detailEmpty));
                s.STT(index);
                s.Allocations = ko.observableArray([]);
                s.Appraisers = ko.observableArray([]);
            }
            s.isValidAppraiser = function () {
                var fl = true;
                $(s.Appraisers()).each(function () {
                    if (!app.hasValue(this.OwnerId())) {
                        fl = false;
                        return false;
                    }
                });
                if (!fl) {
                    app.notify('warning', 'Thông tin trưởng đơn vị chưa đầy đủ');
                }
                return fl;
            };

            s.PhuongPhapDo.subscribe(function () {
                s.calcQuy1();
                s.calcQuy2();
                s.calcQuy3();
                s.calcQuy4();
            });


            if (s.PhuongPhapDo() <= 5) {
                s.formulaId(s.PhuongPhapDo());
            } else {
                if (s.PhuongPhapDo() <= 9) {
                    s.formulaId(6);
                } else {
                    s.formulaId(10);
                }
            }
            s.tenNguyenTacTinh = ko.observable('');
            s.NguyenTacTinh.subscribe(function () {
                $(principles).each(function () {
                    if (this.id == s.NguyenTacTinh()) {
                        s.tenNguyenTacTinh(this.name);
                    }
                });
            });

            $(principles).each(function () {
                if (this.id == s.NguyenTacTinh()) {
                    s.tenNguyenTacTinh(this.name);
                }
            });
            s.expanded = ko.observable(true);

            s.errorQuy1_KehoachX = ko.observable(false);
            s.errorQuy2_KehoachX = ko.observable(false);
            s.errorQuy3_KehoachX = ko.observable(false);
            s.errorQuy4_KehoachX = ko.observable(false);

            s.errorQuy1_ThucHien = ko.observable(false);
            s.errorQuy2_ThucHien = ko.observable(false);
            s.errorQuy3_ThucHien = ko.observable(false);
            s.errorQuy4_ThucHien = ko.observable(false);

            s.Quy1_ThucHien.subscribe(function () {
                s.updateStr();
                s.calcQuy1();
            });
            s.Quy2_ThucHien.subscribe(function () {
                s.updateStr();
                s.calcQuy2();
            });
            s.Quy3_ThucHien.subscribe(function () {
                s.updateStr();
                s.calcQuy3();
            });
            s.Quy4_ThucHien.subscribe(function () {
                s.updateStr();
                s.calcQuy4();
            });
            s.Nam_KeHoach.subscribe(function () {
                s.updateStr();
            });
            s.Quy1_KeHoach_X.subscribe(function () {
                s.updateStr();
            });
            s.Quy2_KeHoach_X.subscribe(function () {
                s.updateStr();
            });
            s.Quy3_KeHoach_X.subscribe(function () {
                s.updateStr();
            });
            s.Quy4_KeHoach_X.subscribe(function () {
                s.updateStr();
            });

            s.Nam_TyLeHTSoHienTai.subscribe(function () {
                var v1 = s.Nam_TyLeHTSoHienTai();
                var v2 = CheckTyLe(s.Nam_TyLeHTSoHienTai());
                if (v1 != v2) {
                    s.Nam_TyLeHTSoHienTai(v2);
                }
            });

            s.Nam_TrongSo.subscribe(function () {
                if (s.Nam_TrongSo() == '0%') {
                    s.Quy1_TrongSo('0%');
                    s.Quy2_TrongSo('0%');
                    s.Quy3_TrongSo('0%');
                    s.Quy4_TrongSo('0%');

                    if (s.ParentId() == null) {
                        $(s.childs()).each(function () {
                            this.Nam_TrongSo('0%');
                        });
                    }
                }
            });
            s.Quy1_TrongSo.subscribe(function () {
                if (s.ParentId() != null) {
                    if (s.Quy1_TrongSo() == '0%') {
                        s.Quy1_KetQua('Không đăng ký');
                    } else {
                        s.Quy1_KetQua('');
                    }
                } else {
                    if (s.Quy1_TrongSo() == '0%') {
                        $(s.childs()).each(function () {
                            this.Quy1_TrongSo('0%');
                        });
                    }
                }
            });
            s.Quy2_TrongSo.subscribe(function () {
                if (s.ParentId() != null) {
                    if (s.Quy2_TrongSo() == '0%') {
                        s.Quy2_KetQua('Không đăng ký');
                    } else {
                        s.Quy2_KetQua('');
                    }
                } else {
                    if (s.Quy2_TrongSo() == '0%') {
                        $(s.childs()).each(function () {
                            this.Quy2_TrongSo('0%');
                        });
                    }
                }
            });
            s.Quy3_TrongSo.subscribe(function () {
                if (s.ParentId() != null) {
                    if (s.Quy3_TrongSo() == '0%') {
                        s.Quy3_KetQua('Không đăng ký');
                    } else {
                        s.Quy3_KetQua('');
                    }
                } else {
                    if (s.Quy3_TrongSo() == '0%') {
                        $(s.childs()).each(function () {
                            this.Quy3_TrongSo('0%');
                        });
                    }

                }
            });
            s.Quy4_TrongSo.subscribe(function () {
                if (s.ParentId() != null) {
                    if (s.Quy4_TrongSo() == '0%') {
                        s.Quy4_KetQua('Không đăng ký');
                    } else {
                        s.Quy4_KetQua('');
                    }
                } else {
                    if (s.Quy4_TrongSo() == '0%') {
                        $(s.childs()).each(function () {
                            this.Quy4_TrongSo('0%');
                        });
                    }
                }
            });
            s.real = ko.computed(function () {
                s.Nam_TrongSo(CheckTyLe(s.Nam_TrongSo()));
                s.Quy1_TrongSo(CheckTyLe(s.Quy1_TrongSo()));
                s.Quy2_TrongSo(CheckTyLe(s.Quy2_TrongSo()));
                s.Quy3_TrongSo(CheckTyLe(s.Quy3_TrongSo()));
                s.Quy4_TrongSo(CheckTyLe(s.Quy4_TrongSo()));


                var ts;
                if (set.trongSoTheoNam) {
                    ts = s.Nam_TrongSo();
                    if (ts == '0%') {
                        s.errorQuy1_KehoachX(false);
                        s.errorQuy2_KehoachX(false);
                        s.errorQuy3_KehoachX(false);
                        s.errorQuy4_KehoachX(false);

                        s.Quy1_TyLeHoanThanh('0%');
                        s.Quy1_TyLeTrongSo('0%');
                        s.Quy1_KetQua('Không đăng ký');

                        s.Quy2_TyLeHoanThanh('0%');
                        s.Quy2_TyLeTrongSo('0%');
                        s.Quy2_KetQua('Không đăng ký');

                        s.Quy3_TyLeHoanThanh('0%');
                        s.Quy3_TyLeTrongSo('0%');
                        s.Quy3_KetQua('Không đăng ký');

                        s.Quy4_TyLeHoanThanh('0%');
                        s.Quy4_TyLeTrongSo('0%');
                        s.Quy4_KetQua('Không đăng ký');

                    } else {
                        s.errorQuy1_KehoachX(!app.hasValue(s.Quy1_KeHoach_X()));
                        s.errorQuy2_KehoachX(!app.hasValue(s.Quy2_KeHoach_X()));
                        s.errorQuy3_KehoachX(!app.hasValue(s.Quy3_KeHoach_X()));
                        s.errorQuy4_KehoachX(!app.hasValue(s.Quy4_KeHoach_X()));

                        if (model.Status > 3) {
                            if (s.quy() == 1 && app.hasValue(s.Quy1_KeHoach_X())) {
                                s.errorQuy1_ThucHien(!app.hasValue(s.Quy1_ThucHien()));
                            }
                            if (s.quy() == 2 && app.hasValue(s.Quy2_KeHoach_X())) {
                                s.errorQuy2_ThucHien(!app.hasValue(s.Quy2_ThucHien()));
                            }
                            if (s.quy() == 3 && app.hasValue(s.Quy3_KeHoach_X())) {
                                s.errorQuy3_ThucHien(!app.hasValue(s.Quy3_ThucHien()));
                            }
                            if (s.quy() == 4 && app.hasValue(s.Quy4_KeHoach_X())) {
                                s.errorQuy4_ThucHien(!app.hasValue(s.Quy4_ThucHien()));
                            }
                        }

                    }
                } else {
                    if (s.Quy1_TrongSo() == '0%') {
                        s.errorQuy1_KehoachX(false);
                        s.Quy1_TyLeHoanThanh('0%');
                        s.Quy1_TyLeTrongSo('0%');
                        s.Quy1_KetQua('Không đăng ký');

                    } else {
                        s.errorQuy1_KehoachX(!app.hasValue(s.Quy1_KeHoach_X()));

                        if (model.Status > 3) {
                            if (s.quy() == 1 && app.hasValue(s.Quy1_KeHoach_X())) {
                                s.errorQuy1_ThucHien(!app.hasValue(s.Quy1_ThucHien()));
                            }
                        }
                    }

                    if (s.Quy2_TrongSo() == '0%') {
                        s.Quy2_TyLeHoanThanh('0%');
                        s.Quy2_TyLeTrongSo('0%');
                        s.Quy2_KetQua('Không đăng ký');
                        s.errorQuy2_KehoachX(false);
                    } else {
                        s.errorQuy2_KehoachX(!app.hasValue(s.Quy2_KeHoach_X()));
                        if (model.Status > 3) {
                            if (s.quy() == 2 && app.hasValue(s.Quy2_KeHoach_X())) {
                                s.errorQuy2_ThucHien(!app.hasValue(s.Quy2_ThucHien()));
                            }
                        }
                    }

                    if (s.Quy3_TrongSo() == '0%') {
                        s.Quy3_TyLeHoanThanh('0%');
                        s.Quy3_TyLeTrongSo('0%');
                        s.Quy3_KetQua('Không đăng ký');
                        s.errorQuy3_KehoachX(false);
                    } else {
                        s.errorQuy3_KehoachX(!app.hasValue(s.Quy3_KeHoach_X()));
                        if (model.Status > 3) {
                            if (s.quy() == 3 && app.hasValue(s.Quy3_KeHoach_X())) {
                                s.errorQuy3_ThucHien(!app.hasValue(s.Quy3_ThucHien()));
                            }
                        } 
                    }

                    if (s.Quy4_TrongSo() == '0%') {
                        s.Quy4_TyLeHoanThanh('0%');
                        s.Quy4_TyLeTrongSo('0%');
                        s.Quy4_KetQua('Không đăng ký');
                        s.errorQuy4_KehoachX(false);
                    } else {
                        s.errorQuy4_KehoachX(!app.hasValue(s.Quy4_KeHoach_X()));
                        if (model.Status > 3) {
                            if (s.quy() == 4 && app.hasValue(s.Quy4_KeHoach_X())) {
                                s.errorQuy4_ThucHien(!app.hasValue(s.Quy4_ThucHien()));
                            }
                        }
                    }
                }


                if (s.ParentId() > 0 && model.Status >= 3) {
                    var thn = 0;
                    if (s.Nam_TrongSo().replace('%', '') == '0') {
                        s.Nam_TyLeHoanThanh('0%');
                        s.Nam_TyLeTrongSo('0%');
                        s.Nam_ThucHien('');
                        s.Nam_KetQua('Không đăng ký');
                    } else {

                        var kqn = tinhTyLeHoanThanhNam(ko.toJS(s), s.quy());
                        var tlStr = kqn.toFixed(2) + '%';
                        s.Nam_TyLeHoanThanh(tlStr);
                        var tlts = tinhTyLeTrongSo(s.Nam_TrongSo(), tlStr);
                        s.Nam_TyLeTrongSo(tlts);

                        var kqht = tinhTyLeNamSoHienTai(ko.toJS(s), s.quy());
                        s.Nam_TyLeHTSoHienTai(kqht.toFixed(2) + '%');

                        s.Nam_KetQua(tlts);

                        if (s.PhuongPhapDo() == 5) {
                            if (app.hasValue(s.Quy4_ThucHien())) {
                                thn = s.Quy4_ThucHien();
                            } else if (app.hasValue(s.Quy3_ThucHien())) {
                                thn = s.Quy3_ThucHien();
                            } else if (app.hasValue(s.Quy2_ThucHien())) {
                                thn = s.Quy2_ThucHien();
                            } else if (app.hasValue(s.Quy1_ThucHien())) {
                                thn = s.Quy1_ThucHien();
                            }
                            s.Nam_ThucHien(thn);
                        } else {
                            var v;
                            if (app.hasValue(s.Quy4_ThucHien())) {
                                v = s.Quy4_ThucHien();
                                if ($.isNumeric(v) && v.indexOf('.') != v.length - 1) {
                                    thn += parseFloat(v);
                                }
                            }
                            if (app.hasValue(s.Quy3_ThucHien())) {
                                v = s.Quy3_ThucHien();
                                if ($.isNumeric(v) && v.indexOf('.') != v.length - 1) {
                                    thn += parseFloat(v);
                                }
                            }
                            if (app.hasValue(s.Quy2_ThucHien())) {
                                v = s.Quy2_ThucHien();
                                if ($.isNumeric(v) && v.indexOf('.') != v.length - 1) {
                                    thn += parseFloat(v);
                                }
                            }
                            if (app.hasValue(s.Quy1_ThucHien())) {
                                v = s.Quy1_ThucHien();
                                if ($.isNumeric(v) && v.indexOf('.') != v.length - 1) {
                                    thn += parseFloat(v);
                                }
                            }
                            s.Nam_ThucHien(Round(parseFloat(thn)));
                        }
                    }
                }
                var arr = [];

                $(s.Appraisers()).each(function () {
                    if (!this.isDelete()) {
                        if (arr.length < 3) {
                            arr.push(this.organizationName());
                        }
                    }
                });
                s.appraiserText(arr.join(', '));

                //arr = [];
                //$(s.Allocations()).each(function () {
                //    if (!this.isDelete()) {
                //        if (arr.length < 3) {
                //            arr.push(this.fullName());
                //        } else {
                //            return false;
                //        }
                //    }
                //});
                //s.allocationText(arr.join(', ') + '...');
            });

            s.calcQuy1 = function () {
                var ts = set.trongSoTheoNam ? s.Nam_TrongSo() : s.Quy1_TrongSo();
                if (ts == '0%') {
                    s.Quy1_TyLeHoanThanh('0%');
                    s.Quy1_TyLeTrongSo('0%');
                    s.Quy1_KetQua('Không đăng ký');
                } else if (ts != '0%') {
                    if (app.hasValue(s.Quy1_KeHoach_X())) {
                        var tlht = tinhTyLeHoanThanh(s.PhuongPhapDo(), s.Quy1_KeHoach_X(), s.Quy1_KeHoach_Y(), s.Quy1_ThucHien());
                        s.Quy1_TyLeHoanThanh(tlht);
                        var tlts = tinhTyLeTrongSo(ts, tlht);
                        s.Quy1_TyLeTrongSo(tlts);
                        if (parseInt(tlht.replace("%", "")) < 100) {
                            s.Quy1_KetQua('Không đạt');
                        }
                        else if (tlht.replace('%', '') == "") {
                            s.Quy1_KetQua('');
                        } else {
                            s.Quy1_KetQua('Đạt');
                        }
                    } else {
                        //   
                        s.Quy1_KetQua('');
                    }
                }
            }

            s.calcQuy2 = function () {
                if (s.Quy2_TrongSo() == '0%') {
                    s.Quy2_TyLeHoanThanh('0%');
                    s.Quy2_TyLeTrongSo('0%');
                    s.Quy2_KetQua('Không đăng ký');
                } else if (s.Quy2_TrongSo() != '0%') {
                    var tlht = tinhTyLeHoanThanh(s.PhuongPhapDo(),
                        s.Quy2_KeHoach_X(),
                        s.Quy2_KeHoach_Y(),
                        s.Quy2_ThucHien());
                    s.Quy2_TyLeHoanThanh(tlht);
                    var tlts = tinhTyLeTrongSo(s.Quy2_TrongSo(), tlht);
                    s.Quy2_TyLeTrongSo(tlts);
                    if (parseInt(tlht.replace("%", "")) < 100) {
                        s.Quy2_KetQua('Không đạt');
                    }
                    else if (tlht.replace('%', '') == "") {
                        s.Quy2_KetQua('');
                    } else {
                        s.Quy2_KetQua('Đạt');
                    }
                } else {
                    s.Quy2_KetQua('');
                }
            }

            s.calcQuy3 = function () {
                //var tlht = tinhTyLeHoanThanh(s.PhuongPhapDo(), s.Quy3_KeHoach_X(), s.Quy3_KeHoach_Y(), s.Quy3_ThucHien());
                //var tlts = tinhTyLeTrongSo(s.Quy3_TrongSo(), tlht);
                //s.Quy3_TyLeHoanThanh(tlht);
                //s.Quy3_TyLeTrongSo(tlts);

                if (s.Quy3_TrongSo() == '0%') {
                    s.Quy3_TyLeHoanThanh('0%');
                    s.Quy3_TyLeTrongSo('0%');
                    s.Quy3_KetQua('Không đăng ký');
                } else if (s.Quy3_TrongSo() != '0%') {
                    //debugger; 

                    if (app.hasValue(s.Quy3_KeHoach_X())) {
                        var tlht = tinhTyLeHoanThanh(s.PhuongPhapDo(),
                            s.Quy3_KeHoach_X(),
                            s.Quy3_KeHoach_Y(),
                            s.Quy3_ThucHien());
                        s.Quy3_TyLeHoanThanh(tlht);
                        var tlts = tinhTyLeTrongSo(s.Quy3_TrongSo(), tlht);
                        s.Quy3_TyLeTrongSo(tlts);
                        if (parseInt(tlht.replace("%", "")) < 100) {
                            s.Quy3_KetQua('Không đạt');
                        }
                        else if (tlht.replace('%', '') == "") {
                            s.Quy3_KetQua('');
                        } else {
                            s.Quy3_KetQua('Đạt');
                        }
                    } else {
                        s.Quy3_KetQua('');
                    }
                }
            };

            s.calcQuy4 = function () {
                if (s.Quy4_TrongSo() == '0%') {
                    s.Quy4_TyLeHoanThanh('0%');
                    s.Quy4_TyLeTrongSo('0%');
                    s.Quy4_KetQua('Không đăng ký');
                } else if (s.Quy4_TrongSo() != '0%') {
                    if (app.hasValue(s.Quy4_KeHoach_X())) {
                        var tlht = tinhTyLeHoanThanh(s.PhuongPhapDo(),
                            s.Quy4_KeHoach_X(),
                            s.Quy4_KeHoach_Y(),
                            s.Quy4_ThucHien());
                        s.Quy4_TyLeHoanThanh(tlht);
                        var tlts = tinhTyLeTrongSo(s.Quy4_TrongSo(), tlht);
                        s.Quy4_TyLeTrongSo(tlts);
                        if (parseInt(tlht.replace("%", "")) < 100) {
                            s.Quy4_KetQua('Không đạt');
                        }
                        else if (tlht.replace('%', '') == "") {
                            s.Quy4_KetQua('');
                        } else {
                            s.Quy4_KetQua('Đạt');
                        }
                    } else {
                        s.Quy4_KetQua('');
                    }
                }
            }

            s.loaded = true;

            s.isValidAppraiser = function () {
                var fl = true;
                $(s.Appraisers()).each(function () {
                    if (!app.hasValue(this.OwnerId())) {
                        fl = false;
                        return false;
                    }
                });
                if (!fl) {
                    app.notify('warning', 'Trưởng đơn vị không được trống. Vui lòng kiểm tra lại.');
                }
                return fl;
            };
            s.isDelete = ko.observable(false);
            setTimeout(function () {

                $('.file-attach').uniform({
                    fileButtonClass: 'action btn btn-default btn-xs text-slate',
                    fileButtonHtml: '<i class="icon-file-plus"></i>'
                });

                if (s.RowHeight() < 80 || s.RowHeight() == null) {
                    s.RowHeight(80);
                }
                $('.kd_' + s.guid() + ' td textarea').css('height', (s.RowHeight() - 1) + 'px');
                $('.kd_' + s.guid() + ' td .resize-height').css('height', (s.RowHeight() - 1) + 'px');
                $('.kd_' + s.guid() + ' > td').css('height', s.RowHeight() + 'px');

                $('#attach-dangKy-' + s.guid()).change(function () {
                    uploadDinhKem(this,
                        function (fs) {
                            if (fs.length > 0) {
                                s.DangKy_DinhKem(fs[0].path);
                            }
                        });
                });

                $('#attach-quy1-' + s.guid()).change(function () {
                    uploadDinhKem(this,
                        function (fs) {
                            if (fs.length > 0) {
                                s.Quy1_DinhKem(fs[0].path);
                            }
                        });
                });
                $('#attach-quy2-' + s.guid()).change(function () {
                    uploadDinhKem(this,
                        function (fs) {
                            if (fs.length > 0) {
                                s.Quy2_DinhKem(fs[0].path);
                            }
                        });
                });
                $('#attach-quy3-' + s.guid()).change(function () {
                    uploadDinhKem(this,
                        function (fs) {
                            if (fs.length > 0) {
                                s.Quy3_DinhKem(fs[0].path);
                            }
                        });
                });
                $('#attach-quy4-' + s.guid()).change(function () {
                    uploadDinhKem(this,
                        function (fs) {
                            if (fs.length > 0) {
                                s.Quy4_DinhKem(fs[0].path);
                            }
                        });
                });

                $('#switchery-' + s.guid()).change(function () {
                    s.AllowSync($(this).is(":checked"));
                });

            }, 500);

             
        };

        var KpiViewModel = function () {
            var s = this;
            // properties 
            s.details = ko.observableArray([]);
            s.modifies = ko.observableArray([]);
            console.log(model.ModifyStatus);
            s.trangThai = ko.observable(set.mode == 1 || set.mode == 2 ? model.ModifyStatus : model.Status);
            console.log(s.trangThai());
            s.perform = perform;
            s.tths1 = ko.observable(0);
            s.tths2 = ko.observable(0);
            s.tths3 = ko.observable(0);
            s.tths4 = ko.observable(0);
            s.activeObject = ko.observable(new KpiObject(set.objectEmpty));
            s.listDonViTinh = ko.observableArray(listDonViTinh);
            s.activeDetail = ko.observable(new KpiDetail(null));
            s.formulas = ko.observableArray([]);
            s.tongket = ko.observable(new KpiDetail(null));
            s.subFormulas = ko.observableArray([]);
            s.loaded = ko.observable(false);
            s.isAdmin = isAdmin;
            s.isBks = isBks;
            s.activeCell = ko.observable('');
            s.isSubmit = ko.observable(false);
            s.activeAllocateCell = ko.observable('');

            s.q1 = ko.observable(true);
            s.q2 = ko.observable(true);
            s.q3 = ko.observable(true);
            s.q4 = ko.observable(true);

            //Tính cho dòng tổng kết
            s.real = ko.computed(function () {
                var ttl1 = 0;
                var ttl2 = 0;
                var ttl3 = 0;
                var ttl4 = 0;
                var ttln = 0;
                $(s.details()).each(function () {
                    var kq1 = 0;
                    var kq2 = 0;
                    var kq3 = 0;
                    var kq4 = 0;
                    var kqnht = 0;
                    var kqn = 0;

                    $(this.childs()).each(function () {
                        kq1 += getGTPT(this.Quy1_TyLeTrongSo());
                        kq2 += getGTPT(this.Quy2_TyLeTrongSo());
                        kq3 += getGTPT(this.Quy3_TyLeTrongSo());
                        kq4 += getGTPT(this.Quy4_TyLeTrongSo());
                        kqn += getGTPT(this.Nam_TyLeTrongSo());

                    });
                    ttl1 += kq1 * getGTPT(this.Quy1_TrongSo()) / 100;
                    ttl2 += kq2 * getGTPT(this.Quy2_TrongSo()) / 100;
                    ttl3 += kq3 * getGTPT(this.Quy3_TrongSo()) / 100;
                    ttl4 += kq4 * getGTPT(this.Quy4_TrongSo()) / 100;
                    ttln += kqn * getGTPT(this.Nam_TrongSo()) / 100;
                    this.Quy1_TyLeHoanThanh(kq1.toFixed(2) + '%');
                    this.Quy2_TyLeHoanThanh(kq2.toFixed(2) + '%');
                    this.Quy3_TyLeHoanThanh(kq3.toFixed(2) + '%');
                    this.Quy4_TyLeHoanThanh(kq4.toFixed(2) + '%');

                    this.Nam_TyLeHoanThanh(kqn.toFixed(2) + '%');
                });

                s.tongket().Quy1_TyLeHoanThanh(ttl1.toFixed(2) + '%');

                s.tongket().Quy2_TyLeHoanThanh(ttl2.toFixed(2) + '%');
                s.tongket().Quy3_TyLeHoanThanh(ttl3.toFixed(2) + '%');
                s.tongket().Quy4_TyLeHoanThanh(ttl4.toFixed(2) + '%');
                s.tongket().Nam_TyLeHoanThanh(ttln.toFixed(2) + '%');
            });

            s.modifyDetail = function (obj, org) {
                var t = obj.Status();
                if (t != 2) {
                    t = 2;
                } else {
                    t = null;
                }
                console.log(t);
                obj.Status(t);
            };

            s.deleteDetail = function (obj, p) {
                if (set.mode == 1) {
                    var t = obj.Status();
                    if (t != 1) {
                        t = 1;
                    } else {
                        t = null;
                    }
                    obj.Status(t);
                } else {
                    if (obj.Id() > 0) {
                        obj.isDelete(true);
                    } else {
                        p.childs.remove(obj);
                    }
                    s.resetIndex(obj.Group());
                }
            };

            // nhân sự nhận mục tiêu

            s.showAllowcateModal = function (obj, e) {
                s.activeDetail(obj);
                if ($('#allocation_modal').length > 0) {
                    $('#allocation_modal').remove();
                }
                var btn = $(e.target);
                btn.button('loading');
                app.loadData(DOMAIN_API + '/kpi/Kpi' + set.type + 'AllocationView',
                    {
                        detailId: obj.Id(),
                        dataType: 'html',
                        mode: s.trangThai() != 0 && s.trangThai() != 2 ? 'view' : 'edit'
                    },
                    null,
                    function (html) {
                        btn.button('reset');
                        $('body').append(html);
                        $('#allocation_modal').modal('show');
                        setTimeout(function () {
                            initAllocationForm(ko.toJS(obj), s.trangThai(), function (nameStr) {
                                s.activeDetail().allocationText(nameStr);
                            });
                        }, 300);
                    });
            };

            s.getOrgs = function (e, callback) {
                var btn = $(e.target);
                var om = 'org_selector_modal';
                if ($('#' + om).length == 0) {
                    app.createEmptyModal({
                        id: om,
                        width: 800,
                        headerClass: 'p-15',
                        title: 'Chọn bộ phận'
                    });
                }
                btn.button('loading');
                app.loadData(DOMAIN_API + '/general/OrganizationTreeView',
                    {
                        dataType: 'html'
                    },
                    null,
                    function (html) {
                        btn.button('reset');
                        $('#' + om + ' .modal-body').html(html);
                        $('#' + om).modal('show');

                        initOrgTreeView(function (orgs) {
                            $('#' + om).modal('hide');
                            callback(orgs);

                        });
                    });
            };

            s.getEmps = function (e, callback) {
                var btn = $(e.target);
                var om = 'emp_selector_modal';
                if ($('#' + om).length == 0) {
                    app.createEmptyModal({
                        id: om,
                        width: 1200,
                        headerClass: 'p-15',
                        title: 'Chọn nhân sự nhận mục tiêu'
                    });
                }
                btn.button('loading');
                app.loadData(DOMAIN_API + '/employee/SuggestionView',
                    {
                        dataType: 'html'
                    },
                    null,
                    function (html) {
                        btn.button('reset');
                        $('#' + om + ' .modal-body').html(html);
                        $('#' + om).modal('show');

                        setTimeout(function () {
                            initEmployeeSuggestionView({
                                OrgIdOrHeadCount: s.activeObject().OrganizationId(),
                                TrangThaiCongViec: 1
                            }, function (emps) {
                                $('#' + om).modal('hide');
                                callback(emps);
                            });
                        }, 400);

                    });
            };

            // NGUỒN CHỨNG MINH

            s.showAppraiserModal = function (obj) {
                $('#nguon_chung_minh_modal').modal('show');
                s.activeDetail(obj);
            };

            s.selectOrgAppraisers = function (obj, e) {
                s.getOrgs(e,
                    function (orgs) {
                        $(orgs).each(function () {
                            var o = this;
                            var exist = false;
                            $(s.activeDetail().Appraisers()).each(function () {
                                if (this.OrganizationId() == o.id) {
                                    exist = true;
                                    return false;
                                }
                            });
                            if (!exist) {
                                s.activeDetail().Appraisers.push(new Appraiser({
                                    OrganizationId: o.id,
                                    ObjOrganization: {
                                        Name: o.name
                                    },
                                    OwnerId: o.owner != null ? o.owner.Id : null,
                                    ObjOwner: o.owner
                                }, s.activeDetail().Appraisers().length + 1));
                            }
                        });
                    });
            };

            s.removeAppraiser = function (obj) {
                if (obj.Id() > 0) {
                    obj.isDelete(true);
                } else {
                    s.activeDetail().Appraisers.remove(obj);
                }
            };
            s.hideAppraiserModal = function () {
                if (s.activeDetail().isValidAppraiser()) {
                    $('#nguon_chung_minh_modal').modal('hide');
                }
            };
            s.saveAppraiserModal = function (obj, e) {
                var btn = $(e.target);
                if (s.activeDetail().isValidAppraiser()) {

                    var model = [];
                    var als = ko.toJS(s.activeDetail().Appraisers());
                    $(als).each(function () {
                        this.childs = null;
                        this.fDesc = null;
                        this.__ko_mapping__ = null;
                        this.ObjOrganization = null;
                        this.ObjOwner = null;
                        this.CongThucDo = '';
                        model.push(this);
                    });
                    btn.button('loading');

                    app.postData(DOMAIN_API + '/kpi/Kpi' + set.type + 'AppraiserCommand',
                        {
                            model: model,
                            detailId: s.activeDetail().Id()
                        }, function () {
                            btn.button('reset');
                            $('#nguon_chung_minh_modal').modal('hide');
                        });
                }
            };

            s.showNguonChungMinhModal = function (obj) {
                $('#nguon_chung_minh_modal').modal('show');
                s.activeDetail(obj);
            };

            // NGUỒN CHỨNG MINH

            // functions
            s.expendGroup = function (obj) {
                var e = obj.expanded();
                obj.expanded(!e);
                $(obj.childs()).each(function () {
                    this.expanded(!e);
                });
            }

            s.renderSubmitData = function () {
                var data = {
                    Id: s.activeObject().Id(),
                    Year: $('.select-year').val(),
                    OrganizationId: s.activeObject().OrganizationId(),
                    NguoiDuyet1: s.activeObject().NguoiDuyet1(),
                    NguoiDuyet2: s.activeObject().NguoiDuyet2(),
                    OwnerId: model.OwnerId,
                    NgayThanhLap: app.convertVnToEnDate(s.activeObject().NgayThanhLap()),
                    details: []
                };
                var d = ko.toJS(s.details());

                $(d).each(function () {
                    $(this.childs).each(function () {
                        this.childs = null;
                        this.fDesc = null;
                        this.__ko_mapping__ = null;
                        this.CongThucDo = '';
                        this.Allocations = null;
                        //this.Appraisers = null;
                        data.details.push(this);
                    });
                    this.childs = null;
                    this.fDesc = null;
                    this.Appraisers = null;
                    this.CongThucDo = '';
                    this.__ko_mapping__ = null;
                    data.details.push(this);
                });
                var tk = ko.toJS(s.tongket());
                tk.MucTieu = 'TỔNG KẾT';
                tk.childs = null;
                tk.fDesc = null;
                tk.Summary = true;
                tk.__ko_mapping__ = null;
                data.details.push(tk);
                return data;
            };

            s.checkHSValid = function (data) {
                var valid = true;
                var q;
                var now = moment();
                if (typeof model.Quarters == 'undefined') {
                    model.Quarters = [1, 2, 3, 4];
                }
                $(data.details).each(function () {
                    var d = this;
                    if (!d.Summary && d.ParentId == null) {
                        for (var x = 0; x < model.Quarters.length; x++) {
                            var i = model.Quarters[x];
                            if (/^\d+(\.\d+)?%$/.test(d['Quy' + i + '_TrongSo']) == false && d['Quy' + i + '_TrongSo'] != '') {
                                valid = false;
                                app.notify('warning', 'Giá trị trọng số không hợp lệ');
                                return false;
                            }
                        }
                    }
                    if (!d.Summary && d.ParentId != null && !d.isDelete) {


                        if (d.MucTieu == null || d.MucTieu == '') {
                            app.notify('warning', 'Tên mục tiêu chưa đầy đủ');
                            valid = false;
                            return false;
                        }
                        if (d.CachTinh == null || d.CachTinh == '') {
                            app.notify('warning', 'Giá trị cách tính chưa đầy đủ');
                            valid = false;
                            return false;
                        }
                        if (d.PhuongPhapDo == null || d.PhuongPhapDo == '') {
                            app.notify('warning', 'Giá trị phương pháp đo chưa đầy đủ');
                            valid = false;
                            return false;
                        }
                        if (set.dataProving && (d.DuLieuChungMinh == null || d.DuLieuChungMinh == '')) {
                            app.notify('warning', 'Dữ liệu chứng minh chưa đầy đủ');
                            valid = false;
                            return false;
                        }
                        var tsn = d.Nam_TrongSo;
                        if (tsn == '') {
                            app.notify('warning', 'Trọng số năm chưa đầy đủ');
                            valid = false;
                            return false;
                        } else {
                            if (d.KpiCompanyAllocationId != null && tsn == '0%') {
                                app.notify('warning', 'Trọng số năm phải lớn hơn 0% khi được phân bổ từ cấp trên.');
                                valid = false;
                                return false;
                            }
                        }
                        for (var x = 0; x < model.Quarters.length; x++) {
                            var i = model.Quarters[x];
                            if (!set.trongSoTheoNam) {
                                if (/^\d+(\.\d+)?%$/.test(d['Quy' + i + '_TrongSo']) == false && d['Quy' + i + '_TrongSo'] != '') {
                                    valid = false;
                                    app.notify('warning', 'Giá trị trọng số không hợp lệ');
                                    return false;
                                }
                            }

                            if (d.errorQuy1_KehoachX) {
                                app.notify('warning', 'KPIs kế hoạch quý 1 chưa đầy đủ');
                                valid = false;
                                return false;
                            }

                            if (d.errorQuy2_KehoachX) {
                                app.notify('warning', 'KPIs kế hoạch quý 2 chưa đầy đủ');
                                valid = false;
                                return false;
                            }

                            if (d.errorQuy3_KehoachX) {
                                app.notify('warning', 'KPIs kế hoạch quý 3 chưa đầy đủ');
                                valid = false;
                                return false;
                            }

                            if (d.errorQuy4_KehoachX) {
                                app.notify('warning', 'KPIs kế hoạch quý 4 chưa đầy đủ');
                                valid = false;
                                return false;
                            }
                        }
                    }
                });
               
                if (valid) {
                    var tongTs = 0;
                    var tongTs1 = $.inArray(1, model.Quarters) >= 0 ? 0 : null;
                    var tongTs2 = $.inArray(2, model.Quarters) >= 0 ? 0 : null;
                    var tongTs3 = $.inArray(3, model.Quarters) >= 0 ? 0 : null;
                    var tongTs4 = $.inArray(4, model.Quarters) >= 0 ? 0 : null;

                    $(data.details).each(function () {
                        var d = this;
                        if (d.ParentId == null && !d.Summary) {
                            var tsn = d.Nam_TrongSo;

                            if ($.inArray(1, model.Quarters) >= 0) {
                                tongTs1 += getGTPT(d.Quy1_TrongSo);
                            }
                            if ($.inArray(2, model.Quarters) >= 0) {
                                tongTs2 += getGTPT(d.Quy2_TrongSo);
                            }
                            if ($.inArray(3, model.Quarters) >= 0) {
                                tongTs3 += getGTPT(d.Quy3_TrongSo);
                            }
                            if ($.inArray(4, model.Quarters) >= 0) {
                                tongTs4 += getGTPT(d.Quy4_TrongSo);
                            }

                            tongTs += parseInt(tsn.substr(0, tsn.length - 1));
                          
                            if (!set.trongSoTheoNam) {
                                var ts;
                                for (var x = 0; x < model.Quarters.length; x++) {
                                    var i = model.Quarters[x];
                                    ts = this['Quy' + i + '_TrongSo'];
                                    if (ts != '0%') {
                                        var percent = 0;
                                        $(data.details).each(function () {
                                            if (this.ParentId != null && this.Group == d.Group && d.isDelete == false) {
                                                ts = this['Quy' + i + '_TrongSo'];
                                                if (ts != '') {
                                                    percent += parseFloat(ts.substr(0, ts.length - 1));
                                                }
                                            }
                                        });
                                        if (percent != 100) {
                                            app.notify('warning',
                                                'Trọng số trong nhóm ' + d.MucTieu + ' quý ' + i + ' phải đủ 100%');
                                            valid = false;
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    });

                    if (set.type != 'Company' && !set.trongSoTheoNam) {

                        if (!valid)
                            return false;
                        if (tongTs1 != null && tongTs1 != 100) {
                            app.notify('warning', 'Tổng trọng số quý 1 của các nhóm phải đủ 100%');
                            valid = false;
                            return valid;
                        }
                        if (tongTs2 != null && tongTs2 != 100) {
                            app.notify('warning', 'Tổng trọng số quý 2 của các nhóm phải đủ 100%');
                            valid = false;
                            return valid;
                        }
                        if (tongTs3 != null && tongTs3 != 100) {
                            app.notify('warning', 'Tổng trọng số quý 3 của các nhóm phải đủ 100%');
                            valid = false;
                            return valid;
                        }
                        if (tongTs4 != null && tongTs4 != 100) {
                            app.notify('warning', 'Tổng trọng số quý 4 của các nhóm phải đủ 100%');
                            valid = false;
                            return valid;
                        }
                    }

                    if (tongTs != 100) {
                        app.notify('warning', 'Tổng trọng số năm của các nhóm phải đủ 100%');
                        valid = false;
                    }
                }
                return valid;
            };

            s.checkDCValid = function (data) {
                var valid = true;
                var q;
                var now = moment();
                if (typeof model.Quarters == 'undefined') {
                    model.Quarters = [1, 2, 3, 4];
                }
                $(data.details).each(function () {
                    var d = this;
                    if (!d.Summary && d.ParentId == null) {
                        for (var x = 0; x < model.Quarters.length; x++) {
                            var i = model.Quarters[x];
                            if (/^\d+(\.\d+)?%$/.test(d['Quy' + i + '_TrongSo']) == false && d['Quy' + i + '_TrongSo'] != '') {
                                valid = false;
                                app.notify('warning', 'Giá trị trọng số không hợp lệ');
                                return false;
                            }
                        }
                    }
                    if (!d.Summary && d.ParentId != null && d.Status != 1) {


                        if (d.MucTieu == null || d.MucTieu == '') {
                            app.notify('warning', 'Tên mục tiêu chưa đầy đủ');
                            valid = false;
                            return false;
                        }
                        if (d.CachTinh == null || d.CachTinh == '') {
                            app.notify('warning', 'Giá trị cách tính chưa đầy đủ');
                            valid = false;
                            return false;
                        }
                        if (d.PhuongPhapDo == null || d.PhuongPhapDo == '') {
                            app.notify('warning', 'Giá trị phương pháp đo chưa đầy đủ');
                            valid = false;
                            return false;
                        }
                        if (set.dataProving && (d.DuLieuChungMinh == null || d.DuLieuChungMinh == '')) {
                            app.notify('warning', 'Dữ liệu chứng minh chưa đầy đủ');
                            valid = false;
                            return false;
                        }
                        var tsn = d.Nam_TrongSo;
                        if (tsn == '') {
                            app.notify('warning', 'Trọng số năm chưa đầy đủ');
                            valid = false;
                            return false;
                        } else {
                            if (d.KpiCompanyAllocationId != null && tsn == '0%') {
                                app.notify('warning', 'Trọng số năm phải lớn hơn 0% khi được phân bổ từ cấp trên.');
                                valid = false;
                                return false;
                            }
                        }
                        for (var x = 0; x < model.Quarters.length; x++) {
                            var i = model.Quarters[x];
                            if (!set.trongSoTheoNam) {
                                if (/^\d+(\.\d+)?%$/.test(d['Quy' + i + '_TrongSo']) == false && d['Quy' + i + '_TrongSo'] != '') {
                                    valid = false;
                                    app.notify('warning', 'Giá trị trọng số không hợp lệ');
                                    return false;
                                }
                            }

                            if (d.errorQuy1_KehoachX) {
                                app.notify('warning', 'KPIs kế hoạch quý 1 chưa đầy đủ');
                                valid = false;
                                return false;
                            }

                            if (d.errorQuy2_KehoachX) {
                                app.notify('warning', 'KPIs kế hoạch quý 2 chưa đầy đủ');
                                valid = false;
                                return false;
                            }

                            if (d.errorQuy3_KehoachX) {
                                app.notify('warning', 'KPIs kế hoạch quý 3 chưa đầy đủ');
                                valid = false;
                                return false;
                            }

                            if (d.errorQuy4_KehoachX) {
                                app.notify('warning', 'KPIs kế hoạch quý 4 chưa đầy đủ');
                                valid = false;
                                return false;
                            }
                        }
                    }
                });
                if (valid) {
                    var tongTs = 0;
                    var tongTs1 = $.inArray(1, model.Quarters) >= 0 ? 0 : null;
                    var tongTs2 = $.inArray(2, model.Quarters) >= 0 ? 0 : null;
                    var tongTs3 = $.inArray(3, model.Quarters) >= 0 ? 0 : null;
                    var tongTs4 = $.inArray(4, model.Quarters) >= 0 ? 0 : null;
                    console.log(set.trongSoTheoNam);
                    $(data.details).each(function () {
                        var d = this;
                        if (d.ParentId == null && !d.Summary) {
                            var tsn = d.Nam_TrongSo;

                            if ($.inArray(1, model.Quarters) >= 0) {
                                tongTs1 += getGTPT(d.Quy1_TrongSo);
                            }
                            if ($.inArray(2, model.Quarters) >= 0) {
                                tongTs2 += getGTPT(d.Quy2_TrongSo);
                            }
                            if ($.inArray(3, model.Quarters) >= 0) {
                                tongTs3 += getGTPT(d.Quy3_TrongSo);
                            }
                            if ($.inArray(4, model.Quarters) >= 0) {
                                tongTs4 += getGTPT(d.Quy4_TrongSo);
                            }

                            tongTs += parseInt(tsn.substr(0, tsn.length - 1));

                            var ts;
                            var percent = 0;
                            $(data.details).each(function () {
                                if (this.ParentId != null && this.Group == d.Group && d.Status != 1) {
                                    ts = this.Nam_TrongSo;
                                    if (ts != '') {
                                        percent += parseFloat(ts.substr(0, ts.length - 1));
                                    }
                                }
                            }); 
                            if (percent != 100) {
                                app.notify('warning',
                                    'Tổng trọng số năm trong nhóm ' + d.MucTieu + 'phải đủ 100%');
                                valid = false;
                                return false;
                            }
                            // trong so nam
                            if (!set.trongSoTheoNam || set.trongSoTheoNam == null) {
                                for (var x = 0; x < model.Quarters.length; x++) {
                                    var i = model.Quarters[x];
                                    ts = this['Quy' + i + '_TrongSo'];
                                    if (ts != '0%') {
                                        percent = 0;
                                        $(data.details).each(function() {
                                            if (this.ParentId != null && this.Group == d.Group && d.Status != 1) {
                                                ts = this['Quy' + i + '_TrongSo'];
                                                if (ts != '') {
                                                    percent += parseFloat(ts.substr(0, ts.length - 1));
                                                }
                                            }
                                        });
                                        if (percent != 100) {
                                            app.notify('warning',
                                                'Trọng số trong nhóm ' + d.MucTieu + ' quý ' + i + ' phải đủ 100%');
                                            valid = false;
                                            return false;
                                        }
                                    }
                                }
                            } 
                        }
                    });

                    if (set.type != 'Company' && !set.trongSoTheoNam) {

                        if (!valid)
                            return false;

                        if (tongTs1 != null && tongTs1 != 100) {
                            app.notify('warning', 'Tổng trọng số quý 1 của các nhóm phải đủ 100%');
                            valid = false;
                            return valid;
                        }
                        if (tongTs2 != null && tongTs2 != 100) {
                            app.notify('warning', 'Tổng trọng số quý 2 của các nhóm phải đủ 100%');
                            valid = false;
                            return valid;
                        }
                        if (tongTs3 != null && tongTs3 != 100) {
                            app.notify('warning', 'Tổng trọng số quý 3 của các nhóm phải đủ 100%');
                            valid = false;
                            return valid;
                        }
                        if (tongTs4 != null && tongTs4 != 100) {
                            app.notify('warning', 'Tổng trọng số quý 4 của các nhóm phải đủ 100%');
                            valid = false;
                            return valid;
                        }
                    }
                    console.log(tongTs);
                    if (tongTs != 100) {
                        app.notify('warning', 'Tổng trọng số năm của các nhóm phải đủ 100%');
                        valid = false;
                    }
                }
                return valid;
            };


            s.checkKQValid = function (data) {
                var valid = true;
                var quy = data.quy;
                $(data.details).each(function () {
                    var d = this;
                    if (!d.Summary && d.ParentId != null) {
                        if (d['errorQuy' + quy + '_ThucHien']) {
                            valid = false;
                            app.notify('warning', 'KPIs thực hiện chưa đầy đủ');
                            return false;
                        }
                    }
                });
                return valid;
            };

            s.resetIndex = function (group) {
                $(s.details()).each(function () {
                    if (this.Group() == group) {
                        var stt = 0;
                        $(this.childs()).each(function (i, o) {
                            if (o.isDelete() == false) {
                                o.STT(stt + 1);
                                stt++;
                            }
                        });
                    }
                });
            }

            s.events = function () {
                toolEvents();
                console.log(s.isSubmit());
            };

            s.addDetail = function (obj, e) {
                var aStatus = [0, 3, 7, 11, 15];
                if (aStatus.indexOf(s.trangThai() >= 0)) {
                    var btn = $(e.target);
                    btn.button('loading');
                    app.postData(DOMAIN_API + '/kpi/CreateKpi' + set.type + 'Detail',
                        {
                            KpiId: model.Id,
                            STT: obj.childs().length + 1,
                            ParentId: obj.Id(),
                            Group: obj.Group()
                        },
                        function (result) {
                            btn.button('reset');
                            obj.childs.push(new KpiDetail(result.Data, obj.childs().length + 1));

                            var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
                            elems.forEach(function (html) {
                                new Switchery(html, { color: '#2196F3' });
                            });
                        });
                }
            };

            s.editPhuongPhapDo = function (obj) {
                s.activeDetail(obj);

                initPhuongPhapDoModal({
                    PhuongPhapDo: obj.PhuongPhapDo(),
                    X: obj.X(),
                    Y: obj.Y()
                }, function (result) {
                    s.activeDetail().PhuongPhapDo(result.phuongPhapDo);
                    s.activeDetail().CongThucDoHtml(result.forumla);
                    s.activeDetail().X(result.X);
                    s.activeDetail().Y(result.Y);
                    s.activeDetail().Nam_KeHoach(result.X);
                });
            };

            s.resize = function () {
                s.setTableHeight(0);
                var rsize = $(atr).width();
                var pl = (rsize / 2) - 130;
                $(atr + ' h3').css('padding-left', pl);

                var h = $(window).height();
                $('#allocation_modal .table-responsive').css('height', h - 240);

            };

            s.setTableHeight = function (ch) {
                var wh = $(window).height();

                var fh = set.mode == 2 ? 60 : 0;

                $(table).css('height', wh - topHeight - fh);

                $(abl).css('height', wh - (topHeight + fh + set.head.height));
                $(abl + ' > div').css('height', wh - (topHeight + fh + set.head.height));

                $(abr).css('height', wh - (topHeight + fh + set.head.height));
                $(abr + ' > div').css('height', wh - (topHeight + fh + set.head.height));
            };

            s.setAreaSize = function (l) {
                $(atl).css('width', l);
                $(atl + ' > div').css('width', l);
                $(atr).css('left', l - 1);
                $(atr + ' > div').css('left', l);

                $(abl).css('width', l);
                $(abl + ' > div').css('width', l + 16);

                $(abr).css('left', l - 1);
                $(abr + ' > div').css('left', l);
            }

            s.selectCell = function (cId, e) {
                s.activeCell(cId);
                $(e.currentTarget).find('textarea').focus();
            };

            s.loadDetails = function (orgId) {
                s.details.removeAll();
                if (set.mode == 2) { // modify view
                    app.loadData(DOMAIN_API + '/kpi/Kpi' + set.type + 'ModifyDetailList',
                        {
                            KpiId: model.Id
                        },
                        null,
                        function (result) {
                            $(result.details).each(function () {
                                if (this.ParentId == null && !this.Summary) {
                                    var d = new KpiDetail(this);
                                    $(result.details).each(function () {
                                        if (this.Group == d.Group() && this.ParentId != null) {
                                            var c = new KpiDetail(this, d.childs().length + 1);
                                            c.Status(null);
                                            d.childs.push(c);
                                        }
                                    });
                                    d.childs().sort(function (a, b) {
                                        var v1 = parseInt(a.STT());
                                        var v2 = parseInt(b.STT());
                                        if (v1 > v2) {
                                            return 1;
                                        }
                                        if (v1 < v2) {
                                            return -1;
                                        }
                                        return 0;
                                    });
                                    s.details.push(d);
                                }
                                if (this.Summary) {
                                    s.tongket().Id(this.Id);
                                    s.tongket().Summary(true);
                                }
                            });
                            $(result.modifies).each(function () {
                                if (this.ParentId == null && !this.Summary) {
                                    var d = new KpiDetail(this);
                                    $(result.modifies).each(function () {
                                        if (this.Group == d.Group() && this.ParentId != null) {
                                            var c = new KpiDetail(this, d.childs().length + 1);
                                            d.childs.push(c);
                                        }
                                    });
                                    d.childs().sort(function (a, b) {
                                        var v1 = parseInt(a.STT());
                                        var v2 = parseInt(b.STT());
                                        if (v1 > v2) {
                                            return 1;
                                        }
                                        if (v1 < v2) {
                                            return -1;
                                        }
                                        return 0;
                                    });
                                    s.modifies.push(d);
                                }
                                if (this.Summary) {
                                    s.tongket().Id(this.Id);
                                    s.tongket().Summary(true);
                                }
                            });
                            s.events();
                            s.loaded(true);
                        });
                } else if (set.mode == 3) {
                    app.loadData(DOMAIN_API + '/Kpi/Kpi' + set.type + 'DetailByApprovalId',
                        {
                            kpiId: model.Id,
                            approvalId: approvalId
                        },
                        null,
                        function (result) {
                            $(result).each(function () {
                                if (this.ParentId == null && !this.Summary) {
                                    var d = new KpiDetail(this);
                                    $(result).each(function () {
                                        if (this.ParentId == d.Id()) {
                                            d.childs.push(new KpiDetail(this, d.childs().length + 1));
                                        }
                                    });
                                    d.childs().sort(function (a, b) {
                                        var v1 = parseInt(a.STT());
                                        var v2 = parseInt(b.STT());
                                        if (v1 > v2) {
                                            return 1;
                                        }
                                        if (v1 < v2) {
                                            return -1;
                                        }
                                        return 0;
                                    });

                                    s.details.push(d);
                                }
                                if (this.Summary) {
                                    s.tongket().Id(this.Id);
                                    s.tongket().Summary(true);
                                }
                            });

                            s.events();
                            s.loaded(true);
                        });
                }
                else {
                    app.loadData(DOMAIN_API + '/kpi/Kpi' + set.type + 'DetailList',
                        {
                            KpiId: model.Id,
                            OrganizationId: orgId
                        },
                        null,
                        function (result) {
                            $(result).each(function () {
                                if (this.ParentId == null && !this.Summary) {
                                    var d = new KpiDetail(this);
                                    if (set.mode == 1) {
                                        d.Status(0);
                                    }
                                    $(result).each(function () {
                                        if (this.ParentId == d.Id()) {
                                            var c = new KpiDetail(this, d.childs().length + 1);
                                            if (set.mode == 1) {
                                                c.Status(null);
                                            }
                                            console.log(set.mode);
                                            d.childs.push(c);
                                        }
                                    });
                                    d.childs().sort(function (a, b) {
                                        var v1 = parseInt(a.STT());
                                        var v2 = parseInt(b.STT());
                                        if (v1 > v2) {
                                            return 1;
                                        }
                                        if (v1 < v2) {
                                            return -1;
                                        }
                                        return 0;
                                    });
                                    s.details.push(d);
                                }

                                if (this.Summary) {
                                    s.tongket().Id(this.Id);
                                    s.tongket().Summary(true);
                                }
                            });
                            s.events();
                            s.loaded(true);
                        });
                }
            };

            //// show, hide quarters

            s.expandQuater = function (i) {
                var v;
                switch (i) {
                    case 1:
                        {
                            v = s.q1();
                            s.q1(!v);
                        }
                        break;
                    case 2:
                        {
                            v = s.q2();
                            s.q2(!v);
                        }
                        break;
                    case 3:
                        {
                            v = s.q3();
                            s.q3(!v);
                        }
                        break;
                    case 4:
                        {
                            v = s.q4();
                            s.q4(!v);
                        }
                        break;
                }
            };

            /////

            s.init = function () {
                s.setAreaSize(set.mode == 2 ? 0 : wl);
                s.resize();
                s.activeObject(new KpiObject(model));
                s.loadDetails(model.OrganizationId);
                $(formulas).each(function () {
                    if (this.ParentId == null) {
                        s.formulas.push(this);
                    } else {
                        s.subFormulas.push(this);
                    }
                });
            };
            s.init();
        };

        function toolEvents() {
            $(window).resize(function () {
                if (vm != null) {
                    vm.resize();
                }

            });

            setTimeout(function () {
                var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
                elems.forEach(function (html) {
                    new Switchery(html, { color: '#2196F3' });
                });
            }, 500);

            eventsKpiTable();

            var ttr;

            $('.kpi-table').find(' .area').mouseover(function () {
                ttr = $(this);
            });

            $('.area-br-2 > div').scroll(function () {
                if ($(ttr).length == 0 || $(ttr).hasClass('area-br-2')) {
                    var t = $(this).scrollTop();
                    var l = $(this).scrollLeft();

                    $('.area-br-1 > div').scrollTop(t);
                    $('.area-br-1 > div').scrollLeft(l);
                }
            });

            $('.area-br-1 > div').scroll(function () {
                if ($(ttr).length == 0 || $(ttr).hasClass('area-br-1')) {
                    var t = $(this).scrollTop();
                    var l = $(this).scrollLeft();

                    $('.area-br-2 > div').scrollTop(t);
                    $('.area-br-2 > div').scrollLeft(l);
                }
            });

            $(rb).draggable(
                {
                    axis: "x",
                    containment: 'parent',
                    drag: function () {
                        var l = $(this).css('left');
                        vm.setAreaSize(l);
                    }
                });

            $('#btn-save-hs').unbind().click(function () {
                var btn = $(this);

                var data = vm.renderSubmitData();
                if (data != null) {
                    data.perform = model.Id > 0 ? 'updateHS' : 'create';
                    btn.button('loading');
                    app.postData(DOMAIN_API + '/kpi/SaveKpi' + set.type,
                        data,
                        function (result) {
                            btn.button('reset');
                            if (!result.Success) {
                                app.notify('warning', result.Message);
                            } else {
                                app.notify('success', 'Lưu thành công');
                                window.location.href = '/kpi/' + set.type + 'edit?tab=tab2&id=' + model.Id;
                            }
                        });
                }
            });

            $('#btn-save-gui-hs').unbind().click(function () {
                var btn = $(this);
                var data = vm.renderSubmitData();
                if (data != null) {
                    data.perform = 'updateHS';
                    data.sent = true;
                    vm.isSubmit(true);
                    data.buocduyet = 2;
                    data.landuyet = btn.attr("data-landuyet");
                    data.AuthEmployeeId = empId;
                    var valid = vm.checkHSValid(data);
                    if (valid) {
                        btn.button('loading');
                        app.postData(DOMAIN_API + '/kpi/SaveKpi' + set.type,
                            data,
                            function (result) {
                                btn.button('reset');
                                if (!result.Success) {
                                    app.notify('warning', result.Message);
                                } else {
                                    app.notify('success', 'Lưu thành công');
                                    window.location.href = '/kpi/' + set.type + 'edit?id=' + model.Id;
                                }
                            });
                    }
                }
            });

            $('#btn-duyet-dk').unbind().click(function () {
                console.log($(this).attr("data-landuyet"));
                confirmDuyet(DOMAIN_API + '/kpi/duyetKpi' + set.type,
                    {
                        id: model.Id,
                        buocduyet: $(this).attr("data-buocduyet"),
                        landuyet: $(this).attr("data-landuyet"),
                        type: 0,
                        trangThai: 2,
                        approverId: $(this).attr("data-nguoiduyet"),
                        isBanKPI: $(this).attr("data-banKPI")
                    }, function (ok) {
                        if (ok) {
                            window.location.href = '/kpi/' + set.type + 'edit?id=' + model.Id;
                        }
                    });
            });

            $('#btn-khong-duyet-dk').unbind().click(function () {
                var btn = $(this);
                var data = {
                    id: model.Id,
                    type: 0,
                    buocduyet: btn.attr('data-buocduyet'),
                    landuyet: btn.attr("data-landuyet"),
                    trangThai: 3,
                    approverId: btn.attr('data-nguoiduyet'),
                    AuthEmployeeId: empId,
                    isAdmin: isAdmin,
                    isBanKPI: $(this).attr("data-banKPI")
                };
                confirmKhongDuyet(DOMAIN_API + '/kpi/DuyetKpi' + set.type,
                    data,
                    function (ok) {
                        if (ok) {
                            window.location.href = '/kpi/' + set.type + 'edit?id=' + model.Id;
                        }
                    });
            });

            $('#btn-save-kq').unbind().on('click', function (e) {
                var btn = $(this);
                var data = vm.renderSubmitData();
                data.perform = 'updateKQ';
                data.quy = btn.attr('data-quy');
                data.landuyet = btn.attr("data-landuyet");
                data.AuthEmployeeId = empId;

                if (data != null) {
                    var btn = $(this);
                    btn.button('loading');
                    app.postData(DOMAIN_API + '/kpi/saveKpi' + set.type,
                        data,
                        function (result) {
                            btn.button('reset');
                            if (!result.Success) {
                                app.notify('warning', result.Message);
                            } else {
                                app.notify('success', 'Lưu thành công');
                                window.location.href = '/kpi/' + set.type + 'edit?tab=tab2&id=' + model.Id;
                            }
                        });
                }
            });

            $('#btn-save-gui-kq').unbind().on('click', function (e) {
                var btn = $(this);
                var data = vm.renderSubmitData();
                if (data != null) {
                    vm.isSubmit(true);
                    data.quy = btn.attr('data-quy');
                    data.perform = 'updateKQ';
                    data.landuyet = btn.attr("data-landuyet");
                    data.sent = true;
                    data.buocduyet = 1;
                    data.AuthEmployeeId = empId;

                    var valid = vm.checkKQValid(data);
                    if (valid) {
                        btn.button('loading');
                        app.postData(DOMAIN_API + '/kpi/SaveKpi' + set.type,
                            data,
                            function (result) {
                                btn.button('reset');
                                if (!result.Success) {
                                    app.notify('warning', result.Message);
                                } else {
                                    app.notify('success', 'Lưu thành công');
                                    window.location.href = '/kpi/' + set.type + 'edit?id=' + model.Id;
                                }
                            });
                    }
                }
            });

            $('#btn-duyet-kq').unbind().click(function () {
                confirmDuyet(DOMAIN_API + '/kpi/duyetKpi' + set.type, {
                    id: model.Id,
                    quy: $(this).attr("data-quy"),
                    buocduyet: $(this).attr("data-buocduyet"),
                    landuyet: $(this).attr("data-landuyet"),
                    trangThai: 2,
                    type: 1,
                    capDuyet: $(this).attr("data-capduyet"),
                    approverId: $(this).attr("data-nguoiduyet"),
                    isBanKPI: $(this).attr("data-banKPI")
                }, function (ok) {
                    if (ok) {
                        window.location.href = '/kpi/' + set.type + 'edit?id=' + model.Id;
                    }

                });
            });

            $('#btn-khong-duyet-kq').unbind().click(function () {
                var btn = $(this);
                confirmKhongDuyet(DOMAIN_API + '/kpi/duyetKpi' + set.type,
                    {
                        id: model.Id,
                        buocduyet: 2,
                        type: 1,
                        trangThai: 3,
                        landuyet: $(btn).attr("data-landuyet"),
                        approverId: $(btn).attr("data-nguoiduyet"),
                        quy: $(btn).attr("data-quy"),
                        isBanKPI: $(this).attr("data-banKPI")
                    }, function (ok) {
                        if (ok) {
                            window.location.href = '/kpi/' + set.type + 'edit?id=' + model.Id;
                        }
                    });
            });

            $('#btn-admin-update').unbind().click(function () {
                var data = vm.renderSubmitData();
                data.perform = 'adminUpdate';
                if (data != null) {
                    var btn = $(this);
                    btn.button('loading');
                    app.postData(DOMAIN_API + '/kpi/SaveKpi' + set.type,
                        data,
                        function (result) {
                            btn.button('reset');
                            if (!result.Success) {
                                app.notify('warning', result.Message);
                            } else {
                                app.notify('success', 'Lưu thành công');
                            }
                        });
                }
            });

            $('.btn-edit-summary').unbind().click(function () {
                var btn = $(this);
                btn = btn.button('loading');

                var m = 'edit-summary-modal';
                if ($('#' + m).length == 0) {
                    app.createEmptyModal({
                        id: m,
                        width: 600,
                        headerClass: 'bg-primary',
                        noPaddingBody: true,
                        title: 'Cập nhật thông tin KPIs cấp công ty'
                    });
                }
                app.loadData(DOMAIN_API + '/kpi/' + set.type + 'SummaryEdit',
                    {
                        dataType: 'html',
                        id: model.Id,
                        AuthEmployeeId: auth.EmployeeId
                    },
                    null,
                    function (html) {
                        $('#' + m + ' .modal-body').html(html);
                        $('#' + m).modal('show');
                        btn = btn.button('reset');
                        initKpiSummaryForm(function () {
                            $('#' + m).modal('hide');
                            window.location.href = '/kpi/deparatmentdit?id=' + model.Id;
                        });
                    });
            });

            $('#btn-request-modify-dk').unbind().click(function () {
                confirmCapNhat(DOMAIN_API + '/kpi/CreateKpi' + set.type + 'Modify', null,
                    {
                        kpiId: model.Id,
                        quy: $('data-quy').val()
                    }, function (result) {
                        if (result) {
                            window.location.href = '/kpi/' + set.type + 'Edit?id=' + model.Id + '&tab=tab3';
                        }
                    });
            });

            $('#btn-save-send-modify').unbind().click(function () {
                var btn = $(this);
                var data = vm.renderSubmitData();
                if (data != null) {
                    vm.isSubmit(true);
                    data.perform = model.Id > 0 ? 'updateHS' : 'create';
                    data.landuyet = btn.attr("data-landuyet");
                     
                    var valid = vm.checkDCValid(data);
                    if (valid) {
                        btn.button('loading');
                        app.postData(DOMAIN_API + '/kpi/RequestModifyKpi' + set.type,
                            data,
                            function (result) {
                                btn.button('reset');
                                if (!result.Success) {
                                    app.notify('warning', result.Message);
                                } else {
                                    app.notify('success', 'Lưu thành công');
                                    window.location.href = '/kpi/' + set.type + 'edit?tab=tab3&id=' + model.Id;
                                }
                            });
                    }
                }
            });

            $('#btn-duyet-dc').unbind().click(function () {
                confirmDuyet(DOMAIN_API + '/kpi/DuyetKpi' + set.type + 'Modify',
                    {
                        id: model.Id,
                        buocduyet: $(this).attr("data-buocduyet"),
                        landuyet: $(this).attr("data-landuyet"),
                        type: 2,
                        trangThai: 2,
                        approverId: $(this).attr("data-nguoiduyet"),
                        isBanKPI: $(this).attr("data-banKPI")
                    }, function (ok) {
                        if (ok) {
                            window.location.href = '/kpi/' + set.type + 'edit?id=' + model.Id;
                        }
                    });
            });

            $('#btn-khong-duyet-dc').unbind().click(function () {
                confirmKhongDuyet(DOMAIN_API + '/kpi/DuyetKpi' + set.type + 'Modify',
                    {
                        id: model.Id,
                        buocduyet: $(this).attr("data-buocduyet"),
                        landuyet: $(this).attr("data-landuyet"),
                        type: 2,
                        trangThai: 3,
                        approverId: $(this).attr("data-nguoiduyet"),
                        isBanKPI: $(this).attr("data-banKPI")
                    }, function (ok) {
                        if (ok) {
                            window.location.href = '/kpi/' + set.type + 'edit?id=' + model.Id;
                        }
                    });
            });

            $('#btn-duyet-cm-kq').unbind().click(function () {
                var btn = $(this);
                var data = {
                    id: model.Id,
                    type: 1,
                    buocduyet: btn.attr('data-buocduyet'),
                    landuyet: $(btn).attr("data-landuyet"),
                    trangThai: 2,
                    quy: btn.attr('data-quy'),
                    approverId: btn.attr('data-nguoiduyet'),
                    AuthEmployeeId: empId,
                    isAdmin: isAdmin
                };
                confirmDuyet(DOMAIN_API + '/kpi/DuyetKpi' + set.type,
                    data,
                    function (ok) {
                        if (ok) {
                            window.location.href = '/kpi/' + set.type + 'appraisers';
                        }
                    });
            });

            $('#btn-khong-duyet-cm-kq').unbind().click(function () {
                var btn = $(this);
                var data = {
                    id: model.Id,
                    type: 1,
                    buocduyet: btn.attr('data-buocduyet'),
                    landuyet: $(btn).attr("data-landuyet"),
                    trangThai: 3,
                    quy: btn.attr('data-quy'),
                    approverId: btn.attr('data-nguoiduyet'),
                    AuthEmployeeId: empId,
                    isAdmin: isAdmin
                };
                confirmKhongDuyet(DOMAIN_API + '/kpi/DuyetKpi' + set.type,
                    data,
                    function (ok) {
                        if (ok) {
                            window.location.href = '/kpi/' + set.type + 'appraisers';
                        }
                    });
            });
        }

        pl.drawRow = function (row) {
            var r = '<td ';

            switch (row.type) {
                case 'control':
                    {
                        r += ' style="vertical-align: middle" >';

                        if (set.mode == 1) // modify
                        {
                            var b = ' <button class="btn btn-default btn-delete mb-15" ' +
                                'data-bind="click: function(data, event) { $root.modifyDetail($data, $parents[1], data, event) },' +
                                'visible: $root.trangThai() == 0 && $root.perform==' + "'create' ";
                            if (set.dependCompany) {
                                b += ' && KpiCompanyAllocationId() == null ';
                            }
                            b += '" > ' +
                                '<i class="icon-pencil7 text-primary" style = "margin-left: 0px; font-size: 13px;" ></i > ' +
                                '</button > ';
                            r += b;
                        }

                        var enable = " ";
                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                                }
                                break;
                            case 1:
                                {
                                    enable += '  $root.trangThai() == 0 && $root.perform == ' + "'create' ";
                                }
                                break;
                            case 2:
                                {
                                    enable += ' false ';
                                }
                                break;
                            case 3:
                                {
                                    enable += ' false ';
                                }
                                break;
                            default:
                        }

                        if (set.dependCompany) {
                            enable += ' && KpiCompanyAllocationId() == null ';
                        }

                        enable += ' && KpiEvaluationCriteriaId() == null ';

                        r += '<button class="btn btn-default btn-delete" data-bind="click: function(data, event) {' +
                            '$root.deleteDetail($data, $parents[0], data, event) }, visible: ' + enable + ' ">' +
                            '<i class="icon-x text-danger" style="margin-left: 0px; font-size: 13px;"></i>' +
                            '</button>';

                        r += '<span class="resize-y" data-bind="draggable: $data"></span>';
                    };
                    break;
                case 'expand':
                    {
                        r += ' class="text-center" style="vertical-align: middle"> ' +
                            '<button class="btn btn-xs btn-expand" type="button" data-bind="click: $root.expendGroup">' +
                            '<i class="icon-arrow-down5"' +
                            'data-bind="css: { ' + "'icon-arrow-down5'" + ' : expanded() == true, ' + "'icon-arrow-up5'" + ' : expanded() == false }"></i>' +
                            '</button> ' +
                            '</td>';
                    }
                    break;
                case 'STT':
                    {
                        if (set.dependCompany) {
                            enable += ' && KpiCompanyAllocationId() == null ';
                        }

                        r += 'data-bind="css: { ' + "'edit'" + ': $root.activeCell() == ' + "'cell_stt_'" + ' + guid(), ';
                        r += "'has-error' : $root.isSubmit() == true  && (STT() == '' || STT() == null) }, ";

                        r += "click: function(data, event) { $root.selectCell('cell_stt_' + guid(), event) }" + '" >' +
                            '<span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>' +
                            '<textarea class="form-control" rows="4" data-bind="value: STT , ';

                        var enable = ' enable: ';
                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                                }
                                break;
                            case 1:
                                {
                                    enable += '  $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                                }
                                break;
                            case 2:
                                {
                                    enable += ' false ';
                                }
                                break;
                            case 3:
                                {
                                    enable += ' false ';
                                }
                                break;
                            default:
                        }

                        r += enable + '"></textarea>';
                    }
                    break;
                case 'text':
                    {
                        r += ' class="' + (row.class != null ? row.class : '') + '" ';
                        if (row.bind != null) {
                            r += 'data-bind="' + row.bind + '" > ';
                        } else {
                            r += '> <span style="' + (row.style != null ? row.style : '') + '" data-bind="text: ' + row.attribute + '"></span>';
                        }
                        if (row.addDetail) {

                            var visible = ' visible: ';
                            if (set.mode == 1) {
                                visible += '  $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                            } else if (set.mode == 0) {
                                visible += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                            } else {
                                visible += ' false ';
                            }
                            r +=
                                '  <button type="button" class="btn bg-teal  btn-add-child" ' +
                                'data-bind="click: $root.addDetail, ' + visible + '" title="Thêm mục tiêu con">' +
                                '<i class="icon-plus3"></i></button>';
                        }
                    }
                    break;
                case 'input':
                    {
                        r += ' data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_" + row.code + "_' + guid() ";
                        if (row.warning) {
                            r += ", 'has-error' : $root.isSubmit() == true  && (" + row.attribute + "() == '' || " + row.attribute + "() == null) ";
                        }
                        r += ' }, ';

                        r += 'click: function(data, event) { $root.selectCell(' + "'cell_" + row.code + "_'" + ' + guid(), event) }" class="edit">' +
                            '<input class="form-control text-center" data-bind="value: ' + row.attribute + ' ';

                        if (row.realTime) {
                            r += ' , valueUpdate: ' + "'afterkeydown' ";
                        }

                        r += '" /></td>';
                    }
                    break;

                case 'textarea':
                    {
                        r += 'data-bind="css: { ' + "'edit'" + ': $root.activeCell() == ' + "'cell_" + row.code + "_'" + ' + guid()';
                        if (row.warning) {
                            r += ", 'has-error' : $root.isSubmit() == true  && (" + row.attribute + "() == '' || " + row.attribute + "() == null) && ($root.perform != 'create' || ($root.perform == 'create' && Status() != 1))";
                        }
                        r += ' }, ';
                        r += "click: function(data, event) { $root.selectCell('cell_" + row.code + "_' + guid(), event) }" + '" >' +
                            '<span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>' +
                            '<textarea class="form-control" rows="4" data-bind="value: ' + row.attribute + ' ';

                        if (row.realTime) {
                            r += ', valueUpdate: ' + "'afterkeydown'";
                        }
                        var enable = ", enable: KpiEvaluationCriteriaId() == null ";
                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' && ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                                }
                                break;
                            case 1:
                                {
                                    enable += ' && $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                                }
                                break;
                            case 2:
                                {
                                    enable += ' && false ';
                                }
                                break;
                            case 3:
                                {
                                    enable += ' && false ';
                                }
                                break;
                            default:
                        }

                        if (set.dependCompany) {
                            enable += ' && KpiCompanyAllocationId() == null ';
                        }

                        r += enable + '"></textarea>';
                    }
                    break;
                case 'DuLieuChungMinh':
                    {
                        r += 'data-bind="css: { ' + "'edit'" + ': $root.activeCell() == ' + "'cell_dlcm_'" + ' + guid()';
                        r += ", 'has-error' : $root.isSubmit() == true  && (DuLieuChungMinh() == '' || DuLieuChungMinh() == null) && ($root.perform != 'create' || ($root.perform == 'create' && Status() != 1)) ";
                        r += ' }, ';
                        r += "click: function(data, event) { $root.selectCell('cell_dlcm_' + guid(), event) }" + '" >' +
                            '<span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>' +
                            '<textarea class="form-control" rows="4" data-bind="value: DuLieuChungMinh ';

                        var enable = ", enable: (KpiEvaluationCriteriaId() == null || (KpiEvaluationCriteriaId() != null && DuLieuChungMinh() != '' )) ";
                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' && ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                                }
                                break;
                            case 1:
                                {
                                    enable += ' && $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                                }
                                break;
                            case 2:
                                {
                                    enable += ' && false ';
                                }
                                break;
                            case 3:
                                {
                                    enable += ' && false ';
                                }
                                break;
                            default:
                        }
                        r += enable + '"></textarea>';
                    }
                    break;
                case 'select':
                    {
                        r += 'data-bind="css: { ';

                        r += "'edit': $root.activeCell() == 'cell_" + row.code + "_' + guid() , ";

                        var enable = " ";
                        if (set.mode == 1) {
                            enable += '  $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                        } else if (set.mode == 0) {
                            enable += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                        } else {
                            enable += ' false ';
                        }

                        if (set.dependCompany) {
                            enable += ' && KpiCompanyAllocationId() == null ';
                        }
                        enable += ' && KpiEvaluationCriteriaId() == null ';
                        r += "  'disabled' :! ( " + enable + " ) }, click: function(data, event) { $root.selectCell('cell_" + row.code + "_' + guid(), event) }" + ' ">';

                        r +=
                            '<span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        if (row.attribute == 'DonViTinh') {
                            r += '<select class="form-control" data-bind="options: listDonViTinh,' +
                                "optionsText: 'Name'," +
                                "optionsValue: 'Code'," +
                                'value: DonViTinh, enable: ' + enable + ' "></select>';

                        } else {
                            r += '<select class="form-control" data-bind="options: principles,' +
                                "optionsText: 'name', " +
                                "optionsValue: 'id'," +
                                "value: NguyenTacTinh, enable : " + enable + ' "></select>';
                        }
                    }
                    break;
                case 'ppd':
                    {
                        r += ' class="edit" data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_ctd_' + guid(), ";
                        r += "'has-error' : $root.isSubmit() == true  && (CongThucDoHtml() == '' || CongThucDoHtml() == null) && ($root.perform != 'create' || ($root.perform == 'create' && Status() != 1)) }, ";

                        var enable = " ";

                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                                }
                                break;
                            case 1:
                                {
                                    enable += '  $root.trangThai() == 0 && ( $root.perform != ' + "'create' " + ' || ( $root.perform == ' + "'create' " +' && Status() != 1)';
                                }
                                break;
                            case 2:
                                {
                                    enable += ' false ';
                                }
                                break;
                            case 3:
                                {
                                    enable += ' false ';
                                }
                                break;
                            default:
                        }


                        if (set.dependCompany) {
                            enable += ' && KpiCompanyAllocationId() == null ';
                        }
                        enable += ' && (KpiEvaluationCriteriaId() == null || (KpiEvaluationCriteriaId() != null && PhuongPhapDo() != null && PhuongPhapDo() != ' + "'' )) ";

                        r += "'disabled' : !( " + enable + " )  ";

                        r += ' ">';

                        r += '<textarea class="text-label" data-bind="value: CongThucDoHtml, css: { ' + "'disabled': !( " + enable + " )" + ' }"></textarea>';

                        r += '<button type="button" class="btn btn-show-modal " ' +
                            'data-bind="click: $root.editPhuongPhapDo, enable: ' + enable + '">' +
                            '<i class="icon-pencil7"></i>' +
                            '</button>';

                    }
                    break;
                case 'ncm':
                    {
                        var enable = " ";
                        if (set.mode == 1) {
                            enable += '  $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                        } else if (set.mode == 0) {
                            enable += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                        } else {
                            enable += ' false ';
                        }
                        if (set.dependCompany) {
                            enable += ' && KpiCompanyAllocationId() == null ';
                        }
                        enable += ' && KpiEvaluationCriteriaId() == null ';
                        r += 'data-bind="css: { ' + "'disabled' : !( " + enable + " ) " + '}">';

                        r += '<span class="text-label" data-bind="text: appraiserText" ></span>';

                        r += ' <button class="btn btn-show-modal" type="button"' +
                            'data-bind="click: $root.showAppraiserModal, enable : ' +
                            enable + ' "><i class="icon-pencil7"></i></button>';
                    }
                    break;
                case 'PhanBoMucTieu':
                    {
                        var enable = " ";
                        if (set.mode == 1) {
                            enable += '  $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                        } else if (set.mode == 0) {
                            enable += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                        } else {
                            enable += ' false ';
                        }
                        if (set.dependCompany) {
                            enable += ' && KpiCompanyAllocationId() == null ';
                        }

                        r += 'data-bind="">' +
                            '<span class="text-label" data-bind="text: allocationText"></span>' +
                            '<button class="btn btn-show-modal " type="button"' +
                            'data-bind="click: $root.showAllowcateModal">' +
                            '<i class="icon-pencil7 "></i>' +
                            '</button>';
                    }
                    break;
                case 'number':
                    {
                        var enable = " ";
                        if (set.mode == 1) {
                            enable += '  $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                        } else {
                            enable += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                        }
                        if (set.dependCompany) {
                            enable += ' && KpiCompanyAllocationId() == null ';
                        }

                        r += 'data-bind="css: { ' + "'disabled' : !( " + enable + " ), ";

                        r += "'edit': $root.activeCell() == 'cell_" + row.code + "_' + guid() ";

                        if (row.warning) {
                            r +=
                                ", 'has-error' : $root.isSubmit() == true  && (" + row.attribute + "() == '' || " + row.attribute + "() == null) }, ";
                        }

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_" + row.code + "_' + guid(), event) } ";


                        r += '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>' +
                            '<p style="padding: 3px 10px; margin: 0px; text-align: left" data-bind="visible: $root.activeCell() != ' + "'cell_"
                            + row.code + "_'" + ' + guid() , text: ' + row.attribute + 'Str"></p>';

                        r += '<textarea class="form-control" rows="4" data-bind="value: ' + row.attribute + ', ' +
                            'visible: $root.activeCell() == ' + "'cell_" + row.code + "_'" + ' + guid(), enable : ' + enable + ' "></textarea>';
                    }
                    break;
                case 'attach':
                    {
                        var enable = "";
                        if (row.quy != null) {
                            enable = ' $root.trangThai() == ' + (row.quy * 4 - 1);
                            r += 'data-bind="css: { ' + "'disabled' : !( " + enable + " )} " + '">';
                            r += ' <div data-bind="visible : ' + enable + '">' +
                                '<input type="file" data-bind="attr: { ' + "'id' : 'attach-quy" + row.quy + "-' + guid()" + ' }"  class="file-attach"  /> ' +
                                '</div>';

                            r += ' <a href="#" class="mt-5" target="_blank" data-bind="attr: { href : Quy' + row.quy + '_DinhKem() }, visible: Quy' + row.quy + '_DinhKem() != null && Quy' + row.quy + '_DinhKem() !=  ' + "''" + '">Xem file</a>';
                        } else {

                            if (set.mode == 1) {
                                enable += '  $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                            } else if (set.mode == 0) {
                                enable += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                            } else {
                                enable += ' false ';
                            }
                            if (set.dependCompany) {
                                enable += ' && KpiCompanyAllocationId() == null ';
                            }


                            r += 'data-bind="css: { ' + "'disabled' : !( " + enable + " )} " + '">';

                            r += ' <div data-bind="">' +
                                '<input type="file" data-bind="attr: { ' + "'id' : 'attach-dangky-' + guid()" + ' }, enable: ' + enable + '" class="file-attach"  /> ' +
                                '</div>';


                            r += '<a href="#" class="mt-5" target="_blank" ' +
                                'data-bind="attr: { href : DangKy_DinhKem() }, visible: DangKy_DinhKem() != null && DangKy_DinhKem() != ' + "''" + '">Xem file</a>';

                        }
                    }
                    break;
                case 'TrongSoQuy':
                    {

                        r += 'data-bind="css: { ' + "'edit'" + ': $root.activeCell() == ' + "'cell_ts" + row.quy + "_'" + ' + guid()';
                        if (row.warning) {
                            r +=
                                ", 'has-error' : $root.isSubmit() == true  && (Quy" + row.quy + "_TrongSo() == '' || Quy" + row.quy + "_TrongSo() == null) && ($root.perform != 'create' || ($root.perform == 'create' && Status() != 1)) ";
                        }
                        r += ' }, ';
                        r += "click: function(data, event) { $root.selectCell('cell_ts" + row.quy + "_' + guid(), event) }" + '" >' +
                            '<span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>' +
                            '<textarea class="form-control text-center" rows="4" data-bind="value: Quy' + row.quy + '_TrongSo ';

                        r += ', valueUpdate: ' + "'afterkeydown'";

                        var enable = ", enable: ";
                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                                }
                                break;
                            case 1:
                                {
                                    enable += ' $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                                }
                                break;
                            case 2:
                                {
                                    enable += ' false ';
                                }
                                break;
                            case 3:
                                {
                                    enable += ' false ';
                                }
                                break;
                            default:
                        }

                        r += enable + '"></textarea>';
                    }
                    break;
                case "KetQuaQuy":
                    {
                        r += ' class="disabled" data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_kq" + row.quy + "_' + guid() ";

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_kq" + row.quy + "_' + guid(), event) } ";
                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea disabled="disabled" class="form-control text-center" rows="4" data-bind="value: Quy' + row.quy + '_KetQua  "></textarea>';
                    }
                    break;
                case "KeHoach_X":
                    {
                        var enable = " ";
                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' Default_X() == null && ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                                }
                                break;
                            case 1:
                                {
                                    enable += ' Default_X() == null && $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                                }
                                break;
                            case 2:
                                {
                                    enable += ' false ';
                                }
                                break;
                            case 3:
                                {
                                    enable += ' false ';
                                }
                                break;
                            default:
                        }

                        r += 'data-bind="css: { ' + "'disabled' : !( " + enable + " ), ";

                        r += "'edit': $root.activeCell() == 'cell_kh_" + row.quy + "_' + guid() ";

                        r += ", 'has-error' : $root.isSubmit() == true  &&  errorQuy" + row.quy + "_KehoachX() == true && ($root.perform != 'create' || ($root.perform == 'create' && Status() != 1)) }, ";

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_kh_" + row.quy + "_' + guid(), event) } ";

                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea readonly="readonly"  class="form-control text-center" rows="4" data-bind="value: Quy' + row.quy + '_KeHoach_XStr, ' +
                            'visible: $root.activeCell() != ' + "'cell_kh_" + row.quy + "_'" + ' + guid() "></textarea>';

                        r += '<textarea class="form-control text-center" rows="4" data-bind="value: Quy' + row.quy + '_KeHoach_X, ' +
                            'visible: $root.activeCell() == ' + "'cell_kh_" + row.quy + "_'" + ' + guid(), enable : ' + enable + ' "></textarea>';
                    }
                    break;
                case "ThucHien":
                    {
                        var enable = " ";
                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' ($root.trangThai() == ' + (row.quy * 4 - 1) + ' || $root.trangThai() ==  ' + (row.quy * 4 + 2) + ' ) ';

                                }
                                break;
                            case 1:
                                {
                                    enable += ' false ';
                                }
                                break;
                            case 2:
                                {
                                    enable += ' false ';
                                }
                                break; case 3:
                                {
                                    enable += ' false ';
                                }
                                break;
                            default:
                        }

                        r += 'data-bind="css: { ' + "'disabled' : !( " + enable + " ), ";

                        r += "'edit': $root.activeCell() == 'cell_th_" + row.quy + "_' + guid() ";

                        r += ", 'has-error' : $root.isSubmit() == true  && errorQuy" + row.quy + "_ThucHien() == true  ";

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_th_" + row.quy + "_' + guid(), event) } ";


                        r += '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>' +
                            '<textarea readonly="readonly" style="padding: 6px 10px; margin: 0px; text-align: center" data-bind="visible: $root.activeCell() != ' + "'cell_th_"
                            + row.quy + "_'" + ' + guid() , value: Quy' + row.quy + '_ThucHienStr"></textarea>';

                        r += '<textarea class="form-control text-center" rows="4" data-bind="value: Quy' + row.quy + '_ThucHien, ' +
                            'visible: $root.activeCell() == ' + "'cell_th_" + row.quy + "_'" + ' + guid(), enable : ' + enable + ' "></textarea>';
                    }
                    break;
                case "TyLeHoanThanh":
                    {
                        r += ' class="disabled" data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_tlht_" + row.quy + "_' + guid() ";
                        if (row.warning) {
                            r += ", 'has-error' : $root.isSubmit() == true  && (Quy" + row.quy + "_TyLeHoanThanh() == '' || Quy" + row.quy + "_TyLeHoanThanh() == null) }, ";
                        }
                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_tlht_" + row.quy + "_' + guid(), event) } ";
                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea disabled="disabled" class="form-control text-center" rows="4" data-bind="value: Quy' + row.quy + '_TyLeHoanThanh "></textarea>';
                    }
                    break;

                case "GhiChu":
                    {
                        var enable = " ";
                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' ($root.trangThai() == ' + (row.quy * 4 - 1) + ' || $root.trangThai() ==  ' + (row.quy * 4 + 2) + ' ) ';
                                }
                                break;
                            case 1:
                                {

                                    enable += ' false ';
                                }
                                break;
                            case 2:
                                {
                                    enable += ' false ';
                                }
                                break; case 3:
                                {
                                    enable += ' false ';
                                }
                                break;
                            default:
                        }

                        r += 'data-bind="css: { ' + "'disabled' : !( " + enable + " ), ";

                        r += "'edit': $root.activeCell() == 'cell_gc_" + row.quy + "_' + guid() ";

                        if (row.warning) {
                            r += ", 'has-error' : $root.isSubmit() == true  && (Quy" + row.quy + "_GhiChu() == '' || Quy" + row.quy + "_GhiChu() == null) }, ";
                        }

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_gc_" + row.quy + "_' + guid(), event) } ";

                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea class="form-control" rows="4" data-bind="value: Quy' + row.quy + '_GhiChu, enable : ' + enable + ' "></textarea>';
                    }
                    break;
                case 'DinhKemKetQua':
                    {
                        var enable = " ";
                        switch (set.mode) {
                            case 0:
                                {
                                    enable += ' ($root.trangThai() == ' + (row.quy * 4 - 1) + ' || $root.trangThai() ==  ' + (row.quy * 4 + 2) + ' ) ';

                                }
                                break;
                            case 1:
                                {
                                    enable += ' false ';
                                }
                                break;
                            case 2:
                                {
                                    enable += ' false ';
                                }
                                break; case 3:
                                {
                                    enable += ' false ';
                                }
                                break;
                            default:
                        }

                        r += 'data-bind="css: { ' + "'disabled' : !( " + enable + " )} " + '">';
                        r += ' <div data-bind="visible : ' + enable + '">' +
                            '<input type="file" data-bind="attr: { ' + "'id' : 'attach-quy" + row.quy + "-' + guid()" + ' }"  class="file-attach"  /> ' +
                            '</div>';

                        r += ' <a href="#" class="mt-5" target="_blank" data-bind="attr: { href : Quy' + row.quy + '_DinhKem() }, ' +
                            'visible: Quy' + row.quy + '_DinhKem() != null && Quy' + row.quy + '_DinhKem() !=  ' + "''" + '">Xem file</a>';
                    }
                    break;
                case 'TrangThaiDeXuat':
                    {
                        r += 'class="vertical-center disabled">' +
                            '<span class="label label-primary" style="padding: 1px 10px; margin-top: 30px;" data-bind="visible: Status() == 2 ">Cập nhật</span>' +
                            '<span class="label label-success" style = "padding: 1px 10px; margin-top: 30px;" data-bind="visible: Status() == 0 " > Thêm mới</span > ' +
                            '<span class="label label-warning" style="padding: 1px 10px; margin-top: 30px;" data-bind="visible: Status() == 1 ">Xóa</span>';
                    }
                    break;
                case 'DongBo':
                    {
                        r += ' style="vertical-align: middle; text-align: center">' +
                            '<div class="checkbox checkbox-switchery switchery-xs " style="width: 38px; margin: auto;">' +
                            '<input type="checkbox" class="switchery" data-bind="attr: { id :' + "'switchery-'" + ' + guid()}, checked: AllowSync() == true">' +
                            '</div>';
                    }
                    break;
                case 'Nam_TrongSo':
                    {
                        console.log(44);
                        r += 'data-bind="css: { ' + "'edit'" + ': $root.activeCell() == ' + "'cell_tsn_'" + ' + guid()';
                        r +=
                            ", 'has-error' : $root.isSubmit() == true  && (Nam_TrongSo() == '' || Nam_TrongSo() == null) && ($root.perform != 'create' || ($root.perform == 'create' && Status() != 1)) ";
                        r += ' }, ';
                        r += "click: function(data, event) { $root.selectCell('cell_tsn_' + guid(), event) }" + '" >' +
                            '<span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>' +
                            '<textarea class="form-control text-center" rows="4" data-bind="value: Nam_TrongSo ';

                        r += ', valueUpdate: ' + "'afterkeydown'";

                        var enable = ', enable: (KpiEvaluationCriteriaId() == null || (KpiEvaluationCriteriaId() != null && Nam_TrongSo() != null && Nam_TrongSo() != ' + "'' )) ";
                        if (set.mode == 1) {
                            enable += '&& $root.trangThai() == 0 && (Status() == 0 || Status() == 2) && $root.perform == ' + "'create' ";
                        } else if (set.mode == 0) {
                            enable += '&& ($root.trangThai() == 0 || $root.trangThai() == 2) ';
                        } else {
                            enable += ' && false ';
                        }

                        r += enable + '"></textarea>';
                    }
                    break;
                case "Nam_TyLeHTSoHienTai":
                    {
                        r += ' class="disabled" data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_tlnsht_' + guid() ";

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_tlnsht_' + guid(), event) } ";
                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea disabled="disabled" class="form-control text-center" rows="4" data-bind="value: Nam_TyLeHTSoHienTai  "></textarea>';
                    }
                    break;
                case "Nam_TyLeHoanThanh":
                    {
                        r += ' class="disabled" data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_tlhtn_' + guid() ";

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_tlhtn_' + guid(), event) } ";
                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea disabled="disabled" class="form-control text-center" rows="4" data-bind="value: Nam_TyLeHoanThanh "></textarea>';
                    }
                    break;
                case "Nam_ThucHien":
                    {
                        r += ' class="disabled" data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_thn_' + guid() ";

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_thn_' + guid(), event) } ";
                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea disabled="disabled" class="form-control text-center" rows="4" data-bind="value: Nam_ThucHien"></textarea>';
                    }
                    break;
                case "Nam_KeHoach":
                    {
                        r += ' class="disabled" data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_khn_' + guid() ";

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_khn_' + guid(), event) } ";
                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea disabled="disabled" class="form-control text-center" rows="4" data-bind="value: Nam_KeHoach"></textarea>';
                    }
                    break;
                case "Nam_KetQua":
                    {
                        r += ' class="disabled" data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_kqn_' + guid() ";

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_kqn_' + guid(), event) } ";
                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea disabled="disabled" class="form-control text-center" rows="4" data-bind="value: Nam_KetQua"></textarea>';
                    }
                    break;
                case "Nam_GhiChu":
                    {
                        r += ' class="disabled" data-bind="css: { ';
                        r += "'edit': $root.activeCell() == 'cell_gcn_' + guid() ";

                        r += '} ' + ", click: function(data, event) { $root.selectCell('cell_gcn_' + guid(), event) } ";
                        r +=
                            '"><span class="l1"></span><span class="l2"></span><span class="l3"></span><span class="l4"></span>';

                        r += '<textarea class="form-control" rows="4" data-bind="value: Nam_GhiChu "></textarea>';
                    }
                    break;
                default:
                    {
                        r += ' class="' + (row.class != null ? row.class : '') + '">' +
                            '<span  >&nbsp;</span>';

                    }
                    break;
            }

            return r + '</td>';
        }

        pl.initTable = function () {

            var i;
            var cgl = '',
                cgr = '',
                wr = 0;
            var col, r;
            var th;
            var tb = '', tt = '';
            var hh = set.head.height != null ? set.head.height : 32;

            var container = $(sel + ' .kpi_container');

            var html = '<div class="kpi-table render_table" style="margin-top: -1px">';
            html += '<div class="area area-tl" style="height: ' + hh + 'px"></div>';
            html += '<div class="area area-bl" style=" "></div>';
            html += '<div class="area area-tr" style="height: ' + hh + 'px"></div>';
            html += '<div class="area area-br" style=""></div>';
            html += '</div>';

            $(container).append(html);

            // top left 
            var area = $('<div></div>');
            var cs = set.cols.left;

            cgl = $('<colgroup></colgroup>');
            cgr = $('<colgroup></colgroup>');
            for (i = 0; i < cs.length; i++) {
                cgl.append('<col style="width: ' + set.head.groups[i] + 'px">');
                wl += set.head.groups[i];
            }
            for (i = cs.length; i < set.head.groups.length; i++) {
                cgr.append('<col style="width: ' + set.head.groups[i] + 'px">');
                wr += set.head.groups[i];
            }

            tb = $('<table class="table table-bordered"></table>');

            tb.css('width', wl).append(cgl);
            th = '<thead><tr>';
            th += '<tr>';
            for (i = 0; i < cs.length; i++) {
                col = cs[i];
                th += '<th ';
                if (col.visible == null || col.visible()) {

                    if (col.rowspan != null) {
                        th += ' rowspan="' + col.rowspan + '" ';
                    }
                    if (col.colspan != null) {
                        th += ' colspan="' + col.colspan + '" ';
                    }
                    th += ' style="height: ' + (col.height != null ? col.height + 'px' : '') + ';';
                    if (col.style != null) {
                        th += col.style + '; ';
                    }
                    th += '"';
                    var cls = '';
                    if (col.class != null) {
                        cls += col.class;
                    }
                    if (col.sort != null) {
                        th += 'class="' + cls + ' orderable" orderby="' + col.sort + '" currentOrder="desc">';
                    } else {
                        th += 'class="' + cls + '" >';
                    }
                    if (col.title != null) {
                        th += col.title;
                    } else {
                        th += '&nbsp;';
                    }
                    if (col.resize) {
                        th += '<span class="resize-x" i="' + (i + 1) + '"><i class="icon-drag-left-right"></i></span>';
                    }
                    th += "</th>";
                }
            }
            th += '</tr></thead>';

            tb.append(th);

            area.css('width', wl + 1).css('height', (set.head.height + 16) + 'px').append(tb);
            $(container).find('.area-tl').append(area);

            // bottom left

            area = '<div>';
            tb = '<table style="width: ' + wl + 'px" class="table table-bordered">' + $(cgl).html();

            var bd = '<tbody>';

            if (set.rows.total != null) {
                tt = '<tr class="tr-total">';
                for (i = 0; i < cs.length; i++) {
                    r = set.rows.total[i];
                    tt += pl.drawRow(r);
                }
                tt += '</tr>';
                bd += tt;
            }

            var pr = ' <!-- ko foreach : details -->';
            if (set.mode == 3) {
                pr += ' <tr class="tr-parent tr-parent-1 " data-bind="visible: childs().length > 0">';
            } else {
                pr += ' <tr class="tr-parent tr-parent-1 ">';
            }

            for (i = 0; i < cs.length; i++) {
                r = set.rows.parent[i];
                pr += pl.drawRow(r);
            }
            pr += '</tr>';

            pr += '<!-- ko foreach: childs -->';
            pr += '<tr data-bind="visible: expanded() == true && isDelete() == false, css: ' + "'kd_'" + ' + guid()">';
            for (i = 0; i < cs.length; i++) {
                r = set.rows.child[i];
                pr += pl.drawRow(r);
            }
            pr += '</tr>';
            pr += '<!-- /ko -->';
            pr += '<!-- /ko -->';
            bd += pr;

            bd += '</tbody';

            tb += bd;
            area += tb + '</table></div>';
            $(container).find('.area-bl').append(area);


            // top right

            area = '<div style="width: ' + wr + 'px, height: ' + (set.head.height + 16) + 'px ">';
            tb = '<table class="table table-bordered" style="width: ' + wr + 'px">' + $(cgr).html();
            th = '<thead>';

            for (var j = 0; j < set.cols.right.length; j++) {
                cs = set.cols.right[j];
                th += '<tr>';
                for (i = 0; i < cs.length; i++) {
                    col = cs[i];
                    th += '<th ';
                    if (col.visible == null || col.visible()) {

                        if (col.rowspan != null) {
                            th += ' rowspan="' + col.rowspan + '" ';
                        }
                        if (col.colspan != null) {
                            th += ' colspan="' + col.colspan + '" ';
                        }
                        th += ' style="height: ' + (col.height != null ? col.height + 'px' : '') + ';';
                        if (col.style != null) {
                            th += col.style + '; ';
                        }
                        th += '"';
                        var cls = '';
                        if (col.class != null) {
                            cls += col.class;
                        }
                        if (col.sort != null) {
                            th += 'class="' + cls + ' orderable" orderby="' + col.sort + '" currentOrder="desc">';
                        } else {
                            th += 'class="' + cls + '" >';
                        }
                        if (col.title != null) {
                            th += col.title;
                        } else {
                            th += '&nbsp;';
                        }
                        if (col.resize) {
                            th += '<span class="resize-x" i="' + (i + 1) + '"><i class="icon-drag-left-right"></i></span>';
                        }
                        th += "</th>";
                    }
                }
                th += '</tr>';
            }

            th += '</thead>';

            tb += th + '</table>';
            area += tb + '</div>';
            $(container).find('.area-tr').append(area);

            // bottom right

            area = '<div>';
            tb = '<table style="width: ' + wr + 'px" class="table table-bordered">' + $(cgr).html();

            bd = '<tbody>';

            if (set.rows.total != null) {
                tt = '<tr class="tr-total">';
                for (i = set.cols.left.length; i < set.rows.parent.length; i++) {
                    r = set.rows.total[i];
                    tt += pl.drawRow(r);
                }
                tt += '</tr>';
                bd += tt;
            }


            pr = ' <!-- ko foreach : details -->';
            pr += ' <tr class="tr-parent tr-parent-1 ">';
            if (set.mode == 3) {
                pr += ' <tr class="tr-parent tr-parent-1 " data-bind="visible: childs().length > 0">';
            } else {
                pr += ' <tr class="tr-parent tr-parent-1 ">';
            }

            for (i = set.cols.left.length; i < set.rows.parent.length; i++) {
                r = set.rows.parent[i];
                pr += pl.drawRow(r);
            }
            pr += '</tr>';

            pr += '<!-- ko foreach: childs -->';
            pr += '<tr data-bind="visible: expanded() == true && isDelete() == false, css: ' + "'kd_'" + ' + guid()">';
            for (i = set.cols.left.length; i < set.rows.child.length; i++) {
                r = set.rows.child[i];
                if (r.type == 'TrangThaiDeXuat') {
                    if (set.mode == 1 || set.mode == 2) {
                        pr += pl.drawRow(r);
                    }
                } else {
                    pr += pl.drawRow(r);
                }
            }
            pr += '</tr>';
            pr += '<!-- /ko -->';
            pr += '<!-- /ko -->';
            bd += pr;

            bd += '</tbody';

            tb += bd;
            area += tb + '</table></div>';
            $(container).find('.area-br').append(area);
        }

        pl.initModifyViewTable = function () {

            var i, cs;
            var cgl = '',
                cgr = '',
                wr = 0;
            var col, r;
            var th;
            var tb = '', tt = '';
            var hh = set.head.height != null ? set.head.height : 32;

            var container = $(sel + ' .kpi_container');

            var html = '<div class="p-15">' +
                '<div class="row">';
            html += '<div class="col-md-6">' +
                '<h5 class="text-bold no-margin-top">Bảng chi tiết</h5>' +
                '<div class="kpi-table render_table kpi-table-1" style="margin-top: -1px">' +
                '<div class="area area-tl" style="height: ' + hh + 'px"></div>' +
                '<div class="area area-bl" style=" "></div>' +
                '<div class="area area-tr" style="height: ' + hh + 'px"></div>' +
                '<div class="area area-br area-br-1" style=""></div>' +
                '</div></div>';
            html += '<div class="col-md-6">' +
                '<h5 class="text-bold no-margin-top">Bảng cập nhật</h5>' +
                '<div class="kpi-table render_table kpi-table-2" style="margin-top: -1px">' +
                '<div class="area area-tl" style="height: ' + hh + 'px"></div>' +
                '<div class="area area-bl" style=" "></div>' +
                '<div class="area area-tr" style="height: ' + hh + 'px"></div>' +
                '<div class="area area-br area-br-2" style=""></div>' +
                '</div></div>';
            html += '</div>';

            $(container).append(html);

            // top left

            var area = $('<div></div>');
            cgr = $('<colgroup></colgroup>');
            for (i = 0; i < set.head.groups.length; i++) {
                cgr.append('<col style="width: ' + set.head.groups[i] + 'px">');
                wr += set.head.groups[i];
            }

            // top right

            area = '<div style="width: ' + wr + 'px, height: ' + (set.head.height + 16) + 'px ">';
            tb = '<table class="table table-bordered" style="width: ' + wr + 'px">' + $(cgr).html();
            th = '<thead>';


            for (var j = 0; j < set.cols.right.length; j++) {
                th += '<tr>';
                if (j == 0) {
                    cs = set.cols.left;
                    for (i = 0; i < cs.length; i++) {
                        col = cs[i];
                        th += '<th ';
                        if (col.visible == null || col.visible()) {

                            if (col.rowspan != null) {
                                th += ' rowspan="' + col.rowspan + '" ';
                            }
                            if (col.colspan != null) {
                                th += ' colspan="' + col.colspan + '" ';
                            }
                            th += ' style="height: ' + (col.height != null ? col.height + 'px' : '') + ';';
                            if (col.style != null) {
                                th += col.style + '; ';
                            }
                            th += '"';
                            var cls = '';
                            if (col.class != null) {
                                cls += col.class;
                            }
                            if (col.sort != null) {
                                th += 'class="' + cls + ' orderable" orderby="' + col.sort + '" currentOrder="desc">';
                            } else {
                                th += 'class="' + cls + '" >';
                            }
                            if (col.title != null) {
                                th += col.title;
                            } else {
                                th += '&nbsp;';
                            }
                            if (col.resize) {
                                th += '<span class="resize-x" i="' + (i + 1) + '"><i class="icon-drag-left-right"></i></span>';
                            }
                            th += "</th>";
                        }
                    }
                }

                cs = set.cols.right[j];
                for (i = 0; i < cs.length; i++) {
                    col = cs[i];
                    th += '<th ';
                    if (col.visible == null || col.visible()) {

                        if (col.rowspan != null) {
                            th += ' rowspan="' + col.rowspan + '" ';
                        }
                        if (col.colspan != null) {
                            th += ' colspan="' + col.colspan + '" ';
                        }
                        th += ' style="height: ' + (col.height != null ? col.height + 'px' : '') + ';';
                        if (col.style != null) {
                            th += col.style + '; ';
                        }
                        th += '"';
                        var cls = '';
                        if (col.class != null) {
                            cls += col.class;
                        }
                        if (col.sort != null) {
                            th += 'class="' + cls + ' orderable" orderby="' + col.sort + '" currentOrder="desc">';
                        } else {
                            th += 'class="' + cls + '" >';
                        }
                        if (col.title != null) {
                            th += col.title;
                        } else {
                            th += '&nbsp;';
                        }
                        if (col.resize) {
                            th += '<span class="resize-x" i="' + (i + 1) + '"><i class="icon-drag-left-right"></i></span>';
                        }
                        th += "</th>";
                    }
                }
                th += '</tr>';
            }

            th += '</thead>';

            tb += th + '</table>';
            area += tb + '</div>';
            $(container).find('.area-tr').append(area);

            // bottom right

            area = '<div>';
            tb = '<table style="width: ' + wr + 'px" class="table table-bordered">' + $(cgr).html();

            var bd = '<tbody>';

            if (set.rows.total != null) {
                tt = '<tr class="tr-total">';
                for (i = 0; i < set.rows.parent.length; i++) {
                    r = set.rows.total[i];
                    tt += pl.drawRow(r);
                }
                tt += '</tr>';
                bd += tt;
            }


            var pr1 = ' <!-- ko foreach : details -->';
            var pr2 = ' <!-- ko foreach : modifies -->';
            var pr = ' <tr class="tr-parent tr-parent-1 " data-bind="visible: childs().length > 0 ">';
            for (i = 0; i < set.rows.parent.length; i++) {
                r = set.rows.parent[i];
                pr += pl.drawRow(r);
            }
            pr += '</tr>';

            pr += '<!-- ko foreach: childs -->';
            pr += '<tr data-bind="visible: expanded() == true && Status() >= 0, css: ' + "'kd_'" + ' + guid()">';
            for (i = 0; i < set.rows.child.length; i++) {
                r = set.rows.child[i];
                if (r.type == 'TrangThaiDeXuat') {
                    if (set.mode == 1 || set.mode == 2) {
                        pr += pl.drawRow(r);
                    }
                } else {
                    pr += pl.drawRow(r);
                }
            }
            pr += '</tr>';
            pr += '<!-- /ko -->';
            pr += '<!-- /ko -->';

            $(container).find('.area-br-1').append(area + tb + bd + pr1 + pr + '</tbody' + '</table></div>');

            $(container).find('.area-br-2').append(area + tb + bd + pr2 + pr + '</tbody' + '</table></div>');
        }

        pl.init = function () {
            if (model.Quarters == null) {
                model.Quarters = [1, 2, 3, 4];
            }
            if (set.mode == 0 && model.Status == 3) {
                if (model.Quarters.length > 0) {
                    if (model.Quarters.length < 4) {
                        var q = model.Quarters[0];
                        model.Status = (q - 1) * 4 + 3;
                    }
                }
            }

            if (typeof perform == 'undefined') {
                perform = '';
            }
            if (typeof isBks == 'undefined') {
                isBks = false;
            }
            if (typeof isAdmin == 'undefined') {
                isAdmin = false;
            }
            if (typeof tab == 'undefined') {
                tab = 'tab1';
            }
            if (tab != 'tab1') {
                if (set.mode == 2) {
                    pl.initModifyViewTable();
                } else {
                    pl.initTable();
                }
                vm = new KpiViewModel();
                ko.applyBindings(vm, $('#applyBinding')[0]);
            } else {
                toolEvents();
            }

        }

        pl.init();
    }
}(jQuery));


function CheckTyLe(v) {
    if (v != null && v != '') {

        v = v.replace(/[^0-9\.]/g, '');
        if (v != '') {
            if ($.isNumeric(v) && v.indexOf('.') != v.length - 1) {
                var decPart = 0;
                var arr = v.split('.');
                if (arr.length == 2) {
                    decPart = arr[1].length;
                }
                v = parseFloat(v).toFixed(decPart);
                if (v > 100) {
                    v = 100;
                }
            }
            v += '%';
        }
        return v;
    }
    return '';
}

function CheckKeHoachX(pp, v) {
    v = v + '';
    if (v != null && v != '') {
        if (pp == 5) { // định dạng ngày\
            if (!isValidDate(v)) {
                v = '';
            }
        } else { //định dạng số 
            v = v.replace(/[^0-9\.]/g, '');

            if (v != '') {
                var arr = v.split('.');
                if (arr.length > 2) {
                    v = arr[0] + '.' + arr[1];
                }

                if (v.indexOf('.') == 0) {
                    v = '0' + v;
                }


                if ($.isNumeric(v) && v.indexOf('.') >= 0) {
                    var decPart = 0;
                    if (arr.length >= 2) {
                        v = parseFloat(arr[0] + '.' + arr[1]);
                        decPart = arr[1].length;
                        if (arr[1].length > 3) {
                            decPart = 3;
                        }
                        if (decPart == 0) {
                            decPart = 1;
                        }
                    }
                    v = parseFloat(v).toFixed(decPart);
                }


            }
        }
    }
    return v;
}

function CheckKeHoachY(pp, v) {
    v = v + '';
    if (v != null && v != '') {
        v = v.replace(/[^0-9\.]/g, '');
        if (v != '') {
            var arr = v.split('.');
            if (arr.length > 2) {
                v = arr[0] + '.' + arr[1];
            }

            if ($.isNumeric(v) && v.indexOf('.') >= 0) {
                if (v.indexOf('.') == 0) {
                    v = '0' + v;
                }
                var decPart = 0;
                if (arr.length >= 2) {
                    v = parseFloat(arr[0] + '.' + arr[1]);
                    decPart = arr[1].length;
                    if (arr[1].length > 3) {
                        decPart = 3;
                    }
                    if (decPart == 0) {
                        decPart = 1;
                    }
                }

                v = parseFloat(v).toFixed(decPart);
            }
        }
    }
    return v;
}

function Round(v) {
    var str = v.toFixed(2);
    if (str.indexOf('.') >= 0) {
        var arr = str.split('.');
        if (arr[1] == '00')
            return arr[0];
    }
    return str;
}

function isValidDate(s) {
    var bits = s.split('/');

    if ($.isNumeric(bits[0]) && $.isNumeric(bits[1]) && $.isNumeric(bits[2]) && bits[2].length == 4) {
        var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
        return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
    }
    return false;
}

function tinhTyLeHoanThanh(phuongPhapDo, x, y, tt) {
    var tl;
    if (tt == '' || tt == null)
        return '';
    switch (phuongPhapDo) {
        case 1:
            {
                x = parseFloat(x);
                y = parseFloat(y);
                if (tt >= x) {
                    return '100%';
                } else {
                    return '0%';
                }
            }
        case 2:
            {
                x = parseFloat(x);
                y = parseFloat(y);
                if (tt <= x) {
                    return '100%';
                } else {
                    return '0%';
                }
            }
        case 3:
            {
                if (x.indexOf('%') >= 0) {
                    x = parseFloat(x.replace('%', ''));
                } else {
                    x = parseFloat(x);
                }
                if (tt.indexOf('%') >= 0) {
                    tt = parseFloat(tt.replace('%', ''));
                } else {
                    tt = parseFloat(tt);
                }
                if (tt >= x) {
                    return '100%';
                } else {
                    var v = tt > 0 ? (tt / x * 100) : 0;
                    return v > 0 ? v.toFixed(2) + '%' : '0%';
                }
            }
        case 4:
            {
                y = parseFloat(y);
                tt = parseInt(tt);
                var r = x - tt;
                if (r > 0) {
                    tl = 100 - (r * y);
                } else {
                    tl = 100;
                }
                return tl + '%';
            }
        case 5:
            {
                if (isValidDate(x) && isValidDate(tt)) {
                    var d1 = moment(x, "DD/MM/YYYY");
                    var d2 = moment(tt, "DD/MM/YYYY");

                    var r = d2.diff(d1, 'days');
                    if (r <= 0)
                        return '100%';

                    while (d2 > d1) {
                        $(holidays).each(function () {
                            var d3 = moment(this.Date);
                            if (d3.diff(d2, 'days') == 0) {
                                r--;
                            }
                        });
                        d2 = d2.subtract(1, 'days');
                    }
                    y = parseFloat(y);
                    tl = 100 - (r * y);
                    if (tl >= 0)
                        return tl + '%';
                    return '0%';
                }
                return '';
            }
        case 7:
            {
                x = parseFloat(x);
                y = parseFloat(y);
                if (tt >= x) {
                    tl = 100;
                } else if (x > tt && tt >= y) {
                    tl = 50;
                } else {
                    tl = 0;
                }
                return tl + '%';
            }
        case 8:
            {
                x = parseFloat(x);
                y = parseFloat(y);

                if (tt >= x) {
                    tl = 100;
                } else if (x > tt && tt >= y) {
                    tl = tt / x * 100;
                    tl = tl.toFixed(2);
                } else {
                    tl = 0;
                }
                return tl + '%';
            }
        case 9:
            {
                x = parseFloat(x);
                y = parseFloat(y);
                if (tt >= x) {
                    tl = 100;
                } else if (x > tt && tt >= y) {
                    tl = tt / x * 50;
                    if (tl < 0) {
                        tl = 0;
                    }
                    tl = tl.toFixed(2);
                } else {
                    tl = 0;
                }
                return tl + '%';
            }
        case 11:
            {
                x = parseFloat(x);
                y = parseFloat(y);
                if (tt <= x) {
                    tl = 100;
                } else if (x < tt && tt <= y) {
                    tl = 50;
                } else {
                    tl = 0;
                }
                return tl.toFixed(2) + '%';
            }
        case 12:
            {
                x = parseFloat(x);
                y = parseFloat(y);
                if (tt <= x) {
                    tl = 100;
                } else if (x < tt && tt <= y) {
                    tl = 100 - ((tt - x) / x * 100);
                    if (tl < 0) {
                        tl = 0;
                    }
                    tl = tl.toFixed(2);
                } else {
                    tl = 0;
                }
                return tl + '%';
            }
        case 13:
            {
                x = parseFloat(x);
                y = parseFloat(y);
                if (tt <= x) {
                    tl = 100;
                } else if (x < tt && tt <= y) {
                    tl = (100 - ((tt - x) / x * 100)) / 2;
                    if (tl < 0) {
                        tl = 0;
                    }
                    tl = tl.toFixed(2);
                } else {
                    tl = 0;
                }
                return tl + '%';
            }
    }
    return null;
};

function tinhTyLeTrongSo(trongso, tlht) {
    if (trongso != null && trongso != '' && tlht != null && tlht != '') {
        var ts = parseFloat(trongso.substr(0, trongso.length - 1));
        var tl = parseFloat(tlht.substr(0, tlht.length - 1));
        var r = tl * ts / 100;
        r = r > 0 ? r.toFixed(2) : '0';
        var str = r + '%';
        return str;
    }
    return '0%';
};

function getGTPT(v) {
    if (v != null && v.indexOf('%') >= 0)
        return parseFloat(v.substr(0, v.length - 1));
    return 0;
}

function confirmKhongDuyet(url, data, callback) {
    var guid = app.newGuid(10);
    swal({
        title: "Không đồng ý duyệt",
        text: '<p>Anh/Chị vui lòng cho biết lý do không đồng ý duyệt</p>' +
            '<textarea id="confirm_' + guid + '" class="form-control" placeHolder="Lý do không đồng ý duyệt"></textarea>',
        html: true,
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonColor: "#ff5722",
        cancelButtonText: "Để sau",
        confirmButtonText: "Hoàn tất",
        showLoaderOnConfirm: true
    }, function (isConfirm) {
        if (!isConfirm) return;

        var cause = $('#confirm_' + guid).val();
        if (cause === "") {
            swal.showInputError("Anh/Chị vui lòng nhập lý do không đồng ý duyệt !");
            return false;
        }
        data.lyDoKhongDuyet = cause;
        app.postData(url,
            data,
            function (result) {
                if (result.Success) {
                    swal({
                        title: "Thao tác thành công",
                        type: 'success'
                    }, function () {
                        if (callback != null) {
                            callback(true);
                        }
                    });
                } else {
                    swal(result.Message, '', "error");

                    if (callback != null) {
                        callback(false);
                    }
                }
            });
    });
}

function confirmDuyet(url, data, callback) {
    var guid = app.newGuid(10);
    swal({
        title: "Đồng ý duyệt",
        text: '<p>Nhập ý kiến của Anh/Chị (nếu có)</p>' +
            '<textarea id="confirm_' + guid + '" class="form-control" placeHolder="Nhập ý kiến của Anh/Chị (nếu có)"></textarea>',
        html: true,
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonColor: "#009688",
        cancelButtonText: "Để sau",
        confirmButtonText: "Duyệt",
        showLoaderOnConfirm: true
    },
        function (isConfirm) {
            if (!isConfirm) return;

            var yk = $('#confirm_' + guid).val();
            data.yKien = yk;

            app.postData(url, data,
                function (result) {
                    if (result.Success) {
                        swal({
                            title: "Duyệt thành công",
                            type: 'success'
                        }, function () {
                            if (callback != null) {
                                callback(true);
                            }
                        });
                    } else {
                        swal(result.Message, '', "error");
                        if (callback != null) {
                            callback(false);
                        }
                    }
                });
        });
}

function confirmCapNhat(url, text, data, callback) {
    swal({
        title: "Anh/Chị chắc chắn ?",
        html: true,
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonColor: "#ff8a65",
        cancelButtonText: "Để sau",
        confirmButtonText: "Đề xuất cập nhật",
        showLoaderOnConfirm: true
    },
        function (isConfirm) {
            if (!isConfirm) return;
            app.postData(url, data,
                function (result) {
                    if (result.Success) {
                        if (callback != null) {
                            callback(true);
                        }
                    } else {
                        swal(result.Message, '', "error");
                        if (callback != null) {
                            callback(false);
                        }
                    }
                });
        });
}

function eventsKpiTable() {
    $('.resize-x').draggable({
        axis: "x",
        start: function (event, ui) {
            var tempPosition = ui.position.left;
        },
        stop: function (event, ui) {
            var w = ui.position.left;
            var ele = $(event.target);
            var area = $(ele).closest('.area');
            if (w < 10) {
                w = 10;
                $(ele).css('left', 10);
            }
            var i = ele.attr('i');
            $('.kpi-col[i="' + i + '"]').css('width', w + 10);

            if ($(area).hasClass('area-tl')) {
                var tw = 0;
                var cols = $(ele).closest('table').find('colgroup col');
                $(cols).each(function () {
                    tw += $(this).width();
                });
                tw = parseInt(tw);
                $('.area-tl').css('width', tw);
                $('.area-bl').css('width', tw);
                $('.area-tl > div').css('width', tw);
                $('.area-bl > div').css('width', tw + 17);
                $('.area-tl > div > table').css('width', tw);
                $('.area-bl > div > table').css('width', tw);

                $('.buffer-bl').css('width', tw);

                $('.area-tr').css('left', tw);
                $('.area-br').css('left', tw);
            }
        }
    });

    window.addEventListener('touchstart',
        function (e) {
            tounchTr = $(e.target).closest('.area');
        });

    $('.kpi-table').find(' .area').mouseover(function () {
        tounchTr = $(this);
    });

    $('.area-br > div').scroll(function () {
        if ($(tounchTr).length == 0 || $(tounchTr).hasClass('area-br')) {
            var tb = $(this).closest('.kpi-table');
            var t = $(this).scrollTop();
            var l = $(this).scrollLeft();
            $(tb).find('.area-tr > div').scrollLeft(l);
            $(tb).find('.area-bl > div').scrollTop(t);
        }
    });
    $('.area-bl > div').scroll(function () {
        if ($(tounchTr).length == 0 || $(tounchTr).hasClass('area-bl')) {
            var tb = $(this).closest('.kpi-table');
            var t = $(this).scrollTop();
            $(tb).find('.area-br > div').scrollTop(t);
        }
    });
}

function xepLoaiKPI(tlht) {
    if (app.hasValue(tlht)) {
        var gt = getGTPT(tlht);
        if (gt >= 95)
            return 'A+';
        if (gt >= 90)
            return 'A';
        if (gt >= 85)
            return 'B+';
        if (gt >= 80)
            return 'B';
        if (gt >= 75)
            return 'C+';
        if (gt >= 70)
            return 'C';
        return 'D';
    }
    return '';
}

function uploadDinhKem(input, callback) {
    var u = $(input).closest('.uploader');
    var i = u.find('.btn i');
    i.removeClass('icon-file-plus').addClass('icon-spinner4 fa-spin ');
    var files = input.files;
    if (kpiUploader == null || typeof kpiUploader == 'undefined') {
        kpiUploader = new FileUploader();
    }

    kpiUploader.upload(files,
        ['jpg', 'jpeg', 'png', 'gif', 'txt', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx'],
        function (fs) {
            i.removeClass('icon-spinner4 fa-spin').addClass('icon-file-plus');
            if (fs.length > 0 && fs[0] != null) {
                callback(fs);
            } else {
                app.notify('warning', 'Định dạng file không hợp lệ. </br> Định dạng cho phép: txt, pdf, xls, xlsx, doc, docx, ppt, pptx');
                callback([]);
            }
        });
}

function initPhuongPhapDoModal(obj, callback) {
    var im = '#edit_muctieu_modal';
    if ($(im).length == 0) {
        app.loadData(DOMAIN_API + '/kpi/PhuongPhapDoView',
            {
                dataType: 'html'
            }, null, function (html) {
                $('body').append(html);
                $(im).modal('show');
                initPhuongPhapDoForm(obj, callback);
            });
    } else {
        $(im).modal('show');
        initPhuongPhapDoForm(obj, callback);
    }
}

function tinhTyLeHoanThanhNam(obj, quy) {
    var v1;
    var khn = obj.X;
    var tl = 0;
    if (obj.NguyenTacTinh == 2) { //cộng dồn
        //debugger; 
        var ts1 = getGTPT(obj.Quy1_TrongSo);
        var ts2 = getGTPT(obj.Quy2_TrongSo);
        var ts3 = getGTPT(obj.Quy3_TrongSo);
        var ts4 = getGTPT(obj.Quy4_TrongSo);
        var d1, r, y;

        if (obj.PhuongPhapDo == 5) {
            if (isValidDate(obj.X)) {
                d1 = moment(khn, "DD/MM/YYYY");
                if (ts4 > 0 && d1.month() >= 9 && isValidDate(obj.Quy4_ThucHien)) {
                    r = dateRange(d1, moment(obj.Quy4_ThucHien, "DD/MM/YYYY"));
                } else if (ts3 > 0 && d1.month() >= 6 && isValidDate(obj.Quy3_ThucHien)) {
                    r = dateRange(d1, moment(obj.Quy3_ThucHien, "DD/MM/YYYY"));
                } else if (ts2 > 0 && d1.month() >= 3 && isValidDate(obj.Quy2_ThucHien)) {
                    r = dateRange(d1, moment(obj.Quy2_ThucHien, "DD/MM/YYYY"));
                } else if (ts1 > 0 && isValidDate(obj.Quy1_ThucHien)) {
                    r = dateRange(d1, moment(obj.Quy1_ThucHien, "DD/MM/YYYY"));
                }
                if (r != null) {
                    y = parseFloat(obj.Y);
                    tl = 100 - (r * y);
                }
            }
        } else {
            v1 = (app.hasValue(obj.Quy1_ThucHien) ? parseFloat(obj.Quy1_ThucHien) : 0) +
                (app.hasValue(obj.Quy2_ThucHien) ? parseFloat(obj.Quy2_ThucHien) : 0) +
                (app.hasValue(obj.Quy3_ThucHien) ? parseFloat(obj.Quy3_ThucHien) : 0) +
                (app.hasValue(obj.Quy4_ThucHien) ? parseFloat(obj.Quy4_ThucHien) : 0);

            tl = app.hasValue(obj.Nam_KeHoach) ? v1 / obj.Nam_KeHoach * 100 : 0;
        }
    } else {
        v1 = (app.hasValue(obj.Quy1_TyLeHoanThanh) ? getGTPT(obj.Quy1_TyLeHoanThanh) : 0);
        if (quy >= 2) {
            v1 += (app.hasValue(obj.Quy2_TyLeHoanThanh) ? getGTPT(obj.Quy2_TyLeHoanThanh) : 0);
        }
        if (quy >= 3) {
            v1 += (app.hasValue(obj.Quy3_TyLeHoanThanh) ? getGTPT(obj.Quy3_TyLeHoanThanh) : 0);
        }
        if (quy == 4) {
            v1 += (app.hasValue(obj.Quy4_TyLeHoanThanh) ? getGTPT(obj.Quy4_TyLeHoanThanh) : 0);
        }

        tl = v1 / 4;
    }

    if (tl > 100) {
        tl = 100;
    }

    return tl;
}

function tinhTyLeNamSoHienTai(obj, quy) {
    var v1, v2;
    var khn = obj.X;
    var tl = 0;
    if (obj.NguyenTacTinh == 2) { //cộng dồn
        //debugger; 
        var ts1 = getGTPT(obj.Quy1_TrongSo);
        var ts2 = getGTPT(obj.Quy2_TrongSo);
        var ts3 = getGTPT(obj.Quy3_TrongSo);
        var ts4 = getGTPT(obj.Quy4_TrongSo);
        var d1, r, y;
        if (obj.PhuongPhapDo == 5) {
            if (isValidDate(obj.X)) {
                d1 = moment(khn, "DD/MM/YYYY");
                if (ts4 > 0 && d1.month() >= 9 && isValidDate(obj.Quy4_ThucHien)) {
                    r = dateRange(d1, moment(obj.Quy4_ThucHien, "DD/MM/YYYY"));
                } else if (ts3 > 0 && d1.month() >= 6 && isValidDate(obj.Quy3_ThucHien)) {
                    r = dateRange(d1, moment(obj.Quy3_ThucHien, "DD/MM/YYYY"));
                } else if (ts2 > 0 && d1.month() >= 3 && isValidDate(obj.Quy2_ThucHien)) {
                    r = dateRange(d1, moment(obj.Quy2_ThucHien, "DD/MM/YYYY"));
                } else if (ts1 > 0 && isValidDate(obj.Quy1_ThucHien)) {
                    r = dateRange(d1, moment(obj.Quy1_ThucHien, "DD/MM/YYYY"));
                }
                if (r != null) {
                    y = parseFloat(obj.Y);
                    tl = 100 - (r * y);
                }
            }
        } else {
            v1 = (app.hasValue(obj.Quy1_ThucHien) ? parseFloat(obj.Quy1_ThucHien) : 0) +
                (app.hasValue(obj.Quy2_ThucHien) ? parseFloat(obj.Quy2_ThucHien) : 0) +
                (app.hasValue(obj.Quy3_ThucHien) ? parseFloat(obj.Quy3_ThucHien) : 0) +
                (app.hasValue(obj.Quy4_ThucHien) ? parseFloat(obj.Quy4_ThucHien) : 0);
            v2 = (app.hasValue(obj.Quy1_KeHoach_X) ? parseFloat(obj.Quy1_KeHoach_X) : 0) +
                (app.hasValue(obj.Quy2_KeHoach_X) ? parseFloat(obj.Quy2_KeHoach_X) : 0) +
                (app.hasValue(obj.Quy3_KeHoach_X) ? parseFloat(obj.Quy3_KeHoach_X) : 0) +
                (app.hasValue(obj.Quy4_KeHoach_X) ? parseFloat(obj.Quy4_KeHoach_X) : 0);

            tl = v2 > 0 ? v1 / v2 * 100 : 0;
        }
    } else {
        v1 = (app.hasValue(obj.Quy1_TyLeHoanThanh) ? getGTPT(obj.Quy1_TyLeHoanThanh) : 0);
        if (quy >= 2) {
            v1 += (app.hasValue(obj.Quy2_TyLeHoanThanh) ? getGTPT(obj.Quy2_TyLeHoanThanh) : 0);
        }
        if (quy >= 3) {
            v1 += (app.hasValue(obj.Quy3_TyLeHoanThanh) ? getGTPT(obj.Quy3_TyLeHoanThanh) : 0);
        }
        if (quy == 4) {
            v1 += (app.hasValue(obj.Quy4_TyLeHoanThanh) ? getGTPT(obj.Quy4_TyLeHoanThanh) : 0);
        }

        tl = v1 / quy;

    }

    if (tl > 100) {
        tl = 100;
    }

    return tl;
}


ko.bindingHandlers.draggable = {
    init: function (element, valueAccessor, allBindingsAccessor, vieModel, bindingContext) {
        var value = valueAccessor();
        $(element).draggable({
            axis: "y",
            start: function (event, ui) {
            },
            stop: function (event, ui) {
                var t = ui.position.top;
                t = parseInt(t);
                if (t < 45) {
                    t = 45;
                }
                value.RowHeight(t);
                var ele = $(event.target);
                var cls = $(ele).closest('tr').attr('class');
                $('.' + cls + ' td textarea').css('height', (t - 1) + 'px');
                $('.' + cls + ' td .resize-height').css('height', (t - 1) + 'px');
                $('.' + cls + ' > td').css('height', t + 'px');
                $(ele).css('top', 'unset');
            }
        });
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
    }
};

ko.bindingHandlers.readonly = {
    update: function (element, valueAccessor) {
        if (valueAccessor()) {
            $(element).attr("readonly", "readonly");
            $(element).addClass("disabled");
        } else {
            $(element).removeAttr("readonly");
            $(element).removeClass("disabled");
        }
    }
};
