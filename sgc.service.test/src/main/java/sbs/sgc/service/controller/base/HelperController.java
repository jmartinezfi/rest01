package sbs.sgc.service.controller.base;

import java.util.LinkedHashMap;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

public class HelperController {

	public static final String USER_NONE = "[[NONE]]";
	public static final String USER_NO_CAUGHT = "no-caught";
	public static final String TOKE_NONE = "0";
	public final static String KEY_PUBLIC = "eqwe12";
	public final static String FORMAT_DATE = "dd/MM/yyyy HH:mm:ss";
	public final static Long TIMEOUT_TOKEN = 30L;

	public static String inserLog(Exception exception, HttpServletRequest request, String codUser, int startStep) {
		LinkedHashMap<String, String> response = new LinkedHashMap<>();
		response.put("Mensaje", exception.getMessage());
		response.put("IP Remota", request.getRemoteAddr());
		response.put("Api", request.getMethod() + " " + request.getPathInfo());
		response.put("Url", request.getRequestURL().toString());
		response.put("Uri", request.getRequestURI());
		if (!request.getParameterMap().isEmpty())
			response.put("Params", request.getParameterMap().toString());
		if (request.getQueryString() != null)
			response.put("Query", request.getQueryString());

		String str = FromBufferToString(request);
		if (str != null)
			response.put("Body", str);

		response.put("Usuario", codUser);
		return "";
	}

	public static String FromBufferToString(HttpServletRequest request) {
		String result = null;
		try {
			if (request.getReader() != null) {
				String str = request.getReader().lines().collect(Collectors.joining());
				if (str != null && !str.isEmpty())
					result = str;
			}
		} catch (Exception e) {
			e.printStackTrace();
			result = null;
		}
		return result;
	}


}