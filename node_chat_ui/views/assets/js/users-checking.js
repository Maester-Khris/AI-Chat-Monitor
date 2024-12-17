

document.addEventListener("DOMContentLoaded",function(){
    console.log("lets start");
    // ======= Component and var initialization ===========
    loginModal = document.querySelector("#loginModal");
    signupModal = document.querySelector("#signupModal");
    newaccbtn = document.querySelector("#newAccount");

    // ======= Is auth checking ===========
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.has('auth'));
    if(searchParams.has('auth')==true ){
        console.log("look at that felon");
        $('#loginModal').modal();
    }

    // ======= UI interaction method ===========
    newaccbtn.addEventListener("click",function(){
        console.log("created");
        loginModal.classList.add("hide-modal");
        setTimeout(()=>{
            $('#loginModal').modal('hide');
            $('#signupModal').modal();
            
        },1000);
        setTimeout(()=>{
            signupModal.classList.remove("d-none");
            signupModal.classList.add("show-modal");
        },1300);
    });
});