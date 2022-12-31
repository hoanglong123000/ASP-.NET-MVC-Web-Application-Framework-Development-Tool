
$(document).ready(function () {
    var panel = '#Class_panel';
    var table = $(panel + " .apply-table").advanceGrid({
        dataUrl: DOMAIN_API + '/Edutcation/ClassList',
        model: "Class", // ten table,
        editController: '/Edutcation',
        checkAll: false,
        width: {},
        filterable: true,
        height: {
            top: 160
        },
        modal: {
            type: 1,
            width: '600px',
            title: 'lớp'
        },
        toolbars: {
            create: {
                ele: panel + ' .main-toolbar .btn-add'
            },
            reload: {
                ele: panel + ' .main-toolbar .btn-reload'
            }
        },
        contextMenu: ['edit',
            {
                text: 'Xuất pdf',
                icon: 'icon-file-pdf text-danger',
                action: 'info',
                class: 'btn-export-pdf',
                click: function (tr) {
                    window.open(DOMAIN_API + '/export/PdfClass?id=' + $(tr).attr('dataid'), '_blank');
                }
            },
            'delete'],
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            initClassForm(function () {
                table.hideModal();
                table.loadData();
            });
        },
        params: {
            search: {
                hasCount: true,
                limit: 20
            }
        },
        head: {
            groups: [50,100,200,300,250,130,250,130] 
        },
        cols: {
            left: [],
            right: [
                [
                    { title: 'STT' },
 { title: 'Tên lớp' } ,
 { title: 'Khối' } ,
 { title: 'Mã lớp' } ,
 { title: 'Người tạo' } ,
 { title: 'Ngày tạo' } ,
 { title: 'Người cập nhật' } ,
 { title: 'Ngày cập nhật' } 
                ]
            ]
        },
        rows: [
            { type: 'ai', style: 'text-align: center' },
{ type: 'text',attribute: 'Name', 
filter: { type: 'contains', attr: 'keyword' }},
{ type: 'text',attribute: 'Khoi', 
},
{ type: 'text',attribute: 'Code', 
filter: { type: 'contains', attr: 'Code' }},
{ type: 'text',
attribute: 'CreatedBy', 
render: function(row){ 
if(row.ObjCreatedBy != null) 
return row.ObjCreatedBy.FullName ; 
 return ''; }},
{ type: 'datetime',
attribute: 'CreatedDate' 
 },
{ type: 'text',
attribute: 'UpdatedBy', 
render: function(row){ 
if(row.ObjUpdatedBy != null) 
return row.ObjUpdatedBy.FullName ; 
 return ''; }},
{ type: 'datetime',
attribute: 'UpdatedDate' 
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