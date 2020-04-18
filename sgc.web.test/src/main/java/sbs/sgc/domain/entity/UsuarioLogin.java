package sbs.sgc.domain.entity;

public class UsuarioLogin {

	private Integer idUsuario;

	private String codUsuario;

	private Integer idCoopac;

	private Integer idSolicitud;
	
	private String tipUsuario;

	public Integer getIdUsuario() {
		return idUsuario;
	}

	public void setIdUsuario(Integer idUsuario) {
		this.idUsuario = idUsuario;
	}

	public String getCodUsuario() {
		return codUsuario;
	}

	public void setCodUsuario(String codUsuario) {
		this.codUsuario = codUsuario;
	}

	public Integer getIdCoopac() {
		return idCoopac;
	}

	public void setIdCoopac(Integer idCoopac) {
		this.idCoopac = idCoopac;
	}

	public Integer getIdSolicitud() {
		return idSolicitud;
	}

	public void setIdSolicitud(Integer idSolicitud) {
		this.idSolicitud = idSolicitud;
	}

	public String getTipUsuario() {
		return tipUsuario;
	}

	public void setTipUsuario(String tipUsuario) {
		this.tipUsuario = tipUsuario;
	}

}