var NoDataMarket;
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

$(document).ready(function () {
    LoadShoppingChart();
    insertKendoWindow();
    EvaluateWindow();

    
    if(pro_data[0].ProductId == "rest"){
        NoDataMarket = pro_data[0].MarketName;
        pro_data = [];
    }


    $("#MarketCategory").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: MarketList,
        index: 0,
        change: ChangeFormItem
    });

    $("#ProductCategory").kendoDropDownList({
        dataTextField: "ProductName",
        dataValueField: "value",
        dataSource: ProductList,
        index: 0,
    });

    $("#Grid").kendoGrid({
        dataSource: {
            data: pro_data,
            schema: {
                model: {
                    fields: {
                        id: {type:"int"},
                        Date: {type:"string"},
                        ProductId: { type: "string" },
                        ProductName: { type: "string" },
                        MarketId: { type: "string" },
                        MarketName: { type: "string" },
                        AveragePrice: { type: "float" },
                    }
                }
            },
            pageSize: 20,
            sort: { field: "交易日期", dir: "asc" }//由大到小：desc
        },
        toolbar: kendo.template("<div class='product-grid-toolbar'><input class='product-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 500,
        sortable: true,
        pageable: {
            refresh: false,
            pageSizes: true,
            buttonCount: 5
        },
        noRecords: {
            template: function(e){
                return "今日 " + NoDataMarket + " 市場休市";
              }
        },
        columns: [
            { field: "Date", title: "日期",width:"15%"},
            { field: "MarketName", title: "市場名稱", width: "15%" },
            { field: "ProductName", title: "作物名稱", width: "20%" },
            { field: "AveragePrice", title: "平均價格", width: "15%" },
            { command: { text: "加入估價", click: Evaluate }, title: "加入估價", width: "14%" },
            { command: { text: "收藏", click: Favorite }, title: "收藏", width: "12%" }
        ],
        editable: false
    });
    Search();
});


function Search(){
    //當鍵盤鑑放開後
    //class改ID
    $(".product-grid-search").keyup(function(){
            //取得搜尋欄的值
            var SearchTarget = $(".product-grid-search").val();
            //取得grid物件
            var Grid = $("#Grid").data("kendoGrid");
            if(SearchTarget) {
                //篩選BookName欄位中包含有searchTarget的資料
                Grid.dataSource.filter(
                    { field: "ProductName", operator: "contains", value: SearchTarget }
                );
            }else{
                Grid.dataSource.filter({});
            }
        });
}

function Favorite(e){
    if(confirm("你確定要收藏此產品嗎?")){
        var grid = $("#Grid").data("kendoGrid");

        //防止頁面滾動位置更改
        e.preventDefault();     
        //在當前的元素，DOM樹中向上遍歷，直到找到了與提供的選擇器相匹配的元素
        var tr = $(e.target).closest("tr");
        var data = grid.dataItem(tr);
        var FavoriteJSON = data.MarketName + ',' + data.ProductName;
        // alert(FavoriteJSON);
        $.ajax({
            url: '/products/add/'+FavoriteJSON,
            type: "GET",
            success: function(result) {
                if (result === 'success')
                    alert("收藏成功");
                else
                    alert("收藏清單已有了>A<");
            },
            fail: function(result) {
                alert("收藏失敗")
            }
        });
    }
}



//鎖定市場與產品的window
function insertKendoWindow(){
    //設定kendowindow顯示
    var insertWindow = $("#FilterForm");
    var insertBar = $("#FilterInsert");
    insertBar.click(function() {
        insertWindow.data("kendoWindow").open();
        $("#MarketCategory").data('kendoDropDownList').select(0);
        ChangeFormItem();
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


function EvaluateWindow(){
    //設定kendowindow顯示
    var EvaluateWindow = $("#ShoppingForm");
    EvaluateWindow.kendoWindow({
        width: "400px",
        title: "數量",
        visible: false,
        actions: [
            "Minimize",
            "Close"
        ],
        position: {
            top: "80%", 
            left: "50%"
        }
    }).data("kendoWindow").center();
}

var ShoppingChartList = []
function LoadShoppingChart(){
    ShoppingChartList = JSON.parse(localStorage.getItem("ShoppingChartData"));
    if(ShoppingChartList == null){
        ShoppingChartList = [];
    }
}

var EvaluateMarketId,EvaluateProductId,EvaluateMarketName,EvaluateProductName,EvaluateAveragePrice;
function ClickSubmit(){
    LoadShoppingChart();

    var Quantity = parseInt(document.getElementById("Quantity").value);
    console.log(Quantity);
    var DataPosition,Id;
    if(ShoppingChartList.length == 0){
        DataPosition = 0;
        Id = 1;
    }else{
        DataPosition = ShoppingChartList.length;
        Id = ShoppingChartList[DataPosition - 1].id + 1;
    }
    console.log(Quantity);
    var ShoppingChartLocal = {
        "id":Id,
        "MarketId":EvaluateMarketId,
        "ProductId":EvaluateProductId,
        "MarketName":EvaluateMarketName,
        "ProductName":EvaluateProductName,
        "AveragePrice":EvaluateAveragePrice,
        "Quantity":Quantity,
        "TotalPrice":Math.round(EvaluateAveragePrice * Quantity)
    };

    if(ShoppingChartList.length == 0){
        ShoppingChartList[DataPosition] = ShoppingChartLocal;
    }else{
        var LoopNum = ShoppingChartList.length;
        for(var i = 0 ; i<LoopNum; i++){
            if(EvaluateMarketId == ShoppingChartList[i].MarketId && EvaluateProductId == ShoppingChartList[i].ProductId){
                        ShoppingChartList[i].Quantity +=  Quantity;
                        ShoppingChartList[i].TotalPrice = Math.round(ShoppingChartList[i].Quantity * ShoppingChartList[i].AveragePrice);
                        break;
            }else if(i == ShoppingChartList.length - 1){
                ShoppingChartList[DataPosition] = ShoppingChartLocal;
            }
        }
    }
    
    localStorage.setItem("ShoppingChartData",JSON.stringify(ShoppingChartList));

    $("#ShoppingForm").data("kendoWindow").close();
}

//鎖定市場與產品的window
function Evaluate(e){
    var EvaluateWindow = $("#ShoppingForm");
    EvaluateWindow.data("kendoWindow").open();
    var grid = $("#Grid").data("kendoGrid");

    //防止頁面滾動位置更改
    e.preventDefault();     
    //在當前的元素，DOM樹中向上遍歷，直到找到了與提供的選擇器相匹配的元素
    var tr = $(e.target).closest("tr");
    var data = grid.dataItem(tr);

    EvaluateMarketName = data.MarketName;
    EvaluateProductName = data.ProductName;
    EvaluateAveragePrice = data.AveragePrice;

    var MarketNameList = document.getElementById("MarketNameShopping");
    var ProductNameList = document.getElementById("ProductNameShopping");
    var PriceShoppingList = document.getElementById("PriceShopping");
    MarketNameList.innerHTML = data.MarketName;
    ProductNameList.innerHTML = data.ProductName;
    PriceShoppingList.innerHTML = data.AveragePrice +" 元";

    EvaluateMarketId = data.MarketId;
    EvaluateProductId = data.ProductId;
}

function ChangeFormItem() {
    var SelectMarketName = $("#MarketCategory option:selected").val();
    var ProductCategoryList = $("#ProductCategory").data("kendoDropDownList");
    console.log(SelectMarketName);
    $.ajax({
        url: '/products/changemarket/'+SelectMarketName,
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
                $("#ProductCategory").data('kendoDropDownList').select(0);
            }
        }
    });
}