
function gd(year, month, day) {
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
    {text:"花蓮市",value:"花蓮市"}
]

var ProductList = [
    {ProductName:"-",value:"-"}
];

function dateconvert(Data_prod) {
    console.log(trend_data);
    console.log(Data_prod);

    if(Data_prod == ""){
        var whatday = new Date();
        today = whatday.getFullYear()+'.'+(whatday.getMonth()+1)+'.'+whatday.getDate();
        console.log(today);
        week_data = [null,null,null,null,null,null,null];

        week_data_grid = week_data_grid + "[{";
        for(i = 0;i<7;i++){
            if (week_data[i] == null ||week_data[i].AveragePrice == 0) {
                DayPrice = "無本日資料";
                count = i+1;
                if(i<6) {
                    week_data_grid = week_data_grid + '"Day' + count + '":"' + DayPrice + '",';
                }else {
                    week_data_grid = week_data_grid + '"Day' + count + '":"' + DayPrice + '"';
                }
            }
        }
        week_data_grid = week_data_grid + "}]";
        console.log(week_data_grid);
        week_data_grid = JSON.parse(week_data_grid);
    }else {
        week_data_grid = week_data_grid + "[{";
        today = Data_prod[Data_prod.length - 1].Date;

        data_start = 0;


        if (Data_prod.length < 7) {
            data_start = 0;
            console.log('data start at = ' + data_start);
        } else {
            data_start = Data_prod.length - 7;
            console.log('data start at = ' + data_start);
        }

        for (j = data_start; j <= Data_prod.length - 1; j++) {
            testdate = Data_prod[j].Date;
            testday = parseInt(testdate.split('.')[2]);
            console.log('testday = ' + testday);
            console.log('today = ' + today.split('.')[2]);

            pos = 6 - (today.split('.')[2] - testday);
            console.log('pos = ' + pos);
            filted_data[pos] = [Data_prod[j].Date, Data_prod[j].AveragePrice];
        }


        var week_data_pos = 0;
        var count = 1;
        for (i = 0; i < 7; i++) {

            if (filted_data[i] == null) {
                DayPrice = "無本日資料";
            } else {
                arr = filted_data[i];
                if(arr[1] != 0){
                DayPrice = arr[1] + "元";
                }else {
                    DayPrice = "休市";
                }
            }

            if (i == 6) {
                week_data_grid = week_data_grid + '"Day' + count + '":"' + DayPrice + '"';
            } else {
                week_data_grid = week_data_grid + '"Day' + count + '":"' + DayPrice + '",';
            }
            count += 1;

            if (filted_data[i] != null) {
                arr = filted_data[i];
                string_d = arr[0];
                string_p = arr[1];
                if (string_p != 0) {
                    o_test = string_d.split(".");
                    o_year = string_d.split(".")[0];
                    o_month = string_d.split(".")[1];
                    o_day = string_d.split(".")[2];

                    week_data[week_data_pos] = [gd(parseInt(o_year), parseInt(o_month), parseInt(o_day)), string_p];
                    week_data_pos += 1;
                    console.log('week_date[' + i + ']:');
                }else {
                    week_data[week_data_pos] = null;
                    week_data_pos += 1;
                }

            }
        }

        week_data_grid = week_data_grid + "}]";
        console.log(week_data_grid);
        week_data_grid = JSON.parse(week_data_grid);
        console.log('filt data: '+ filted_data);
        console.log('week data' + week_data);


    }
}
var filted_data = [null,null,null,null,null,null,null];
var week_data = [];
var week_data_grid = "";
var today;


var testdata = [
    [gd(2019,12,17),94.87],
    [gd(2019,12,18),88],
    [gd(2019,12,19),87.87],
    [gd(2019,12,20),77.77],
    [gd(2019,12,21),99.77]
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
        url: '/products/trend/'+SelectMarketName,
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
    ProName = $("#ProductCategory_t option:selected").val();
    MarketName = $("#MarketCategory_t option:selected").val();
    if (ProName != "-") {
        Status.text("");
        SetCookie(MarketName,ProName,0.1);
        return true;
    } else {
        Status.text("請填寫完整資料!!");
        return false;
    }
}

function SetCookie(MarketName,ProductName,Exhours){
    var D = new Date();
    D.setTime(D.getTime() + (Exhours * 60 * 60 * 1000));
    var Expires = "expires="+ D.toUTCString();
    document.cookie = "MN = " + MarketName + ";" + Expires + ";path=/";
    document.cookie = "PN = " + ProductName + ";" + Expires + ";path=/";
}


function getCookie(name)//取cookies函数
  {
      var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
       if(arr != null) return unescape(arr[2]); return null;
  }

  function delCookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) SetCookie("","",-1);
}


$(document).ready(function () {
    insertKendoWindow_t();
    dateconvert(trend_data);

    if(getCookie("MN") != null && getCookie("PN") != null){
        $("#Name").text(getCookie("MN") +","+ getCookie("PN"));
        delCookie("MN");
        delCookie("PN");
    }

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
            { field: "Day1", title: today.split('.')[1]+'/'+ (parseInt(today.split('.')[2])-6).toString(), width: "15%" },
            { field: "Day2", title: today.split('.')[1]+'/'+ (parseInt(today.split('.')[2])-5).toString(), width: "15%" },
            { field: "Day3", title: today.split('.')[1]+'/'+ (parseInt(today.split('.')[2])-4).toString(), width: "15%" },
            { field: "Day4", title: today.split('.')[1]+'/'+ (parseInt(today.split('.')[2])-3).toString(), width: "15%" },
            { field: "Day5", title: today.split('.')[1]+'/'+ (parseInt(today.split('.')[2])-2).toString(), width: "15%" },
            { field: "Day6", title: today.split('.')[1]+'/'+ (parseInt(today.split('.')[2])-1).toString(), width: "15%" },
            { field: "Day7", title: today.split('.')[1]+'/'+ today.split('.')[2], width: "15%" },
        ],
        editable: false
    });
    if(trend_data != '' && week_data != '') {
        setTimeout(function () {
            $.plot($("#flotcontainer"),
                [
                    {
                        data: week_data,
                        points: {show: true},
                        lines: {
                            show: true,
                            lineWidth: 5,
                        }
                    }
                ],
                {
                    grid: {
                        backgroundColor: {colors: ["#764ba2", "#764ba2"]},
                        borderColor: "#FFFFFF",
                        borderWidth: 5,
                    },
                    xaxis: {
                        color: "#FFFFFF",
                        mode: "time",
                        timeformat: "%m/%d",
                    },
                    yaxis: {
                        color: "#FFFFFF",
                    },
                    points: {
                        //資料點的半徑大小
                        radius: 10
                    },
                    colors: ["#FFDDAA"]
                },
            )
        }, 10)

    }
});