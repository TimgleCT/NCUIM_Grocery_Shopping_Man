function CheckNull(){
　var checkaccount = document.getElementById("account1null").value;
  var checkpassword1 = document.getElementById("password1null").value;
  var checkpassword2 = document.getElementById("password2null").value;
　if(checkaccount == ""){
    alert("帳號不可為空")
  }else if(checkpassword1 == ""){
    alert("密碼不可為空")
  }
  else if(checkpassword2 != checkpassword1){
    alert("兩次密碼輸入不同")
  }else{
  }
}

function DoubleAccount(){
    if (register_str == ''){
    }
    else if (register_str == '帳號已被註冊過'){
        register_str = ''
        alert('帳號已被註冊過')
    }
}