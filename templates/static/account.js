function Logout(){
    SetAccountCookie("",-1)
}

function SetAccountCookie(MemberId,Exhours){
    var D = new Date();
    D.setTime(D.getTime() + (Exhours * 60 * 60 * 1000));
    var Expires = "expires="+ D.toUTCString();
    document.cookie = "UserAccount = " + MemberId + ";" + Expires + ";path=/";
}