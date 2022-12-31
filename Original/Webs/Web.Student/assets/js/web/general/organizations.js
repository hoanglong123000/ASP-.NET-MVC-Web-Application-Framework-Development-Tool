var tree = '.tree-ajax';
var tp = '.tree-panel';

function treeEvents() {
    var cmt = $(tp).find(' .tree-context-menu');

    $(tp + ' .fancytree-title').unbind().contextmenu({
        target: cmt.selector,
        onItem: function (context, e) {
            var a = $(e.target);
            if (!a[0].hasAttribute('action')) {
                a = $(e.target).closest('a');
            }
            var act = a.attr('action');
            switch (act) {
                case 'delete':
                    {
                        app.confirm('warning',
                            'Bạn có chắc chắn muốn xóa',
                            null,
                            function () {
                                var node = $(tree).fancytree("getActiveNode");
                                var d = node.data;
                                app.postData('/general/DeleteOrganizationByIds',
                                    {
                                        ids: [d.dataid]
                                    },
                                    function (result) {
                                        node.remove();
                                    });
                            });

                    }
                    break;
                case 'add-child':
                    {
                        var node = $(tree).fancytree("getActiveNode");

                        $('html, body').animate({
                            scrollTop: ($('.tree-panel').offset().top)
                        }, 200);

                        loadEditForm(null, node.data.dataid, function (item) {

                            var v = node.data.val + item.Id + ';';
                            var dobj = {
                                val: v,
                                dataid: item.Id,
                                parent: item.Id
                            };
                            var obj = [
                                { title: item.Name, data: dobj }
                            ];
                            node.addChildren(obj);
                            treeEvents();
                        });
                    }
                    break;
            }
        }
    });

    $(tp + ' .search').unbind().keyup(function (e) {
        var n,
            tr = $(tree).fancytree("getTree"),
            filterFunc = tr.filterNodes,
            match = $(this).val();
        
        n = filterFunc.call(tr, match,
            {
                mode: "hide",
                autoApply: true,   // Re-apply last filter if lazy data is loaded
                autoExpand: true, // Expand all branches that contain matches while filtered
                counter: true,     // Show a badge with number of matching child nodes near parent icons
                fuzzy: false,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
                hideExpandedCounter: true,  // Hide counter badge if parent is expanded
                hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
                highlight: true,   // Highlight matches by wrapping inside <mark> tags
                leavesOnly: true, // Match end nodes only
                nodata: false    
            });

        $(tp + ' .clear-filter').attr("disabled", false);
    }).focus();

    $(tp + ' .clear-filter').unbind().click(function (e) {
        var tr = $(tree).fancytree("getTree");
        $(tp + ' .search').val("");
        tr.clearFilter();
    }).attr("disabled", true);
}
$(document).ready(function () {
    var cm = '<div class="tree-context-menu context-menu-popup">' +
        '<ul class="dropdown-menu">' +
        '<li><a class="" action="add-child"><i class="icon-forward position-left"></i>Thêm cấp con</a></li>' +
        '<li><a class="" action="delete"><i class="icon-trash position-left"></i>Xóa</a></li>' +
        '</ul> ' +
        '</div>';
    $(tp).append(cm);
    app.loadData('/general/organizationlist',
        {
            unlimited: true
        },
        null,
        function (result) {
            $('.loader').css('display', 'none');
            var c = drawLis(result.Many, null, ';');
            $(tree).html(c);
            $(tree).fancytree({
                extensions: ["dnd", "filter"],
                selectMode: 1,
                activate: function (event, data) {
                    var obj = data.node.data;
                    var n = data.node;
                    loadEditForm(obj.dataid, null, function(result) {
                        n.setTitle(result.Name);
                    });
                },
                select: function (event, data) {
                    logEvent(event, data, "current state=" + data.node.isSelected());
                    var s = data.tree.getSelectedNodes().join(", ");
                    $("#echoSelected").text(s);
                },
                dnd: {
                    autoExpandMS: 400,
                    focusOnClick: true,
                    preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                    preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                    dragStart: function (node, data) {
                        return true;
                    },
                    dragEnter: function (node, data) {
                        return true;
                    },
                    dragDrop: function (node, data) {
                        data.otherNode.moveTo(node, data.hitMode);
                        var n = data.otherNode;
                        var t = n.title;
                        n.setTitle(t + '<i class="icon-spinner2 spinner position-right"></i>');
                        app.postData('/general/ChangePriorityOrganization',
                            {
                                id: data.otherNode.data.dataid,
                                nearId: node.data.dataid,
                                priorityPosition: data.hitMode
                            },
                            function (result) {
                                n.setTitle(t);
                            });
                    }
                },
                filter: {
                    
                }
            });

            var fc = $(tree).fancytree("getTree").rootNode.getFirstChild().setActive();
             
            treeEvents();
        });

    $('#btn-add').unbind().click(function() {
        loadEditForm(null, null, function() { });
    });
});

function loadEditForm(id, parentId, callback) {
    var ep = '.edit_panel';
    $(ep).block({
        message: '<i class="icon-spinner4 spinner"></i>',
        overlayCSS: {
            backgroundColor: '#fff',
            opacity: 0.8,
            cursor: 'wait'
        },
        css: {
            border: 0,
            padding: 0,
            backgroundColor: 'transparent'
        },
        onBlock: function () {
            app.loadData('/general/organizationEdit',
                {
                    id: id,
                    parentId: parentId,
                    dataType: 'html'
                },
                null,
                function (html) {
                    $(ep).unblock();
                    $(ep).html(html);
                    initOrganizationForm(callback);
                });
        }
    });
}

function drawLis(data, parent, val) {
    var str = '';
    $(data).each(function () {
        if (this.ParentId == parent) {
            var v = val + this.Id + ';';
            var dobj = {
                val: v,
                dataid: this.Id,
                parent: this.Id
            };
            var x = '<li key="' + this.Id + '" class="expanded" data-json=' + "'" + JSON.stringify(dobj) + "'" + '>' + this.Name + 
            drawLis(data, this.Id, v) + '</li >';
            str += x;
        }
    });
    if (str.length > 0) {
        str = '<ul>' + str + '</ul>';
    }
    return str;
}