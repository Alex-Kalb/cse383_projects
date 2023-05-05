var URL="https://api.polygon.io/v3/reference/";
var key="oVhmIj_vHLKvXKNcn3LNn95ImprN3LgO";
var exchange=null;
var ticker=null;
getExchange();
getTicker();
getDetails();
getNews();

function getExchange() {
    a=$.ajax({
        url: URL + 'exchanges?asset_class=stocks&apiKey=' + key,
        method: "GET"
    }).done(function(data) {
        $("#exchanges").html("");
        len = data.count;
        for (i=0;i<len;i++) {
            $("#exchanges").append("<option value=\"" + data.results[i].operating_mic + "\">" + data.results[i].name + "</option>");
        }
        exchange = $("#exchanges").value();
    })

}


function getTicker() {
    a=$.ajax({
        url: URL + "tickers?exchange=" + exchange + "&active=true&apiKey=" + key,
        method: "GET"
    }).done(function(data) {
        $("#stock").html("");
        len = data.count;
        for (i=0;i<len;i++) {
            $("#stock").append("<option value=\"" + data.results[i].ticker + "\">" + data.results[i].name + "</option>");
        }
        ticker = $("#stock").value();
    })
}