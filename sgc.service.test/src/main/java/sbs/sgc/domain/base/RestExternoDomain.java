package sbs.sgc.domain.base;

import java.io.FileInputStream;
import java.util.Base64;
import java.util.Properties;

import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import sbs.sgc.domain.entity.EntidadPersona;
import sbs.sgc.domain.entity.dto.ReniecRequest;
import sbs.sgc.domain.entity.dto.ReniecResponse;

public class RestExternoDomain {

	private final static String KEY_PUBLIC = "";
	private final static String FORMAT_DATE = "dd/MM/yyyy HH:mm:ss";
	private final static Long TIMEOUT_TOKEN = 30L;
	
	private static final String URLS_PROPERTY = "urls.properties";
	private static Properties prop = new Properties();
	

	public ReniecResponse ObtenerDNI(String dni, String user, String pass) throws Exception {
		CloseableHttpClient httpClient = HttpClients.custom().setSSLHostnameVerifier(new NoopHostnameVerifier()).build();
		HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
		requestFactory.setHttpClient(httpClient);
		ReniecResponse response = new ReniecResponse();
		RestTemplate restTemplate = new RestTemplate(requestFactory);

		HttpHeaders headers = getAuthHeader(user, pass);

		ReniecRequest reniecRequest = new ReniecRequest();
		reniecRequest.setDni("123161564");
		reniecRequest.setUsuario("123131321");
		HttpEntity<ReniecRequest> request = new HttpEntity<>(reniecRequest, headers);
		try {
			prop.load(RestExternoDomain.class.getClassLoader().getResourceAsStream("urls.properties"));
			
			EntidadPersona responseEnt = restTemplate.postForObject( prop.getProperty("remote.urls"), request, EntidadPersona.class);
			//EntidadPersona responseEnt = new EntidadPersona();
			responseEnt.setDNI("4569889789");
			responseEnt.setNOMBRES(String.valueOf(Math.random()));
			responseEnt.setNOMBRESMADRE("Madre");
			responseEnt.setFECHAEMISION("01/01/2019");
			response.setExiste(true);
			response.setServicestatus(true);
			response.setEntidadPersona(responseEnt);
		} catch (HttpClientErrorException | HttpServerErrorException e) {
			e.printStackTrace();
		}
		return response;
	}
	
	private HttpHeaders getAuthHeader(String user, String pass) {
		user = "wqeqwe";
		pass = "qweqwe";

		HttpHeaders headers = new HttpHeaders();
		String plainCreds = user + ":" + pass;
		byte[] plainCredsBytes = plainCreds.getBytes();
		byte[] base64CredsBytes = Base64.getEncoder().encode(plainCredsBytes);
		String base64Creds = new String(base64CredsBytes);
		headers.add("Authorization", "Basic " + base64Creds);

		return headers;
	}
}
