var modal_counter = 0;
var USER_DEFAULT_AVATAR = DOMAIN_API + '/media/default/user-default.jpg';

$(document).ready(function () {
    $(".styled, .multiselect-container input").uniform({
        radioClass: 'choice'
    });
    app.lazyLoader(function (e) {
    });
    $('.panel-filter .input-group input').focus(function () {
        $(this).closest('.input-group').addClass('focus');
    }).blur(function () {
        $(this).closest('.input-group').removeClass('focus');
    });

    resize();
    $(window).resize(function () {
        resize();
    });

    $(document).on('show.bs.modal', '.modal',
        function () {
            var zIndex = 1040 + (10 * $('.modal:visible').length);
            $(this).css('z-index', zIndex);
            setTimeout(function () {
                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            }, 10);
        });
    $(document).on('shown.bs.modal', '.modal',
        function () {
            $(this).find('.close').unbind().click(function () {
                $(this).closest('.modal').modal('hide');
            });
        });
    $(document).on('hidden.bs.modal', '.modal',
        function () {
            setTimeout(function () {
                if ($('.modal.in').length > 0) {
                    $('body').addClass('modal-open');
                } else {
                    $('body').removeClass('modal-open');
                }
            }, 200);
        });

    var path = window.location.pathname;

    if (typeof auth != 'undefined' && path.indexOf('developer') < 0) {
        LoadApproveStatus();
    }
});

function viewProcessCause(a) {
    var cause = $(a).attr('data-cause');
    var m = 'view_process_cause';
    if ($('#' + m).length == 0) {
        app.createEmptyModal({
            title: 'Lý do không duyệt',
            headerClass: 'bg-warning',
            width: 600,
            id: m
        });
    }
    $('#' + m + ' .modal-body').html(cause);
    $('#' + m).modal('show');
}

function resize() {

}

function UpdateSidebarStatus(view, val) {
    var sv = '.sidebar-category';
    var li = $(sv + ' li[view="' + view + '"]');
    var st = li.find('.status');
    var parent = $(li).parents('li');
    if (val > 0) {
        if ($(st).length == 0) {
            $(li).find('a').append('<span class="label bg-danger status">' + val + '</span>');
        } else {
            $(st).text(val).css('display', 'block');
        }

        if (parent.length > 0) {
            if (parent.find(' > a .status').length == 0) {
                $(parent).find(' > a').append('<span class="label bg-danger status">' + val + '</span>');
            } else {
                parent.find(' > a .status').text(val).css('display', 'block');
            }
        }
    } else {
        $(st).css('display', 'none');
        $(parent).find(' > a .status').css('display', 'none');
    }
}

function LoadApproveStatus() {
    app.loadData(DOMAIN_API + '/general/approveStatus',
        {
            approver: auth.EmployeeId,
            organizationId: auth.OrganizationId,
            jobPositionId: auth.JobPositionId
        }, null, function (result) {

            $('.main-navbar .notification, .sidebar-main .notification').attr('count', 0);

            // notifications

            var o;
            var count;
            var notify;
            $('.main-navbar .notification, .sidebar-main .notification').each(function () {
                var code = $(this).attr('process-code');
                notify = $(this);
                if (code.indexOf('-') >= 0) {
                    count = 0;
                    var arr = code.split('-');
                    $(arr).each(function () {
                        var c = this;
                        $(result).each(function () {
                            if (this.Code == c) {
                                count += this.Count;
                            }
                        });
                    });
                    notify.text(count);
                    notify.attr('count', count);
                    if (count > 0) {
                        notify.css('opacity', 1);
                    }

                } else {
                    $(result).each(function () {
                        if (this.Code == code) {
                            notify.text(this.Count);
                            notify.attr('count', this.Count);
                            if (this.Count > 0) {
                                notify.css('opacity', 1);
                            }
                        }
                    });
                }

            });


            // badge status

            $(result).each(function () {
                var o = this.Count > 0 ? 1 : 0;
                var c = this.Count;

                var b = $('.badge-status[process-code="' + this.Code + '"]');
                b.text(c);
                b.attr('count', c);
                b.css('opacity', o);
            });

            // l1
            $('.main-navbar > li, .sidebar-main .navigation > li').each(function () {
                notify = $(this).find(' > a > .notification'); 
                var childs = $(this).find(' li .notification');
                if (childs.length > 0) {
                    count = 0;
                    $(this).find(' li .notification').each(function () {
                        count += parseInt($(this).attr('count'));

                    });
                    notify.attr('count', count);
                    notify.text(count);
                    if (count > 0) {
                        notify.css('opacity', 1);
                    }
                } 
            });
        });
}