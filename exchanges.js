var URL="https://api.polygon.io/v3/reference/";
var key="oVhmIj_vHLKvXKNcn3LNn95ImprN3LgO";
var ticker=null;
var exchange=null;
getExchange();
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
        $("#exchanges").on('change',function() {
            var val = $(this).val();
            getTicker(val);
            console.log(val);
        });
    })

}

function getTicker($exchange) {
    a=$.ajax({
        url: URL + "tickers?exchange=" + $exchange + "&active=true&apiKey=" + key,
        method: "GET"
    }).done(function(data) {
        $("#Stocks").html("<select name=\"Stock\" id=\"stock\"></select>");
        $("#stock").html("");
        len = data.count;
        for (i=0;i<len;i++) {
            $("#stock").append("<option value=\"" + data.results[i].ticker + "\">" + data.results[i].name + "</option>");
        }
        $("#Stocks").append("<input type=\"button\" value=\"Details\" id=\"Details\"><input type=\"button\" value=\"News\">");
        $("#Details").click( function() {
            getDetails($("#stock").val());
        });
    })
}

function getDetails($ticker) {
    a=$.ajax({
        url: URL + "tickers/" + $ticker + "?apiKey=" + key,
        method: "GET"
    }).done(function(data) {
        console.log(data);
    })
}