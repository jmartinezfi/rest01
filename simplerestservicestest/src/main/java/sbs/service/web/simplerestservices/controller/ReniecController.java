package sbs.service.web.simplerestservices.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import sbs.service.reniec.wsdl.EntidadPersona;
import sbs.service.web.simplerestservices.controller.base.AsyncResult;
import sbs.service.web.simplerestservices.model.ReniecCliente;

@RestController
@RequestMapping("/reniec")
public class ReniecController {

	@RequestMapping(value = "/buscaPersonaReniec", method = {RequestMethod.POST}, produces = {MediaType.APPLICATION_JSON_UTF8_VALUE})
	public DeferredResult<ResponseEntity<EntidadPersona>> buscaPersonaReniecPost(@RequestBody ReniecCliente reniecCliente) {
		String user = "user";
		return AsyncResult.Call(() -> {
			
			EntidadPersona responde = new EntidadPersona();
			responde.setDNI("4569889789");
			responde.setNOMBRES("Juan Pablooo");
			responde.setNOMBRESMADRE("Madre");
			responde.setFECHAEMISION("01/01/2019");
			
			return new ResponseEntity<EntidadPersona>( responde, HttpStatus.OK);
		},user);
	}
}
