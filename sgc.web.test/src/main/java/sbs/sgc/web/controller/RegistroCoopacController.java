package sbs.sgc.web.controller;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.async.DeferredResult;

import sbs.sgc.web.controller.base.AsyncResult;

@Controller
@RequestMapping("/registro_coopac")
public class RegistroCoopacController {
	

	@GetMapping("/inicio")
	public DeferredResult<String> tableroCoopac(HttpSession session) {
		return AsyncResult.Call(() -> {
			return "pub/login.html";
		});
	};

}