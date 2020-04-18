window.jajax = window.jajax || {};

(function($x) {

	$x.apiGet = function(request) {
		request.type = "GET";
		this.api(request);
	};

	$x.apiPost = function(request) {
		request.type = "POST";
		this.api(request);
	};

	$x.apiPut = function(request) {
		request.type = "PUT";
		this.api(request);
	};

	$x.apiDelete = function(request) {
		request.type = "DELETE";
		this.api(request);
	};

	$x.apiAuthGet = function(request) {
		request.type = "GET";
		this.apiAuth(request);
	};

	$x.apiAuthPost = function(request) {
		request.type = "POST";
		//this.apiAuth(request);
		request.async = true;
		request.contentType = "application/json";
		request.dataType = "json";
		
		$.support.cors = true;
		this.invoke(request);
		/*
		request.type = "POST";
		this.apiAuth(request);*/
	};

	$x.apiAuthPut = function(request) {
		request.type = "PUT";
		this.apiAuth(request);
	};

	$x.apiAuthDelete = function(request) {
		request.type = "DELETE";
		this.apiAuth(request);
	};
	$x.apiAuthUploadPost = function(request) {
		request.type = "POST";

		this.apiUploadAuth(request);
	};
	$x.apiUp = function(request) {
		request.enctype = "multipart/form-data";
		request.processData = false;
		request.dataType = "json";
		request.contentType = false;
		this.invokeUp(request);
	};
	$x.api = function(request) {
		request.contentType = "application/json";
		request.dataType = "json";

		this.invoke(request);
	};

	$x.apiAuth = function(request) {
		$.support.cors = true;
		console.log("paso 1");
		this.invoke({

			type : "GET",
			url : "https://localhost:9443/sgc.web.test/sgc_web_test/service_discovery/token",
			contentType : "application/json",
			dataType : "json",
			success : function(data) {
				var user = data;
				var basic = "";
				if (window.btoa)
					basic = window.btoa(user.ticket + ":" + user.token);
				else
					basic = $.base64.encode(user.ticket + ":" + user.token);
				request.headers = {
					"authorization" : "Basic " + basic
				};
				jajax.api(request);
			}
		});
	};
	
	$x.getTicketFn = function(func) {
		$.support.cors = true;
		this.invoke({

			type : "GET",
			url : jbase.urls.token,
			contentType : "application/json",
			dataType : "json",
			success : function(data) {
				var ticket;
				ticket = encodeURIComponent(data.ticket);
				
				if(func)
					func(ticket);
			}
		});
	};
	
	$x.apiUploadAuth = function(request) {
		$.support.cors = true;
		this.invoke({

			type : "GET",
			url : jbase.urls.token,
			contentType : "application/json",
			dataType : "json",
			success : function(data) {
				var user = data;
				var basic = "";
				if (window.btoa)
					basic = window.btoa(user.ticket + ":" + user.token);
				else
					basic = $.base64.encode(user.ticket + ":" + user.token);
				request.headers = {
					"authorization" : "Basic " + basic
				};
				jajax.apiUp(request);

			}
		});
	};
	// El error se debe guardar en un log o mostrar en pantalla
	$x.invoke = function(request) {
		if (!request.url) {
			jnoty.warning("URL no definidad");
			return;
		}

		$.ajax({
			type : request.type,
			url : request.url,
			contentType : request.contentType,
			dataType : request.dataType,
			async : request.async == undefined ? true : request.async,
			data : request.data == undefined ? null : (request.type == "GET" && !request.getIsBody ? request.data : JSON.stringify(request.data)),
			headers : request.headers == undefined ? null : request.headers,
			success : function(data) {
				if (request.success) {
				    if(data instanceof Object || typeof data === 'boolean'){
					request.success(data);
				    }else{
					if(data.indexOf('timeout_special_sbs') == -1){
					    request.success(data); 
					}else{
					    jnoty.accept("Sesión Finalizada por Inactividad",function(){window.location.href = jbase.prop.url_login_base});
					    jbase.wait(false); 
					}					
				    }
				    
				}
					
			},
			error : function(xhr, textStatus, error) {
				if (request.error)
					request.error(xhr, textStatus, error);
				else {
					if (xhr.responseJSON) {
						var obj = xhr.responseJSON;
						if (obj.level_type == "ERROR")
							jnoty.error("ERROR: " + obj.message + ". CODE: [" + obj.status_code + "]. </br> LOG: " + obj.log_code);
						if (obj.level_type == "WARNING")
							jnoty.warning("ADVERTENCIA: " + obj.message);
						if (obj.level_type == "INFORMATION")
							jnoty.information("INFORMACIÓN: " + obj.message);
					} else if (xhr.status === 404)
						jnoty.error("ERROR: Revise la siguiente dirección \"" + request.url + "\". NO ESTÁ FUNCIONANDO. [" + (false ? xhr.responseText.substring(1, 50) : "NONE") + "]");
					else if (xhr.status === 401)
						jnoty.error("ERROR: Revise la siguiente dirección \"" + request.url + "\". NO ESTÁ AUTORIZADO.");
					else if(xhr.status === 200 && xhr.responseText.indexOf('timeout_special_sbs') != -1){
					    jnoty.accept("Sesión Finalizada por Inactividad",function(){window.location.href = jbase.prop.url_login_base});
					}
					else
						jnoty.error("HA OCURRIDO UN ERROR: Por favor comuníquese con la SBS.");
					jbase.wait(false);
				}
			}
		});
	};
	$x.invokeUp = function(request) {
		if (!request.url) {
			jnoty.warning("URL no definidad");
			return;
		}

		$.ajax({
			type : request.type,
			url : request.url,
			enctype : request.enctype,
			contentType : request.contentType,
			async : request.async == undefined ? true : request.async,
			processData : request.processData,
			data : request.data,
			headers : request.headers == undefined ? null : request.headers,
			cache : false,
			success : function(data) {
				if (request.success)
					request.success(data);
			},
			error : function(xhr, textStatus, error) {
				if (request.error)
					request.error(xhr, textStatus, error);
				else {
					if (xhr.responseJSON) {
						var obj = xhr.responseJSON;
						if (obj.level_type == "ERROR")
							jnoty.error("ERROR: " + obj.message + ". CODE: [" + obj.status_code + "]. </br> LOG: " + obj.log_code);
						if (obj.level_type == "WARNING")
							jnoty.warning("ADVERTENCIA: " + obj.message);
						if (obj.level_type == "INFORMATION")
							jnoty.information("INFORMACIÓN: " + obj.message);
					} else if (xhr.status === 404)
						jnoty.error("ERROR: Revise la siguiente dirección \"" + request.url + "\". NO ESTÁ FUNCIONANDO. [" + (false ? xhr.responseText.substring(1, 50) : "NONE") + "]");
					else if (xhr.status === 401)
						jnoty.error("ERROR: Revise la siguiente dirección \"" + request.url + "\". NO ESTÁ AUTORIZADO.");
					else
						jnoty.error("HA OCURRIDO UN ERROR: Por favor comuníquese con la SBS.");
					jbase.wait(false);
				}
			}
		});
	};
	$x.getHtml = function(request) {
		request.contentType = "text/html;charset=UTF-8";
		request.dataType = "html";
		request.async = true;
		request.type = "GET";
		this.invoke(request);
	};

	$x.getAuthHtml = function(request) {
		$.support.cors = true;
		this.invoke({

			type : "GET",
			url : jbase.urls.token,
			contentType : "application/json",
			dataType : "json",
			success : function(data) {
				var user = data;
				var basic = "";
				if (window.btoa)
					basic = window.btoa(user.ticket + ":" + user.token);
				else
					basic = $.base64.encode(user.ticket + ":" + user.token);
				request.headers = {
					"authorization" : "Basic " + basic
				};
				jajax.getHtml(request);
			}
		});
	};
}(window.jajax));