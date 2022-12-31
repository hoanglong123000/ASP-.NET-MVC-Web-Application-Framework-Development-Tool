

function initDistrictView(opt) {
    var params = {
        hasCount: true,
        cache: false,
        unlimited: true
    };
    params = $.extend(params, opt);
    var panel = '#district_panel';

    var table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/general/districtList',
        model: "District", // ten table,
        editController: '/general',
        checkAll: true,
        width: {},
        height: {
            top: 220
        },
        modal: {
            type: 1,
            width: '500px',
            title: "Quận/huyện"
        },
        toolbars: {
            create: panel + ' .main-toolbar .btn-add',
            edit: panel + ' .main-toolbar .btn-edit',
            delete: panel + ' .main-toolbar .btn-delete'
        },
        paging: {
            options: [10, 20, 30, 50]
        },
        loadModalCallback: function () {
            initDistrictForm(table);
        },
        params: {
            search: params,
            edit: opt
        },
        head: {
            groups: [50, 200]
        },
        cols: {
            left: [],
            right: [
                [
                    {
                        title: "STT"
                    },
                    {
                        title: "Quận / huyện",
                        sort: 'Male'
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
                attribute: 'Name'
            }
        ]
    });
    
    return table;
}