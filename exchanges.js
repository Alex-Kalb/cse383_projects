var URL="https://api.polygon.io/";
var key="oVhmIj_vHLKvXKNcn3LNn95ImprN3LgO";
var php="http://172.17.12.35/cse383_final/final.php?method=";
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
       
        len = data.count;
        if(len > 0) {
            $("#Stocks").html("<label for=\"stock\" class=\"col\">Stocks: </label>");
            $("#Stocks").append("<select name=\"Stock\" id=\"stock\" class=\"col\"></select>");
            $("#Stocks").addClass("Exchanges")
            $("#stock").html("");
            for (i=0;i<len;i++) {
                $("#stock").append("<option value=\"" + data.results[i].ticker + "\">" + data.results[i].name + "</option>");
            }
            $("#Stocks").append("<input type=\"button\" class=\"col\" value=\"Details\" id=\"Details\"><input type=\"button\" class=\"col\" value=\"News\" id=\"News\">");
            $("#Details").click( function() {
                getDetails($("#stock").val());
            });
            $("#News").click(function() {
                var val = $("#stock").val();
                getNews(val);
            });
        } else {
            alert("Exchange does not contain any Stocks");
            $("#Stocks").html("");
            $("#Stocks").removeClass("Exchanges");
        }
    })
}

function getDetails($ticker) {
    a=$.ajax({
        url: URL + "v3/reference/tickers/" + $ticker + "?apiKey=" + key,
        method: "GET",
    }).done(function(data) {
        console.log(data);
        b=$.ajax({
            url: php + "setStock&stockTicker=" + $ticker + "&queryType=detail&jsonData=" + data,
            method: "POST"
        });
    })
}

function getNews($ticker) {
    a=$.ajax({
        url: URL + "v2/reference/news?ticker=" + $ticker + "&apiKey=" + key,
        method: "GET"
    }).done(function(data) {
        console.log(data);
        $.ajax({
            url: php + "setStock&stockTicker=" + $ticker + "&queryType=news&jsonData=" + data,
            method: "POST"
        });
    })

    
}