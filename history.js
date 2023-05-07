stock();

function stock() {
    $("#get").click(function() {
        var date = $("#date").val();
        var lines = $("#lines").val();
        getStocks(date, lines);
        console.log("fuck");
    })
}

function getStocks($date, $lines) {
    a=$.ajax({
        url: php + "getStock&date=" + $date,
        method: "POST"
    }).done(function(data) {
        console.log(data);
    });
}