package sbs.sgc.service.controller.base;

import com.fasterxml.jackson.annotation.JsonProperty;


public class BaseException {
	private String logCode;
	
	private String message;

	@JsonProperty("log_code")
	public String getLogCode() {
		return logCode;
	}

	public void setLogCode(String logCode) {
		this.logCode = logCode;
	}


	@JsonProperty("message")
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
