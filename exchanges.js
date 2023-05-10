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
const formattedLastYear = (y - 1) + '-' + m + '-' + d;
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
        url: URL + "v2/aggs/ticker/" + $ticker + "/range/1/day/" + formattedLastWeek + "/" + formattedToday + "?adjusted=true&sort=asc&limit=5000&apiKey=" + key,
        method: "GET"
    }).done(function(data) {
        console.log(data);
        $("#info").html("<div class='col row infoPage' id='infoPage'>");
        $("#infoPage").html("");
        $("#infoPage").append("<div class='col' id='logoCol'>");
        $("#infoPage").append("<div class='col' id='infoCol1'>");
        
        $("#infoCol1").html("<p> At close on " + formattedToday + "</p><p class='inline top'>$</p>");
        $("#infoCol1").append("<h1 class='inline'>" + data.results[0].c + "</h1>");
        $("#infoCol1").append("<p class='inline'> USD</p>");
        b=$.ajax({
            url: URL + "v2/aggs/ticker/" + $ticker + "/range/1/day/" + formattedLastYear + "/" + formattedToday + "?adjusted=true&sort=asc&limit=50000&apiKey=" + key,
            method: "GET"
        }).done(function(data) {
            $("#infoCol1").append("<p>52 week range</p><h1>" + data.results[0].c + " - " + data.results[data.count - 1].c + "</h1>");
        })
        $("#infoPage").append("<div class='col' id='infoCol2'>");
        $("#infoCol2").html("<p>Ticker</p><h1>" + $ticker + "</h1><p>Volume</p><h1>" + data.results[0].v + "</h1>");
        
        $("#infoPage").append("</div>");
        $("#info").append("</div>");
        $("#info").append("<canvas id='priceChart' class='chart col center' style='width:100%;max-width:700px'></canvas>");
        
        c=$.ajax({
            url: URL + "v3/reference/tickers/" + $ticker + "?apiKey=" + key,
            method: "GET"
        }).done(function(data) {
            console.log(data);
            $("#logoCol").append("<p>Name</p><h1>" + data.results.name + "</h1>");
            if(data.results.branding.logo_url != null) {
                $("#logoCol").prepend("<div class='col'><img src='" + data.results.branding.logo_url + "?apikey=" + key +"'></div>")
            }
       
        })
        let n =[];
        for (i = 0; i < data.resultsCount; i++) {
            n[i] = i;
        }
        let close = [];
        let max = -1;
        for (i = 0; i < data.resultsCount; i++) {
            close[i] = data.results[i].c;
            if (max <= close[i]) {
                max = close[i];
            }
        }
        $("#infoCol2").append("<p>7 Day High</p><h1>" + max + "</h1>");
        new Chart("priceChart", {
            type: "line",
            data: {
                labels: n,
                datasets: [{
                    data: close,
                    borderColor: "green",
                    fill: true
                }],
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    
                    yAxes: [{
                        ticks: {
                            fontColor: 'white'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Stock Price (USD)',
                            fontColor: 'white',
                            fontSize: 18
                        }
                        
                    }],
                    xAxes: [{ 
                        ticks: {
                            fontColor: 'white'
                        },                      
                        scaleLabel: {
                            display: true,
                            labelString: 'Days',
                            fontColor: 'white',
                            fontSize: 18
                        }
                    }]
                }
            }
        });
        
        d=$.ajax({
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
            $("#info").html("<div class='p'>Latest News on " + $ticker + "</div>");
            $("#info").append("<table id='table1' class='container'>");
            $("#table1").html("<thead class='center'><tr class='row'><th class='col'>Publication</th><th class='col'>Title</th><th class='col'>Date Published</th></tr></thead>");
            $("#table1").append("<tbody id='stockLines' class='center'>");
            $("#stockLines").html("");
            
            for (let i = 0; i < data.count; i++) {
                const da = new Date(data.results[i].published_utc);
                const datePub = (da.getMonth() + 1) + "/" + da.getDate() + "/" + da.getFullYear();
                $("#stockLines").append("<tr class='row tr'><td class='col publ'>" + data.results[i].publisher.name + "</td><td class='col'> <a href='" + data.results[i].article_url + "'>" + data.results[i].title + "</a></td><td class='col dat'>" + datePub +  "</td></tr>");
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