function initCostForm(callback) {
    $('#CostForm').ultraForm({
        uiType: 1,
        action: '/Costs/CostEdit',
        actionType: 'ajax',
        props: [
            { name: 'Id', type: 'hidden' },

            {
                name: 'Ngay', type: 'datepicker',
                required: { message: 'Nhập Ngay' }
            },

            {
                name: 'SoTien', type: 'money',
                required: { message: 'Nhập SoTien' }
            },

            {
                name: 'Type', type: 'select2',
                option: {}, required: { message: 'Chọn loại' }
            },

            {
                name: 'GhiChu', type: 'text',
                required: { message: 'Nhập GhiChu' }
            },
        ],
        initCallback: function (form) { },
        beforSubmit: function (form) { },
        afterSubmit: function (result) {
            if (result.Success) {
                callback(result.Data);
            } else {
                app.notify('warning', result.Message);
            }
        }
    });
};