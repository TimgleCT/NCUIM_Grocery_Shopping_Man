var ShoppingChartList = []
$(document).ready(function () {
    EditQuantityWindow();
    LoadShoppingChart();
    $("#Grid").kendoGrid({
        dataSource: {
            data: ShoppingChartList,
            schema: {
                model: {
                    fields: {
                        id: {type:"int"},
                        ProductId: { type: "string" },
                        ProductName: { type: "string" },
                        MarketId: { type: "string" },
                        MarketName: { type: "string" },
                        AveragePrice: { type: "float" },
                        Quantity:{type: "int"},
                        TotalPrice:{type: "float"}
                    }
                }
            },
            sort: { field: "ProductId", dir: "asc" }//由大到小：desc
        },
        noRecords: {
            template: function(e){
                return "您還未將任何產品加入估價清單喔! ";
              }
        },
        sortable: true,
        pageable: false,
        columns: [
            { field: "MarketName", title: "市場名稱", width: "15%" },
            { field: "ProductName", title: "作物名稱", width: "17%" },
            { field: "AveragePrice", title: "今日均價", width: "15%" },
            { field: "Quantity", title: "數量", width: "10%" },
            { field: "TotalPrice", title: "預算", width: "10%" },
            { command: { text: "編輯", click: EditQuantity }, title: "編輯數量", width: "12%" },
            { command: { text: "刪除估價", click: CancelShopping }, title: "刪除估價", width: "12%" }
        ],
        editable: false
    });
    CalculateTotalPrice();
});


function LoadShoppingChart(){
    ShoppingChartList = JSON.parse(localStorage.getItem("ShoppingChartData"));
    if(ShoppingChartList == null){
        ShoppingChartList = [];
    }
}

function CalculateTotalPrice(){
    var AllTotalPrice = 0;
    for(var i = 0; i < ShoppingChartList.length; i++){
        AllTotalPrice = AllTotalPrice + ShoppingChartList[i].TotalPrice;
    }
    document.getElementById("TotalPrice").innerHTML = "Total：" + AllTotalPrice + "元";
}

function CancelShopping(e){
    if(confirm("你確定要刪除這項預算嗎?")){
        var grid = $("#Grid").data("kendoGrid")
        var dataSource = grid.dataSource;
        //防止頁面滾動位置更改
        e.preventDefault();     
        //在當前的元素，DOM樹中向上遍歷，直到找到了與提供的選擇器相匹配的元素
        var tr = $(e.target).closest("tr");
        var data = grid.dataItem(tr);
        dataSource.remove(data);

        //刪除localStorage資料
        //找出欲刪除的資料ID
        //使用 splice 方法去除陣列中某筆位置的資料
        var deletePosition;
        //更新整包datasource
        //刪除多項資料時會有問題
        for(var i = 0; i < ShoppingChartList.length; i++){
            if(ShoppingChartList[i].id == data.id){
                deletePosition = i;
                ShoppingChartList.splice(deletePosition,1);
                localStorage.setItem("ShoppingChartData",JSON.stringify(ShoppingChartList));
            }
        }
        CalculateTotalPrice()
    }
}

var EditId;
function EditQuantity(e){
    var EvaluateWindow = $("#ShoppingForm");
    EvaluateWindow.data("kendoWindow").open();

    var grid = $("#Grid").data("kendoGrid")
    e.preventDefault();     
    var tr = $(e.target).closest("tr");
    var data = grid.dataItem(tr);
    document.getElementById("MarketNameShopping").innerHTML = data.MarketName;
    document.getElementById("ProductNameShopping").innerHTML = data.ProductName;
    document.getElementById("PriceShopping").innerHTML = data.AveragePrice + "元";
    document.getElementById("Quantity").value = data.Quantity;
    EditId = data.id;
}

function ClickQuantitySubmit(){
    var UpdatePosition;
    var dataSource = $("#Grid").data("kendoGrid").dataSource;
    for(var i = 0; i < ShoppingChartList.length; i++){
        if(ShoppingChartList[i].id == EditId){
            UpdatePosition = i;
            var newQuantity = document.getElementById("Quantity").value;
            ShoppingChartList[UpdatePosition].Quantity = newQuantity;
            ShoppingChartList[UpdatePosition].TotalPrice = Math.round(newQuantity * ShoppingChartList[UpdatePosition].AveragePrice); 
            localStorage.setItem("ShoppingChartData",JSON.stringify(ShoppingChartList));
        }
    }
    dataSource.pushUpdate(ShoppingChartList);
    LoadShoppingChart();
    CalculateTotalPrice();
    $("#ShoppingForm").data("kendoWindow").close();
}

function EditQuantityWindow(){
    //設定kendowindow顯示
    var EvaluateWindow = $("#ShoppingForm");
    EvaluateWindow.kendoWindow({
        width: "400px",
        title: "編輯數量",
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