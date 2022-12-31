
var _defaultOrgWidth = 340;
var hasStopped = false;

function setOrgProp(s, obj) {
	s.Id = ko.observable(obj.Id);
	s.Code = ko.observable(obj.Code);
	s.DirectManager = ko.observable(obj.DirectManager);
	s.Name = ko.observable(obj.Name);
	s.OrgLevelId = ko.observable(obj.OrgLevelId);
	s.OrgLevel = ko.observable(obj.OrgLevel);
	s.ParentId = ko.observable(obj.ParentId);
	s.ParentStr = ko.observable(obj.ParentStr);
	s.Positions = ko.observable(obj.Positions);
	s.Stopped = ko.observable(obj.Stopped);
	s.Type = ko.observable(obj.Type); 
}
function setOrgDefault(s) {
	s.Id = ko.observable(0);
	s.Code = ko.observable('');
	s.DirectManager = ko.observable('');
	s.Name = ko.observable('');
	s.OrgLevelId = ko.observable(null);
	s.OrgLevel = ko.observable({
		MoRong1: ''
	});
	s.ParentId = ko.observable(null);
	s.ParentStr = ko.observable('');
	s.Positions = ko.observable(null);
	s.Stopped = ko.observable(false);
	s.Type = ko.observable(0); 
} 

var HorLine = function () {
    var s = this;
    s.width = ko.observable(0);
    s.left = ko.observable(0);
};
var VerLine = function () {
    var s = this;
    s.height = ko.observable(0);
    s.left = ko.observable(0);
};
var OrgEmployee = function (obj) {
    var s = this;
    if (obj != null) {
        s.Id = ko.observable(obj.Id);
        s.FullName = ko.observable(obj.FullName);
        s.Avatar = ko.observable(obj.Avatar);
        s.MainOrg = ko.observable(obj.MainOrg);
    } else {
        s.Id = ko.observable(null);
        s.FullName = ko.observable('');
        s.Avatar = ko.observable('');
        s.MainOrg = ko.observable(null);
    }
    s.JobPositionName = ko.observable('');
    s.real = ko.computed(function () {
        var n = '';
        if (s.MainOrg() != null && s.MainOrg().ObjJobPosition != null) {
            n = s.MainOrg().ObjJobPosition.Name;
        }
        s.JobPositionName(n);
    });
};
var ParentOrg = function (obj) {
    var s = this; 
    if (obj != null) {
	    setOrgProp(s, ko.toJS(obj)); 
        s.Owner = ko.observable(obj.Owner());
        s.totalChilds = ko.observable(0);
        s.level = ko.observable(1);
    }
    else {
	    setOrgDefault(s);
        s.Owner = ko.observable(new OrgEmployee(null));
        s.totalChilds = ko.observable(0);
        s.level = ko.observable(0);
    } 
    s.isShowChild = ko.observable(true);
    s.active = ko.observable(false);
    s.top = ko.observable(0);
    s.left = ko.observable(0);
    s.focus = ko.observable(false); 
    s.orgClass = ko.pureComputed(function () {
        var c = 'panel panel-body no-padding ' + s.OrgLevel().MoRong1;
        return c;
    }, s); 
};
var Org = function (obj, parent) {
    var s = this;
    s.childs = ko.observableArray([]);
    if (obj != null) {
        setOrgProp(s, obj); 
        s.Owner = ko.observable(new OrgEmployee(obj.Owner));
        s.level = ko.observable((parent != null ? parent.level() : 0) + 1);
    } else {
	    setOrgDefault(s);
        s.Owner = ko.observable(new OrgEmployee(null));
        s.level = ko.observable(1);
    }

    s.parent = ko.observable(new ParentOrg(parent));
    s.isShowChild = ko.observable(true);
    s.active = ko.observable(false);
    s.focus = ko.observable(false);
    s.top = ko.observable(0);
    s.left = ko.observable(0);
    s.height = ko.observable(100);
    s.horLine = ko.observable(new HorLine());
    s.verLine = ko.observable(new VerLine());
    s.orgClass = ko.pureComputed(function () {
        var c = 'panel panel-body no-padding ' + s.OrgLevel().MoRong1;
        return c;
    }, s);
    s.coverWidth = ko.observable(0);
    s.coverPos = ko.observable(0);
    s.loadEmpState = ko.observable(0);
    s.employees = ko.observableArray([]);
    s.empCount = ko.observable(0);
    s.showEmp = ko.observable(false);
    
    if (obj != null && obj.Childs != null) { 
        $.each(obj.Childs, function () {
            s.childs.push(new Org(this, s));
        });
    }
};
var OrgChartViewModel = function () {
    var s = this;
    s.tree = ko.observableArray([]);
    s.isInitOrg = ko.observable(false);
    s.activeOrg = ko.observable(new Org(null, null));
    s.focusOrg = ko.observable(new Org(null, null));
    s.computeChildPosition = function (obj) {
         
        var aw = 0;
        //compute width
        $.each(obj.childs(), function () {
            var w = s.computeCoverWidth(this);
            aw += w;
        });
        obj.coverWidth(aw);
        //compute left
        $.each(obj.childs(), function (o, i) {

            s.computeLeft(this, o, obj);
        });
    };
    s.computeCoverWidth = function (obj) {
        var w = 0;
        if (obj.childs().length > 0) {
            $.each(obj.childs(), function () {
                if (this.level() > 3) {
                    w = _defaultOrgWidth;
                    this.coverWidth(_defaultOrgWidth);
                } else {
                    w += s.computeCoverWidth(this);
                }
            });
            obj.coverWidth(w);
        } else {
            obj.coverWidth(_defaultOrgWidth);
            w = _defaultOrgWidth;
        }
        return w;
    };
    s.computeLeft = function (obj, i, parent) {
        var w = $('.org-chart-container').width();
        var h = parent.coverWidth() / 2;
        var cp, l, rp;
        // left
        if (parent.childs().length == 1) { 
            if (obj.level() <= 4) {
                obj.left(parent.left());
            } else {
                l = parent.left() + 37;
                obj.left(l);
            }
        } else {

            if (obj.level() <= 3) { 
                if (i == 0) {
                    if (obj.coverWidth() == _defaultOrgWidth) {
                        if (parent.coverWidth() < w) {
                            cp = (w - parent.coverWidth()) / 2;
                        } else {
                            if (app.hasValue(parent.coverPos())) {
                                cp = parent.coverPos();
                            } else {
                                cp = 15;
                            }
                        }
                    } else {
                        cp = parent.coverPos() + 170 - h;
                    }
                    if (cp < 0) {
                        cp = 15;
                    }
                    l = cp + (obj.coverWidth() / 2 - 170);

                } else {
                    var c = parent.childs()[i - 1].coverPos() + parent.childs()[i - 1].coverWidth();
                    cp = c;
                    if (obj.coverWidth() == _defaultOrgWidth) {
                        l = c;
                    } else {

                        l = c + (obj.coverWidth() / 2 - 170);

                    }
                }

            } else if (obj.level() == 4) {
                l = parent.left();
            } else if (obj.level() == 5) {
                l = parent.left() + 37;
            } else {
                l = parent.left() + 74;
            }

            if (l < 0) {
                l = l + _defaultOrgWidth;
                cp = cp + _defaultOrgWidth;
            }

            obj.left(l);
            obj.coverPos(cp);


        }
        // line 
        if (obj.level() < 4) {
            var lw;
            if (obj.left() == parent.left()) {
                lw = 0;
                obj.horLine().left(0);
            } else if (obj.left() < parent.left()) {
                lw = parent.left() - obj.left();
                obj.horLine().left(0);
            } else {
                lw = obj.left() - parent.left();
                obj.horLine().left(-lw);
            }
            obj.horLine().width(lw);
        } else {
            var lh;
            if (i == 0) {

                if (obj.level() == 4) {

                    lh = 127;
                } else {
                    lh = 50;
                }
            } else {

                rp = parent.childs()[i - 1];
                lh = 127;
                if (rp.isShowChild()) {
                    lh += rp.childs().length * 110;
                }

            }

            obj.verLine().height(lh);
        }
        // top
        if (obj.level() < 4) {
            obj.top(parent.top() + 127);
        } else if (obj.level() == 4) {
            if (i == 0) {
                obj.top(parent.top() + 127);
            } else {
                rp = parent.childs()[i - 1];
                var t = rp.top() + 127;
                if (rp.childs().length > 0) {
                    if (rp.isShowChild()) {
                        t += rp.childs().length * 110;
                    }
                }
                obj.top(t);
            }
        } else {
            if (i == 0) {
                obj.top(parent.top() + 110);
            } else {
                var t = parent.childs()[i - 1].top() + 110;
                obj.top(t);
            }
        }

        $.each(obj.childs(), function (o, i) {
            s.computeLeft(this, o, obj);
        });
    };
    s.computedPos = function (obj, oi, p) {
        var l = 0, t = 0;
        if (p.childs().length > 1) {
            if (obj.level() <= 4) {
                var defaultL = 0;
                var leftItems = 0;
                var firstItemLeft = 0;
                var even;
                if (p.childs().length % 2 == 0) {
                    leftItems = p.childs().length / 2;
                    even = true;
                } else {
                    leftItems = Math.floor(p.childs().length / 2);
                    even = false;
                }
                firstItemLeft = p.left() - (leftItems * _defaultOrgWidth) - 156;
                if (oi == leftItems) {
                    if (even) {
                        defaultL = p.left() - 125;
                        obj.horLine().width(125);
                    } else {
                        defaultL = p.left();
                        obj.horLine().width(0);
                    }
                } else {
                    defaultL = p.left() - ((leftItems - oi) * _defaultOrgWidth) - 125;
                    obj.horLine().width(_defaultOrgWidth);
                }

                if (firstItemLeft < 0) {
                    var a = defaultL - firstItemLeft;
                    defaultL = a;
                }
                t = p.top() + 127;
                l = defaultL;
            }
            else {
                if (obj.level() == 5 || obj.level() == 6) {
                    l = p.left() + 5;
                    var h = 127;
                    if (oi > 0) {
                        t = p.childs()[oi - 1].top() + 127;
                        if (p.childs()[oi - 1].isShowChild()) {
                            if (p.childs()[oi - 1].childs().length > 0) {
                                h += p.childs()[oi - 1].childs().length * 110;
                                t += p.childs()[oi - 1].childs().length * 110;
                            }
                        }
                    } else {
                        t = p.top() + (oi * 127) + 127;
                    }
                    obj.verLine().height(h);
                } else {
                    if (oi == 0) {
                        obj.verLine().height(68);
                    } else {
                        obj.verLine().height(127);
                    }

                    t = p.top() + (oi * 110) + 110;
                    l = p.left() + 40;
                }
            }
        } else {
            if (obj.level() <= 3) {
                t = p.top() + 127;
                l = p.left();
            } else {
                if (obj.level() == 5 || obj.level() == 6) {
                    l = p.left() + 5;
                    obj.verLine().height(127);
                } else {
                    l = p.left() + 30;
                    if (oi == 0) {
                        obj.verLine().height(68);
                    } else {
                        obj.verLine().height(127);
                    }
                }

                t = p.top() + (oi * 127) + 127;
            }
        }

        obj.left(l);
        obj.top(t);

        if (l <= p.left()) {
            obj.horLine().left(0);
        } else {
            obj.horLine().left(-_defaultOrgWidth);
        }
        $.each(obj.childs(), function (o, i) {
            s.computedPos(this, o, obj);
        });
    };
    s.updateLevel = function (obj) {
        $.each(obj.childs(), function (o, i) {
            this.level(obj.level() + 1);
            s.updateLevel(this); 
        });
    };
    s.empList = ko.observableArray([]);
    s.real = ko.computed(function () {
        var w = $('.org-chart-container').width();
        var l = w / 2;
        if (s.activeOrg().parent().Id() > 0) {
            s.activeOrg().top(142);
            s.activeOrg().level(2);

            s.activeOrg().parent().level(1);
            s.activeOrg().parent().left(l - 170);
        } else {
            s.activeOrg().top(15);
            s.activeOrg().level(1);
        }
        s.activeOrg().coverPos(0);
        l -= 170;
        s.activeOrg().left(l);
        s.activeOrg().horLine().width(0);
        s.updateLevel(s.activeOrg());
        s.computeChildPosition(s.activeOrg());

        if (s.isInitOrg()) {
            s.computeEmps(s.activeOrg());
        }
    });

    s.loadEmps = function (org) {
        org.loadEmpState(1); 
        app.loadData('/employee/suggestionList',
            {
                limit: 5,
                organizationId: org.Id(),
                TrangThaiCongViec: 1,
                NotId: org.Owner().Id(),
                hasCount: true
            },
            null,
            function (result) {
              
                org.loadEmpState(2);
                if (result.Count > 0) {
                    if (org.Owner().Id() == null) {
                        org.empCount(result.Count - 1);
                    } else {
                        org.empCount(result.Count);
                    }
                } 
                $(result.Many).each(function () {
                    var e = this;
                    if (e.Id != org.Owner().Id()) {
                        var emp = new OrgEmployee(this);
                        org.employees.push(emp);
                    }
                });
                if (result.Count > 0) {
                    org.height(200);
                } else {
                    org.height(100);
                }
            });
    };

    s.computeEmps = function (obj) { 
        if (obj.level() <= 3) {
            obj.showEmp(true);
            if (obj.childs().length == 0) {
                if (obj.loadEmpState() == 0) {
                    s.loadEmps(obj);
                } else {
                    if (obj.employees().length > 0) {
                        obj.height(200);
                    } else {
                        obj.height(100);
                    }
                }
            } else {
                $(obj.childs()).each(function () {
                    s.computeEmps(this);
                });
            }
        } else {
            obj.showEmp(false);
            obj.height(100);
            if (obj.childs().length > 0) {
                $(obj.childs()).each(function () {
                    s.computeEmps(this);
                });
            }
        }
    };

    s.focusOrgItem = function (obj, e) {
        var href;
        if (e.target.localName == 'a') {
            href = $(e.target).attr('href');
            if (href != '#') {
                window.open(href, '_blank');
                return false;
            }
        } else if ($(e.target).hasClass('img-xs')) {
            href = $(e.target).closest('a').attr('href');
            window.open(href, '_blank');
            return false;
        }
        s.focusOrg().focus(false);
        s.focusOrg(obj);
        s.focusOrg().focus(true);
    };
    s.selectTreeChild = function (obj) {
        s.activeOrg().active(false);
        s.activeOrg(obj);
        s.activeOrg().active(true);
        s.activeOrg().horLine().width(0);

        if (typeof ko.unwrap(s.activeOrg.parent) !== 'undefined') {
            s.activeOrg().parent().width(0);
        }

    };
    s.selectParentOrg = function (id) {
        var p = s.findParentOrg(s.tree(), id);
        if (p != null) {
            s.activeOrg().active(false);
            s.activeOrg(p);
            s.activeOrg().active(true);
        }
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
        if (obj.level() == 4) {
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
                            //pOrg.childs()[i].top(t);
                            //pOrg.childs()[i].verLine().height(h);
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
    s.resize = function () {
        var wh = $(window).height();
        var ww = $(window).width();
        $('.org-tree').css('height', wh - 215);
        $('.org-chart-container').css('height', wh - 150);

    };
    s.loadData = function (id) {
        $('.tree-container .overlay').css('display', 'block');
        s.isInitOrg(false);
        app.loadData(DOMAIN_API + '/general/OrganizationsForChart',
            {
                unlimited: true,
                hasOwner: true,
                hasStopped: hasStopped
            },
            null,
            function (result) {
                $('.tree-container .overlay').css('display', 'none');
                s.activeOrg(new Org(null, null));
                if (s.tree().length > 0) {
                    s.tree.removeAll();
                };

                s.tree.push(new Org(result, null));

                if (s.tree().length > 0) {
                    var org;
                    if (id != null) {
                        org = s.findOrgById(s.tree(), id);
                        if (org != null) {
                            s.activeOrg(org);
                            s.activeOrg().active(true);
                        } else {
                            org = s.tree()[0];
                        }
                    } else {
                        org = s.tree()[0];
                    }

                    org.active(true);
                    s.activeOrg(org);
                }
                s.isInitOrg(true);
                s.events();
            });
    };

    s.viewMoreEmp = function (obj) {
        var m = '#emp_modal';
        $(m + ' .modal-title span').text(obj.Name());
        obj.loadEmpState(1);
        $(m).modal('show');
        app.loadData('/employee/suggestions',
            {
                unlimited: true,
                hasOrg: true,
                organizationId: obj.Id(),
                TrangThaiCongViec: 1
            },
            null,
            function (result) {
                obj.loadEmpState(2);
                s.empList.removeAll();
                $(result).each(function () {
                    s.empList.push(new OrgEmployee(this));
                });
            });
    };
    s.events = function () {
        s.resize();

        $(window).resize(function () {
            s.resize();
        });

        $('#btn_add_org').unbind().click(function () {
            var btn = $(this);
            btn.button('loading');

            var md = 'OrgEditModal';

            if ($('#' + md).length == 0) {
                app.createEmptyModal({
                    title: 'Khởi tạo đơn vị mới',
                    width: 1000,
                    id: md,
                    headerClass: 'bg-primary',
                    model: 'Organization'
                });
            }

            app.loadData('/general/organizationedit',
                {
                    dataType: 'html'
                },
                null,
                function (html) {
                    btn.button('reset');
                    $('#' + md + ' .modal-body').html(html);
                    $('#' + md).modal('show');
                    initOrganizationForm(function (data) {
                        var parent = s.findParentOrg(s.tree(), data.ParentId);

                        if (parent != null) {

                            parent.childs.push(new Org(data, parent));
                        } else {
                            s.tree.push(new Org(data, null));
                        }
                        if (s.activeOrg().Id() == 0) {
                            s.activeOrg(s.tree()[0]);
                        }
                    });
                });
        });
        $('#btn_edit_org').unbind().click(function () {
            var btn = $(this);
            var md = 'OrgEditModal';
            if ($('#' + md).length == 0) {
                app.createEmptyModal({
                    title: 'Cập nhật đơn vị',
                    width: 1000,
                    id: md,
                    headerClass: 'bg-primary',
                    model: 'Organization'
                });
            }
            btn.button('loading');
            app.loadData('/general/organizationedit',
                {
                    dataType: 'html',
                    id: s.activeOrg().Id()
                },
                null,
                function (html) {
                    btn.button('reset');
                    $('#' + md + ' .modal-body').html(html);
                    $('#' + md).modal('show');
                    initOrganizationForm(function (data) {
                        if (data.Id == s.activeOrg().Id()) {
                            s.loadData(s.activeOrg().Id());
                        } else {
                            var parent = s.findParentOrg(s.tree(), data.ParentId);
                            if (parent != null) {
                                parent.childs.push(new Org(data, parent));
                            } else {
                                s.tree.push(new Org(data, null));
                            }
                            if (s.activeOrg().Id() == 0) {
                                s.activeOrg(s.tree()[0]);
                            }
                        }
                    });
                });
        });
        $('#btn_delete_org').unbind().click(function () {
            var btn = $(this);
            app.confirm('warning',
                'Bạn chắc chắn muốn xóa đơn vị này ?',
                'Lưu ý: Sau khi xóa, tất cả đơn vị cấp con (nếu có) sẽ bị xóa theo.',
                function () {
                    app.postData('/general/DeleteOrganizationByIds',
                        {
                            ids: [s.activeOrg().Id()]
                        },
                        function (result) {
                            s.loadData();
                        });
                });
        });
        $('#btn_export_org').unbind().click(function () {
            window.open('/general/ExportOrgChart?id=' + s.activeOrg().Id(), '_blank');
        });


    };
    s.init = function () {

        s.loadData();

    };
    s.init();
};

$(document).ready(function () {
    var vm = new OrgChartViewModel();
    ko.applyBindings(vm, $('#applyBinding')[0]);
    $('#checkbox_stopped').change(function () {
        var c = $(this).is(":checked");
        if (c) {
            hasStopped = true;

        } else {
            hasStopped = false;
        }
        vm.loadData();
    });
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

ko.bindingHandlers.singleClick = {
    init: function (element, valueAccessor) {
        var handler = valueAccessor(),
            delay = 200,
            clickTimeout = false;

        $(element).click(function () {
            if (clickTimeout !== false) {
                clearTimeout(clickTimeout);
                clickTimeout = false;
            } else {
                clickTimeout = setTimeout(function () {
                    clickTimeout = false;
                    handler();
                }, delay);
            }
        });
    }
};
