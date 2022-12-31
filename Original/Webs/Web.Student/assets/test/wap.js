
function createWapModal(opt) {
    if ($(opt.id).length == 0) {
        var h = '<div id="' +
            opt.id +
            '" class="modal"  tabindex="-1" role="dialog" data-backdrop="static">' +
            '<div class="modal-dialog" role="document">' +
            '<div class="modal-content"';
        if (opt.fullscreen) {
            h += ' style="min-height: ' + $(window).height() + 'px" ';
        }

        h += '> <div class="modal-loader" style="display: none"><div class="theme_radar"><div class="pace_progress" data-progress-text="60%" data-progress="60"></div><div class="pace_activity"></div></div></div>';

        if (opt.header != null) {
            h += opt.header;
        } else {
            h += '<div class="modal-header p-5 ' + (opt.headerClass != null ? opt.headerClass : '') + '">' +
                '<button type="button" class="btn btn-link pull-left ' + (opt.headerClass != null ? opt.headerClass : '') + '"><i class="icon-arrow-left8"></i></button>' +
                '<h5 class="modal-title text-bold mt-5 pull-left ml-10" >' + opt.title + '</h5>' +
                '</div>';
        }

        h += '<div class="modal-body ' + (opt.noPaddingBody ? 'no-padding' : 'p-10') + ' ' + opt.bodyClass + '">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        $(opt.appendTo != null ? opt.appendTo : 'body').append(h);

        $('.modal .pull-left').unbind().click(function () {
            var m = $(this).closest('.modal');
            m.removeClass('in');
            setTimeout(function () {
                m.modal('hide');
            }, 200);
        });
    }
};

function _rightNavbar() {
    $(".navbar-mobile-main-toggle").click(function () {
        $("#rightNavbar").css('display', 'block');
        setTimeout(function () {
            $('#rightNavbar').addClass('open');
        }, 50);
        $('body').css('position', 'fixed');
    });
    $("#rightNavbar .btn").click(function () {
        $("#rightNavbar").removeClass('open');
        setTimeout(function () {
            $('#rightNavbar').css('display', 'none');
        }, 100);
        $('body').css('position', 'inherit');
    });
    $("#rightNavbar .sidebar-overlay").unbind().click(function () {
        $("#rightNavbar").removeClass('open');
        setTimeout(function () {
            $('#rightNavbar').css('display', 'none');
        }, 100);
        $('body').css('position', 'inherit');
    });

    //$('#rightNavbar i.collap').unbind().click(function () {
    //    var li = $(this).closest('li');
    //    var i = $(this);
    //    var child = $(li).find(' > ul');
    //    if (child.css('display') == 'none') {
    //        child.fadeIn('fast');
    //        i.removeClass('icon-arrow-right5').addClass('icon-arrow-down5');
    //    } else {
    //        child.css('display', 'none');
    //        i.removeClass('icon-arrow-down5').addClass('icon-arrow-right5');
    //    }
    //});
    $('#rightNavbar a.collap').unbind().click(function () {
        var li = $(this).closest('li');
        var child = $(li).find(' > ul');
        if (child.css('display') == 'none') {
            child.fadeIn('fast');
            $(this).find('i.pull-right').removeClass('icon-arrow-right5').addClass('icon-arrow-down5');
        } else {
            child.css('display', 'none');
            $(this).find('i.pull-right').removeClass('icon-arrow-down5').addClass('icon-arrow-right5');
        }
    });
}


$(document).ready(function () {
    _rightNavbar();

    LoadApproveStatus();

    var pn = $(location).attr('pathname');
    if (pn == '/' || pn == '/employee/index') {
        $('.navbar-mobile-main-toggle').trigger("click");
    }
    
});

function LoadApproveStatus() {
    if (typeof isAdmin == 'undefined') {
        isAdmin = false;
    }
    if (typeof isPortal == 'undefined') {
        isPortal = false;
    }
    if (typeof isCB == 'undefined') {
        isCB = false;
    }
    var t;
    if (isHRM) {
        t = 0;
    } else if (isPortal) {
        t = 1;
    } else if (isCB) {
        t = 2;
    }

    app.loadData(DOMAIN_API + '/general/approveStatus',
        {
            approver: auth.EmployeeId,
            organizationId: auth.OrganizationId,
            jobPositionId: auth.JobPositionId,
            isAdmin: isAdmin,
            groups: auth.Groups,
            featureType: t
        }, null, function (result) {

            $('.right-navbar .notification').attr('count', 0);

            // notifications

            var o;
            var count;
            var notify;
            var totalNotify = 0;
            $('.right-navbar .notification').each(function () {
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
                            totalNotify += this.Count;
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
            $('.right-navbar .menu > ul > li').each(function () {
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

            if (totalNotify > 0) {
                $('.total-notify').css('opacity', 1).text(totalNotify);
            } 
        });
}