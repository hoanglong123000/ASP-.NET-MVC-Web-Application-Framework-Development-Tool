
(function ($) {
    $.fn.salaryGrid = function (options) {
        var s = this;
        var sel = this.selector;
        var currentPage = 0;
        s.searchParams = {
            keyword: "",
            limit: null
        };
        s.editParams = {
        };
        s.sourceData = [];
        s.viewData = [];
        s.count = 0;
        s.rowIndex = 0;
        s.sequentially = {
            number: 20,
            total: 0,
            first: false,
            done: false,
            loading: false,
            loaded: 0
        }

        s.formId = '';
        s.sumarray = [];
        s.tounchTr = null;
        s.moveObjectId = null;
        s.colRight;
        s.searching;
        s.initData = false;
        s.hr;
        s.editLoader = '.salary-grid-edit-loader';
        s.clickSubContextMenu = false;
        // Establish our default settings
        var set = $.extend({
            tableSize: null,
            lazy: null,
            rootUrl: null,
            dataUrl: null,
            params: null,
            autoLoad: null,
            width: null,
            height: null,
            selectRow: null,
            toolbars: null,
            idAttribute: null,
            rows: [],
            cols: null,
            editController: null,
            model: "",
            filterable: false,
            checkAll: null,
            beforeSubmit: null,
            detailRow: null,
            childs: null,
            modal: null,
            contextMenu: null,
            skipCols: 0,
            loadDataCallback: null,
            loadModalCallback: null,
            selectRowCallback: null,
            submitFormCallback: null,
            sumInfo: null,
            beforeSearch: null,
            hideable: false
        },
            options);
        s.set = set;

        s.filter = {
            attrs: []
        };

        if (set.params != null) {
            if (typeof set.params.search != 'undefined') {
                $.extend(s.searchParams, set.params.search);
            }
            if (typeof set.params.edit != 'undefined') {
                $.extend(s.editParams, set.params.edit);
            }
        }
        s.showTableLoading = function () {
            var tb = $(sel).find('.main-content');
            if ($(tb).find('.loading').length == 0) {
                $(tb).append(app.loading());
            }
            $(sel).find(".loading").show();
        }
        s.hideTableLoading = function () {
            $(sel).find(".loading").hide();
        }
        s.drawCheckbox = function (id) {
            return '<td class="first-col" style="width: 40px"><div class="checkbox checkbox-info">' +
                '<input type="checkbox"  class="styled check-item" value="" dataId="' +
                id +
                '"/><label></label></div></td>';
        }
        s.drawExpandNode = function (level, totalChild) {
            var n = '<span class="expand-child position-left level-' + level + '" level="' + level + '" >';
            if (totalChild > 0) {
                n += '<i class="icon-arrow-right13"></i>';
            } else {
                n += '';
            }
            n += '</span>';
            return n;
        };
        s.setTdData = function (item, cell, i, stt) {
            var td = '<td attr="' + cell.attribute + '" ci="' + i + '"';
            var cls = '', txt = '';
            if (cell.class != null) {
                if ($.isFunction(cell.class)) {
                    cls += ' ' + cell.class(item) + ' ';
                } else {
                    cls += ' ' + cell.class + ' ';
                }
            }
            if (cell.editInline) {
                cls += ' edit-inline ';
            }
            td += ' class="' + cls + '"';
            td += ' style="height: ' + s.hr + 'px; ';
            var sty = '';

            if (cell.style != null) {
                if ($.isFunction(cell.style)) {
                    sty += ' ' + cell.style(item) + ' ';
                } else {
                    sty += cell.style;
                }
            }
            td += sty + '"';

            if (cell.colspan != null) {
                if (cell.colspan.if(item)) {
                    td += ' colspan="' + cell.colspan.value + '" ';
                }
            }

            switch (cell.type) {
                case "text":
                    {
                        if (cell.sumable) {
                            if (typeof s.sumarray[i] == "undefined") {
                                s.sumarray[i] = 0;
                            }
                        } else {
                            s.sumarray[i] = null;
                        }

                        td += '>';
                        if (cell.expandChild != null) {
                            td += s.drawExpandNode(level, item.TotalChild);
                        }
                        var v = "";
                        if (cell.attribute != null) {
                            if (item[cell.attribute] != null)
                                v = item[cell.attribute];
                        }

                        if (cell.editInline != null) {
                            var ei = cell.editInline;
                            if (ei == true) {
                                td += '<span class="span-edit-inline" ' + '>' + v + '</span>';
                                td += '<div class="form-group inline-form">' +
                                    '<input style="' +
                                    sty +
                                    '" class="form-control" data-type="text" attr="' +
                                    cell.attribute +
                                    '" value="' +
                                    v +
                                    '" />' +
                                    '</div>';
                            } else if (ei.type == 'option') {
                                txt = '';
                                var select = '<select style="' +
                                    sty +
                                    '" class="form-control" data-type="text" attr="' +
                                    cell.attribute +
                                    '" >';

                                $(ei.lst).each(function () {
                                    select += '<option value="' +
                                        this.id +
                                        '" ' +
                                        (v == this.id ? 'selected="selected"' : '') +
                                        '>' +
                                        this.text +
                                        '</option>';
                                    if (this.id == v) {
                                        txt = this.text;
                                    }
                                });
                                select += '</select>';

                                td += '<span class="span-edit-inline" ' + '>' + txt + '</span>';
                                td += '<div class="form-group inline-form">' + select + '</div>';
                            }
                        }
                        else {
                            if (cell.render != null) {
                                td += '<span> ' + cell.render(item) + '</span>';
                            } else {
                                td += '<span';
                                if (cell.aline != null) {
                                    td += ' class="aline" title="' + v + '"';
                                }
                                td += '> ' + v + '</span>';
                            }
                        }
                    };
                    break;
                case "checkbox":
                    {
                        td += '>';
                        var v = item[cell.attribute];
                        td += '<div class="form-group">' +
                            '<input class="" type="checkbox" attr="' +
                            cell.attribute +
                            '" value="true" ' +
                            (v == true ? 'checked="checked"' : '') +
                            ' />' +
                            '</div>';
                        s.sumarray[i] = null;
                    };
                    break;
                case "option":
                    {
                        td += ' style="width: 40px;">';
                        var option = '<ul class="icons-list">';
                        option += '<li class="dropdown">';
                        option +=
                            '<a class="dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false"><i class="icon-menu9" style="font-size: 16px;"></i></a>';
                        option += '<ul class="dropdown-menu dropdown-menu-right" style="width: 200px">';
                        for (var j = 0; j < cell.render.length; j++) {
                            var opt = cell.render[j];
                            if (opt != null) {
                                if (opt.condition == null || opt.condition(item)) {
                                    option += '<li><a href="javascript:void(0)"';
                                    if (opt.class != null) {
                                        option += 'class="' + opt.class + '"';
                                    }
                                    option += '><i style="margin-right:5px" class="' +
                                        opt.icon +
                                        ' ' +
                                        opt.iconColor +
                                        '"></i>' +
                                        opt.text +
                                        '</a></li>';
                                }
                            }
                        }
                        option += '</li></ul>';

                        td += option + '</ul>';
                    };
                    break;
                case "date":
                    {

                        td += '>';
                        var v = app.formatDate(item[cell.attribute]);
                        if (cell.editInline != null) {
                            var ei = cell.editInline; 
                            if (cell.editInline) {
                                td += '<span class="span-edit-inline" ' + '>' + v + '</span>';
                                td += '<div class="form-group inline-form">' +
                                    '<input style="' +
                                    sty +
                                    '" class="form-control" data-type="date" attr="' +
                                    cell.attribute +
                                    '" value="' +
                                    v +
                                    '" />' +
                                    '</div>';
                            }
                        }
                        else {
                            td += '<span>' + v + '</span>';
                        }

                        s.sumarray[i] = null;
                    };
                    break;
                case "time":
                    {

                        td += '>';
                        td += app.formatTime(item[cell.attribute]);
                        s.sumarray[i] = null;
                    };
                    break;
                case "datetime":
                    {
                        td += '>';
                        td += app.formatDateTime(item[cell.attribute]);
                        s.sumarray[i] = null;
                    };
                    break;
                case "html":
                    {
                        td += '>';
                        if (cell.render != null) {
                            td += cell.render(item).replace(/\n/g, '<br/>');
                        } else if (cell.attribute != null) {
                            td += item[cell.attribute] != null ? item[cell.attribute] : "";
                        }
                        s.sumarray[i] = null;
                    };
                    break;
                case "price":
                case "number":
                    {
                        if (cell.sumable) {
                            if (typeof s.sumarray[i] == "undefined") {
                                s.sumarray[i] = 0;
                            }
                        }
                        td += '>';
                        var val = 0;
                        if (cell.render != null) {
                            val = cell.render(item, cell.attribute);
                        } else {
                            val = parseFloat(item[cell.attribute]);
                        }
                        s.sumarray[i] += val;

                        txt = cell.fixed != null ? val.toFixed(cell.fixed) : Math.round(val);

                        if (cell.renderText != null) {
                            txt = cell.renderText(item);
                        } else {
                            txt = cell.type == 'price' ? app.formatPrice(txt) : txt;
                        }

                        if (cell.editInline) {
                            td += '<span class="span-edit-inline"> ' + txt + '</span>';
                            var stl = cell.style != null ? cell.style : '';
                            td += '<div class="form-group inline-form">' +
                                '<input style="' +
                                stl +
                                '" class="form-control" data-type="price" attr="' +
                                cell.attribute +
                                '" value="' +
                                val +
                                '" />' +
                                '</div>';
                        } else {
                            td += '<span class=""> ' + txt + '</span>';
                        }
                    };
                    break;
                case "ai":
                    {
                        td += '>';
                        td += stt;

                        if (cell.sumable) {
                            if (typeof s.sumarray[i] == "undefined") {
                                s.sumarray[i] = 0;
                            }
                            s.sumarray[i] += 1;
                        } else {
                            s.sumarray[i] = null;
                        }
                    };
                    break;
            }
            td += '</td>';
            return td;
        }
        s.drawRow = function (item, idAttr, level, stt, p, gid) {
            var row = { left: '', right: '' };

            var skip = set.skipCols;
            var tr = '<tr ';

            if (set.contextMenu != null) {
                tr += ' data-toggle="context" data-target=".context-table-row" ';
            }

            tr += ' dataid="' + item[idAttr] + '" ai="' + stt + '" groupid="' + gid + '" ';

            var cls = ' class="tr-child tr-real ';
            if (set.rowStyle != null) {
                tr += ' ' + set.rowStyle(item) + '" ';
            }
            cls += '"';
            tr += cls;
            if (typeof item['Code'] != 'undefined') {
                tr += ' datacode="' + item['Code'] + '" ';
            }
            if (item.ParentId != null) {
                tr += ' parent="' + item.ParentId + '" ';
            }
            tr += '>';

            var start, end, cell, v, i;
            var str;

            if (skip > 0) {
                str = '';
                if (skip > 0 && (set.checkAll == null || set.checkAll)) {
                    str += s.drawCheckbox(item.Id);
                    skip--;
                }
                start = 0;
                end = skip;

                if (p == null || p == 'l') {
                    for (i = start; i < end; i++) {
                        cell = set.rows[i];
                        v = false;
                        if (app.hasValue(cell.visible)) {
                            v = cell.visible();
                        } else {
                            v = true;
                        }
                        if (v) {
                            str += s.setTdData(item, cell, i, stt);
                        }
                    }
                    row.left = tr + str + '<td>&nbsp;</td></tr>';
                }
            }

            if (p == null || p == 'r') {
                str = '';
                start = skip;
                end = set.rows.length;

                for (i = start; i < end; i++) {
                    cell = set.rows[i];
                    v = false;
                    if (app.hasValue(cell.visible)) {
                        v = cell.visible();
                    } else {
                        v = true;
                    }
                    if (v) {
                        str += s.setTdData(item, cell, i, stt);
                    }
                }
                row.right = tr + str + '<td>&nbsp;</td></tr>';
            }

            return row;
        }
        s.drawSuminfo = function (mc) {

            var si = s.set.sumInfo;

            if (set.skipCols > 0) {
                mc.find(".area-bl tbody").append('<tr class="warning tr-total"><td colspan="' +
                    set.skipCols +
                    '" style="height: 31px" class="text-bold text-center">TỔNG CỘNG</td></tr>');
            }

            var tr = '<tr class="warning tr-total">';
            var index = 0;
            if (si.colspan != null) {
                index = si.colspan;
                tr += '<td colspan="' +
                    si.colspan +
                    '" style="text-align: right"><strong>Tổng</strong></td>';
            }
            if (set.skipCols > 0) {
                index += set.skipCols;
            }
            if (set.checkAll) {
                index -= 1;
            }

            var cLabel = -1;
            var tLabel = '';

            if (si.label != null) {
                var cLabel = si.label.col != null ? si.label.col : 0;
                var tLabel = si.label.text != null
                    ? si.label.text
                    : 'TỔNG CỘNG';
            }
            for (var i = index; i < s.set.rows.length; i++) {

                if (i == cLabel) {
                    tr += '<td style="text-align: right"><strong>' + tLabel + '</strong></td>';
                } else {
                    var col = s.set.rows[i];
                    if (col.sumable) {
                        var v = '';
                        if (s.sumarray.length > i) {
                            v = col.fixed != null ? s.sumarray[i].toFixed(col.fixed) : app.formatPrice(s.sumarray[i]);
                        }
                        var td = '<td class="text-right"  data-attr="' + col.attribute + '" ';
                        if (col.style != null) {
                            td += 'style="' + col.style + '; height: 31px"';
                        } else {
                            td += 'style="height: 31px"';
                        }

                        td += ' ><strong>' +
                            v +
                            '</strong></td>';
                        tr += td;
                    } else {
                        tr += '<td>&nbsp;</td>';
                    }
                }
            }
            tr += '<td></td></tr>';
            mc.find(".area-br tbody").append(tr);
        }

        s.rowFilter = function (bl) {
            var skip = set.skipCols;
            var tr = '<tr class="tr-filter">';
            var start, end;

            if (bl) {
                if (skip == 0)
                    return '';
                if (skip > 0 && (set.checkAll == null || set.checkAll)) {
                    tr += '<td></td>';
                    skip--;
                }
                start = 0;
                end = skip;
            } else {
                if (set.checkAll == null || set.checkAll) {
                    if (skip == 0) {
                        tr += '<td></td>';
                    } else {
                        skip--;
                    }
                }
                start = skip;
                end = set.rows.length;
            }

            for (var i = start; i < end; i++) {
                var cell = set.rows[i];
                var v;
                if (app.hasValue(cell.visible)) {
                    v = cell.visible();
                } else {
                    v = true;
                }
                if (v) {
                    var model = set.model;
                    if (cell.model != null) {
                        model = cell.model;
                    }
                    var td = '<td ';

                    if (cell.colspan != null) {
                        if (cell.colspan.if(item)) {
                            td += ' colspan="' + cell.colspan.value + '" ';
                        }
                    }
                    td += '>';
                    var f = cell.filter;
                    if (f != null) {
                        switch (f.type) {
                            case 'contains':
                                {
                                    var o = '<div class="input-group input-group-sm">' +
                                        '<div class="input-group-btn" > ' +
                                        '<button type="button" class="btn btn-default btn-left dropdown-toggle" title="Lộc dữ liệu" ' +
                                        'data-toggle="dropdown"><i class="icon-search4"></i></button>' +
                                        //'<ul class="dropdown-menu">' +
                                        //'<li><a href="javascript:void(0)" class="operator" value="[*]">Chứa</a></li>' +
                                        //'<li><a href="javascript:void(0)" class="operator" value="=">Bằng</a></li>' +
                                        //'<li><a href="javascript:void(0)" class="operator" value=">">Lớn hơn</a></li>' +
                                        //'<li><a href="javascript:void(0)" class="operator" value=">=">Lớn hơn hoặc bằng</a></li>' +
                                        //'<li><a href="javascript:void(0)" class="operator" value="<">Bé hơn</a></li>' +
                                        //'<li><a href="javascript:void(0)" class="operator" value="<=">Bé hơn hoặc bằng</a></li>' +
                                        //'</ul>' +
                                        '</div > ' +
                                        '<input type="text" class="form-control filter-contains" data-index="' + i + '" attr="' +
                                        f.attr +
                                        '" placeholder="...">' +
                                        '</div>';
                                    td += o;
                                }
                                break;
                            case 'option':
                                {
                                    var w = set.head.groups[i];
                                    var o = '<div class="form-group form-group-sm">' +
                                        '<div class="input-group input-group-sm">' +
                                        '<select class="form-control filter-option select-option" attr="' + cell.attribute + '"  data-index="' +
                                        i +
                                        '" data-width="' + w + '" style="width: ' + w + 'px">' +
                                        '<option value="">Tất cả</option>';
                                    if (f.lst != null) {
                                        var data = f.lst();
                                        $(data).each(function () {
                                            o += '<option value="' + this.id + '">' + this.text + '</option>';
                                        });
                                    }
                                    o += '</select>' +
                                        '</div>' +
                                        '</div>';
                                    td += o;
                                }
                                break;
                            case 'optionRemote':
                                {
                                    var o = '<div class="form-group form-group-sm">' +
                                        '<div class="input-group input-group-sm">' +
                                        '<div class="input-group-btn" > ' +
                                        '<button type="button" class="btn btn-default btn-left dropdown-toggle" ' +
                                        'title="Lộc dữ liệu" data-toggle="dropdown"><i class="icon-filter4"></i></button>' +
                                        '</div>' +
                                        '<input type="text" attr="' + cell.attribute + '" class="form-control filter-option select-option-remote" data-index="' +
                                        i +
                                        '" data-width="' +
                                        set.head.groups[i] +
                                        '"/>';
                                    o += '</div>' +
                                        '</div>';
                                    td += o;
                                }
                                break;
                            case 'compoTree':
                                {
                                    var o = '<div class="form-group form-group-sm">' +
                                        '<div class="input-group input-group-sm">' +
                                        '<div class="input-group-btn" > ' +
                                        '<button type="button" class="btn btn-default btn-left dropdown-toggle" ' +
                                        'title="Lộc dữ liệu" data-toggle="dropdown"><i class="icon-filter4"></i></button>' +
                                        '</div>';
                                    o += '<input class="form-control compo-tree" id="' + app.newGuid() + '" data-index="' + i + '" type="text" />';
                                    o += '</div>' +
                                        '</div>';
                                    td += o;
                                }
                                break;
                            case 'date':
                                {
                                    var o = '<div class="datepicker" from to name="' + cell.attribute + '" data-index="' +
                                        i +
                                        '" ></div>';
                                    td += o;
                                }
                                break;
                        }
                    }
                    td += '</td>';
                    tr += td;
                }
            }

            tr += '<td>&nbsp;</td></tr>';
            return tr;
        }

        s.drawEmptyRow = function (bl) {
            var skip = set.skipCols;
            var tr = '<tr class="empty">';
            var colspan;

            if (bl) {
                if (skip == 0)
                    return '';
                if (skip > 0 && (set.checkAll == null || set.checkAll)) {
                    tr += s.drawCheckbox();
                    skip--;
                }
                colspan = skip;
            } else {
                if (set.checkAll == null || set.checkAll) {
                    if (skip == 0) {
                        tr += s.drawCheckbox();
                    } else {
                        skip--;
                    }
                }
                colspan = set.rows.length - skip;
            }
            tr += '<td colspan="' + colspan + '"></td>';
            tr += '<td>&nbsp;</td></tr>';
            return tr;
        }

        s.showBackground = function () {
            var mc = $(sel).find('> .salary-table > .main-content');
            var bl = mc.find('.area-bl tbody');
            var br = mc.find('.area-br tbody');

            mc.find('.area-bl tbody tr').css('display', 'none');
            mc.find('.area-br tbody tr').css('display', 'none');

            mc.find('.area-bl tbody tr.tr-background').remove();
            mc.find('.area-br tbody tr.tr-background').remove();

            $(s.viewData).each(function () {
                if (this.active) {
                    mc.find('tr.tr-group[groupid="' + this.gid + '"]').css('display', 'table-row');
                    if (this.groupChilds.length > 0) {
                        $(this.groupChilds).each(function () {
                            if (this.active) {
                                mc.find('tr.tr-group[groupid="' + this.gid + '"]').css('display', 'table-row');
                                var l = '';
                                var r = '';
                                var pl = bl.find('tr.tr-group[groupid="' + this.gid + '"]');
                                var pr = br.find('tr.tr-group[groupid="' + this.gid + '"]');
                                for (var i = 0; i < this.count; i++) {
                                    if (this.left[i].active) {
                                        l += this.left[i].bg;
                                        r += this.right[i].bg;
                                    }
                                }
                                $(pl).after(l);
                                $(pr).after(r);

                                for (var i = 0; i < this.count; i++) {
                                    if (this.left[i].active) {
                                        bl.find('tr.tr-child[dataid="' + this.left[i].id + '"]')
                                            .attr('data-top', this.left[i].top);
                                        br.find('tr.tr-child[dataid="' + this.left[i].id + '"]')
                                            .attr('data-top', this.left[i].top);
                                    }
                                }
                            }
                        });
                    } else {
                        var l = '';
                        var r = '';
                        var pl = bl.find('tr.tr-group[groupid="' + this.gid + '"]');
                        var pr = br.find('tr.tr-group[groupid="' + this.gid + '"]');
                        for (var i = 0; i < this.count; i++) {
                            if (this.left[i].active) {
                                l += this.left[i].bg;
                                r += this.right[i].bg;

                                bl.find('tr.tr-child[dataid="' + this.left[i].id + '"]')
                                    .attr('data-top', this.left[i].top);
                                br.find('tr.tr-child[dataid="' + this.left[i].id + '"]')
                                    .attr('data-top', this.left[i].top);
                            }
                        }
                        $(pl).after(l);
                        $(pr).after(r);
                        for (var i = 0; i < this.count; i++) {
                            if (this.left[i].active) {
                                bl.find('tr.tr-child[dataid="' + this.left[i].id + '"]')
                                    .attr('data-top', this.left[i].top);
                                br.find('tr.tr-child[dataid="' + this.left[i].id + '"]')
                                    .attr('data-top', this.left[i].top);
                            }
                        }
                    }
                }
            });
        }


        s.loadRightData = function (gindex, ids, callback) {
            var g = s.viewData[gindex];
            s.searchParams.orgId = g.gid;
            s.searchParams.idStr = ids.join(';');

            $.ajax({
                url: set.url.right,
                type: "GET",
                dataType: "JSON",
                contentType: 'application/json; charset=utf-8',
                data: s.searchParams,
                async: false,
                success: function (list) {
                    g = s.viewData[gindex];

                    for (var i = 0; i < list.length; i++) {
                        var v1 = list[i];
                        for (var j = 0; j < s.sourceData.length; j++) {
                            if (s.sourceData[j].Id == v1.Id) {
                                v1.Keyword = s.sourceData[j].Keyword;
                                s.sourceData[j] = v1;
                            }
                        }
                    }
                    if (list.length > 0) {
                        var idAttr = "Id";
                        if (set.idAttribute != null) {
                            idAttr = set.idAttribute;
                        }
                        $.each(list, function (k, item) {
                            var r = s.drawRow(item, idAttr, 1, k + 1, 'r', item[set.group.attr]);
                            $(g.right).each(function () {
                                if (this.id == item[idAttr]) {
                                    this.html = r.right;
                                };
                            });
                        });
                    }

                    //s.sortai(s.viewData[gindex]);

                    if (callback != null) {
                        callback(s.viewData[gindex]);
                    }
                }
            });
        }

        s.showData = function (top) {
            var mc = $(sel).find('> .salary-table > .main-content');
            var bl = mc.find('.area-bl tbody');
            var br = mc.find('.area-br tbody');
            var a = mc.find('.area-br').height();
            var gids = [], hides = [], tr, p1, p2;
            var gr = bl.find('.tr-group');
            $(gr).each(function () {
                p1 = parseInt($(this).attr('data-p1'));
                p2 = parseInt($(this).attr('data-p2'));
                if ((p1 <= top && top <= p2) || (p1 <= top + a && top <= p2)) {
                    gids.push(parseInt($(this).attr('groupid')));
                }
            });
            var showed = bl.find('tr.tr-group.showed');
            $(showed).each(function (ri, r) {
                var id = parseInt($(r).attr('groupid'));
                p1 = parseInt($(r).attr('data-p1'));
                p2 = parseInt($(r).attr('data-p2'));
                if ($.inArray(id, gids) < 0) {
                    //hides.push(id);
                    var childs = bl.find('tr.tr-child[groupid="' + id + '"]');
                    if (childs.length > 0) {
                        bl.find('tr.tr-child[groupid="' + id + '"]').remove();
                        br.find('tr.tr-child[groupid="' + id + '"]').remove();

                        bl.find('tr.tr-group-overload-top[groupid="' + id + '"]').css('display', 'none').find('td').css('height', 0);
                        br.find('tr.tr-group-overload-top[groupid="' + id + '"]').css('display', 'none').find('td').css('height', 0);

                        var h = p2 - p1 - s.hr;

                        bl.find('tr.tr-group-overload-bot[groupid="' + id + '"]').css('display', 'table-row').find('td').css('height', h + 'px');
                        br.find('tr.tr-group-overload-bot[groupid="' + id + '"]').css('display', 'table-row').find('td').css('height', h + 'px');

                    }

                    $(this).removeClass('showed');
                }
            });
            var rn = Math.round(a / s.hr);
            var x = 0, y, z, h, i, t, l;
            $(s.viewData).each(function (gindex, r) {
                if ($.inArray(r.gid, gids) >= 0 && r.active) {
                    var l = bl.find('tr.tr-group[groupid="' + r.gid + '"]');

                    if (!l.hasClass('showed')) {
                        l.addClass('showed');
                    }

                    p1 = parseInt(l.attr('data-p1'));
                    p2 = parseInt(l.attr('data-p2'));
                    h = p2 - p1;

                    if (p1 > 0) {
                        if (top < p1 && p1 < top + a) {
                            x = 0;
                            t = top + a - p1 - s.hr;
                            rn = Math.round(t / s.hr);
                        } else {
                            x = top - p1 - s.hr;

                        }
                    } else {
                        x = top - s.hr;
                    }

                    if (x < 0) {
                        x = 0;
                    }

                    x = Math.floor(x / s.hr);

                    l = rn;
                    if (x + rn >= r.left.length) {
                        rn = r.left.length - x;
                    }

                    if (rn < 0) {
                        rn = 0;
                    }

                    var ids = [];

                    y = x * s.hr;
                    z = h - (rn * s.hr) - y - s.hr;


                    if (y > 0) {
                        bl.find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').css('display', 'table-row').find('td').css('height', y + 'px');
                        br.find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').css('display', 'table-row').find('td').css('height', y + 'px');
                    } else {
                        bl.find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').css('display', 'none').find('td').css('height', 0);
                        br.find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').css('display', 'none').find('td').css('height', 0);
                    }

                    if (z > 0) {
                        bl.find('tr.tr-group-overload-bot[groupid="' + r.gid + '"]').css('display', 'table-row').find('td').css('height', z + 'px');
                        br.find('tr.tr-group-overload-bot[groupid="' + r.gid + '"]').css('display', 'table-row').find('td').css('height', z + 'px');
                    } else {
                        bl.find('tr.tr-group-overload-bot[groupid="' + r.gid + '"]').css('display', 'none').find('td').css('height', 0);
                        br.find('tr.tr-group-overload-bot[groupid="' + r.gid + '"]').css('display', 'none').find('td').css('height', 0);
                    }

                    bl.find('tr.tr-child[groupid="' + r.gid + '"]').remove();
                    br.find('tr.tr-child[groupid="' + r.gid + '"]').remove();

                    ids = [];
                    for (i = x; i < x + rn; i++) {
                        if (i < r.left.length) {
                            if (r.right[i].html == '') {
                                ids.push(r.right[i].id);
                            }
                        }
                    }
                    var left = '';
                    var right = '';


                    if (ids.length > 0) {
                        s.loadRightData(gindex, ids, function (r) {
                            right = '';
                            for (i = x; i < x + rn; i++) {
                                if (i < r.left.length) {
                                    if (r.left[i].active) {
                                        left += r.left[i].html;
                                        right += r.right[i].html;
                                    }
                                }
                            }

                            bl.find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').after(left);

                            br = mc.find('.area-br tbody');
                            br.find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').after(right);

                            $(r.left).each(function () {
                                if (this.checked) {
                                    var checkbox = bl.find('tr.tr-child[dataid="' + this.id + '"] .first-col input[type="checkbox"]');
                                    checkbox.prop('checked', true);
                                }
                            });

                            s.setRowEvents(r.gid);
                            if (set.loadDataCallback != null) {
                                set.loadDataCallback();
                            }
                        });
                    } else {
                        right = '';
                        for (i = x; i < x + rn; i++) {
                            if (i < r.left.length) {
                                if (r.left[i].active) {
                                    left += r.left[i].html;
                                    right += r.right[i].html;
                                }
                            }
                        }

                        bl.find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').after(left);

                        br = mc.find('.area-br tbody');
                        br.find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').after(right);

                        $(r.left).each(function () {
                            if (this.checked) {
                                var checkbox = bl.find('tr.tr-child[dataid="' + this.id + '"] .first-col input[type="checkbox"]');
                                checkbox.prop('checked', true);
                            }
                        });

                        s.setRowEvents(r.gid);
                        if (set.loadDataCallback != null) {
                            set.loadDataCallback();
                        }
                    }
                }
            });
        }

        s.setViewData = function (list, hasRight) {
            var idAttr = "Id";
            if (set.idAttribute != null) {
                idAttr = set.idAttribute;
            }
            var has, r, gattr;
            s.sumarray = [];
            var mc = $(sel).find('> .salary-table > .main-content');
            $.each(list, function (k, item) {
                if (set.group != null) {
                    gattr = item[set.group.attr];
                    r = s.drawRow(item, idAttr, 1, k + 1, hasRight ? null : 'l', gattr);
                    has = false;
                    $(s.viewData).each(function () {
                        var g = this;
                        if (g.groupChilds.length > 0) {
                            $(g.groupChilds).each(function () {
                                var c = this;
                                if (c.gid == gattr) {
                                    has = true;
                                    c.left.push({
                                        active: true,
                                        id: item[idAttr],
                                        html: r.left,
                                        bg: '',
                                        keyword: item.Keyword
                                    });
                                    c.right.push({
                                        id: item[idAttr],
                                        html: '',
                                        bg: ''
                                    });
                                    return;
                                }
                            });
                        }
                        else {
                            if (g.gid == gattr) {
                                has = true;
                                g.left.push({
                                    active: true,
                                    id: item[idAttr],
                                    html: r.left,
                                    bg: '',
                                    keyword: item.Keyword
                                });

                                var ri = {
                                    id: item[idAttr],
                                    html: hasRight ? r.right : '',
                                    bg: ''
                                };

                                for (var i = 0; i < set.rows.length; i++) {
                                    var f = set.rows[i];
                                    if (f.filter != null) {
                                        ri[f.attribute] = item[f.attribute];
                                    }
                                }
                                g.lL = true;
                                g.lR = hasRight ? true : false;
                                g.right.push(ri);
                                return;
                            }
                        }
                    });
                    mc.find(".area-bl tbody").append(r.left);
                    mc.find(".area-br tbody").append(r.right);
                }
                else {
                    r = s.drawRow(item, idAttr, 1, k + 1, hasRight ? null : 'l', null);
                    has = false;
                    $(s.viewData).each(function () {
                        var g = this;
                        has = true;
                        g.left.push({
                            active: true,
                            id: item[idAttr],
                            html: r.left,
                            bg: '',
                            keyword: item.Keyword
                        });

                        var ri = {
                            id: item[idAttr],
                            html: hasRight ? r.right : '',
                            bg: ''
                        };

                        for (var i = 0; i < set.rows.length; i++) {
                            var f = set.rows[i];
                            if (f.filter != null) {
                                ri[f.attribute] = item[f.attribute];
                            }
                        }
                        g.lL = true;
                        g.lR = hasRight ? true : false;
                        g.right.push(ri);
                    });

                    mc.find(".area-bl tbody").append(r.left);
                    mc.find(".area-br tbody").append(r.right);
                }
            });
        }

        s.loadDataSequentially = function (arr, callback) {
            s.searchParams.orgStr = arr.join(';');
            s.sequentially.ajax = $.ajax({
                url: set.url.left,
                type: "GET",
                dataType: "JSON",
                contentType: 'application/json; charset=utf-8',
                data: s.searchParams,
                success: function (result) {
                    var list = result.Many != null ? result.Many : result.length > 0 ? result : [];

                    s.sourceData = $.merge(s.sourceData, list);
                    s.count += result.Count;
                    var r;

                    s.sumarray = [];

                    if (set.rows.length > 0) {
                        if (list != null && list.length > 0) {
                            s.setViewData(list);
                        }
                    }

                    //if (s.sequentially.first) {
                    //    s.sequentially.first = false;
                    //    s.showData(0);
                    //}

                    s.sequentially.loaded += arr.length;

                    app.loadingAsyncData({
                        mode: 1,
                        tl: s.sequentially.loaded / s.viewData.length
                    });

                    arr = [];
                    $(s.viewData).each(function () {
                        if (!this.loaded) {
                            if (arr.length < s.sequentially.number) {
                                arr.push(this.gid);
                                this.loaded = true;
                            } else {
                                return;
                            }
                        }
                    });

                    if (arr.length > 0) {
                        s.loadDataSequentially(arr);
                    } else {
                        s.sequentially.loading = false;
                        app.loadingAsyncData({
                            mode: 2
                        });

                        s.sortai();

                        s.setRowPositions();

                        //s.showBackground();

                        s.showData(0);
                        s.initData = true;
                        s.hideTableLoading();
                        if (set.loadDataCallback != null) {
                            set.loadDataCallback(result);
                        }
                        if (callback != null) {
                            callback(result);
                        }
                    }
                }
            });
        }

        s.loadData = function (params, callback, reload) {
            if (params != null) {
                $.extend(s.searchParams, params);
            }

            app.cleanJson(s.searchParams);

            if ($.isEmptyObject(s.searchParams)) {
                s.searchParams.limit = set.params.limitClear;
            } else {
                s.searchParams.limit = null;
            }
            if (set.group != null) {
                if (set.group.sequentially) {
                    var arr = [];

                    if (reload) {
                        s.sequentially.loaded = 0;
                        $(s.viewData).each(function () {
                            this.loaded = false;
                            this.left = [];
                            this.right = [];
                        });
                    }

                    s.sequentially.total = s.viewData % s.sequentially.number == 0
                        ? (s.viewData / s.sequentially.number)
                        : (s.viewData / s.sequentially.number) + 1;

                    $(s.viewData).each(function () {
                        if (!this.loaded) {
                            if (arr.length < s.sequentially.number) {
                                arr.push(this.gid);
                                this.loaded = true;
                            } else {
                                return;
                            }
                        }
                    });

                    if (arr.length > 0) {
                        s.sequentially.loading = true;
                        s.sequentially.first = true;

                        app.loadingAsyncData({
                            mode: 0,
                            text: 'Đang tải dữ liệu ...'
                        });
                        s.clearViewData(true);
                        s.loadDataSequentially(arr, callback);
                    }
                }
                else {
                    s.showTableLoading();
                    $.ajax({
                        url: set.url.left != null ? set.url.left : set.url.all,
                        type: "GET",
                        dataType: "JSON",
                        contentType: 'application/json; charset=utf-8',
                        data: s.searchParams,
                        success: function (result) {
                            var list = result.Many != null ? result.Many : result.length > 0 ? result : [];

                            var mc = $(sel).find('> .salary-table > .main-content');

                            mc.find(".area-bl tbody tr").removeClass('showed-child');
                            mc.find(".area-br tbody tr").removeClass('showed-child');

                            s.sourceData = list;
                            s.count = result.Count;
                            var r;

                            s.sumarray = [];
                            s.clearViewData(true);
                            if (set.rows.length > 0) {
                                if (list != null && list.length > 0) {
                                    s.setViewData(list, set.url.all != null);

                                    mc.find('tbody tr.tr-child').remove();

                                    s.sortai();

                                    s.setRowPositions();

                                    //s.showBackground();

                                    s.showData(0);

                                    // draw sum tr 
                                    if (s.set.sumInfo != null) {
                                        s.drawSuminfo(mc);
                                    }

                                    mc.find('.empty-message').css('display', 'none');
                                }
                                else {
                                    s.showBackground();
                                    s.showData(0);
                                    r = s.drawEmptyRow(true);
                                    mc.find(".area-bl tbody").append(r);
                                    r = s.drawEmptyRow(false);
                                    mc.find(".area-br tbody").append(r);
                                    mc.find('.empty-message').css('display', 'block');
                                }
                            }

                            s.hideTableLoading();
                            if (set.loadDataCallback != null) {
                                set.loadDataCallback(result, reload);
                            }
                            if (callback != null) {
                                callback(result);
                            }
                        }
                    });
                }
            } else {
                s.showTableLoading();
                $.ajax({
                    url: set.url.all,
                    type: "GET",
                    dataType: "JSON",
                    contentType: 'application/json; charset=utf-8',
                    data: s.searchParams,
                    success: function (result) {
                        var list = result.Many != null ? result.Many : result.length > 0 ? result : [];

                        var mc = $(sel).find('> .salary-table > .main-content');
                        mc.find(".area-bl tbody").html("");
                        mc.find(".area-br tbody").html("");
                        mc.find(".area-bom tbody").html("");

                        s.sourceData = list;
                        s.count = result.Count;
                        var r;
                        s.clearViewData(true);
                        s.sumarray = [];
                        if (set.rows.length > 0) {
                            if (list != null && list.length > 0) {

                                s.setViewData(list, set.url.all != null);

                                // draw sum tr
                                if (s.set.sumInfo != null) {
                                    s.drawSuminfo(mc);
                                }
                            }
                        }

                        s.setRowEvents();

                        s.hideTableLoading();
                        if (set.loadDataCallback != null) {
                            set.loadDataCallback(result, reload);
                        }
                        if (callback != null) {
                            callback(result);
                        }
                    }
                });
            }
        };

        s.setRowPositions = function () {
            var mc = $(sel).find('> .salary-table > .main-content');
            var bl = mc.find('.area-bl tbody');
            var br = mc.find('.area-br tbody');
            var h = s.hr;
            var top = 0;
            var p1, p2;

            if (set.group.onlyHasValue) {
                $(s.viewData).each(function () {

                });
            }

            $(s.viewData).each(function () {
                var r = this;
                if (set.group.onlyHasValue) {
                    if (r.left.length == 0) {
                        r.active = false;
                        $(bl).find('tr.tr-group[groupid="' + r.gid + '"]').css('display', 'none');
                        $(br).find('tr.tr-group[groupid="' + r.gid + '"]').css('display', 'none');
                        $(bl).find('tr.tr-group-overload[groupid="' + r.gid + '"]').css('display', 'none');
                        $(br).find('tr.tr-group-overload[groupid="' + r.gid + '"]').css('display', 'none');
                    }
                }

                if (r.active) {
                    if (this.groupChilds.length > 0) {
                        $(this.groupChilds).each(function () {
                            if (this.active) {
                                top += h;
                                if (this.count > 0) {
                                    var cc = 0;
                                    for (var j = 0; j < r.left.length; j++) {
                                        if (r.left[j].active) {
                                            top += h;
                                            cc++;
                                            var id = r.left[j].id;
                                            var e = s.drawBackground(id, h, top, this.gid);
                                        }
                                    }
                                    this.top = h * cc;
                                }
                            }
                        });
                    }
                    else {
                        var cc = 0;
                        for (var j = 0; j < r.left.length; j++) {
                            if (r.left[j].active) {
                                cc++;
                            }
                        }
                        var v = h * cc;
                        p1 = top;
                        p2 = p1 + v + h;
                        $(bl).find('tr.tr-group[groupid="' + r.gid + '"]').css('display', 'table-row').attr('data-p1', p1).attr('data-p2', p2);
                        $(br).find('tr.tr-group[groupid="' + r.gid + '"]').css('display', 'table-row');

                        $(bl).find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').css('display', 'none');
                        $(br).find('tr.tr-group-overload-top[groupid="' + r.gid + '"]').css('display', 'none');

                        $(bl).find('tr.tr-group-overload-bot[groupid="' + r.gid + '"] > td').css('height', v + 'px');
                        $(br).find('tr.tr-group-overload-bot[groupid="' + r.gid + '"] > td').css('height', v + 'px');
                        top += h + v;
                    }
                } else {
                    $(bl).find('tr.tr-group-overload[groupid="' + r.gid + '"]').css('display', 'none');
                    $(br).find('tr.tr-group-overload[groupid="' + r.gid + '"]').css('display', 'none');
                }
            });
        }

        s.drawBackground = function (id, h, top, gid) {
            var el = '<tr dataid="' + id + '" data-top="' + top + '" class="tr-background tr-child" groupid="' + gid + '" style="">' +
                '<td style="height: ' + h + 'px" colspan="' + set.skipCols + '">&nbsp;</td></tr>';
            var er = '<tr dataid="' + id + '" data-top="' + top + '" class="tr-background tr-child" groupid="' + gid + '" style="">' +
                '<td style="height: ' + h + 'px" colspan="' + s.colRight + '">&nbsp;</td></tr>';
            return {
                left: el,
                right: er
            };
        }

        s.sortai = function () {
            var stt;
            $(s.viewData).each(function () {
                if (this.groupChilds.length > 0) {
                    $(this.groupChilds).each(function () {
                        if (this.active) {
                            stt = 0;
                            $(this.left).each(function () {
                                if (this.active) {
                                    var temp = $(this.html);
                                    stt++;
                                    if (set.checkAll) {
                                        temp.find('td:eq(1)').text(stt);
                                    } else {
                                        temp.find('td:eq(0)').text(stt);
                                    }
                                    var h = $("<div>").append(temp.clone()).html();
                                    this.html = h;
                                }
                            });
                        }
                    });
                } else {
                    if (this.active) {
                        stt = 0;
                        $(this.left).each(function () {
                            if (this.active) {
                                var temp = $(this.html);
                                stt++;
                                if (set.checkAll) {
                                    temp.find('td:eq(1)').text(stt);
                                } else {
                                    temp.find('td:eq(0)').text(stt);
                                }
                                var h = $("<div>").append(temp.clone()).html();
                                this.html = h;
                            }
                        });
                    }
                }
            });
        }

        s.reloadDataGroup = function (gid) {
            s.showTableLoading();
            var gi = 0;
            $(s.viewData).each(function (i, o) {
                if (gid == this.gid) {
                    gi = i;
                    return;
                }
            });

            s.viewData[gi].left = '';
            s.viewData[gi].right = '';
            s.sourceData = $.grep(s.sourceData, function (o) {
                return o[set.group.attr] != gid;
            });
            s.searchParams.orgStr = gid + '';
            s.count -= s.viewData[gi].count;
            s.viewData[gi].count = 0;

            $.ajax({
                url: set.dataUrl != null ? set.dataUrl : '/api/' + set.model + "List",
                type: "GET",
                dataType: "JSON",
                contentType: 'application/json; charset=utf-8',
                data: s.searchParams,
                success: function (result) {
                    var list = result.Many != null ? result.Many : result.length > 0 ? result : [];

                    var mc = $(sel).find('> .salary-table > .main-content');

                    s.sourceData = $.merge(s.sourceData, list);
                    s.count += result.Count;

                    var r;

                    if (set.rows.length > 0) {
                        if (list != null && list.length > 0) {
                            var idAttr = "Id";

                            if (set.idAttribute != null) {
                                idAttr = set.idAttribute;
                            }

                            $.each(list, function (k, item) {
                                var gattr = item[set.group.attr];
                                r = s.drawRow(item, idAttr, 1, k + 1, true, gattr);

                                s.viewData[gi].left += r.left;
                                s.viewData[gi].right += r.right;
                                s.viewData[gi].count += 1;
                            });

                            mc.find('tbody tr.tr-child[groupid="' + gid + '"]').remove();
                            var h = s.hr * s.viewData[gi].count;
                            mc.find('.areas tbody tr[groupid="' + gid + '"]').attr('data-height', h + s.hr)
                                .removeClass('showed-child');
                            mc.find('.areas tbody tr.tr-background[groupid="' + gid + '"] td').css('height', h);
                            s.resetGroupPosition();

                            mc.find('.empty-message').css('display', 'none');
                        }
                        else {
                            r = s.drawEmptyRow(true);
                            mc.find(".area-bl tbody").append(r);
                            r = s.drawEmptyRow(false);
                            mc.find(".area-br tbody").append(r);
                            mc.find('.empty-message').css('display', 'block');
                        }
                    }

                    s.hideTableLoading();
                    if (set.loadDataCallback != null) {
                        set.loadDataCallback(result);
                    }
                }
            });

        }

        s.clearViewData = function (a) {

            if (set.group != null) {
                $(s.viewData).each(function () {
                    this.left = [];
                    this.right = [];
                    this.active = a;
                });
            } else {
                $(s.viewData).each(function () {
                    this.left = [];
                    this.right = [];
                    this.active = a;
                });
                var bd = $(sel).find('> .salary-table > .main-content .area tbody');
                bd.find('tr.tr-child').remove();
                bd.find('tr.tr-total').remove();
            }
        }

        s.searchGroup = function (gid) {
            if (gid != null && gid.length > 0) {
                s.filter.groupId = parseInt(gid);
            } else {
                s.filter.groupId = null;
            }
            s.search(null);

        }

        s.search = function (par) {

            if (par != null) {
                $.extend(s.filter, par);
            } 

            var bd = $(sel).find('> .salary-table > .main-content .area tbody');
            //bd.find('tr.tr-child').remove();
            bd.find('tr.tr-group').removeClass('showed');
            bd.find('tr.tr-group').css('display', 'none');

            s.showTableLoading();

            setTimeout(function () {
                s.clearViewData(false);
                //var gids = [];
                //$(s.viewData).each(function () {
                //    var g = this;
                //    if (s.filter.groupId != null) {
                //        if (g.gid == s.filter.groupId) {
                //            g.active = true;
                //        } else {
                //            g.active = false;
                //        }
                //    } else {
                //        g.active = true;
                //    }
                //    if (g.active) {
                //        gids.push(g.gid);
                //    }
                //});

                var list = [];

                $(s.viewData).each(function () {
                    var g = this;
                    var c = 0;
                    $(s.sourceData).each(function () {
                        var item = this;
                        var active = false;
                        if (set.group != null) {
                            var gattr = item[set.group.attr];
                            if (gattr == g.gid) {
                                active = true;
                            }
                        } else {
                            active = true;
                        }
                        if (active) {
                            for (var j = 0; j < s.filter.attrs.length; j++) {
                                var a = s.filter.attrs[j];
                                switch (a.type) {
                                    case 'option':
                                        {
                                            if (a.v != null) {
                                                if (item[a.attr] + '' != a.v) {
                                                    active = false;
                                                }
                                            }
                                        }
                                        break;
                                    case 'contains':
                                        {
                                            if (a.v != null && a.v.length > 0) {
                                                if (item.Keyword.indexOf(a.v) < 0) {
                                                    active = false;
                                                }
                                            }
                                        }
                                        break;
                                }
                            }

                            if (active) {
                                list.push(item);
                                c++;
                            }
                        }
                    });

                    if (s.filter.groupId != null) {
                        if (g.gid == s.filter.groupId) {
                            g.active = true;
                        } else {
                            g.active = false;
                        }
                    } else {
                        if (c > 0) {
                            g.active = true;
                        } else {
                            g.active = false;
                        }
                    }

                    if (!g.active) {
                        bd.find('tr.tr-child[groupid="' + g.gid + '"]').remove();
                        bd.find('tr.tr-group-overload[groupid="' + g.gid + '"]').css('display', 'none');
                    }
                });

                if (set.group != null) {
                    s.setViewData(list, false);

                    s.sortai();
                    s.setRowPositions();

                    s.showData(0);
                    if (set.loadDataCallback != null) {
                        set.loadDataCallback();
                    }

                } else {

                    s.setViewData(list, true);
                    var mc = $(sel).find('> .salary-table > .main-content');
                    // draw sum tr
                    if (s.set.sumInfo != null) {
                        s.drawSuminfo(mc);
                    }
                    s.setRowEvents();
                    if (set.loadDataCallback != null) {
                        set.loadDataCallback();
                    }
                };
                s.hideTableLoading();
            }, 300);
            $(s.filter.attrs).each(function() {
                if (this.v != '' && this.v != null) {
                    s.searchParams[this.attr] = this.v;
                }
            });
        };

        s.setData = function (result, callback) {

            var count = result.Count != null ? result.Count : 0;
            var list = result.Many != null ? result.Many : result.length > 0 ? result : null;
            if (list != null) {
                if (count == 0) {
                    count = list.length;
                }
                $(sel).find(".area-bl tbody").html("");
                $(sel).find(".area-br tbody").html("");
                s.sourceData = list;
            }

            s.count = count;
            if (set.rows.length > 0) {
                if (list != null && list.length > 0) {
                    var idAttr = "Id";

                    if (set.idAttribute != null) {
                        idAttr = set.idAttribute;
                    }
                    s.sumarray = [];
                    $.each(list,
                        function (k, item) {
                            var r = s.drawRow(item, idAttr, 1, k + 1, true);
                            $(sel).find(".area-bl tbody").append(r);
                            r = s.drawRow(item, idAttr, 1, k + 1, false);
                            $(sel).find(".area-br tbody").append(r);


                        });
                }
            }
            $(sel).find(".main-content .total-row span").text(count);

            s.hideTableLoading();
            s.setRowEvents();
            if (set.loadDataCallback != null) {
                set.loadDataCallback(result);
            }
            if (callback != null) {

                callback(result);
            }
        }
        s.setSubmitEvent = function (type) {
            var flag = true;
            if (set.beforeSubmit != null) {
                flag = set.beforeSubmit();
            }
            if (!flag || !set.autoSubmit) return false;

            s.submitForm(type);
        };
        s.hideModal = function () {
            var type = parseInt($('#' + set.model + 'FormEditModal').attr('data-type'));
            if (type == 2) {
                $('#' + set.model + 'FormEditModal').fadeOut('fast',
                    function () {
                        $('#' + set.model + 'FormEditModal').remove();
                    });
            } else {
                $('#' + set.model + 'FormEditModal').modal("hide");
            }
            $('body').removeClass('overflow-hidden');
        };
        s.eventModal = function () {
            $('.form-cancel').unbind().click(function () {
                s.hideModal();
            });

            var wh = $(window).height();
            var fem = '#formEditModal';
            var h = $(fem + ' form').height();
            h += 57 + 60;
            var t = (wh - h) / 4;
            if (wh < h) {
                t = 0;
                h = wh;
            }
            $(fem + ' .wtable-epanel-content')
                .css('height', h + 'px')
                .css('top', t + 'px');

            $(window).resize(function () {
                var modal = set.modal;
                if (modal.type == 2) {
                    var ww = $(window).width();
                    wh = $(window).height();
                    var mw = modal.width;
                    var l = '';
                    if (mw.indexOf('%') > -1) {
                        mw = mw.substr(0, mw.length - 1);
                        l = ((100 - parseInt(mw)) / 2) + '%';
                    } else if (mw.indexOf('px') > -1) {
                        mw = mw.substr(0, mw.length - 2);
                        mw = parseInt(mw);
                        if (ww > mw) {
                            l = ((ww - mw) / 2) + 'px';
                        } else {
                            l = '0px';
                        }
                    }
                    var h = $(fem + ' form').height();
                    h += 57 + 60;
                    t = (wh - h) / 4;
                    if (wh < h) {
                        t = 0;
                        h = wh;
                    }
                    $(fem + ' .wtable-epanel-content')
                        .css('left', l)
                        .css('height', h + 'px')
                        .css('top', t + 'px');
                }
            });

            $(fem).on('keyup keypress',
                function (e) {
                    var keyCode = e.keyCode || e.which;
                    if (keyCode === 13) {
                        e.preventDefault();
                        return false;
                    }
                });

        };
        s.initModal = function (modal, content) {
            var html = '';
            if (modal.type == 2) {
                var ww = $(window).width();
                var mw = modal.width;
                var l = '';
                if (mw.indexOf('%') > -1) {
                    mw = mw.substr(0, mw.length - 1);
                    l = ((100 - parseInt(mw)) / 2) + '%';
                } else if (mw.indexOf('px') > -1) {
                    mw = mw.substr(0, mw.length - 2);
                    mw = parseInt(mw);
                    if (ww > mw) {
                        l = ((ww - mw) / 2) + 'px';
                    }
                }
                html = '<div class="wtable-epanel" id="' + set.model + 'FormEditModal" data-type="' + modal.type + '">';
                if (modal.width != "") {
                    html += '<div class="wtable-epanel-content" style="width:' + modal.width + ';left: ' + l + '">';
                } else {
                    html += '<div class="wtable-epanel-content">';
                }
                html += '<div class="panel panel-flat wtable-panel">';
                html += content;
                html += '</div></div></div>';
                $("body").append(html);
            } else {
                html = '<div class="modal" id="' +
                    set.model +
                    'FormEditModal" data-type="' +
                    modal.type +
                    '" data-backdrop="static"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
                if (modal.width != "") {
                    html += '    <div class="modal-dialog" style="width:' + modal.width + '">';
                } else {
                    html += '    <div class="modal-dialog" >';
                }
                html += '<div class="modal-content">';
                html += '      <div class="modal-header p-15 ' +
                    (modal.headerClass != null ? modal.headerClass : '') +
                    '">';
                html +=
                    '          <button class="close" aria-hidden="true" data-dismiss="modal" type="button">×</button>';
                html += '              <h5 class="modal-title text-bold">' + modal.title + '</h5>';
                html += '          </div><form id="' +
                    set.model +
                    'Form" class="form-horizontal">' +
                    '<div class="modal-body ' +
                    (modal.noPaddingBody != null ? 'no-padding' : 'pt-15 pl-15 pr-15 pb-5') +
                    '">';
                html += content;
                html += '</div>';
                if (modal.footerTemplate != null) {
                    html += $(modal.footerTemplate).html();
                } else {
                    switch (modal.mode) {
                        case 2:
                            {
                                html += '<div class="panel-footer panel-footer p-15">' +
                                    '<div class="pull-right">' +
                                    '<button class="btn btn-sm btn-default form-cancel mr-10 btn-rounded" data-dismiss="modal">' +
                                    '<i class="fa fa-remove"></i> Thoát' +
                                    '</button>' +
                                    '<button class="btn btn-sm bg-slate mr-10 btn-submit btn-rounded" type="button" data-mode="1" ' +
                                    'data-loading-text="<i class=' +
                                    "'icon-spinner4 fa-spin position-left'" +
                                    '></i> Lưu tạm">' +
                                    '<i class="icon-floppy-disk position-left"></i> Lưu tạm' +
                                    '</button>' +
                                    '<button class="btn btn-sm btn-success btn-submit btn-rounded" type="button" data-mode="2" ' +
                                    'data-loading-text="<i class=' +
                                    "'icon-spinner4 fa-spin position-left'" +
                                    '></i> Lưu và gửi đề xuất">' +
                                    '<i class="icon-paperplane position-left"></i> Lưu và gửi đề xuất' +
                                    '</button>' +
                                    '</div>' +
                                    '</div>';
                            }
                            break;
                        case 3:
                            {
                                html += '<div class="panel-footer panel-footer p-15">' +
                                    '<div class="pull-right">' +
                                    '<button class="btn btn-sm btn-default form-cancel mr-10 btn-rounded" data-dismiss="modal">' +
                                    '<i class="fa fa-remove"></i> Thoát' +
                                    '</button>' +
                                    '<button class="btn btn-sm bg-slate mr-10 btn-submit btn-rounded" type="button" data-mode="1" ' +
                                    'data-loading-text="<i class=' +
                                    "'icon-spinner4 fa-spin position-left'" +
                                    '></i> Lưu tạm">' +
                                    '<i class="icon-floppy-disk position-left"></i> Lưu tạm' +
                                    '</button>' +
                                    '<button class="btn btn-sm btn-success btn-submit btn-rounded" type="button" data-mode="3" ' +
                                    'data-loading-text="<i class=' +
                                    "'icon-spinner4 fa-spin position-left'" +
                                    '></i> Lưu và gửi đề xuất">' +
                                    '<i class="icon-check position-left"></i> Lưu và ký chốt' +
                                    '</button>' +
                                    '</div>' +
                                    '</div>';
                            }
                            break;
                        default:
                            {
                                html += '<div class="panel-footer panel-footer p-15">' +
                                    '<div class="pull-right">' +
                                    '<button class="btn btn-sm btn-default form-cancel mr-10 btn-rounded" data-dismiss="modal">' +
                                    '<i class="fa fa-remove"></i> Thoát' +
                                    '</button>' +
                                    '<button class="btn btn-sm btn-fill btn-primary m-r-5 btn-submit btn-rounded" type="button" ' +
                                    'data-loading-text="<i class=' +
                                    "'icon-spinner4 fa-spin'" +
                                    '></i> Đang xử lý ...">' +
                                    '<i class="fa fa-save"></i> Lưu lại' +
                                    '</button>' +
                                    '</div>' +
                                    '</div>';
                            }
                    }
                }
                html += '</form></div></div></div>';
                $("body").append(html);
                $('#' + set.model + 'FormEditModal').on('hidden.bs.modal',
                    function (e) {
                        $('body').removeClass('overflow-hidden');
                        $('#' + set.model + 'FormEditModal').remove();
                    });
            }
        }
        s.showModal = function () {
            var type = parseInt($('#' + set.model + 'FormEditModal').attr('data-type'));
            if (type == 2) {

                $('#' + set.model + 'FormEditModal').fadeIn('fast');
            } else {
                $('#' + set.model + 'FormEditModal').modal("show");
            }
            $('body').addClass('overflow-hidden');
        }
        s.createOrUpdateObject = function (par, callback, tr) {
            s.showTableLoading();
            var url = set.editController != null ? set.editController + '/' : '/admin/';
            url += set.model + "Edit";
            $.extend(s.editParams, par);
            $.ajax({
                url: url,
                type: "GET",
                data: s.editParams,
                dataType: "html",
                success: function (result) {
                    s.hideTableLoading();
                    var m = set.modal;
                    s.initModal({
                        title: 'Thêm mới ' + m.title,
                        width: m.width,
                        type: m.type != null ? m.type : 1,
                        noPaddingBody: m.noPaddingBody,
                        headerClass: m.headerClass,
                        noFooter: m.noFooter,
                        mode: m.mode
                    },
                        result);
                    s.eventModal();
                    s.showModal();

                    if (set.loadModalCallback != null) {
                        set.loadModalCallback(tr);
                    }
                    if (callback) {
                        callback();
                    }
                }
            });
        };
        s.getSelectedIds = function () {
            var ids = [];
            $.each($(sel).find('> .salary-table > .main-content .area-br tr'),
                function (k, tr) {
                    if ($(tr).hasClass("active")) {
                        ids.push($(tr).attr("dataid"));
                    }
                });
            return ids;
        }

        s.unique = function (list) {
            var result = [];
            $.each(list, function (i, e) {
                if ($.inArray(e, result) == -1) result.push(e);
            });
            return result;
        }

        s.getCheckedRowIds = function () {
            var result = [];
            $.each(s.viewData, function () {
                var r = this;
                if (r.left.length > 0) {
                    var arr = [];
                    $(r.left).each(function () {
                        if (this.checked) {
                            arr.push(parseInt(this.id));
                        }
                    });
                    if (arr.length > 0) {
                        result.push({
                            gid: r.gid,
                            ids: arr
                        });
                    }
                }
            });

            return result;
        }
        s.getCheckedDatas = function () {
            var result = [];
            var idAttr = "Id";
            if (set.idAttribute != null) {
                idAttr = set.idAttribute;
            }
            var ids = s.getCheckedRowIds();
            for (var i = 0; i < ids.length; i++) {
                $(s.sourceData).each(function () {
                    if (this[idAttr] == ids[i]) {
                        result.push(this);
                        return false;
                    }
                });
            }
            return result;
        };
        s.setCheckedRowIds = function (ids) {
            var mc = $(sel).find('> .salary-table > .main-content');
            for (var i = 0; i < ids.length; i++) {
                var tr = mc.find('.area-bl tr[dataid="' + ids[i] + '"]');
                var checkbox = $(tr).find('.first-col input[type="checkbox"]');
                checkbox.prop('checked', true);
            }
            $.uniform.update();
        }
        s.getSelectedRow = function () {
            var tr = $(sel).find('> .salary-table > .main-content .area-br tr[class="active"]').first();
            return tr;
        };
        s.getSelectedDatas = function () {
            var result = [];
            var idAttr = "Id";
            if (set.idAttribute != null) {
                idAttr = set.idAttribute;
            }
            var ids = s.getSelectedIds();
            for (var i = 0; i < ids.length; i++) {
                $(s.sourceData).each(function () {
                    if (this[idAttr] == ids[i]) {
                        result.push(this);
                        return false;
                    }
                });
            }
            return result;
        };

        s.addChild = function (param, tr) {
            s.showTableLoading();
            var url = set.editController != null ? set.editController + '/' : '/admin/';
            url += set.model + "Edit";

            var m = set.modal;

            $.ajax({
                url: url,
                type: "GET",
                data: param,
                dataType: "html",
                success: function (result) {
                    s.hideTableLoading();
                    s.initModal({
                        title: 'Thêm ' + m.title.toLowerCase(),
                        width: m.width,
                        type: m.type != null ? m.type : 1,
                        mode: m.mode
                    },
                        result);
                    s.eventModal();
                    s.showModal();

                    if (set.loadModalCallback != null) {
                        set.loadModalCallback(tr);
                    }
                }
            });
        };

        s.getDataById = function (id) {
            var data;
            var idAttr = "Id";
            if (set.idAttribute != null) {
                idAttr = set.idAttribute;
            }
            $(s.sourceData).each(function () {
                if (this[idAttr] == id) {
                    data = this;
                    return false;
                }
            });
            return data;
        };
        s.getActiveTabIndex = function () {
            var index = $(sel).find('> .salary-table > .sub-content > .tab-content > div.active').index();
            return index;
        }
        s.loadFilterOption = function (ele, callback) {
            if (!$(ele).hasClass('loaded')) {
                var idex = ele.attr('data-index');
                var f = set.rows[idex].filter;
                if (f.ajax != null) {
                    var par = f.ajax.data;
                    app.loadData(f.ajax.url,
                        par,
                        null,
                        function (result) {
                            ele.addClass('loaded');
                            var lst = result.Many != null ? result.Many : result;
                            $(lst).each(function () {
                                var option = new Option(this[f.ajax.attr.text],
                                    this[f.ajax.attr.id],
                                    true,
                                    true);
                                ele.append(option);
                            });
                            ele.select2('val', '');

                            if (callback != null) {
                                callback();
                            }
                        });
                    return true;
                }
            }
        }
        s.setStaticEvents = function () {
            s.resize();
            $(window).resize(function () {
                s.resize();
            });

            var mc = $(sel).find('> .salary-table > .main-content');
            var rs = $(sel).find('> .salary-table > .resize');
            var sc = $(sel).find('> .salary-table > .sub-content');
            var scm = $('#sub_content_modal');

            window.addEventListener('touchstart',
                function (e) {
                    s.tounchTr = $(e.target).closest('.area');
                });

            $(mc).find(' .area').mouseover(function () {
                s.tounchTr = $(this);
            });

            mc.find('.area-tr > div').scroll(function () {
                if ($(s.tounchTr).length == 0 || $(s.tounchTr).hasClass('area-tr')) {
                    var l = $(this).scrollLeft();
                    mc.find('.area-br > div').scrollLeft(l);
                }
            });

            mc.find('.area-br > div').scroll(function (e) {
                if ($(s.tounchTr).length == 0 || $(s.tounchTr).hasClass('area-br')) {
                    clearTimeout($.data(this, "scrollCheck"));
                    var t = $(this).scrollTop();
                    var l = $(this).scrollLeft();

                    mc.find('.area-bl > div').scrollTop(t);
                    mc.find('.area-tr > div').scrollLeft(l);
                    $.data(this, "scrollCheck", setTimeout(function () {
                        if (!s.searching) {
                            s.showData(t);
                        }
                    }, 100));
                }
            });

            mc.find('.area-bl > div').scroll(function () {
                if ($(s.tounchTr).length == 0 || $(s.tounchTr).hasClass('area-bl')) {
                    var t = $(this).scrollTop();
                    mc.find('.area-br > div').scrollTop(t);
                    clearTimeout($.data(this, "scrollCheck"));
                    $.data(this, "scrollCheck", setTimeout(function () {
                        if (!s.searching) {
                            s.showData(t);
                        }
                    }, 200));
                }
            });

            mc.find('.styled').uniform();

            var tempPosition;

            rs.draggable({
                axis: "y",
                start: function (event, ui) {
                    tempPosition = ui.position.top;
                },
                stop: function (event, ui) {
                    var newValue = ui.position.top;
                    var change = newValue - tempPosition;
                    var oh = mc.find('.areas').height();
                    s.setMainTableHeight(oh + change);
                    rs.css('top', 0);
                    oh = sc.find('> .tab-content').height();
                    s.setSubContentHeight(oh + 70 - change);
                }
            });

            rs.find('.btn-expand-main-content').unbind().click(function () {
                var at = $(sel).find('.salary-table');
                var b = $(this);
                var h = at.height();
                if (at.hasClass('expand')) {
                    sc.css('display', 'block');
                    at.removeClass('expand');
                    b.find('i').removeClass('icon-arrow-up5').addClass('icon-arrow-down5');
                    s.setMainTableHeight(parseInt(h / 2));
                } else {
                    sc.css('display', 'none');
                    at.addClass('expand');
                    b.find('i').removeClass('icon-arrow-down5').addClass('icon-arrow-up5');
                    if (set.footer == null || set.footer) {
                        s.setMainTableHeight(h - 35);
                    } else {
                        s.setMainTableHeight(h);
                    }

                }
            });

            sc.find('.btn-scroll-tab-right').unbind().click(function () {
                var d = $(this).closest('.tabbable').find('.tabs-group > div');
                var leftPos = d.scrollLeft();
                d.animate({ scrollLeft: leftPos + 200 }, 100);
            });
            sc.find('.btn-scroll-tab-left').unbind().click(function () {
                var d = $(this).closest('.tabbable').find('.tabs-group > div');
                var leftPos = d.scrollLeft();
                d.animate({ scrollLeft: leftPos - 200 }, 100);
            });

            sc.find('.btn-select-tab').unbind().click(function () {
                var id = $(this).attr('href');
                var a = sc.find('.tabs-group a[href="' + id + '"]');
                a.tab('show');
                var d = sc.find('.tabs-group > div');
                var left = parseInt(a.closest('li').attr('data-pos'));
                d.animate({ scrollLeft: left }, 100);
            });

            if (set.toolbars != null) {
                if (set.toolbars.create != null) {
                    $(set.toolbars.create.ele).unbind().click(function () {
                        if (set.toolbars.create.click != null) {
                            set.toolbars.create.click();
                        } else {
                            var btn = $(this);
                            btn.button('loading');
                            s.createOrUpdateObject(null,
                                function () {
                                    btn.button('reset');
                                });
                        }
                    });
                }
                if (set.toolbars.edit != null) {

                    var te = set.toolbars.edit;

                    $(te.ele).prop('disabled', true);
                    $(te.ele).unbind().click(function () {
                        var id = s.getSelectedIds()[0];
                        var tr = s.getSelectedRow();
                        var btn = $(this);
                        if (app.hasValue(id)) {
                            var data = s.getDataById(id);
                            if (te.before == null || te.before(data)) {
                                if (te.click != null) {
                                    te.click(id);
                                } else {
                                    btn.button('loading');
                                    s.createOrUpdateObject({ id: id },
                                        function () {
                                            btn.button('reset');
                                        },
                                        tr);
                                }
                            }
                        } else {
                            app.notify('warning', 'Vui lòng chọn đối tượng cần sửa');
                        }
                    });
                }
                if (set.toolbars.delete != null) {
                    var td = set.toolbars.delete;
                    $(td.ele).prop('disabled', true);
                    $(td.ele).unbind().click(function () {
                        var ids = s.getCheckedRowIds();
                        if (ids.length > 0) {
                            if (td.before == null || td.before(ids)) {
                                s.deleteObjects('bulk',
                                    ids,
                                    function () {
                                        s.loadData();
                                    });
                            }
                        } else {
                            app.notify('warning', 'Vui lòng chọn đối tượng cần xóa');
                        }
                    });
                }
                if (set.toolbars.reload != null) {
                    $(set.toolbars.reload.ele).unbind().click(function () {
                        s.loadData();
                    });
                }
                if (set.toolbars.reorder != null) {
                    $(set.toolbars.reorder.ele).unbind().click(function () {
                        var ids = s.getCheckedRowIds();
                        if (ids.length == 0) {
                            app.notify('warning', 'Vui lòng chọn dữ liệu để sắp xếp');
                        } else {

                        }
                    });
                }
            }

            mc.find('.first-col input[type="checkbox"]').click(function () {
                var ca = mc.find(".checkAll");
                var tr = $(this).closest('tr');
                var id = tr.attr('dataid');
                if ($(this).prop("checked")) {
                    $(sel).find('.area-bl tr[dataid="' + id + '"]').addClass("active");
                    $(sel).find('.area-br tr[dataid="' + id + '"]').addClass("active");
                } else {
                    $(sel).find('.area-bl tr[dataid="' + id + '"]').removeClass("active");
                    $(sel).find('.area-br tr[dataid="' + id + '"]').removeClass("active");
                    if (ca.prop("checked")) {
                        ca.prop('checked', false);
                    }
                }
                var checkNumber = 0;
                var inputs = mc.find(' .first-col input');

                inputs.each(function () {
                    if ($(this).prop("checked") == true) {
                        checkNumber++;
                    }
                });

                if (inputs.length == checkNumber) {
                    ca.prop('checked', true);
                }
                if (set.toolbars != null) {
                    if (set.toolbars.delete != null) {
                        if (checkNumber > 0) {
                            $(set.toolbars.delete.ele).prop('disabled', false);
                        } else {
                            $(set.toolbars.delete.ele).prop('disabled', true);
                        }
                    }
                }
                $.uniform.update();
                if (set.selectRowCallback != null) {
                    set.selectRowCallback(tr);
                }
            });

            if (set.filterable) {

                mc.find('.tr-filter .btn').unbind().click(function () {

                });

                mc.find('.tr-filter .select-option').unbind().select2({
                    minimumResultsForSearch: 1,
                    dropdownCssClass: 'bigdrop'
                }).on('select2-open',
                    function (e) {
                        var ele = $(this);
                        s.loadFilterOption(ele, function () {
                            ele.select2('close').select2('open');
                            return true;
                        });
                    }).on("change",
                        function (e) {
                            var ele = $(e.target);
                            var f = set.rows[ele.attr('data-index')];
                            var attr = f.attribute;
                            var w = parseInt(ele.attr('data-width'));

                            if (f.filter.reload) {
                                var p = {};
                                p[attr] = e.val;
                                s.loadData(p, function () { }, true);
                            } else {
                                var ex = false;
                                $(s.filter.attrs).each(function () {
                                    if (this.attr == attr) {
                                        switch (f.filter.dataType) {
                                            case 'int':
                                                {
                                                    this.v = e.val != '' ? parseInt(e.val) : null;
                                                }
                                                break;
                                            case 'float':
                                                {
                                                    this.v = e.val != '' ? parseFloat(e.val) : null;
                                                }
                                                break;
                                            default:
                                                {
                                                    this.v = e.val != '' ? e.val : null;
                                                }
                                                break;
                                        }
                                        ex = true;
                                    }
                                });
                                if (!ex) {
                                    s.filter.attrs.push(
                                        {
                                            attr: attr,
                                            type: 'option',
                                            v: e.val != '' ? e.val : null
                                        });
                                }
                                s.search();
                            }
                        });

                mc.find('.tr-filter .select-option-remote').each(function () {
                    var ele = $(this);
                    var idex = $(this).attr('data-index');
                    var f = set.rows[idex].filter;
                    ele.unbind().select2({
                        ajax: {
                            url: f.ajax.url,
                            dataType: 'json',
                            quietMillis: 200,
                            data: function (term, page) {
                                var k = app.toKeyword(term);
                                var sd = $.extend({
                                    keyword: k,
                                    limit: 10
                                },
                                    f.ajax.data);
                                return sd;
                            },
                            results: function (result) {
                                var data = [];
                                $(result).each(function () {
                                    data.push({
                                        id: this[f.ajax.attr.id],
                                        text: this[f.ajax.attr.text]
                                    });
                                });
                                return {
                                    results: data
                                };
                            }
                        },
                        minimumInputLength: 1,
                        minimumResultsForSearch: 1,
                        dropdownCssClass: 'bigdrop',
                        allowClear: true,
                        placeholder: 'Tất cả'
                    }).on("change",
                        function (e) {
                            var ele = $(e.target);
                            var f = set.rows[ele.attr('data-index')];
                            var p = {};
                            if (f.filter.prop != null) {
                                p[f.filter.prop] = e.val;
                            } else {
                                p[f.attribute] = e.val;
                            }
                            var w = parseInt(ele.attr('data-width'));
                            ele.closest('div').find('.select2-container').css('width', (w - 30) + 'px');
                            s.search(p);
                        });
                });

                var globalTimeout = null;
                mc.find('.filter-contains').unbind().keyup(function () {
                    var attr = $(this).attr('attr');
                    var ele = $(this);
                    var key = $(this).val();
                    var idex = ele.attr('data-index');
                    var f = set.rows[idex].filter;

                    if (globalTimeout != null) {
                        clearTimeout(globalTimeout);
                    }
                    globalTimeout = setTimeout(function () {
                        if (f.reload) {
                            var par = {};
                            par[attr] = key;
                            s.loadData(par,
                                function () { },
                                true);
                        } else {
                            var e = false;
                            $(s.filter.attrs).each(function () {
                                if (this.attr == attr) {
                                    this.v = key;
                                    e = true;
                                }
                            });
                            if (!e) {
                                s.filter.attrs.push(
                                    {
                                        attr: attr,
                                        type: 'contains',
                                        v: key
                                    });
                            }
                            s.search();
                        }
                        clearTimeout(globalTimeout);
                    }, 300);
                });
            }


            if (set.height.correlate != null) {
                set.height.correlate.attrchange({
                    callback: function (e) {
                        var curHeight = $(this).height();
                        var th = curHeight - (set.toolbars != null ? 40 : 0);
                        var at = $(sel).find('> .salary-table');
                        at.css('height', th);
                        if (set.subContent != null) {
                            if (at.hasClass('expand')) {
                                s.setMainTableHeight(th - 35);
                            } else {
                                s.setMainTableHeight(parseInt(th / 2));
                            }
                            s.setSubContentHeight(parseInt(th / 2));
                        } else {
                            s.setMainTableHeight(th - 35);
                        }
                    }
                });
            }

            $(document).on('click', function (e) {
                if (!$(e.target).hasClass('edit-inline') && !$(e.target).hasClass('span-edit-inline')) {
                    if ($(e.target).closest(".inline-form").length === 0) {
                        var cell = $('.areas tr td.editing');
                        if (cell.length > 0) {
                            var inp = cell.find('.form-control');
                            s.closeEditInline(inp, inp.val(), inp.attr('data-type'));
                        }
                    }
                }
            });

            $(sel).find('.btn-export').unbind().click(function () {
                var url = set.params.export.url;
                var pr = s.searchParams;
                app.cleanJson(pr);
                url += '?' + $.param(pr);
                window.open(url, '_blank');
            });
            $(sel).find('.btn-import').unbind().click(function () {
                $('#importModal').modal('show');
                s.initImportForm();
            });

            $('#import_form').ultraForm({
                uiType: 1, action: '/cb/CbFamilyReduceEdit',
                actionType: 'ajax', props: [
                    { name: 'employeeType', type: 'hidden' },
                    { name: 'type', type: 'hidden' },
                    {
                        name: 'File', type: 'file',
                        option: {
                            uploadFirst: true
                        },
                        required: {
                            message: 'Chọn file cần import'
                        }
                    }
                ],
                validCallback: function (data, btn) {
                    data = app.formDataToJson(data);
                }
            });


            $('a').click(function () {
                if (set.group != null) {
                    if (set.group.sequentially && s.sequentially.loading && s.sequentially.ajax != null) {
                        s.sequentially.ajax.abort();
                    }
                }
            });

            $('.th-hide').click(function () {
                var x, y;
                var b = $(this);
                var th = b.closest('th');
                var ri = parseInt(th.attr('ri'));
                var chs = [];
                var ci = th.attr('ci');
                if (ci.indexOf('-') > 0) {
                    var arr = ci.split('-');
                    x = parseInt(arr[0]);
                    y = parseInt(arr[1]);
                    for (var j = x; j <= y; j++) {
                        chs.push(j);
                    }
                } else {
                    chs.push(parseInt(ci));
                }

                var cols = mc.find('.area-tr colgroup col');
                $(cols).each(function () {
                    var i = parseInt($(this).attr('i'));
                    if ($.inArray(i, chs) >= 0) {
                        $(this).css('width', 2);
                    }
                });

                cols = mc.find('.area-br colgroup col');
                $(cols).each(function () {
                    var i = parseInt($(this).attr('i'));
                    if ($.inArray(i, chs) >= 0) {
                        $(this).css('width', 2);
                    }
                });

                th.addClass('hided');

                if (chs.length > 1) {
                    for (var k = ri + 1; k <= set.cols.right.length; k++) {
                        cols = mc.find('.area-tr thead th[ri="' + k + '"]');
                        $(cols).each(function () {
                            var ci = $(this).attr('ci');
                            if (ci.indexOf('-') > 0) {
                                var arr = ci.split('-');
                                x = parseInt(arr[0]);
                                y = parseInt(arr[1]);

                                if ($.inArray(x, chs) >= 0 && $.inArray(y, chs) >= 0) {
                                    $(this).addClass('hided');
                                }

                            } else {
                                ci = parseInt(ci);
                                if ($.inArray(ci, chs) >= 0) {
                                    $(this).addClass('hided');
                                }
                            }
                        });
                    }
                }

                //$(chs).each(function() {

                //});
            });

            $('.th-unhide').click(function () {
                var x, y, k;
                var b = $(this);
                var th = b.closest('th');
                var ri = parseInt(th.attr('ri'));
                var chs = [];
                var ci = th.attr('ci');
                if (ci.indexOf('-') > 0) {
                    var arr = ci.split('-');
                    x = parseInt(arr[0]);
                    y = parseInt(arr[1]);
                    for (var j = x; j <= y; j++) {
                        chs.push(j);
                    }
                } else {
                    chs.push(parseInt(ci));
                }

                var cols = mc.find('.area-tr colgroup col');
                $(cols).each(function () {
                    var i = parseInt($(this).attr('i'));
                    if ($.inArray(i, chs) >= 0) {
                        var w = $(this).attr('w');
                        $(this).css('width', w + 'px');
                    }
                });

                cols = mc.find('.area-br colgroup col');
                $(cols).each(function () {
                    var i = parseInt($(this).attr('i'));
                    if ($.inArray(i, chs) >= 0) {
                        var w = $(this).attr('w');
                        $(this).css('width', w + 'px');
                    }
                });

                th.removeClass('hided');

                if (chs.length > 1) {
                    for (k = ri + 1; k <= set.cols.right.length; k++) {
                        cols = mc.find('.area-tr thead th[ri="' + k + '"]');
                        $(cols).each(function () {
                            ci = $(this).attr('ci');
                            if (ci.indexOf('-') > 0) {
                                var arr = ci.split('-');
                                x = parseInt(arr[0]);
                                y = parseInt(arr[1]);

                                if ($.inArray(x, chs) >= 0 && $.inArray(y, chs) >= 0) {
                                    $(this).removeClass('hided');
                                }

                            } else {
                                ci = parseInt(ci);
                                if ($.inArray(ci, chs) >= 0) {
                                    $(this).removeClass('hided');
                                }
                            }
                        });
                    }
                }

                // bỏ ẩn cha
                if (ri > 1) {
                    for (k = 1; k < ri; k++) {
                        cols = mc.find('.area-tr thead th[ri="' + k + '"]');
                        $(cols).each(function () {
                            ci = $(this).attr('ci');
                            if (ci.indexOf('-') > 0) {
                                var arr = ci.split('-');
                                x = parseInt(arr[0]);
                                y = parseInt(arr[1]);
                                if (chs.length > 1) {
                                    if (x <= chs[0] && y >= chs[chs.length - 1]) {
                                        $(this).removeClass('hided');
                                    }
                                } else {
                                    if (x <= chs[0] && chs[0] <= y) {
                                        $(this).removeClass('hided');
                                    }
                                }
                            } else {
                                ci = parseInt(ci);
                                if (chs.length == 1) {
                                    if (ci == chs[0]) {
                                        $(this).removeClass('hided');
                                    }
                                }
                            }
                        });
                    }
                }
            });

            $('[data-toggle="tooltip"]').tooltip({
                html: true
            });
        };
        s.initImportForm = function () {

        }
        s.reorder = function (tr) {
            var rom = '#reorder_modal';
            if ($(rom).length == 0) {
                var html =
                    '<div class="modal fade" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">' +
                    '<div class="modal-dialog modal-sm" role="document">' +
                    '<div class="modal-content"></div></div>' +
                    '</div>';
            } else {

            }
        }

        s.resetGroupPosition = function () {
            var mc = $(sel).find('> .salary-table > .main-content');
            var trs = mc.find('tr.tr-group');
            var top = 0;
            $(trs).each(function () {
                $(this).attr('data-top', top);

                if ($(this).hasClass('expanded')) {
                    var v = $(this).attr('data-height');
                    top += parseInt(v);
                } else {
                    top += s.hr;
                }
            });

            var t = mc.find('.area-br > div').scrollTop();
            s.showData(t);
        }

        s.expandChild = function (btn, tr, mc) {
            var gid = parseInt(tr.attr('groupid'));
            var i = btn.find('i');
            var trs = mc.find('tr[groupid="' + gid + '"]:not(.tr-group)');

            mc.find('tbody tr.tr-real').remove();

            if (tr.hasClass('expanded')) {
                trs.remove();
                $(s.viewData).each(function () {
                    this.active = true;
                    if (this.gid == gid) {
                        if (this.count > 0) {
                            for (var j = 0; j < this.count; j++) {
                                this.left[j].active = false;
                            }
                        }
                    }
                });

                tr.removeClass('expanded');
                i.removeClass('icon-arrow-down5').addClass('icon-arrow-right5');
            } else {
                $(s.viewData).each(function () {
                    this.active = true;
                    if (this.gid == gid) {
                        if (this.count > 0) {
                            for (var j = 0; j < this.count; j++) {
                                this.left[j].active = true;
                            }
                        }
                    }
                });

                tr.addClass('expanded');
                i.removeClass('icon-arrow-right5').addClass('icon-arrow-down5');
            }

            s.setRowPositions();
            s.showBackground();
            s.showData(0);
        }

        s.setRowEvents = function () {
            var mc = $(sel).find('> .salary-table > .main-content');
            mc.find('.styled').uniform();

            mc.find(".area-bl tr td").unbind().click(function (e) {
                if (e.target != this) return;
                s.selectRow($(this).closest('tr'));
            });

            mc.find(".area-bl tr").unbind().hover(function () {
                var id = $(this).attr('dataid');
                $(sel).find('.area-br tr[dataid="' + id + '"]').addClass('hover');
                $(this).addClass('hover');
                $(this).addClass('hover');

            },
                function () {
                    var id = $(this).attr('dataid');
                    $(sel).find('.area-br tr[dataid="' + id + '"]').removeClass('hover');
                    $(this).removeClass('hover');
                    $(this).removeClass('hover');
                });
            mc.find(".area-br tr").unbind().hover(function () {
                var id = $(this).attr('dataid');
                $(sel).find('.area-bl tr[dataid="' + id + '"]').addClass('hover');
                $(this).addClass('hover');
                $(this).addClass('hover');

            },
                function () {
                    var id = $(this).attr('dataid');
                    $(sel).find('.area-bl tr[dataid="' + id + '"]').removeClass('hover');
                    $(this).removeClass('hover');
                    $(this).removeClass('hover');
                });

            mc.find(".area-br tr td").unbind().click(function (e) {
                if (e.target != this) return;
                s.selectRow($(this).closest('tr'));
            });

            mc.find(".area td.edit-inline").unbind().click(function (e) {
                if (e.target != this) return;
                if (!$(this).hasClass('editing')) {
                    var fct = mc.find('.area td.editing > .inline-form .form-control');

                    if (fct.length > 0) {
                        s.closeEditInline(fct, fct.val(), fct.attr('data-type'));
                    }

                    $(this).addClass('editing');
                    var inp = $(this).find('.form-control');
                    if ($(inp).is("select")) {
                        $(inp).trigger('open');
                    } else {
                        inp.focus().select();
                    }

                }
            });

            mc.find(".area td.edit-inline > span").unbind().click(function (e) {
                //if (e.target != this) return;
                $(this).closest('td').trigger("click");
            });

            mc.find('.area td.edit-inline input[type="checkbox"]').unbind().change(function (e) {
                if (e.target != this) return;
                s.closeEditInline($(this), $(this).prop('checked'));
            });

            mc.find('.area td.edit-inline select').unbind().change(function (e) {
                if (e.target != this) return;
                s.closeEditInline($(this), $(this).val());
            });

            mc.find('.btn-expander').unbind().click(function () {
                var btn = $(this);
                var tr = btn.closest('tr');
                s.expandChild(btn, tr, mc);
            });

            mc.find('.expand-child').unbind().click(function () {
                var arrow = $(this);
                var isExpand = arrow.hasClass('expand');
                var i = arrow.find('i');
                var tr = arrow.closest('tr');
                var parentId = tr.attr('dataid');
                var ai = tr.attr('ai');
                if (isExpand) {
                    arrow.removeClass('expand');
                    i.removeClass('icon-arrow-down12').addClass('icon-arrow-right13');
                    s.displayChilds(parentId, 'none', true);
                    s.displayChilds(parentId, 'none', false);
                } else {
                    arrow.addClass('expand');
                    i.removeClass('icon-arrow-right13');
                    var isLoaded = arrow.hasClass('loaded');
                    if (!isLoaded) {
                        i.addClass('icon-spinner10 spinner');
                        var level = arrow.attr('level');
                        var url = set.dataUrl != null ? set.dataUrl : '/api/' + set.model + "List";
                        loadData(url,
                            {
                                parentId: parentId
                            },
                            null,
                            function (result) {
                                var list = result.Many;
                                i.removeClass('icon-spinner10 spinner').addClass('icon-arrow-down12');
                                if (list != null && list.length > 0 && set.rows.length > 0) {

                                    var idAttr = "Id";
                                    if (set.idAttribute != null) {
                                        idAttr = set.idAttribute;
                                    }
                                    s.sumarray = [];
                                    var blInsertIndex = $(sel).find('.area-bl tbody tr[dataid="' + parentId + '"]');
                                    var brInsertIndex = $(sel).find('.area-br tbody tr[dataid="' + parentId + '"]');
                                    $.each(list,
                                        function (k, item) {
                                            var r = s.drawRow(item,
                                                idAttr,
                                                parseInt(level) + 1,
                                                ai + '.' + (k + 1),
                                                true);
                                            $(r).insertAfter(blInsertIndex);
                                            blInsertIndex = $(blInsertIndex).next();

                                            r = s.drawRow(item, idAttr, parseInt(level) + 1, ai + '.' + (k + 1), false);
                                            $(r).insertAfter(brInsertIndex);
                                            brInsertIndex = $(brInsertIndex).next();
                                        });

                                    s.setRowEvents();
                                    s.sourceData = $.merge(list, s.sourceData);
                                } else {
                                    i.addClass('hide');
                                }

                                arrow.addClass('loaded');
                                if (set.loadDataCallback != null) {
                                    set.loadDataCallback(result);
                                }
                            });
                    } else {
                        i.addClass('icon-arrow-down12');
                        s.displayChilds(parentId, 'table-row', true);
                        s.displayChilds(parentId, 'table-row', false);
                    }
                }
            });

            var input = mc.find(".area td.edit-inline input");

            input.unbind();

            input.keydown(function (e) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                var v = $(this).val(), c, tr, body, ai, nextStr, td;
                if (keycode == 9) {
                    s.closeEditInline($(this), v);
                    v = $(this).val();
                    c = $(this).attr('attr');
                    td = $(this).closest('td');
                    ai = parseInt(td.attr('i'));
                    tr = $(this).closest('tr');
                    var tds = tr.find('td.edit-inline');
                    nextStr = null;
                    $(tds).each(function () {
                        var tai = parseInt($(this).attr('i'));
                        if (tai > ai) {
                            nextStr = $(this);
                            return false;
                        }
                    });
                    if (nextStr == null) {
                        nextStr = tds.first();
                    }
                    if (nextStr.length > 0) {
                        nextStr.addClass('editing');
                        nextStr.find('input').focus().select();
                    }
                    return false;
                }
            });

            input.keyup(function (e) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                var v = $(this).val(), c, tr, body, ai, nextStr, td;
                if (keycode >= 65 && keycode <= 90) {

                }
                else {
                    switch (keycode) {
                        case 13:
                        case 40:  // xuống
                            {
                                s.closeEditInline($(this), v);
                                c = $(this).closest('td').attr('i');
                                tr = $(this).closest('tr');
                                body = tr.closest('body');
                                ai = parseInt(tr.attr('ai'));
                                nextStr = body.find('tr[ai="' + (ai + 1) + '"]');
                                if (nextStr.length == 0) {
                                    nextStr = body.find('tr[ai="1"]');
                                }
                                if (nextStr.length > 0) {
                                    td = nextStr.find('td[i="' + c + '"]');
                                    if (td.length > 0) {
                                        td.addClass('editing');
                                        td.find('input').focus().select();
                                    }
                                }
                            }
                            break;

                        case 39: // phải 
                            {
                                s.closeEditInline($(this), v);
                                c = $(this).attr('attr');
                                td = $(this).closest('td');
                                ai = parseInt(td.attr('i'));
                                tr = $(this).closest('tr');
                                var tds = tr.find('td.edit-inline');
                                nextStr = null;
                                $(tds).each(function () {
                                    var tai = parseInt($(this).attr('i'));
                                    if (tai > ai) {
                                        nextStr = $(this);
                                        return false;
                                    }
                                });
                                if (nextStr == null) {
                                    nextStr = tds.first();
                                }
                                if (nextStr.length > 0) {
                                    nextStr.addClass('editing');
                                    nextStr.find('input').focus().select();
                                }
                            }
                            break;
                        case 37: // trái
                            {
                                s.closeEditInline($(this), v);
                                c = $(this).attr('attr');
                                td = $(this).closest('td');
                                ai = parseInt(td.attr('i'));
                                tr = $(this).closest('tr');
                                var tds = tr.find('td.edit-inline');
                                nextStr = null;
                                $(tds).each(function () {
                                    var tai = parseInt($(this).attr('i'));
                                    if (tai < ai) {
                                        nextStr = $(this);
                                    }
                                });
                                if (nextStr == null) {
                                    nextStr = tds.last();
                                }
                                if (nextStr.length > 0) {
                                    nextStr.addClass('editing');
                                    nextStr.find('input').focus().select();
                                }
                            }
                            break;
                        case 38: // lên
                            {
                                s.closeEditInline($(this), v);
                                c = $(this).closest('td').attr('i');
                                tr = $(this).closest('tr');
                                body = tr.closest('body');
                                ai = parseInt(tr.attr('ai'));
                                nextStr = body.find('tr[ai="' + (ai - 1) + '"]');

                                if (nextStr.length == 0) {
                                    nextStr = body.find('tr:not(.tr-total)').last();
                                }
                                if (nextStr.length > 0) {
                                    td = nextStr.find('td[i="' + c + '"]');
                                    if (td.length > 0) {
                                        td.addClass('editing');
                                        td.find('input').focus().select();
                                    }
                                }
                            }
                            break;
                    }
                }
            });

            mc.find('.btn-add-row').unbind().click(function () {
                var gid = $(this).attr('groupid');
                var tr = $(this).closest('tr');
                var p = {};
                p[set.group.attr] = gid;
                s.createOrUpdateObject(p, null, tr);
            });

            if (set.contextMenu != null) {
                var cmt = $(sel).find('> .context-menu-salary-grid-popup');
                mc.find('.area-br tr[data-toggle="context"]').unbind().contextmenu({
                    target: cmt.selector,
                    before: function (e, context) {
                        e.preventDefault();

                        if (s.moveObjectId != null) {
                            this.getMenu().find('li .near')
                                .removeClass('disabled');
                        } else {
                            this.getMenu().find('li .near')
                                .addClass('disabled');
                        }

                        var menu = this.getMenu();
                        var id = $(context).attr('dataid');
                        var row = s.getDataById(id);

                        $(set.contextMenu).each(function () {
                            var li = menu.find('a.' + this.class).closest('li');
                            if (this.enable == null || this.enable(row)) {
                                li.css('display', 'block');
                                if (this.visible != null && !this.visible(row)) {
                                    li.find('a').addClass('disabled');
                                } else {
                                    if (this == 'edit' || this == 'delete') {
                                        var lis = menu.find('a[action="edit"], a[action="delete"]');
                                        if (row.Status != null && row.Status > 0) {
                                            lis.addClass('disabled');
                                        } else {
                                            lis.removeClass('disabled');
                                        }
                                    } else {
                                        li.find('a').removeClass('disabled');
                                    }
                                }
                            } else {
                                li.css('display', 'none');
                            }
                        });

                        return true;
                    },
                    onItem: function (context, e) {
                        var ct = $(e.currentTarget);
                        if (!ct.hasClass('dropdown-submenu')) {
                            if (!$(e.target).hasClass('disabled')) {
                                s.clickContextMenu(context, e);
                            }
                        } else {
                            if (!s.clickSubContextMenu) {
                                s.clickContextMenu(context, e);
                                s.clickSubContextMenu = true;
                            } else {
                                s.clickSubContextMenu = false;
                            }
                        }
                    }
                });

                mc.find('.area-bl tr[data-toggle="context"]').unbind().contextmenu({
                    target: cmt.selector,
                    before: function (e, context) {
                        e.preventDefault();
                        if (s.moveObjectId != null) {
                            this.getMenu().find('li .near')
                                .removeClass('disabled');
                        } else {
                            this.getMenu().find('li .near')
                                .addClass('disabled');
                        }
                        var menu = this.getMenu();
                        var id = $(context).attr('dataid');
                        var row = s.getDataById(id);

                        $(set.contextMenu).each(function () {
                            var li = menu.find('a.' + this.class).closest('li');
                            if (this.enable == null || this.enable(row)) {
                                li.css('display', 'block');
                                if (this.visible != null && !this.visible(row)) {
                                    li.find('a').addClass('disabled');
                                } else {
                                    li.find('a').removeClass('disabled');
                                }
                            } else {
                                li.css('display', 'none');
                            }
                        });
                        return true;
                    },
                    onItem: function (context, e) {
                        var ct = $(e.currentTarget);
                        if (!ct.hasClass('dropdown-submenu')) {
                            if (!$(e.target).hasClass('disabled')) {
                                s.clickContextMenu(context, e);
                            }
                        } else {
                            if (!s.clickSubContextMenu) {
                                s.clickContextMenu(context, e);
                                s.clickSubContextMenu = true;
                            } else {
                                s.clickSubContextMenu = false;
                            }
                        }
                    }
                });
            }

            mc.find(".check-group").unbind().click(function () {
                var gid = $(this).attr('groupid');
                var checked = $(this).is(":checked");

                mc.find('.area-bl tr[groupid="' + gid + '"] .first-col  input').prop("checked", checked);
                mc.find('.area-br tr[groupid="' + gid + '"] .first-col  input').prop("checked", checked);
                $.uniform.update();

                $(s.viewData).each(function () {
                    var r = this;
                    if (r.gid == gid) {
                        $(r.left).each(function () {
                            this.checked = checked;
                        });
                    }
                });

                if (set.selectRowCallback != null) {
                    set.selectRowCallback();
                }
            });

            mc.find(".checkAll").unbind().click(function () {
                var checked = $(this).is(":checked");
                mc.find('.area-bl td input[type="checkbox"]').prop("checked", checked);
                mc.find('.area-br td input[type="checkbox"]').prop("checked", checked);
                $.uniform.update();
                $(s.viewData).each(function () {
                    var r = this;
                    r.checked = checked;
                    if (r.left.length > 0) {
                        $(r.left).each(function () {
                            this.checked = checked;
                        });
                    }
                });

                if (set.selectRowCallback != null) {
                    set.selectRowCallback();
                }
            });

            mc.find('.check-item').click(function () {
                var checked = $(this).is(":checked");
                var id = parseInt($(this).attr('dataid'));
                $(s.viewData).each(function () {
                    var r = this;
                    $(r.left).each(function () {
                        if (this.id == id) {
                            this.checked = checked;
                        }
                    });
                });
            });
            if (set.height.fixHeight != true) {
                var childs = mc.find('.area-bl tbody tr.tr-child');
                childs.each(function () {
                    var h = $(this).height();
                    var id = $(this).attr('dataid');
                    var trr = mc.find('.area-br tr[dataid="' + id + '"]');
                    if (trr.height() >= h) {
                        $(this).css('height', trr.height());
                    } else {
                        $(trr).css('height', h);
                    }
                    var tro = mc.find('.area-bom tr[dataid="' + id + '"]');
                    if (tro.height() >= h) {
                        $(this).css('height', tro.height());
                    } else {
                        $(tro).css('height', h);
                    }
                });
            }
        };

        s.clearCheckbox = function () {
            var mc = $(sel).find('> .salary-table > .main-content');
            mc.find(".checkAll").prop('checked', false);
            mc.find(".check-group").prop('checked', false);
            $.uniform.update();
        }

        s.clickContextMenu = function (context, e) {
            var a = $(e.target);
            if (!a[0].hasAttribute('action')) {
                a = $(e.target).closest('a');
            }
            var tr = $(context.context);
            var act = a.attr('action');
            var cls = a.attr('class');

            switch (act) {
                case 'edit':
                    {
                        var id = $(tr).attr('dataid');
                        s.createOrUpdateObject({ id: id }, function () { }, $(tr));
                    }
                    break;
                case 'delete':
                    {
                        var id = $(tr).attr('dataid');
                        s.deleteObjects('bulk',
                            [id],
                            function () {
                                console.log('reload...');
                                s.loadData();
                            });
                    }
                    break;
                case 'move-top':
                    {
                        var id = $(tr).attr('dataid');
                        var url = set.editController != null ? set.editController + '/' : '/admin/';
                        url += 'ChangePriority' + set.model;
                        s.showTableLoading();
                        app.postData(url,
                            {
                                PriorityPosition: 'Top',
                                id: id
                            },
                            function (result) {
                                s.search({},
                                    function () {
                                        s.hideTableLoading();
                                    });
                            });
                    }
                    break;
                case 'move-bottom':
                    {

                    }
                    break;
                case 'chose-position':
                    {
                        app.notify('info', 'Chọn vị trí sắp xếp');
                        s.moveObjectId = $(tr).attr('dataid');
                    }
                    break;
                case 'near-above':
                    {
                        var url = set.editController != null ? set.editController + '/' : '/admin/';
                        url += 'ChangePriority' + set.model;
                        s.showTableLoading();
                        app.postData(url,
                            {
                                PriorityPosition: 'NearAbove',
                                NearId: $(tr).attr('dataid'),
                                id: s.moveObjectId
                            },
                            function (result) {
                                s.moveObjectId = null;
                                s.loadData({},
                                    function () {
                                        s.hideTableLoading();
                                    });
                            });
                    }
                    break;
                case 'near-under':
                    {
                        var url = set.editController != null ? set.editController + '/' : '/admin/';
                        url += 'ChangePriority' + set.model;
                        s.showTableLoading();
                        app.postData(url,
                            {
                                PriorityPosition: 'NearUnder',
                                NearId: $(tr).attr('dataid'),
                                id: s.moveObjectId
                            },
                            function (result) {
                                s.moveObjectId = null;
                                s.loadData({},
                                    function () {
                                        s.hideTableLoading();
                                    });
                            });
                    }
                    break;
                case 'add-child':
                    {
                        s.showTableLoading();
                        var url = set.editController != null ? set.editController + '/' : '/admin/';
                        url += set.model + "Edit";
                        $.extend(s.editParams,
                            {
                                parentId: tr.attr('dataid'),
                                id: null
                            });
                        $.ajax({
                            url: url,
                            type: "GET",
                            data: s.editParams,
                            dataType: "html",
                            success: function (result) {
                                s.hideTableLoading();
                                s.initModal({
                                    title: 'Thêm ' + set.modal.title.toLowerCase(),
                                    width: set.modal.width,
                                    type: set.modal.type != null ? set.modal.type : 1,
                                    mode: m.mode
                                },
                                    result);
                                s.eventModal();
                                s.showModal();

                                if (set.loadModalCallback != null) {
                                    set.loadModalCallback(tr);
                                }

                            }
                        });
                    }
                    break;
                case 'custom':
                    {
                        for (var i = 0; i < set.contextMenu.length; i++) {
                            var cm = set.contextMenu[i];
                            if (cls == cm.class) {
                                if (cm.click != null) {
                                    cm.click(tr);
                                    return false;
                                }
                            } else {
                                if (cm.childs != null) {
                                    for (var j = 0; j < cm.childs.length; j++) {
                                        var ch = cm.childs[j];
                                        if (cls == ch.class) {
                                            if (ch.click != null) {
                                                ch.click(tr);
                                                return false;
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                    break;
            }
        };
        s.updateRowValue = function (tr) {
            var id = parseInt(tr.attr('dataid'));
            var data = s.getDataById(id);
            var rowIndex = -1;
            var i;
            for (i = 0; i < s.sourceData.length; i++) {
                if (s.sourceData[i].Id == id) {
                    rowIndex = i;
                    break;
                }
            }

            for (i = 0; i < set.rows.length; i++) {
                var cell = set.rows[i];
                if (cell.formula != null) {
                    var v = cell.formula(data);
                    var txt = v;
                    var td = tr.find('td[attr="' + cell.attribute + '"]');

                    txt = cell.fixed != null ? txt.toFixed(cell.fixed) : Math.round(txt);
                    txt = cell.type == 'price' ? app.formatPrice(txt) : txt;

                    //if (cell.fixed != null) {
                    //    txt = v.toFixed(cell.fixed);
                    //} else {
                    //    txt = Math.round(v);
                    //}

                    td.find('span').text(txt);
                    td.find('input').val(txt);
                    data[cell.attribute] = v;
                }
            }
            s.sourceData[rowIndex] = data;
            return data;
        }
        s.updateGroupValue = function (tr) {
            var gid = parseInt(tr.attr('groupid'));
            var gtr = $(sel).find('.area-br tr.tr-group[groupid="' + gid + '"]');

            var list = [];
            $(s.sourceData).each(function () {
                if (this[set.group.attr] == gid) {
                    list.push(this);
                }
            });

            for (var i = set.skipCols; i < set.rows.length; i++) {
                var r = set.rows[i];
                if (r.sumable) {
                    var v = 0;
                    $(list).each(function () {
                        var x = this[r.attribute];
                        if (app.hasValue(x) && $.isNumeric(x)) {
                            v += parseFloat(x);
                        }
                    });
                    gtr.find('td[data-attr="' + r.attribute + '"] span').text(app.formatPrice(v));
                }
            }

            //var id = parseInt(tr.attr('dataid'));
            //var rowIndex = -1;
            //for (var i = 0; i < s.sourceData.length; i++) {
            //    if (s.sourceData[i].Id == id) {
            //        rowIndex = i;
            //        break;
            //    }
            //}

            //for (var i = 0; i < set.rows.length; i++) {
            //    var cell = set.rows[i];
            //    if (cell.formula != null) {
            //        var v = cell.formula(data);
            //        v = Math.round(v);
            //        var td = tr.find('td[attr="' + cell.attribute + '"]');
            //        td.find('span').text(cell.type == 'price' ? app.formatPrice(v) : v);
            //        td.find('input').val(v);
            //        s.sourceData[rowIndex][cell.attribute] = v;
            //        data[cell.attribute] = v;
            //    }
            //}
            //s.sourceData[rowIndex] = data;
            //return data;
        }
        s.updateTotalRow = function () {
            for (var i = 0; i < set.rows.length; i++) {
                var cell = set.rows[i];
                if (cell.sumable) {
                    var total = 0;
                    $(s.sourceData).each(function () {
                        var row = this;
                        var v = parseFloat(row[cell.attribute]);
                        total += v;
                    });
                    total = cell.fixed != null ? total.toFixed(cell.fixed) : app.formatPrice(Math.round(total));
                    $('.tr-total td[data-attr="' + cell.attribute + '"] strong').text(total);
                }
            }
        }

        s.closeEditInline = function (inp, v) {
            var tr = inp.closest('tr');
            var id = parseInt(tr.attr('dataid'));
            var attr = inp.attr('attr');
            var t = inp.attr('data-type');
            var td = inp.closest('td');
            switch (t) {
                case 'price':
                    {
                        if (!$.isNumeric(v)) {
                            v = '0';
                            inp.val(v);
                        } else {
                            v = v.replace(/,/g, '');
                            v = parseFloat(v);
                            var ci = parseInt($(td).attr('ci'));
                            var cell = set.rows[ci];
                            if (cell.min != null) {
                                if (v < cell.min) {
                                    v = cell.min;
                                }
                            }
                            if (cell.max != null) {
                                if (v > cell.max) {
                                    v = cell.max;
                                }
                            }
                            inp.val(v);
                        }
                    }
                    break;
                case 'date':
                    {
                        if (v != '') {
                            v = app.convertVnToEnDate(v);
                        }
                    }
                    break;
            }

            td.removeClass('editing');

            $(s.sourceData).each(function () {
                if (this.Id == id) {
                    this[attr] = v;
                }
            });

            var data = s.updateRowValue(tr);
            if (set.group != null) {
                if (set.group.sumable) {
                    s.updateGroupValue(tr);
                }
            }

            s.updateTotalRow();

            var url = set.editController != null ? set.editController + '/' : '/admin/';
            url += set.model + "EditRow";

            if (set.params.edit != null) {
                $.extend(data, set.params.edit);
            }

            $(s.editLoader).show();

            app.postData(url, data,
                function (result) {
                    $(s.editLoader).hide();
                    var td = inp.closest('td');
                    if ($(inp).is("select")) {
                        var txt = inp.find(' option:selected').text();
                        td.find('> span').text(txt);
                    }
                    else {
                        switch (t) {
                            case 'price':
                                {
                                    v = app.formatPrice(v);
                                    td.find('> span').text(v);
                                }
                                break;
                            case 'date':
                                {
                                    if (v != '') {
                                        td.find('> span').text(moment(v, 'MM/DD/YYYY').format('DD/MM/YYYY'));
                                    }
                                    
                                }
                                break;
                            default:
                                {
                                    td.find('> span').text(v);
                                }
                                break;
                        } 
                    }
                    td.removeClass('editing');
                });
        }
        s.displayChilds = function (pid, display, bl) {
            var trs = bl
                ? $(sel).find('> .salary-table > .main-content .area-bl tr')
                : $(sel).find('> .salary-table > .main-content .area-br tr');
            trs.each(function () {
                var p = $(this).attr('parent');
                if (p == pid) {
                    $(this).css('display', display);
                    s.displayChilds($(this).attr('dataid'), display, bl);
                }
            });
        }

        s.bulkDelete = function (callback) {
            var ids = s.getSelectedIds();
            if (ids.length > 0) {
                s.deleteObjects("bulk", ids, callback);
            } else {
                app.confirm('info', 'Vui lòng chọn đối tượng cần xóa', null, null);
            }
        }
        s.deleteObjects = function (type, ids, callback) {
            app.confirm("warning",
                null,
                ids.length + ' đối tượng được chọn để xóa.',
                function () {
                    var url = set.editController != null ? set.editController : '/admin';
                    if (type == "bulk") {
                        app.postData(url + "/delete" + set.model + 'ByIds',
                            {
                                ids: ids
                            },
                            function () {
                                if (callback != null) {
                                    callback();
                                }
                            });
                    } else {

                        $.ajax({
                            url: url + "/delete" + set.model,
                            type: "POST",
                            data: {
                                model: set.model,
                                id: ids[0]
                            },
                            success: function () {
                                if (typeof webaby !== "undefined") {
                                    webaby.hideModalLoading();
                                }
                                $("#deleteModal").modal("hide");
                                if (callback != null) {
                                    callback();
                                }
                            }
                        });
                    }
                    $(sel).find(".checkAll").prop("checked", false);
                    $.uniform.update();
                });
        };
        s.setSubData = function (id) {

        };
        s.selectRow = function (tr, isReload) {
            var id = tr.attr('dataid');
            if (!tr.hasClass('active')) {
                $(sel).find('.area-bl tr.active').removeClass('active');
                $(sel).find('.area-bl tr[dataid="' + id + '"]').addClass('active');
                $(sel).find('.area-br tr.active').removeClass('active');
                $(sel).find('.area-br tr[dataid="' + id + '"]').addClass('active');
                $(sel).find('.area-bom tr.active').removeClass('active');
                $(sel).find('.area-bom tr[dataid="' + id + '"]').addClass('active');
                if (set.subContent != null) {
                    s.setSubData(id);
                }

                if (set.selectRowCallback != null) {
                    set.selectRowCallback(tr);
                }

            } else {
                $(sel).find('.area-bl tr[dataid="' + id + '"]').removeClass('active');
                $(sel).find('.area-br tr[dataid="' + id + '"]').removeClass('active');
                $(sel).find('.area-bom tr[dataid="' + id + '"]').removeClass('active');
            }
        };
        s.resize = function () {
            var fh = null;
            var fw = null;
            if (app.hasValue(set.width.fix)) {
                fw = set.width.fix;
            }

            var wh = $(window).height();
            var th = wh - set.height.top;
            var at = $(sel).find('> .salary-table');
            at.css('height', th);

            s.setMainTableHeight(th - 35);
            if (fw == null) {
                s.setMainTableWidth();
            }

            if (s.initData) {
                var top = $(sel).find('.area-br > div').scrollTop();
                s.showData(top);
            }
        };

        s.setMainTableWidth = function () {
            var tr = $(sel).find('> .salary-table > .main-content .area-tr');
            var br = $(sel).find('> .salary-table > .main-content .area-br');

            var maxW = tr.find('> div').width();
            var tw = parseInt(tr.find('table').attr('data-w'));
            var trl = tr.find('table > colgroup col').last();
            var brl = br.find('table > colgroup col').last();
            if (maxW >= tw) {
                var nw = maxW - tw - 19;
                trl.css('width', nw);
                brl.css('width', nw);
            } else {
                trl.css('width', 0);
                brl.css('width', 0);
            }
        };

        s.setMainTableHeight = function (ah) {
            var hh = set.head.height != null ? set.head.height : 32;
            if (set.filterable) {
                hh += 37;
            }
            var mc = $(sel).find('> .salary-table > .main-content');
            mc.css('height', ah + 35);
            mc.find('> .areas').css('height', ah + 35);
            mc.find('> .areas .area-bl').css('height', ah - hh + 17);
            mc.find('> .areas .area-bl > div').css('height', ah - hh + 17);
            mc.find('> .areas .area-br').css('height', ah - hh + 34);
            mc.find('> .areas .area-br > div').css('height', ah - hh + 34);
        }

        s.initTable = function () {
            if (set.height.row != null) {
                s.hr = set.height.row;
            }

            var skip = set.skipCols;
            var sg = set.group;
            var h = $(window).height();
            var cgl = '',
                cgr = '',
                wl = 0,
                wr = 0;
            var th, cs;
            var tb = $('<div class="salary-table  ' + (set.border ? 'bordered' : '') + ' ' + (set.evenColor ? 'even-color' : '') + '"></div>');
            if (app.hasValue(set.height.fix)) {
                tb.css('height', set.height.fix);
            } else {
                tb.css('height', h - set.height.top);
            }

            tb.append('<div class="main-content"><div class="areas ' + (skip > 0 ? 'has-left' : '') + '"><span class="empty-message" style="display: none">Không tìm thấy dữ liệu phù hợp</span></div></div>');
            $(sel).append(tb);

            var hh = set.head.height != null ? set.head.height : 32;
            if (set.filterable) {
                hh += 37;
            }



            // area top left
            var area = $('<div class="area area-tl" style="height: ' + hh + 'px"><div></div></div>');
            if (skip > 0) {
                tb = $('<table class="table table-bordered"></table>');
                cgl = $('<colgroup></colgroup>');
                wl = 0;
                if (set.checkAll == null || set.checkAll) {
                    cgl.append('<col style="width: 40px">');
                    wl += 40;
                    skip--;
                }
                for (var k = 0; k < skip; k++) {
                    cgl.append('<col style="width: ' + set.head.groups[k] + 'px">');
                    wl += set.head.groups[k];
                }
                tb.css('width', wl).append(cgl.html());
                th = '<thead>';
                skip = set.skipCols;
                cs = set.cols.left;
                for (var i = 0; i < cs.length; i++) {
                    var r = cs[i];
                    th += '<tr>';

                    if (i == 0 && (set.checkAll == null || set.checkAll)) {
                        th += '<th rowspan="' +
                            cs.length +
                            '" style="height: 31px">' +
                            '<div class="checkbox"><input type="checkbox" class="styled checkAll" /><label></label></div></th>';
                        skip--;
                    }
                    for (var j = 0; j < r.length; j++) {
                        var col = r[j];
                        if (col.visible == null || col.visible()) {

                            th += '<th ';
                            if (col.rowspan != null) {
                                th += ' rowspan="' + col.rowspan + '" ';
                            }
                            if (col.colspan != null) {
                                th += ' colspan="' + col.colspan + '" ';
                            }
                            th += ' style="';
                            if (col.style != null) {
                                th += col.style + '; ';
                            }
                            th += '"';
                            var cls = '';
                            if (col.class != null) {
                                cls += col.class;
                            }
                            if (col.color != null) {
                                cls += ' hc-' + col.color + ' ';
                            }
                            if (col.sort != null) {
                                th += 'class="' + cls + ' orderable" orderby="' + col.sort + '" currentOrder="desc">';
                            } else {
                                th += 'class="' + cls + '" >';
                            }
                            if (col.render != null) {
                                th += col.render();
                            } else {
                                th += (col.title != null ? col.title : "&nbsp;");
                            }


                            th += (col.sort != null ? '<i style="margin-left:5px;" class="fa fa-caret-down"></i>' : "") +
                                "</th>";
                        }


                    }
                    th += '</tr>';
                }
                th += '</thead>';

                tb.append(th);

                if (set.filterable) {
                    var f = s.rowFilter(true);
                    tb.append('<tbody>' + f + '</tbody>');
                }

                area.css('width', wl + 1).find('> div').append(tb);
            }
            $(sel).find('.areas').append(area);

            // area bottom left
            var ww = $(window).width();
            area = $('<div class="area area-bl" style="width:' + (wl + (ww > 375 ? 19 : 1)) + 'px"></div>');
            area.append(
                '<div><table class="table table-bordered table-hover" style="width:' + wl + 'px"></table></div>');
            area.find('table').append(cgl);

            var tbody = '<tbody>';
            if (sg != null) {
                var top = 0;
                $(sg.data).each(function () {
                    var gr = this;
                    var h = 0;
                    h = s.hr * gr.totalChild;
                    var p2 = top + h + s.hr;

                    tbody += '<tr class="tr-group expanded ' +
                        (gr.class != null ? gr.class : '') +
                        '" groupid="' + gr.id + '"  data-p1="' + top + '" data-p2="' + p2 + '">' +
                        '<td colspan="' + ((set.checkAll == null || set.checkAll) ? skip + 1 : skip) +
                        '" class="' + (gr.class != null ? gr.class : '') + '" ' +
                        'style="height:' + s.hr + 'px">';
                    tbody += '<div>';
                    if (set.checkAll) {
                        tbody +=
                            '<div class="checkbox"><input type="checkbox" class="styled check-group" groupid="' + gr.id + '" /><label></label></div>';
                    }
                    tbody += '<button class="btn btn-icon btn-xs btn-expander"><i class="icon-arrow-down5"></i></button> ';

                    if (sg.render != null) {
                        tbody += sg.render(gr);
                    } else {
                        tbody += this.text;
                    }
                    if (sg.addable) {
                        tbody +=
                            '<button class="btn btn-icon btn-xs btn-add-row bg-primary" groupid="' + gr.id + '" type="button"><i class="icon-plus3"></i></button>';
                    }
                    tbody += '</div></td></tr>';
                    tbody += '<tr class="tr-group-overload tr-group-overload-top"  groupid="' + gr.id + '" style = "display: none"><td style="height: 0px">&nbsp;</td></tr>';
                    tbody += '<tr class="tr-group-overload tr-group-overload-bot"  groupid="' + gr.id + '" ' + (gr.totalChild == 0 ? 'style="display: none"' : '') + '><td style="height: ' + h + 'px">&nbsp;</td></tr>';

                    var v = {
                        gid: gr.id,
                        active: true,
                        left: [],
                        right: [],
                        count: gr.totalChild,
                        loaded: false,
                        groupChilds: []
                    };
                    if (gr.childs != null) {
                        $(this.childs).each(function () {
                            tbody += '<tr class="tr-group-child tr-group" groupid="' +
                                this.id +
                                '" ><td colspan="' +
                                skip +
                                '" class="">';
                            tbody += '<div class="' +
                                (this.class != null ? this.class : '') +
                                '">' +
                                this.text +
                                '</div></td></tr>';

                            v.groupChilds.push({
                                active: true,
                                gid: this.id,
                                left: [],
                                right: [],
                                count: 0,
                                loaded: false
                            });
                        });

                    }
                    s.viewData.push(v);
                    top += h + s.hr;
                });
            } else {
                s.viewData.push({
                    active: true,
                    gid: 0,
                    left: [],
                    right: [],
                    count: 0,
                    loaded: false,
                    groupChilds: []
                });
            }

            tbody += '</tbody>';
            area.find('table').append(tbody);

            $(sel).find('.areas').append(area);

            var hasOm = set.optionMenu != null && browser == 'Wap';

            // area top right
            skip = set.skipCols;

            area = $('<div class="area area-tr" style="left: ' +
                wl +
                'px; height: ' +
                hh +
                'px; ' +
                (hasOm ? 'right: 35px;' : '') +
                '"><div></div></div>');
            tb = $('<table class="table table-bordered"></table>');
            cgr = $('<colgroup></colgroup>');
            wr = 0;

            if (set.checkAll == null || set.checkAll) {
                if (skip == 0) {
                    cgr.append('<col style="width: 40px">');
                    wr += 40;
                } else {
                    skip--;
                }
            }

            for (var k = skip; k < set.head.groups.length; k++) {
                cgr.append('<col i="' + k + '" w="' + set.head.groups[k] + '" style="width: ' + set.head.groups[k] + 'px">');
                wr += set.head.groups[k];
            }
            cgr.append('<col>');

            tb.attr('data-w', wr).css('width', +wr + 'px').append(cgr);

            th = '<thead>';
            skip = set.skipCols;
            cs = set.cols.right;
            for (var i = 0; i < cs.length; i++) {
                r = cs[i];
                th += '<tr>';

                for (var j = 0; j < r.length; j++) {
                    var col = r[j];
                    if (col.visible == null || col.visible()) {
                        th += '<th ';
                        if (col.rowspan != null) {
                            th += ' rowspan="' + col.rowspan + '" ';
                        }
                        if (col.colspan != null) {
                            th += ' colspan="' + col.colspan + '" ';
                        }
                        th += ' style="';
                        if (col.style != null) {
                            th += col.style + '; ';
                        }

                        th += '"';
                        var cls = '';
                        if (col.class != null) {
                            cls += col.class;
                        }
                        if (col.color != null) {
                            cls += ' hc-' + col.color + ' ';
                        }

                        th += 'class="' + cls + '" ri="' + (i + 1) + '" ci="' + col.ci + '" >';

                        if (col.note != null) {
                            th += '<span class="th-tooltip"><i class="icon-info22" data-toggle="tooltip" data-placement="bottom" title="' + col.note + '"></i></span>';
                        }

                        th += '<span class="title ell">';
                        var txt = '';
                        if (col.render != null) {
                            txt = col.render();
                        } else {
                            txt = (col.title != null ? col.title : "&nbsp;");
                        }
                        th += txt;
                        if (set.hideable) {
                            th += '</span><span class="th-hide" i="" data-toggle="tooltip" data-placement="right" title="Ẩn cột ' + txt + '" ><i class="icon-shrink7"></i></span>' +
                                '<span class="th-unhide" i=""  data-toggle="tooltip" data-placement="right" title="Bỏ ẩn cột ' + txt + '"><i class="icon-enlarge7"></i></span>';
                        }
                        th += '</th>';
                    }
                }
                th += '<th>&nbsp;</th>';
                th += '</tr>';
            }
            th += '</thead>';

            tb.append(th);
            if (set.filterable) {
                tb.append('<tbody>' + s.rowFilter(false) + '</tbody>');
            }

            area.find('> div').append(tb);
            $(sel).find('.areas').append(area);

            // area bottom right
            skip = set.skipCols;
            area = $('<div class="area area-br" style="left: ' +
                wl +
                'px;' +
                (hasOm ? 'right: 35px;' : '') +
                '"><div></div></div>');
            tb = $('<table class="table table-bordered table-hover"></table>');
            cgr = $('<colgroup></colgroup>');
            wr = 0;

            if (set.checkAll == null || set.checkAll) {
                if (skip == 0) {
                    cgr.append('<col style="width: 40px" w="40">');
                    wr += 40;
                } else {
                    skip--;
                }
            }

            s.colRight = set.head.groups.length - skip;

            for (var k = skip; k < set.head.groups.length; k++) {
                cgr.append('<col i="' + k + '" w="' + set.head.groups[k] + '" style="width: ' + set.head.groups[k] + 'px">');
                wr += set.head.groups[k];
            }
            cgr.append('<col>');

            tbody = '<tbody>';
            if (sg != null) {
                var g = sg;
                $(g.data).each(function () {
                    var ok = true;
                    //if (sg.onlyHasValue) {
                    //    if (this.totalChild != null && this.totalChild > 0) {
                    //        ok = true;
                    //    } else {
                    //        ok = false;
                    //    }
                    //}
                    if (ok) {

                        var tr = '<tr class="tr-group " groupid="' + this.id + '" >';
                        if (g.sumable) {
                            for (var k = skip; k < set.rows.length; k++) {
                                var r = set.rows[k];
                                var sty = r.style != null ? r.style : '';
                                sty += '; height:' + s.hr + 'px';
                                if (r.sumable) {
                                    tr += '<td data-attr="' + set.rows[k].attribute + '" class="text-bold text-right  ' + (this.class != null ? this.class : '') + '" style="' + sty + '">' +
                                        '<span>' + app.formatPrice(this[set.rows[k].attribute]) + '</span></td>';
                                } else {
                                    tr += '<td data-attr="' + set.rows[k].attribute + '" class=" ' + (this.class != null ? this.class : '') + '"><span>&nbsp;</span></td>';
                                }
                            }
                            tr += '<td>&nbsp;</td></tr>';
                        } else {
                            tr += '<td colspan="' + (s.colRight + 1) + '" style="height:' + s.hr + 'px" class=" ' + (this.class != null ? this.class : '') + '">&nbsp;</td>';
                        }
                        tbody += tr;
                        var h = s.hr * this.totalChild;
                        tbody += '<tr class="tr-group-overload tr-group-overload-top" groupid="' + this.id + '" style="display: none"><td style="height: 0">&nbsp;</td></tr>';
                        tbody += '<tr class="tr-group-overload tr-group-overload-bot" groupid="' + this.id + '" ' + (this.totalChild == 0 ? 'style="display: none"' : '') + '><td style="height: ' + h + 'px">&nbsp;</td></tr>';
                        if (this.childs != null) {
                            $(this.childs).each(function () {
                                tr = '<tr class="tr-group  tr-group-child " groupid="' + this.id + '" >';
                                tr += '<td colspan="' + (s.colRight + 1) + '" style="height:' + s.hr + 'px">&nbsp;</td>';
                                tbody += tr;
                            });
                        }


                    }
                });
            }
            tbody += '</tbody>';
            tb.css('width', +wr + 'px').append(cgr).append(tbody);

            area.find('> div').append(tb);
            $(sel).find('.areas').append(area);


            if (set.optionMenu != null && browser == 'Wap') {
                area = $('<div class="area area-tom" style="right: 0; height: ' + hh + 'px"><div></div></div>');
                tb = $(
                    '<table class="table"><colgroup><col style="width: 40px" /></colgroup><thead><th style="height: 30px">&nbsp;</th></thead></table>');
                if (set.filterable) {
                    tb.append('<tbody><tr class="tr-filter"><td></td> </tr></tbody>');
                }
                area.find('> div').append(tb);
                $(sel).find('.areas').append(area);

                area = $('<div class="area area-bom" style="right: 0; top: 63px"><div></div></div>');
                tb = $('<table class="table table-bordered"><tbody></tbody></table>');
                area.find('> div').append(tb);
                $(sel).find('.areas').append(area);
            }

            $(sel).find('.areas').append('<span class="buffer-bl" style="width: ' + wl + 'px"></span>');

            if (set.contextMenu != null) {
                var cm = '<div class="context-menu-salary-grid-popup">' +
                    '<ul class="dropdown-menu">';
                for (var i = 0; i < set.contextMenu.length; i++) {
                    var c = set.contextMenu[i];
                    switch (c) {
                        case 'edit':
                            {
                                cm +=
                                    '<li><a href="#" action="edit"><i class="icon-pencil7 position-left"></i>Cập nhật</a></li>';
                            }
                            break;
                        case 'delete':
                            {
                                cm +=
                                    '<li><a href="#" action="delete"><i class="icon-x position-left"></i>Xóa</a></li> ';
                            }
                            break;
                        case 'add-child':
                            {
                                cm +=
                                    '<li><a href="#" action="add-child"><i class="icon-stack-plus position-left"></i>Thêm cấp con</a></li> ';
                            }
                            break;
                        case '-':
                            {
                                cm += '<li class="divider" ></li>';
                            }
                            break;
                        default:
                            {
                                if (c.childs != null) {
                                    cm += '<li class="dropdown-submenu dropdown-submenu-hover">';
                                    cm += '<a href="#"><i class="' + c.icon + ' position-left" ></i>' + c.text + '</a>';
                                    cm += '<ul class="dropdown-menu">';
                                    $.each(c.childs,
                                        function () {
                                            cm += '<li> <a href="#"  action="custom" class="' +
                                                this.class +
                                                '">' +
                                                this.text +
                                                '</a></li> ';
                                        });
                                    cm += '</ul>';
                                    cm += '</li>';

                                } else {
                                    cm +=
                                        '<li><a href="#" title="' + c.text + '" action="custom" class="' +
                                        c.class +
                                        '">' +
                                        (c.icon != null ? '<i class="' + c.icon + '"></i>' : '') +
                                        c.text +
                                        '</a></li> ';
                                }
                            }
                            break;
                    }
                }
                cm += '</ul> ' +
                    '</div>';
                $(sel).append(cm);
            }

            //s.resize();
            s.setStaticEvents();

            if (set.data != null) {
                var mc = $(sel).find('> .salary-table > .main-content');
                s.setViewData(set.data, true);
                s.sortai();

                s.setRowPositions();

                //s.showBackground();

                s.showData(0);

                // draw sum tr
                if (s.set.sumInfo != null) {
                    s.drawSuminfo(mc);
                }
            } else {
                if (set.autoLoad != false) {
                    s.loadData();
                }
            }
        };
        s.initTable();
        return this;
    };
}(jQuery));