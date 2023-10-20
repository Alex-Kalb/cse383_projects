var php = "http://172.17.12.35/cse383_final/final.php?method=getStock&date=";

$(document).on("click", "#get" ,function() {
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
            $("#table").html("<div class='p'>Stocks Queried</div>");
            $("#table").append("<table id='table1' class='container'>");
            $("#table1").html("<thead class='center'><tr class='row'><th class='col'>Stock</th><th class='col'>Date and Time</th><th class='col'>Request Type</th></tr></thead>");
            $("#table1").append("<tbody id='stockLines' class='center'>");
            $("#stockLines").html("");
            for (let i = 0; i < $lines && i < data.result.length; i++) {
                $("#stockLines").append("<tr class='row'><td class='col'>" + data.result[i].stockTicker + "</td><td class='col'>" + data.result[i].dateTime + "</td><td class='col'>" + data.result[i].queryType + "</td></tr>");
            }
            $("#table1").append("</tbody>");
            $("#table").append("</table>");
        } else {
            alert("No Stocks found on that date");
        }
    })
}