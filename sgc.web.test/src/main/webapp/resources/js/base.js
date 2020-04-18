function regresoLogin(login){window.location = login};
window.jbase = window.jbase || {};
(function($b) {

	$b.prop = {};
	$b.urls = {};

	$b.loadUrls = function(prop) {
		jajax.apiGet({
			url : $('meta[name=context-path]').attr("content") + 'sgc_web/service_discovery/urls',
			data : {
				propertie : prop
			},
			async : false,
			success : function(data) {
				jbase.urls = data;
			}
		});

	};

	$b.getOpcionFromMenu = function(url, toggle) {
		jajax.getHtml({
			url : url,
			success : function(data) {
				$("#container_primary").html(data);
				componentHandler.upgradeDom();
				var layout = document.querySelector('.mdl-layout');
				if (toggle)
					layout.MaterialLayout.toggleDrawer();
			}
		});
	};

	$b.getContentPrimary = function(url, fnc) {
		jbase.wait(true);
		jajax.getHtml({
			url : url,
			success : function(data) {
				$("#container_primary").html(data);
				componentHandler.upgradeDom();
				if (fnc)
					fnc();
				jbase.wait(false);			
			},
			error: function(xhr, textStatus, error){
			    console.log("Eerror");
				}
		});
	};

	// $b.getContentSecondary = function(url) {
	//
	// jajax.getHtml({
	// url : url,
	// success : function(data) {
	// $("#container_secondary").html(data);
	// componentHandler.upgradeDom();
	// }
	// });
	// };

	// $b.getOpcionLoadFromMenu = function(url, toggle, step) {
	// jajax.getHtml({
	// url : url,
	// success : function(data) {
	// $("#load_secondary").html(data);
	// $("#step_" + step).addClass("flow-step__active");
	// componentHandler.upgradeDom();
	// var layout = document.querySelector('.mdl-layout');
	// if (toggle)
	// layout.MaterialLayout.toggleDrawer();
	// }
	// });
	// };

	$b.getContentLoadSecondary = function(url, step) {
		jajax.getHtml({
			url : url,
			success : function(data) {
				$("#load_secondary").html(data);
				$("#" + step).addClass("flow-step__active");
				componentHandler.upgradeDom();
			}
		});
	};

	$b.positive_integer_gzero = function() {
		$('.positive-integer_gzero').numeric({
			decimal : false,
			negative : false,
			gcero : true
		}, function() {
			this.value = '';
			this.focus();
		});
	};

	$b.integer_gzero = function() {
		$('.integer_gzero').numeric({
			decimal : false,
			negative : true,
			gcero : true
		}, function() {
			this.value = '';
			this.focus();
		});
	};

	$b.integer = function() {
		$('.integer').numeric(false, function() {
			this.value = '';
			this.focus();
		});
	};

	$b.positive_integer = function() {
		$('.positive-integer').numeric({
			decimal : false,
			negative : false
		}, function() {
			this.value = '';
			this.focus();
		});
	};

	$b.formatDate = function(flag) {
		$(".sbs-date").datetimepicker({
			format : "L",
			locale : "es",
			maxDate : flag == undefined ? false : 'now',
			timeZone: 'Europe/London',
			sideBySide : true
		})
	};

	$b.wait = function(visible) {
		if (visible === true) {
			$('body').loading({
				overlay : $("#custom-overlay")
			});
		} else {
			if ($("body").is(":loading"))
				$("body").loading("stop");
		}
		return true;
	};

	$b.validRegistro = function(css_required) {
		var valid = true;
		$("[class*='" + css_required + "']").each(function() {
			var valores = $(this).val();
			if (valores == null || valores == '' || typeof (valores) === "undefined") {
				$("#" + $(this).attr('id')).parent().addClass("is-invalid");
				valid = false;
			}
		});
		return valid;
	};

	$b.disableToggle = function(css_required) {
		$("[class*='" + css_required + "']").each(function() {
			var attr = $(this).attr('disabled');
			if (typeof attr !== typeof undefined && attr !== false) {
				$(this).removeAttr('disabled');
			} else {
				$(this).prop("disabled", true);
			}
		});
	};

	$b.getStringReplaced = function(string, arguments) {
		var args = arguments;
		return string.replace(/\{(\d+)\}/g, function() {
			return args[arguments[1]];
		});
	};

	$b.roundNumber = function(num, scale) {
		if (!("" + num).includes("e")) {
			return +(Math.round(num + "e+" + scale) + "e-" + scale);
		} else {
			var arr = ("" + num).split("e");
			var sig = ""
			if (+arr[1] + scale > 0) {
				sig = "+";
			}
			return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
		}
	};
	$b.getDosExtension = function (filename) {

	    var dosExtension = filename.substr(filename.lastIndexOf(".") + 1);
	    return dosExtension.toLowerCase();
	};

	$b.getCodExtension = function (filename) {
	    var dosExtension = this.getDosExtension(filename);
	    var codExtension = this.allowExtension[dosExtension];

	    if (codExtension == null || codExtension == undefined )
	        return null;
	    return codExtension;

	};
	$b.sessionleft = function(sesstime){
		setTimeout(function () {
		    	console.log(sesstime-10);
		    	$b.sessionleft(sesstime-10);
		    }, 10000);
		}
	$b.allowExtension = {	    
		jpg: { type: null, name: "jpg" },
		pdf: { type: null, name: "pdf" },
		png: { type: null, name: "png" }
	};
	
	$b.opcionMenu = function (valor){
		if (valor==1){
			window.location.href = jbase.urls.start;
		}else if (valor==2){
			window.location.href = jbase.urls.menulogin;
		}else if (valor==3){
			window.location.href = jbase.urls.menulogout;
		}
	}
	
}(window.jbase));