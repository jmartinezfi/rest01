package sbs.sgc.service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import sbs.sgc.domain.core.CreacionUsuarioDomain;
import sbs.sgc.domain.entity.dto.ReniecResponse;
import sbs.sgc.domain.entity.dto.ValidaDni;
import sbs.sgc.service.controller.base.AsyncResult;

@RestController
@RequestMapping("/creacion_usuario")
public class CreacionUsuarioController {

	@Autowired
	private CreacionUsuarioDomain creacionUsuarioDomain;

	@PostMapping(value = "/valida_dni")
	public DeferredResult<ResponseEntity<ReniecResponse>> validaDNI(@RequestBody ValidaDni entity) {
		String user = "UsuarioPruebaSBS";
		String pass = "PasswordPruebaSBS";
		System.out.println("Inicio de valida DNI");
		return AsyncResult.Call(() -> {
			// return new ResponseEntity<Integer>(creacionUsuarioDomain.validaRuc(numRuc) ), HttpStatus.CREATED);
			System.out.println("Dentro del async!");
			return new ResponseEntity<ReniecResponse>(creacionUsuarioDomain.validaDNI(user, pass, entity), HttpStatus.OK);
		}, user);
	}

}
