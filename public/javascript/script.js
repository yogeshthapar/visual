(function(){
   var config = {
      userDashboard: "dashboards",
      container: "#dashboards"
   };
   widgetHandler(config);

   $('.theme a').click(function() {
     var id = $(this).attr("id");
     $('body').removeClass();
     $('body').addClass(id);

     $.ajax({
       url: "/changeTheme/" + id,  //changes the theme id
       dataType: "text"
     });
   });
})();
