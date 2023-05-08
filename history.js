var php = "http://172.17.12.35/cse383_final/final.php?method=getStock&date=";

$(document).on("click", "#fuckYou" ,function() {
    var date = $("#date").val();
    var lines = $("#lines").val();
    getStocks(date, lines);
});

function getStocks($date, $lines) {
    a=$.ajax({
        url: php + $date,
        method: "POST"
    }).done(function(data) {
        if(data.result.length > 0) {
            $("#table").html("<h2>Stocks<span id=\"lines\"></span></h2>");
            $("#table").append("<table class='table'>");
            $("#table").append("<thead><tr><th>Stock</th><th>Date and Time</th><th>Type</th></tr></thead>");
            $("#table").append("<tbody id='stockLines'>");
            $("#stockLines").html("");
            for (let i = 0; i < $lines && i < data.result.length; i++) {
                $("#stockLines").append("<tr><td>" + data.result[i].stockTicker + "</td><td>" + data.result[i].dateTime + "</td><td>" + data.result[i].queryType + "</td></tr>");
            }
            $("#table").append("</tbody>");
            $("#table").append("</table>");
        } else {
            alert("No Stocks found on that date")
        }
        
    })
}