$(document).ready(function () {
    $('#help_tree').webabyTree({
        url: '/general/helpList',
        model: 'Help',
        params: {
            cache: true
        },
        resultElement: null,
        item: {
            id: "Id",
            name: "Name",
            parent: 'ParentId'
        },
        singleNode: null,
        lead: { 
            mode: 'select',
            icon: true
        },
        changedCallback: function (ids, obj) {
            if (!obj.data.IsFolder) {

            }
        }
    });
})