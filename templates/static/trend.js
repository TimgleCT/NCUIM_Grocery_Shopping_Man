
function gd(year, month, day) {
    return new Date(year, month-1, day+17).getTime()-1440000000;
}

function dateconvert(Data_prod) {
    strig_d = Data_prod[0].toString();
    test = strig_d.split(".");
    year = strig_d.split(".")[0];
    month = strig_d.split(".")[1];
    day = strig_d.split(".")[2];
    return test;
}

var testdata = [
    [gd(2019,12,17),94.87],
    [gd(2019,12,18),88],
    [gd(2019,12,19),87.87],
    [gd(2019,12,20),77.77],
    [gd(2019,12,21),99.77],
    [gd(2019,12,22),88.77],
    [gd(2019,12,23),99]
]



var trendDate, trendMarketName, trendProductName, trendPrice


$(function () {

    $.plot($("#flotcontainer"),
        [
            {
              data: testdata,
              points: { show: true },
              lines: { show: true}
            }
        ],
        {
            grid: {
                backgroundColor: { colors: ["#000000", "#000000"] }
            },
            xaxis: {
                color: "#FFFFFF",
                mode: "time",
                timeformat: "%y/%m/%d"
            },
            yaxis: {
                color: "#FFFFFF"
            }

        }
    );
});