var ProductData = [];

$(document).ready(function () {
    LoadProductData();
    insertKendoWindow();


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
            data: ProductData,
            schema: {
                model: {
                    fields: {
                        Date: {type:"string"},
                        ProductId: { type: "string" },
                        ProductName: { type: "string" },
                        MarketId: { type: "string" },
                        MarketName: { type: "string" },
                        TopPrice: { type: "int" },
                        MiddlePrice: { type: "int" },
                        LowPrice: { type: "int" },
                        AveragePrice: { type: "int" },
                        Quantity: { type: "int" }
                    }
                }
            },
            pageSize: 20,
            sort: { field: "交易日期", dir: "asc" }//由大到小：desc
        },
        toolbar: kendo.template("<div class='product-grid-toolbar'><input class='product-grid-search' placeholder='我想要找......' type='text'></input></div>"),
        height: 550,
        sortable: true,
        pageable: {
            refresh: true,
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

function LoadProductData(){
    ProductData = data.map(function(item){
        return{
            Date:item.交易日期,
            ProductId:item.作物代號,
            ProductName:item.作物名稱,
            MarketId:item.市場代號,
            MarketName:item.市場名稱,
            TopPrice:item.上價,
            MiddlePrice:item.中價,
            LowPrice:item.下價,
            AveragePrice:item.平均價,
            Quantity:item.交易量
        }
    });
}

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

function Favorite(){

}

function Evaluate(){

}

//新增書籍的window
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
