var TestMember = "測試帳號";

$(document).ready(function () {
    LoadShoppingChart();
    insertKendoWindow();
    EvaluateWindow();
    SetAccountCookie(TestMember,24);

    var MarketList = [
        {text:"台北二",value:"台北二"},
        {text:"台北市場",value:"台北市場"},
        {text:"台北一",value:"台北一"},
        {text:"板橋區",value:"板橋區"},
        {text:"三重區",value:"三重區"}
    ]
    var ProductList = [
        {text:"椰子",value:"椰子"},
        {text:"棗子",value:"棗子"},
        {text:"釋迦",value:"釋迦"},
        {text:"釋迦-鳳梨釋迦",value:"釋迦-鳳梨釋迦"},
        {text:"草莓",value:"草莓"}
    ];
    

    $("#MarketCategory").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: MarketList,
        index: 0,
    });

    $("#ProductCategory").kendoDropDownList({
        dataTextField: "text",
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
        var dataSource = grid.dataSource;

        //防止頁面滾動位置更改
        e.preventDefault();     
        //在當前的元素，DOM樹中向上遍歷，直到找到了與提供的選擇器相匹配的元素
        var tr = $(e.target).closest("tr");
        var data = grid.dataItem(tr);
        var FavoriteJSON = TestMember + ',' + data.MarketId + ',' + data.ProductId;
        alert(FavoriteJSON);
        // $.ajax({
        //     url: "http://127.0.0.1:8000/products/InsertFavorite",    
        //     data: FavoriteJSON,
        //     contentType: 'application/json',
        //     type: "POST",
        //     traditional: true,    // 需要传递列表、字典时加上这句
        //     success: function(result) {
        //         alert("收藏成功");
        //     },
        //     fail: function(result) {
        //         alert("收藏失敗")
        //     }
        // });
    }
}



//鎖定市場與產品的window
function insertKendoWindow(){
    //設定kendowindow顯示
    var insertWindow = $("#FilterForm");
    var insertBar = $("#FilterInsert");
    insertBar.click(function() {
        insertWindow.data("kendoWindow").open();
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
    var DataPosition,Id;
    if(ShoppingChartList.length == 0){
        DataPosition = 0;
        Id = 1;
    }else{
        DataPosition = ShoppingChartList.length;
        Id = ShoppingChartList[DataPosition - 1].id + 1;
    }

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

    ShoppingChartList[DataPosition] = ShoppingChartLocal;
    localStorage.setItem("ShoppingChartData",JSON.stringify(ShoppingChartList));

    $("#ShoppingForm").data("kendoWindow").close();
    alert(ShoppingChartList);
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