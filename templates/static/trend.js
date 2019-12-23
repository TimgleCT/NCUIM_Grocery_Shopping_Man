
function gd(year, month, day) {
    // return new Date(year, month-1, day+17).getTime()-1440000000;
    return new Date(year, month-1, day).getTime()+29160000;
}

var MarketList = [
    {text:"台北二",value:"台北二"},
    {text:"台北一",value:"台北一"},
    {text:"板橋區",value:"板橋區"},
    {text:"三重區",value:"三重區"},
    {text:"桃農",value:"桃農"},
    {text:"台中市",value:"台中市"},
    {text:"豐原區",value:"豐原區"},
    {text:"溪湖鎮",value:"溪湖鎮"},
    {text:"南投市",value:"南投市"},
    {text:"嘉義市",value:"嘉義市"},
    {text:"高雄市",value:"高雄市"},
    {text:"鳳山區",value:"鳳山區"},
    {text:"屏東市",value:"屏東市"},
    {text:"台東市",value:"台東市"},
    {text:"東勢鎮",value:"東勢鎮"},
    {text:"宜蘭市",value:"宜蘭市"},
    {text:"永靖鄉",value:"永靖鄉"},
    {text:"西螺鎮",value:"西螺鎮"},
    {text:"花蓮市",value:"花蓮市"},
]

var ProductList = [
    {ProductName:"-",value:"-"}
];

function dateconvert(Data_prod) {
    console.log(Data_prod);
    week_data_grid = week_data_grid +"[{";
    var count = 1;
    for(i=Data_prod.length-1;i>=Data_prod.length-7;i--){

        if(Data_prod[i] == null){
            DayPrice = "無本日資料";
        }else{
            DayPrice = Data_prod[i].AveragePrice;
        }
        
        if(i == Data_prod.length-7){
            week_data_grid = week_data_grid + '"Day' + count + '":"' +DayPrice +'元"';
        }else{
            week_data_grid = week_data_grid + '"Day' + count + '":"' +DayPrice +'元",';
        }
        count += 1;

        if(Data_prod[i]!=null){
            string_d = Data_prod[i].Date;
            string_p = Data_prod[i].AveragePrice;
            o_test = string_d.split(".");
            o_year = string_d.split(".")[0];
            o_month = string_d.split(".")[1];
            o_day = string_d.split(".")[2];
            // console.log(o_test);
            // console.log(o_year);
            // console.log(o_month);
            // console.log(o_day);
            // console.log(gd(parseInt(o_year),parseInt(o_month),parseInt(o_day)),string_p);
            // console.log(gd(108,12,17));
            week_data[i] = [gd(parseInt(o_year),parseInt(o_month),parseInt(o_day)),string_p];
            console.log(week_data[i]);
        }
    }
    week_data_grid = week_data_grid +"}]";
    week_data_grid = JSON.parse(week_data_grid);
    console.log(week_data_grid);
    console.log(week_data);
}

var week_data = [];
var week_data_grid = "";



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
}

function Validation(){
    Status = $(".Status");
    MPName = $("#Name");
    ProName = $("#ProductCategory_t option:selected").val();
    MarketName = $("#MarketCategory_t option:selected").val();
    if (ProName != "-") {
        Status.text("");
        MPName.text(MarketName +","+ ProName);
        return true;
    } else {
        Status.text("請填寫完整資料!!");
        return false;
    }
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
    
    $("#GridTrend").kendoGrid({
        dataSource: {
            data: week_data_grid,
            schema: {
                model: {
                    fields: {
                        Day1: {type:"string"},
                        Day2: {type:"string"},
                        Day3: {type:"string"},
                        Day4: {type:"string"},
                        Day5: {type:"string"},
                        Day6: {type:"string"},
                        Day7: {type:"string"},
                    }
                }
            },
        },
        sortable: false,
        pageable: false,
        columns: [
            { field: "Day1", title: "一天前", width: "15%" },
            { field: "Day2", title: "二天前", width: "15%" },
            { field: "Day3", title: "三天前", width: "15%" },
            { field: "Day4", title: "四天前", width: "15%" },
            { field: "Day5", title: "五天前", width: "15%" },
            { field: "Day6", title: "六天前", width: "15%" },
            { field: "Day7", title: "七天前", width: "15%" },
        ],
        editable: false
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