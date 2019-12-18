
function gd(year, month, day) {
    // return new Date(year, month-1, day+17).getTime()-1440000000;
    return new Date(year, month-1, day).getTime()+29160000;
}

function dateconvert(Data_prod) {

    for(i=0;i<7;i++){
        if(Data_prod[i]!=null){
            string_d = Data_prod[i].Date;
            string_p = Data_prod[i].AveragePrice;
            o_test = string_d.split(".");
            o_year = string_d.split(".")[0];
            o_month = string_d.split(".")[1];
            o_day = string_d.split(".")[2];
            console.log(o_test);
            console.log(o_year);
            console.log(o_month);
            console.log(o_day);
            console.log(gd(parseInt(o_year),parseInt(o_month),parseInt(o_day)),string_p);
            // console.log(gd(108,12,17));
            week_data[i] = [gd(parseInt(o_year),parseInt(o_month),parseInt(o_day)),string_p];
            console.log(week_data[i]);
        }
    }

}

var week_data = [];



var testdata = [
    [gd(2019,12,17),94.87],
    [gd(2019,12,18),88],
    [gd(2019,12,19),87.87],
    [gd(2019,12,20),77.77],
    [gd(2019,12,21),99.77]
    // [gd(2019,12,22),88.77],
    // [gd(2019,12,23),99]
];



$(document).ready(function () {
    dateconvert(trend_data);
    // console.log('function work');
});

$(function () {
    //
    // console.log('function1 work');

    $.plot($("#flotcontainer"),
        [
            {
              data: week_data,
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