package sbs.sgc.domain.entity.dto;

import sbs.sgc.domain.entity.EntidadPersona;
import sbs.sgc.service.controller.base.BaseException;

public class ReniecResponse {
	private boolean existe;
	private EntidadPersona entidadPersona;
	private BaseException baseException;
	private boolean servicestatus;
	private String datoFaltante;

	public boolean isExiste() {
		return existe;
	}

	public void setExiste(boolean existe) {
		this.existe = existe;
	}

	public BaseException getBaseException() {
		return baseException;
	}

	public void setBaseException(BaseException baseException) {
		this.baseException = baseException;
	}

	public boolean isServicestatus() {
		return servicestatus;
	}

	public void setServicestatus(boolean servicestatus) {
		this.servicestatus = servicestatus;
	}

	public String getDatoFaltante() {
		return datoFaltante;
	}

	public void setDatoFaltante(String datoFaltante) {
		this.datoFaltante = datoFaltante;
	}
	
	public void setEntidadPersona(EntidadPersona entidadPersona) {
		this.entidadPersona = entidadPersona;
	}
	
	public EntidadPersona getEntidadPersona() {
		return entidadPersona;
	}
}
