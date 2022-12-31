

$(document).ready(function () {
    var form = $('#GeneralForm').ultraForm({
        uiType: 0,
        actionType: 'ajax',
        autoSubmit: false,
        props: [
            { name: 'domain', type: 'text', required: { message: 'Vui lòng nhập tên miền website' } },
            { name: 'domain_api', type: 'text' },
            { name: 'domain_sso', type: 'text'  },
            { name: 'logoWeb', type: 'fileThumb', option: { uploadFirst: true } },
            { name: 'logoWap', type: 'fileThumb', option: { uploadFirst: true } },
            { name: 'loginBg', type: 'fileThumb', option: { uploadFirst: true } },
            { name: 'smtp_host', type: 'text' },
            { name: 'smtp_sender_email', type: 'text' },
            { name: 'smtp_sender_password', type: 'text' },
            { name: 'smtp_sender_name', type: 'text' }
        ],
        validCallback: function (data, btn) {
            data = app.formDataToJson(data);
            var pram = {
                models: [
                    { tab: 'general', section: 'domain', value: data.domain },
                    { tab: 'general', section: 'domain_api', value: data.domain_api },
                    { tab: 'general', section: 'domain_sso', value: data.domain_sso },
                    { tab: 'general', section: 'logoWeb', value: data.logoWeb },
                    { tab: 'general', section: 'logoWap', value: data.logoWap },
                    { tab: 'general', section: 'loginBg', value: data.loginBg },
                    { tab: 'general', section: 'smtp_host', value: data.smtp_host },
                    { tab: 'general', section: 'smtp_sender_email', value: data.smtp_sender_email },
                    { tab: 'general', section: 'smtp_sender_password', value: data.smtp_sender_password },
                    { tab: 'general', section: 'smtp_sender_name', value: data.smtp_sender_name } 
                ],
                dataType: 'json'
            };
            btn.button('loading');
            app.postData('/general/SaveSetting',
                pram,
                function (result) {
                    btn.button('reset');
                    app.notify('success', 'Lưu thay đổi thành công');
                });
        }
    });
});