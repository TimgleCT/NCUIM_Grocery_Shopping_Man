
function gd(year, month, day) {
    // return new Date(year, month-1, day+17).getTime()-1440000000;
    return new Date(year, month-1, day).getTime()+29160000;
}

var MarketList = [
    {text:"台北二",value:"台北二"},
    {text:"台北市場",value:"台北市場"},
    {text:"台北一",value:"台北一"},
    {text:"板橋區",value:"板橋區"},
    {text:"三重區",value:"三重區"}
]

var ProductList = [
    {ProductName:"-",value:"-"}
];

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


function insertKendoWindow_t(){
    //設定kendowindow顯示
    var insertWindow = $("#FilterForm_t");
    var insertBar = $("#FilterInsert_t");
    insertBar.click(function() {
        insertWindow.data("kendoWindow").open();
        $("#MarketCategory_t").data('kendoDropDownList').select(0);
        ChangeFormItem_t();
    });

    insertWindow.kendoWindow({
        width: "400px",
        title: "鎖定市場/產品",
        visible: false,
        actions: [
            "Minimize",
            "Close"
        ],
        position: {
            top: "50%",
            left: "50%"
        }
    }).data("kendoWindow").center();
}

function ChangeFormItem_t() {
    console.log('trend CF work')
    var SelectMarketName = $("#MarketCategory_t option:selected").val();
    var ProductCategoryList = $("#ProductCategory_t").data("kendoDropDownList");
    console.log(SelectMarketName);
    $.ajax({
        url: SelectMarketName,
        type: 'GET',
        datatype: 'json',
        success: function (data) {
            if (data){
                ProductList = data;
                ProductList = ProductList.replace(/'/g,'"');
                ProductList = ProductList.replace('[',',' );
                ProductList = '[{"ProductName": "-"}'+ ProductList;
                ProductList = JSON.parse(ProductList);
                ProductCategoryList.dataSource.data(ProductList);
                $("#ProductCategory_t").data('kendoDropDownList').select(0);
            }
        }
    });
    // ProductList = data;
    // ProductCategoryList.dataSource.data(ProductList);
}


$(document).ready(function () {
    insertKendoWindow_t();
    dateconvert(trend_data);
    // console.log('function work');
    $("#MarketCategory_t").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: MarketList,
        index: 0,
        change: ChangeFormItem_t
    });

    $("#ProductCategory_t").kendoDropDownList({
        dataTextField: "ProductName",
        dataValueField: "value",
        dataSource: ProductList,
        index: 0,
    });

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