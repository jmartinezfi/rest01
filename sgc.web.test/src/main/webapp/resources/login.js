var app = new Vue({
    el: "#app",
    data: {
    	respuesta : "",
    	model : {
	    	dni : "45269989",
	    	fecEmision : "",
	    	nombreMadre : ""
    	}
    },
    
    beforeCreate : function() {
    	
    },
    
    methods: {
    	load: function(){
    		console.log("load...");
    	},
    	coopacExterno: function(){
    	    
    	},
    	descargar: function(_idNotificacion, _idDocumento) {
    		
    	},
    	invoke : function() {
    		console.log("invoke...");
    		
    		var self = this;
    		
    		jajax.apiAuthPost({
				url : "https://coopacqa.sbs.gob.pe/sgc.service.test/sgc_api/creacion_usuario/valida_dni",
				data : self.model,
				success : function(data) {
					console.log(data);
					self.respuesta = data.entidadPersona.nombres;

				}
			});
    	}
    },
    
    mounted: function() {
    	this.load();
        $("#app").show();
    }

});