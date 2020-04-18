package sbs.sgc.domain.core;

import java.text.Normalizer;

import org.springframework.stereotype.Service;

import sbs.sgc.domain.base.RestExternoDomain;
import sbs.sgc.domain.entity.EntidadPersona;
import sbs.sgc.domain.entity.dto.ReniecResponse;
import sbs.sgc.domain.entity.dto.ValidaDni;

@Service
public class CreacionUsuarioDomain {

	
	public ReniecResponse validaDNI(String usu, String pass, ValidaDni entity) throws Exception {
		ReniecResponse responseF = new ReniecResponse();
		responseF.setExiste(false);
		RestExternoDomain restExternoDomain = new RestExternoDomain();
		responseF = restExternoDomain.ObtenerDNI(entity.getDni(), usu, pass);
		if (responseF.isExiste()) {
			EntidadPersona response = responseF.getEntidadPersona();

			/* ini: add by mapalacin */
			String motherName = response.getNOMBRESMADRE().trim();
			boolean bMotherName = false;
			String outputDate = response.getFECHAEMISION().trim();
			boolean bOutputDate = false;
			String msg = "";
			if (motherName.isEmpty())
				bMotherName = true;
			else {
				String noTilde = entity.getNombreMadre();
				if (noTilde != null)
					noTilde = Normalizer.normalize(entity.getNombreMadre().toUpperCase(), Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");
				else
					noTilde = "@";
				if (motherName.contains(noTilde)) {
					bMotherName = true;
				} else {
					bMotherName = false;
					if (noTilde == "@" || noTilde.isEmpty())
						msg += "Ingrese el primer nombre de la madre. ";
				}
			}

			if (outputDate.isEmpty())
				bOutputDate = true;
			else {
				String fec = entity.getFecEmision();
				if (fec == null)
					fec = "@";

				if (outputDate.contains(fec)) {
					bOutputDate = true;
				} else {
					bOutputDate = false;
					if (fec == "@" || fec.isEmpty())
						msg += "Ingrese la fecha de emisión. ";
				}
			}

			if (!msg.isEmpty())
				responseF.setDatoFaltante(msg);

			/* fin: add by mapalacin */

			if (response.getDNI().trim().equalsIgnoreCase(entity.getDni()) && bMotherName && bOutputDate) {
				responseF.setExiste(true);
			} else {
				responseF.setExiste(false);
			}
		}
		System.out.println("Responde DNI!");
		return responseF;
	}

}
