var URL="https://api.polygon.io/";
var key="oVhmIj_vHLKvXKNcn3LNn95ImprN3LgO";
var ticker=null;
var exchange=null;
getExchange();
getDetails();
getNews();

function getExchange() {
    a=$.ajax({
        url: URL + 'v3/reference/exchanges?asset_class=stocks&apiKey=' + key,
        method: "GET"
    }).done(function(data) {
        $("#exchanges").html("");
        len = data.count;
        for (i=0;i<len;i++) {
            $("#exchanges").append("<option value=\"" + data.results[i].operating_mic + "\">" + data.results[i].name + "</option>");
        }
        $("#exchanges").on('change',function() {
            var val = $(this).val();
            getTicker(val);
        });
    })

}

function getTicker($exchange) {
    a=$.ajax({
        url: URL + "v3/reference/tickers?exchange=" + $exchange + "&active=true&apiKey=" + key,
        method: "GET"
    }).done(function(data) {
        $("#Stocks").html("<select name=\"Stock\" id=\"stock\"></select>");
        $("#stock").html("");
        len = data.count;
        for (i=0;i<len;i++) {
            $("#stock").append("<option value=\"" + data.results[i].ticker + "\">" + data.results[i].name + "</option>");
        }
        $("#Stocks").append("<input type=\"button\" value=\"Details\" id=\"Details\"><input type=\"button\" value=\"News\" id=\"News\">");
        $("#Details").click( function() {
            getDetails($("#stock").val());
        });
        $("#News").click(function() {
            var val = $("#stock").val();
            getNews(val);
        });
    })
}

function getDetails($ticker) {
    a=$.ajax({
        url: URL + "v3/reference/tickers/" + $ticker + "?apiKey=" + key,
        method: "GET",
        success: function(data) {

        }
    }).done(function(data) {
        console.log(data);
    })
}

function getNews($ticker) {
    a=$.ajax({
        url: URL + "v2/reference/news?ticker=" + $ticker + "&apiKey=" + key,
        method: "GET"
    }).done(function(data) {
        console.log(data);
    })

    $.ajax({
        url: "http://172.17.12.35/cse383_final/final.class.php"
    })
}