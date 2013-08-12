//handle upload process
(function($){
	$(document).ready(function(){
		var handleJson = function(id){
			var bookinfo = {};
			var did = $('#did').val();
			$.getJSON("http://api.douban.com/book/subject/"+did+"?alt=xd&callback=?", function(data){
				bookinfo.author = data.author[0].name['$t'];
				bookinfo.dblink = data.link[1]['@href'];
				bookinfo.img = data.link[2]['@href'].replace('spic','lpic');
				bookinfo.title = data['title']['$t'];
				_.each(data['db:attribute'],function(value,index){
					switch(value['@name']){
						case 'isbn13':
						bookinfo.isbn = value['$t'];
						break;
						case 'pages':
						bookinfo.pages = value['$t'];
						break;
						case 'publisher':
						bookinfo.publisher = value['$t'];
						break;
					}
				})
				bookinfo.release = data['db:attribute'][4]['$t'];
				bookinfo.summary = data.summary['$t'];
				var output = "<b>Success!</b>Return Book is <b>" + bookinfo.title + "</b> by " + bookinfo.author; 
				$('#getdid').after($('<p id="jsonpback"></p>').html(output));
			})
		}

		$('#getdid').on('click',function(e){
			handleJson($(this).val().trim());
		})

		$("#tags").select2({tags:["css","html5", "javascript","nodejs","jquery","backbone.js","python"]});

	})

})(jQuery)