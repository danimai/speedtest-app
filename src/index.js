import './style.css';

(function($){
	$(function(){
		controller.init();
	});

	var model = {
		// estrutura de dados
		data: [{
			username: '',
			results: []
		}],
		// inicia o localStorage
		init: function(){
			if (!localStorage.data) {
				localStorage.data = JSON.stringify([]);
				model.populate();
			} else {
				model.data = JSON.parse(localStorage.data);
			}
		},
		// popula o localStorage com dados
		populate: function(){
			localStorage.data = JSON.stringify(model.data);
		},
		// salva um novo resultado no localStorage
		create_result: function(result) {
			model.data[0].results.unshift(result);
			localStorage.data = JSON.stringify(model.data);
		},
		// salva o nome da conta no localStorage
		set_username: function(username) {
			model.data[0].username = username;
			localStorage.data = JSON.stringify(model.data);
		},
		// obtem o nome da conta
		get_username: function() {
			return model.data.length ? model.data[0].username : false;
		},
		// obtem os resultados
		get_results: function() {
			return model.data.length ? model.data[0].results : false;
		},
	};

	var controller = {
		// inicia a aplicação
		init: function() {
			model.init();
			view.init();
		},
		// retorna o nome da conta registrada
		get_username: function() {
			return model.get_username();
		},
		// altera o nome da conta
		set_username: function(username) {
			model.set_username(username);
		},
		// retorna os resultados registrados
		get_results: function() {
			return model.get_results();
		},
		// cria um novo resultado
		create_result: function(result) {
			model.create_result(result);
			setTimeout(view.render_result(result), 500);
			setTimeout(view.render_start, 1500);
		},
		result: {},
		// inicia o teste de velocidade para download e upload
		// realiza 20 medições com duração de 500ms para cada e renderiza na view
		test_speed: function(loadType) {
			var	counter = 0,
					runner = setInterval(function() {
				var speed = controller.get_speed();
				view.render_speed(loadType, speed);
				counter++;
				// ao totalizar 20 medições de download, para de medir, registra a última medição, e passa a medir upload
				if ( counter === 20 ) {
					clearInterval(runner);
					if ( loadType === 'download' ) {
						controller.result.download = speed;
						controller.test_speed('upload');
						view.render_uploading();
					}
					// ao totalizar 20 medições de upload, registra a última medição, assim como data e hora, e cria o novo resultado
					else {
						controller.result.upload = speed;
						controller.result.timestamp = new Date().toLocaleDateString("pt-BR", {hour: '2-digit', minute: '2-digit', second: '2-digit'});
						controller.create_result(controller.result);
					}
				}
			}, 500);
		},
		// retorna uma medição de velocidade (número aleatório entre 90 e 99)
		get_speed: function () {
			return Math.floor(Math.random() * 9) + 90;
		}
	};

	var view = {
		// inicia a view
		init: function() {
			// esconde animação de carregamento
			$('.loader').fadeOut('fast');
			// mostra interface
			$('#app').removeAttr('style');
			// $('#app').removeClass('hidden-opacity');
			view.render_start();
			$('#start').click(function(e){
				e.preventDefault();
				controller.test_speed('download');
				view.render_container();
				setTimeout(view.render_downloading, 10);
			});
			// guarda o nome da conta quando alterado o valor do campo
			$('#username').bind('input propertychange', function() {
				controller.set_username($(this).val());
			});
			// se já houver nome da conta, define como valor do campo
			if ( controller.get_username() ) {
				$('#username').val(controller.get_username());
			}
		},
		// renderiza a tela inicial e mostra os resultados anteriores, caso existam
		render_start: function() {
			if ( controller.get_results().length ) {
				$('#app').removeClass('first-time');
			}
			$('#app').removeClass('state-result');
			$('#app').addClass('state-start');
			view.create_container();
			if ( controller.get_results() ) {
				view.render_results();
			}
		},
		// cria o container para mostrar as medições
		create_container: function() {
			var container_html = 
				'<div id="container" class="container hidden-display">'+
				'	<span class="timestamp"></span>'+
				'	<div class="download">'+
				'		<h3>Download</h3>'+
				'		<span class="speed">00</span>'+
				'	</div>'+
				'	<div class="upload">'+
				'		<h3>Upload</h3>'+
				'		<span class="speed">00</span>'+
				'	</div>'+
				'	<div class="sprite-left"></div>'+
				'	<div class="sprite-right"></div>'+
				'</div>';
			$(container_html).insertAfter('#username');
		},
		// renderiza o container
		render_container: function() {
			$('#container').removeClass('hidden-display');
		},
		// renderiza o estado downloading
		render_downloading: function() {
			$('#app').removeClass('state-start');
			$('#app').addClass('state-downloading');
			$('#username').addClass('hidden-display');
			$('.new-result').remove();
		},
		// renderiza o estado uploading
		render_uploading: function() {
			$('#app').removeClass('state-downloading');
			$('#app').addClass('state-uploading');
		},
		// renderiza a velocidade da medição
		render_speed: function(loadType, speed) {
			$('#container .'+loadType+' .speed').html(speed);
		},
		// renderiza o resultado da medição
		render_result: function(result) {
			$('#app').removeClass('state-uploading');
			$('#app').addClass('state-result');
			$('#container .timestamp').html(result.timestamp);
			$('#container').addClass('new-result');
			$('#container').removeAttr('id');
		},
		// renderiza os resultados anteriores
		render_results: function() {
			var results_html = '',
					results = controller.get_results();
			results.forEach(function(result){
				results_html += '<div class="container hidden-opacity">'+
								'	<div class="timestamp">'+ result.timestamp +'</div>'+
								'	<div class="download">'+
								'		<h3>Download</h3>'+
								'		<span class="speed">'+ result.download +'</span>'+
								'	</div>'+
								'	<div class="upload">'+
								'		<h3>Upload</h3>'+
								'		<span class="speed">'+ result.upload +'</span>'+
								'	</div>'+
								'</div>';
			});
			$('#results').html(results_html);
			$('#results .container, #username').removeClass('hidden-display');
			setTimeout(function() {
				$('#results .container, #username').removeClass('hidden-opacity');
			}, 5);
		}
	};

})(jQuery);