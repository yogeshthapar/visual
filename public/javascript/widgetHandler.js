function widgetHandler(widgetsConfig) {
  
  $.ajax({
    url: widgetsConfig.userDashboard,
    dataType: "text",
    success: function(data) {
       json = $.parseJSON(data);
      // var makeActiveTab = true;
      var config = {
         height: 300,
         enableLegend: false,
         //colors: ['red', 'green', 'yellow', 'pink']
      };
      chartLoader.init(config)
      $(widgetsConfig.container).find('li').first().addClass('active');
      $('#dashboardsContent').find('div').first().addClass('active');

     $.getJSON('chartData/widgets', function(widgets) {
         //loop through users tabs
         // var dashboard = json[0];
         for(i in json) {
            tb = json[i];
            var tab = tb.tabId;
            var colId = "";
            var index = 1;
            tb.rows.forEach(function(r) {

               var widgetId = r.widgetId;
               var row = r.rowId;
               colId = tab + row + "col" + index++;
               var colWidth = r.colWidth;
               var details = getWidgetDetail(widgets, widgetId);
               chartRenderer = details.chartRenderer;
               dataUrl = details.url;
               var title = details.title;
               var comments = details.comments;
               widgetContainer = "#" + colId;

               if($("#" + tab).find("#" + row).length == 0) {
                 //create row
                 $("#" + tab).append('<div id = ' + row + ' class = row></div>');
               }

               //create col
               $("#" + tab + ' #' + row).append('<div class = col-lg-' + colWidth + ' id = ' + colId + '></div>');

               $(widgetContainer).append('<div class = "panel panel-primary"></div>');

               var subDiv = $('#' + colId + " .panel");

               //create header
               $(subDiv).append('<div class = panel-heading id = header><span class = panel-heading id = headerCaption> ' + title + '</span></div>');

               //create chart
               $(subDiv).append('<div id = barChart></div>');

               var screenWidth = $(".container").width();
               var widgetWidth = $(widgetContainer).width();

               if(widgetWidth > 100) {
                 var width = $(widgetContainer).width();
                 var parentWidth = $(widgetContainer).offsetParent().width();
                 widgetWidth = (width * 100)/parentWidth;
               }

               var containerWidth = (screenWidth * widgetWidth)/100;
               var chartFunction = "chartLoader" + "." + chartRenderer + '("' + widgetContainer + '", ' + containerWidth + ', "' + dataUrl + '")';

               eval(chartFunction);

               $(subDiv).append('<hr class = hr-prop>');

               // create comment
               $(subDiv).append('<div id = comment class = col-lg-12></div>');
               $("textarea").css('overflow', 'hidden').autogrow();

               var textAreaWidth = 0;
               if(colWidth > 8) {
                 textAreaWidth = 80;
               } else if(colWidth > 5) {
                 textAreaWidth = 60;
               } else {
                 textAreaWidth = 40;
               }
               var len = comments.length-1;
               for(var i=len-1; i<=len;i++) {
                 var recentComment = "<strong>" + comments[i].userid + " : </strong>" + comments[i].comment + " <strong>at</strong> " + comments[i].datetime;
                 $(subDiv).append('<p class = col-lg-12>' + recentComment + '</p>');
               }
               $(subDiv).append('<a id = modalLink data-toggle="modal" class="col-lg-12 col-md-12" href="#commentsDialog" data-widgetId="' + widgetId + '">more Comments....</a>');

               $(subDiv).append('<textarea id = enterComments placeholder = "Add your comments... " style = "width:' + textAreaWidth + '%" ></textarea>');
               $(subDiv).append('<button type="button" class="btn btn-warning" id="submitButton">Submit</button>')
            })

         }
      });
      $('#commentsDialog').on('show.bs.modal', function(event){

      //$(this).find('#cd-timeline').reset();
        var button = $(event.relatedTarget) // Button that triggered the modal
        var widgetId = $(event.relatedTarget).attr('data-widgetId');
        var modal = $(this);

        $('#cd-timeline').html("");


        $.getJSON("comments/" + widgetId, function(widgetData) {
            $('.modal-body #barChart').html("");
          var comments = widgetData.comments;

          var widgetContainer = ".modal-body";
          var chartRenderer =widgetData.chartRenderer;
          var dataUrl = widgetData.url;
          var title = widgetData.title;
          $('#modalTitle').html(title);

           var screenWidth = $(".modal-dialog").width();

          var containerWidth = screenWidth-50;//(screenWidth * widgetWidth)/100;
          var chartData = "chartLoader" + "." + chartRenderer + '("' + widgetContainer + '", ' + containerWidth + ', "' + dataUrl + '")';
          eval(chartData);
           for(j in comments) {
             var id = "comments" + j;
             var subid = "sub" + id;

            $("#cd-timeline").append('<div id = ' + id + ' class = cd-timeline-block></div>');
            $("#" + id).append('<div id = ' + subid + ' class = cd-timeline-content></div>');
            $("#" + subid).append('<h3>' + comments[j].userid + '</h3>');
            $("#" + subid).append('<h5>' + comments[j].comment + '</h5>');
            $("#" + subid).append('<span class="cd-date">' + comments[j].datetime + '</span>');
          }

        });

      });

    } // end of success function
  }); // end of main ajax

} // end of function

function getWidgetDetail(widgets, widgetId) {
   var details = {};
   widgets.forEach(function(w) {
      if(w.widgetId === widgetId) {
         details.title = w.title;
         details.chartRenderer = w.chartRenderer;
         details.url = w.url;
         details.comments = w.comments;
      }
   })
   return details;
}
