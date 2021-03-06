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

var UserAccount;
$(document).ready(function () {

    $("#Grid").kendoGrid({
        dataSource: {
            data: fav_data,
            schema: {
                model: {
                    fields: {
                        ProductName: { type: "string" },
                        MarketName: { type: "string" },
                        AveragePrice: { type: "float" },
                        Fav_id: {type: "string"},
                    }
                }
            },
            pageSize: 10,
            sort: { field: "Fav_id", dir: "asc" }//由大到小：desc
        },
        toolbar: kendo.template("<div class='product-grid-toolbar'><input class='product-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 500,
        sortable: true,
        noRecords: {
            template: function(e){
                return "您沒有相關收藏喔!";
              }
        },
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

function CancelFavorite(e){
    if(confirm("你確定要刪除這項收藏嗎?")){
        var grid = $("#Grid").data("kendoGrid")
        var dataSource = grid.dataSource;
        //防止頁面滾動位置更改
        e.preventDefault();     
        var tr = $(e.target).closest("tr");
        var data = grid.dataItem(tr);
        dataSource.remove(data);

        var DeleteBackEnd = data.Fav_id;
        // alert(DeleteBackEnd);
        $.ajax({
            url: '/products/delete/'+ DeleteBackEnd,
            type: "GET",
            success: function(result) {
                alert("刪除成功");
            },
            fail: function(result) {
                alert("刪除失敗")
            }
        });
    }
}


