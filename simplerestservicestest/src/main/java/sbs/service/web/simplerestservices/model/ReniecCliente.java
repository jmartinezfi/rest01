package sbs.service.web.simplerestservices.model;

import java.io.Serializable;

public class ReniecCliente implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String DNI;
	private String Usuario;

	public String getDNI() {
		return DNI;
	}

	public void setDNI(String dNI) {
		DNI = dNI;
	}

	public String getUsuario() {
		return Usuario;
	}

	public void setUsuario(String usuario) {
		Usuario = usuario;
	}

}
