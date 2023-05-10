var URL="https://api.polygon.io/";
var key="oVhmIj_vHLKvXKNcn3LNn95ImprN3LgO";
var php="http://172.17.12.35/cse383_final/final.php?method=";
const today = new Date();
const y = today.getFullYear();
let m = today.getMonth() + 1;
let d = today.getDate();

if (d < 10) d = '0' + d;
if (m < 10) m = '0' + m;

const formattedToday = y + '-' + m + '-' + d;

const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 11);
let dd = lastWeek.getDate();
let mm = lastWeek.getMonth() + 1;
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedLastWeek = y + '-' + mm + '-' + dd;
getExchange();

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
        url: URL + "v3/reference/tickers?market=stocks&exchange=" + $exchange + "&active=true&order=asc&limit=1000&sort=ticker&apiKey=" + key,
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
        url: URL + "v2/aggs/ticker/" + $ticker + "/range/1/day/" + formattedLastWeek + "/" + formattedToday + "?adjusted=true&sort=asc&limit=120&apiKey=" + key,
        method: "GET"
    }).done(function(data) {
        console.log(data);
        $("#info").html("<div class='col' id='infoPage'>");
        $("#infoPage").html("<p>" + data.ticker + "</p>");
        $("#info").append("</div>");
        $("#info").append("<canvas id='priceChart' class='chart col center' style='width:100%;max-width:700px'></canvas>");

        let n =[];
        for (i = 0; i < data.resultsCount; i++) {
            n[i] = i;
        }
        let close = [];
        for (i = 0; i < data.resultsCount; i++) {
            close[i] = data.results[i].c;
        }

        new Chart("priceChart", {
            type: "line",
            data: {
                labels: n,
                datasets: [{
                    data: close,
                    borderColor: "blue",
                    fill: true
                }],
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Stock Price (USD)'
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Days'
                        }
                    }]
                }
            }
        });
        b=$.ajax({
            url: php + "setStock&stockTicker=" + $ticker + "&queryType=detail&jsonData=" + data.results,
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
        if(data.count >0 ) {
            $("#info").html("<div class='p'>Stocks</div>");
            $("#info").append("<table id='table1' class='container'>");
            $("#table1").html("<thead class='center'><tr class='row'><th class='col'>Stock</th><th class='col'>Date and Time</th><th class='col'>Type</th></tr></thead>");
            $("#table1").append("<tbody id='stockLines' class='center'>");
            $("#stockLines").html("");
            for (let i = 0; i < data.count; i++) {
                $("#stockLines").append("<tr class='row'><td class='col'>" + data.results[i].title + "</td><td class='col'>" + data.results[i].author + "</td><td class='col'> <a href='" + data.results[i].article_url + "'>" + data.results[i].publisher.name + "</a></td></tr>");
            }
            $("#table1").append("</tbody>");
            $("#info").append("</table>");
        } else {
            alert("No recent news found");
        }
        b=$.ajax({
            url: php + "setStock&stockTicker=" + $ticker + "&queryType=news&jsonData=" + data.results,
            method: "POST"
        });
    })
}