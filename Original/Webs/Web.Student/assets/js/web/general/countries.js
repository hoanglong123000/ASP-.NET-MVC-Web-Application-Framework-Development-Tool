

function initCountryView() {
    var panel = '#country_panel';

    var table = $(panel + " .apply-table").advanceGrid({
        dataUrl: '/general/countryList',
        model: "Country", // ten table,
        editController: '/general',
        checkAll: true,
        width: {},
        height: {
            top: 210
        },
        modal: {
            type: 1,
            width: '500px',
            title: "tỉnh/thành phố"
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
            initCountryForm(table);
        },
        params: {
            search: {
                cache: true,
                hasCountr: true,
                unlimited: true
            }
        },
        head: {
            groups: [50, 200]
        },
        cols: {
            left: [[]],
            right: [
                [
                    {
                        title: "STT"
                    },
                    {
                        title: "Tỉnh/thành phố"
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