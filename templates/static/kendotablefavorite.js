var FavoriteData = [
    {
        "id":"1",
        "ProductId":"11",
        "ProductName":"椰子",
        "MarketId":"104",
        "MarketName":"台北二",
        "AveragePrice":10.8,
    },
    {
        "id":"2",
        "ProductId":"22",
        "ProductName":"棗子",
        "MarketId":"104",
        "MarketName":"台北二",
        "AveragePrice":75.1,
    }
]

$(document).ready(function () {

    $("#Grid").kendoGrid({
        dataSource: {
            data: FavoriteData,
            schema: {
                model: {
                    fields: {
                        id: {type:"int"},
                        ProductId: { type: "string" },
                        ProductName: { type: "string" },
                        MarketId: { type: "string" },
                        MarketName: { type: "string" },
                        AveragePrice: { type: "float" },
                    }
                }
            },
            pageSize: 10,
            sort: { field: "ProductId", dir: "asc" }//由大到小：desc
        },
        toolbar: kendo.template("<div class='product-grid-toolbar'><input class='product-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 540,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [
            { field: "MarketName", title: "市場名稱", width: "15%" },
            { field: "ProductName", title: "作物名稱", width: "20%" },
            { field: "AveragePrice", title: "今日均價", width: "15%" },
            { command: { text: "取消收藏", click: CancelFavorite }, title: "取消收藏", width: "12%" }
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

function CancelFavorite(){

}

function Evaluate(){

}

