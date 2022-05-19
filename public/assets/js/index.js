$(".toggle-box").click(function () {
    $(".side-bar").toggleClass("active");
    $(".page-content").toggleClass("active");
    $(".logo-lg").toggleClass("d-none");
    $(".logo-sm").toggleClass("d-block");
    $(".open-sidebar").toggleClass("d-none");
    $(".close-sidebar").toggleClass("d-block");
});
$(document).click(function () {
    $(".dropdown-content").removeClass("active");
});
$(".dropdown-button").click(function (e) {
    e.stopPropagation();
    $(this).parent().find(".dropdown-content").toggleClass("active");
});
$(".dropdown-content").click(function (e) {
    e.stopPropagation();
});


$(document).on('click',".quit-quiz-button",function () {
    $("video").get(0).pause();
    $(".quit-quiz-wrappper").toggleClass("active");
});


$(".quiz-response-button").click(function () {
    $(".quiz-response-wrapper").toggleClass("d-none");
});

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
