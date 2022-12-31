
 
var p = '#list_panel';
$(document).ready(function () {
    var lg = $(p + " .apply-list").listGroup({

        top: 145,
        autoLoad: true,
        groups: [ 
            {
                width: '30%',
                header: {
                    title: 'Email'
                },
                type: 'list',
                ajax: {
                    url: '/general/emailtemplatelist',
                    data: {}
                },
                item: {
                    id: 'Id',
                    relateId: 'ProcessId',
                    body: {
                        render: function (item) {
                            return '<span class="media-heading">' + item.Name + '</span>';
                        }
                    },
                    right: {
                        render: function (item) {
                            return item.Code;
                        }
                    }
                },
                loadCallback: function () {

                }
            },
            {
                width: '70%',
                type: 'html',
                header: {
                    title: 'Nội dung email'
                },
                ajax: {
                    url: '/general/EmailTemplateDetailEdit',
                    data: {
                        dataType: 'html'
                    }
                },
                item: {
                    id: 'Id',
                    relateId: 'Id'
                },
                loadDataCallback: function () {
                    initEmailTemplateDetailForm();
                }
            }
        ]
    });
     
})