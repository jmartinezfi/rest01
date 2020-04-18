
package sbs.service.reniec.wsdl;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Clase Java para EntidadPersona complex type.
 * 
 * <p>El siguiente fragmento de esquema especifica el contenido que se espera que haya en esta clase.
 * 
 * <pre>
 * &lt;complexType name="EntidadPersona">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="DNI" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="NOMBRES" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="APELLIDOPATERNO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="APELLIDOMATERNO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="FECHANACIMIENTO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="SEXO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ESTADOCIVIL" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="APELLIDOCASADA" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="CODUBIGEODPTDOMICILIO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="CODUBIGEOPROVDOMICILIO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="CODUBIGEODISTDOMICILIO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="UBIGEODPTDOMICILIO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="UBIGEOPROVDOMICILIO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="UBIGEODISTDOMICILIO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="GRADOINSTRUCCION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ESTATURA" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="DOCSUSTENTATORIOTIPO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="DOCSUSTENTATORIONUM" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="CODUBIGEODPTNACIMIENTO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="CODUBIGEOPROVNACIMIENTO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="CODUBIGEODISTNACIMIENTO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="UBIGEODPTNACIMIENTO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="UBIGEOPROVNACIMIENTO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="UBIGEODISTNACIMIENTO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="NOMBRESPADRE" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="NOMBRESMADRE" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="FECHAINSCRIPCION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="FECHAEMISION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="FECHAFALLECIMIENTO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="CONSTANCIAVOTACION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="RESTRICCION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="PREFIJODIRECCION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="DIRECCION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="NUMERODIRECCION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="BLOCKCHALET" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="INTERIOR" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="URBANIZACION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ETAPA" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="MANZANA" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="LOTE" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="PREFIJOBLOCKCHALET" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="PREFIJODPTPISOINTERIOR" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="PREFIJOUBRCONDRESIDENCIA" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="LONGITUDFOTO" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="LONGITUDFIRMA" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="FIRMA" type="{http://www.w3.org/2001/XMLSchema}base64Binary"/>
 *         &lt;element name="FOTO" type="{http://www.w3.org/2001/XMLSchema}base64Binary"/>
 *         &lt;element name="FECHACREACION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="TIPOFICHAREGISTRAL" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="DATOS" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="IMAGEN" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="CONSULTA" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="FECHAACTUALIZACION" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "EntidadPersona", propOrder = {
    "dni",
    "nombres",
    "apellidopaterno",
    "apellidomaterno",
    "fechanacimiento",
    "sexo",
    "estadocivil",
    "apellidocasada",
    "codubigeodptdomicilio",
    "codubigeoprovdomicilio",
    "codubigeodistdomicilio",
    "ubigeodptdomicilio",
    "ubigeoprovdomicilio",
    "ubigeodistdomicilio",
    "gradoinstruccion",
    "estatura",
    "docsustentatoriotipo",
    "docsustentatorionum",
    "codubigeodptnacimiento",
    "codubigeoprovnacimiento",
    "codubigeodistnacimiento",
    "ubigeodptnacimiento",
    "ubigeoprovnacimiento",
    "ubigeodistnacimiento",
    "nombrespadre",
    "nombresmadre",
    "fechainscripcion",
    "fechaemision",
    "fechafallecimiento",
    "constanciavotacion",
    "restriccion",
    "prefijodireccion",
    "direccion",
    "numerodireccion",
    "blockchalet",
    "interior",
    "urbanizacion",
    "etapa",
    "manzana",
    "lote",
    "prefijoblockchalet",
    "prefijodptpisointerior",
    "prefijoubrcondresidencia",
    "longitudfoto",
    "longitudfirma",
    "firma",
    "foto",
    "fechacreacion",
    "tipoficharegistral",
    "datos",
    "imagen",
    "consulta",
    "fechaactualizacion"
})
public class EntidadPersona {

    @XmlElement(name = "DNI", required = true)
    protected String dni;
    @XmlElement(name = "NOMBRES", required = true)
    protected String nombres;
    @XmlElement(name = "APELLIDOPATERNO", required = true)
    protected String apellidopaterno;
    @XmlElement(name = "APELLIDOMATERNO", required = true)
    protected String apellidomaterno;
    @XmlElement(name = "FECHANACIMIENTO", required = true)
    protected String fechanacimiento;
    @XmlElement(name = "SEXO", required = true)
    protected String sexo;
    @XmlElement(name = "ESTADOCIVIL", required = true)
    protected String estadocivil;
    @XmlElement(name = "APELLIDOCASADA", required = true)
    protected String apellidocasada;
    @XmlElement(name = "CODUBIGEODPTDOMICILIO", required = true)
    protected String codubigeodptdomicilio;
    @XmlElement(name = "CODUBIGEOPROVDOMICILIO", required = true)
    protected String codubigeoprovdomicilio;
    @XmlElement(name = "CODUBIGEODISTDOMICILIO", required = true)
    protected String codubigeodistdomicilio;
    @XmlElement(name = "UBIGEODPTDOMICILIO", required = true)
    protected String ubigeodptdomicilio;
    @XmlElement(name = "UBIGEOPROVDOMICILIO", required = true)
    protected String ubigeoprovdomicilio;
    @XmlElement(name = "UBIGEODISTDOMICILIO", required = true)
    protected String ubigeodistdomicilio;
    @XmlElement(name = "GRADOINSTRUCCION", required = true)
    protected String gradoinstruccion;
    @XmlElement(name = "ESTATURA", required = true)
    protected String estatura;
    @XmlElement(name = "DOCSUSTENTATORIOTIPO", required = true)
    protected String docsustentatoriotipo;
    @XmlElement(name = "DOCSUSTENTATORIONUM", required = true)
    protected String docsustentatorionum;
    @XmlElement(name = "CODUBIGEODPTNACIMIENTO", required = true)
    protected String codubigeodptnacimiento;
    @XmlElement(name = "CODUBIGEOPROVNACIMIENTO", required = true)
    protected String codubigeoprovnacimiento;
    @XmlElement(name = "CODUBIGEODISTNACIMIENTO", required = true)
    protected String codubigeodistnacimiento;
    @XmlElement(name = "UBIGEODPTNACIMIENTO", required = true)
    protected String ubigeodptnacimiento;
    @XmlElement(name = "UBIGEOPROVNACIMIENTO", required = true)
    protected String ubigeoprovnacimiento;
    @XmlElement(name = "UBIGEODISTNACIMIENTO", required = true)
    protected String ubigeodistnacimiento;
    @XmlElement(name = "NOMBRESPADRE", required = true)
    protected String nombrespadre;
    @XmlElement(name = "NOMBRESMADRE", required = true)
    protected String nombresmadre;
    @XmlElement(name = "FECHAINSCRIPCION", required = true)
    protected String fechainscripcion;
    @XmlElement(name = "FECHAEMISION", required = true)
    protected String fechaemision;
    @XmlElement(name = "FECHAFALLECIMIENTO", required = true)
    protected String fechafallecimiento;
    @XmlElement(name = "CONSTANCIAVOTACION", required = true)
    protected String constanciavotacion;
    @XmlElement(name = "RESTRICCION", required = true)
    protected String restriccion;
    @XmlElement(name = "PREFIJODIRECCION", required = true)
    protected String prefijodireccion;
    @XmlElement(name = "DIRECCION", required = true)
    protected String direccion;
    @XmlElement(name = "NUMERODIRECCION", required = true)
    protected String numerodireccion;
    @XmlElement(name = "BLOCKCHALET", required = true)
    protected String blockchalet;
    @XmlElement(name = "INTERIOR", required = true)
    protected String interior;
    @XmlElement(name = "URBANIZACION", required = true)
    protected String urbanizacion;
    @XmlElement(name = "ETAPA", required = true)
    protected String etapa;
    @XmlElement(name = "MANZANA", required = true)
    protected String manzana;
    @XmlElement(name = "LOTE", required = true)
    protected String lote;
    @XmlElement(name = "PREFIJOBLOCKCHALET", required = true)
    protected String prefijoblockchalet;
    @XmlElement(name = "PREFIJODPTPISOINTERIOR", required = true)
    protected String prefijodptpisointerior;
    @XmlElement(name = "PREFIJOUBRCONDRESIDENCIA", required = true)
    protected String prefijoubrcondresidencia;
    @XmlElement(name = "LONGITUDFOTO", required = true)
    protected String longitudfoto;
    @XmlElement(name = "LONGITUDFIRMA", required = true)
    protected String longitudfirma;
    @XmlElement(name = "FIRMA", required = true)
    protected byte[] firma;
    @XmlElement(name = "FOTO", required = true)
    protected byte[] foto;
    @XmlElement(name = "FECHACREACION", required = true)
    protected String fechacreacion;
    @XmlElement(name = "TIPOFICHAREGISTRAL", required = true)
    protected String tipoficharegistral;
    @XmlElement(name = "DATOS", required = true)
    protected String datos;
    @XmlElement(name = "IMAGEN", required = true)
    protected String imagen;
    @XmlElement(name = "CONSULTA", required = true)
    protected String consulta;
    @XmlElement(name = "FECHAACTUALIZACION", required = true)
    protected String fechaactualizacion;

    /**
     * Obtiene el valor de la propiedad dni.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDNI() {
        return dni;
    }

    /**
     * Define el valor de la propiedad dni.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDNI(String value) {
        this.dni = value;
    }

    /**
     * Obtiene el valor de la propiedad nombres.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNOMBRES() {
        return nombres;
    }

    /**
     * Define el valor de la propiedad nombres.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNOMBRES(String value) {
        this.nombres = value;
    }

    /**
     * Obtiene el valor de la propiedad apellidopaterno.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAPELLIDOPATERNO() {
        return apellidopaterno;
    }

    /**
     * Define el valor de la propiedad apellidopaterno.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAPELLIDOPATERNO(String value) {
        this.apellidopaterno = value;
    }

    /**
     * Obtiene el valor de la propiedad apellidomaterno.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAPELLIDOMATERNO() {
        return apellidomaterno;
    }

    /**
     * Define el valor de la propiedad apellidomaterno.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAPELLIDOMATERNO(String value) {
        this.apellidomaterno = value;
    }

    /**
     * Obtiene el valor de la propiedad fechanacimiento.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFECHANACIMIENTO() {
        return fechanacimiento;
    }

    /**
     * Define el valor de la propiedad fechanacimiento.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFECHANACIMIENTO(String value) {
        this.fechanacimiento = value;
    }

    /**
     * Obtiene el valor de la propiedad sexo.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSEXO() {
        return sexo;
    }

    /**
     * Define el valor de la propiedad sexo.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSEXO(String value) {
        this.sexo = value;
    }

    /**
     * Obtiene el valor de la propiedad estadocivil.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getESTADOCIVIL() {
        return estadocivil;
    }

    /**
     * Define el valor de la propiedad estadocivil.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setESTADOCIVIL(String value) {
        this.estadocivil = value;
    }

    /**
     * Obtiene el valor de la propiedad apellidocasada.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAPELLIDOCASADA() {
        return apellidocasada;
    }

    /**
     * Define el valor de la propiedad apellidocasada.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAPELLIDOCASADA(String value) {
        this.apellidocasada = value;
    }

    /**
     * Obtiene el valor de la propiedad codubigeodptdomicilio.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCODUBIGEODPTDOMICILIO() {
        return codubigeodptdomicilio;
    }

    /**
     * Define el valor de la propiedad codubigeodptdomicilio.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCODUBIGEODPTDOMICILIO(String value) {
        this.codubigeodptdomicilio = value;
    }

    /**
     * Obtiene el valor de la propiedad codubigeoprovdomicilio.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCODUBIGEOPROVDOMICILIO() {
        return codubigeoprovdomicilio;
    }

    /**
     * Define el valor de la propiedad codubigeoprovdomicilio.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCODUBIGEOPROVDOMICILIO(String value) {
        this.codubigeoprovdomicilio = value;
    }

    /**
     * Obtiene el valor de la propiedad codubigeodistdomicilio.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCODUBIGEODISTDOMICILIO() {
        return codubigeodistdomicilio;
    }

    /**
     * Define el valor de la propiedad codubigeodistdomicilio.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCODUBIGEODISTDOMICILIO(String value) {
        this.codubigeodistdomicilio = value;
    }

    /**
     * Obtiene el valor de la propiedad ubigeodptdomicilio.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUBIGEODPTDOMICILIO() {
        return ubigeodptdomicilio;
    }

    /**
     * Define el valor de la propiedad ubigeodptdomicilio.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUBIGEODPTDOMICILIO(String value) {
        this.ubigeodptdomicilio = value;
    }

    /**
     * Obtiene el valor de la propiedad ubigeoprovdomicilio.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUBIGEOPROVDOMICILIO() {
        return ubigeoprovdomicilio;
    }

    /**
     * Define el valor de la propiedad ubigeoprovdomicilio.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUBIGEOPROVDOMICILIO(String value) {
        this.ubigeoprovdomicilio = value;
    }

    /**
     * Obtiene el valor de la propiedad ubigeodistdomicilio.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUBIGEODISTDOMICILIO() {
        return ubigeodistdomicilio;
    }

    /**
     * Define el valor de la propiedad ubigeodistdomicilio.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUBIGEODISTDOMICILIO(String value) {
        this.ubigeodistdomicilio = value;
    }

    /**
     * Obtiene el valor de la propiedad gradoinstruccion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getGRADOINSTRUCCION() {
        return gradoinstruccion;
    }

    /**
     * Define el valor de la propiedad gradoinstruccion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setGRADOINSTRUCCION(String value) {
        this.gradoinstruccion = value;
    }

    /**
     * Obtiene el valor de la propiedad estatura.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getESTATURA() {
        return estatura;
    }

    /**
     * Define el valor de la propiedad estatura.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setESTATURA(String value) {
        this.estatura = value;
    }

    /**
     * Obtiene el valor de la propiedad docsustentatoriotipo.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDOCSUSTENTATORIOTIPO() {
        return docsustentatoriotipo;
    }

    /**
     * Define el valor de la propiedad docsustentatoriotipo.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDOCSUSTENTATORIOTIPO(String value) {
        this.docsustentatoriotipo = value;
    }

    /**
     * Obtiene el valor de la propiedad docsustentatorionum.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDOCSUSTENTATORIONUM() {
        return docsustentatorionum;
    }

    /**
     * Define el valor de la propiedad docsustentatorionum.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDOCSUSTENTATORIONUM(String value) {
        this.docsustentatorionum = value;
    }

    /**
     * Obtiene el valor de la propiedad codubigeodptnacimiento.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCODUBIGEODPTNACIMIENTO() {
        return codubigeodptnacimiento;
    }

    /**
     * Define el valor de la propiedad codubigeodptnacimiento.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCODUBIGEODPTNACIMIENTO(String value) {
        this.codubigeodptnacimiento = value;
    }

    /**
     * Obtiene el valor de la propiedad codubigeoprovnacimiento.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCODUBIGEOPROVNACIMIENTO() {
        return codubigeoprovnacimiento;
    }

    /**
     * Define el valor de la propiedad codubigeoprovnacimiento.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCODUBIGEOPROVNACIMIENTO(String value) {
        this.codubigeoprovnacimiento = value;
    }

    /**
     * Obtiene el valor de la propiedad codubigeodistnacimiento.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCODUBIGEODISTNACIMIENTO() {
        return codubigeodistnacimiento;
    }

    /**
     * Define el valor de la propiedad codubigeodistnacimiento.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCODUBIGEODISTNACIMIENTO(String value) {
        this.codubigeodistnacimiento = value;
    }

    /**
     * Obtiene el valor de la propiedad ubigeodptnacimiento.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUBIGEODPTNACIMIENTO() {
        return ubigeodptnacimiento;
    }

    /**
     * Define el valor de la propiedad ubigeodptnacimiento.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUBIGEODPTNACIMIENTO(String value) {
        this.ubigeodptnacimiento = value;
    }

    /**
     * Obtiene el valor de la propiedad ubigeoprovnacimiento.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUBIGEOPROVNACIMIENTO() {
        return ubigeoprovnacimiento;
    }

    /**
     * Define el valor de la propiedad ubigeoprovnacimiento.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUBIGEOPROVNACIMIENTO(String value) {
        this.ubigeoprovnacimiento = value;
    }

    /**
     * Obtiene el valor de la propiedad ubigeodistnacimiento.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getUBIGEODISTNACIMIENTO() {
        return ubigeodistnacimiento;
    }

    /**
     * Define el valor de la propiedad ubigeodistnacimiento.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setUBIGEODISTNACIMIENTO(String value) {
        this.ubigeodistnacimiento = value;
    }

    /**
     * Obtiene el valor de la propiedad nombrespadre.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNOMBRESPADRE() {
        return nombrespadre;
    }

    /**
     * Define el valor de la propiedad nombrespadre.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNOMBRESPADRE(String value) {
        this.nombrespadre = value;
    }

    /**
     * Obtiene el valor de la propiedad nombresmadre.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNOMBRESMADRE() {
        return nombresmadre;
    }

    /**
     * Define el valor de la propiedad nombresmadre.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNOMBRESMADRE(String value) {
        this.nombresmadre = value;
    }

    /**
     * Obtiene el valor de la propiedad fechainscripcion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFECHAINSCRIPCION() {
        return fechainscripcion;
    }

    /**
     * Define el valor de la propiedad fechainscripcion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFECHAINSCRIPCION(String value) {
        this.fechainscripcion = value;
    }

    /**
     * Obtiene el valor de la propiedad fechaemision.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFECHAEMISION() {
        return fechaemision;
    }

    /**
     * Define el valor de la propiedad fechaemision.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFECHAEMISION(String value) {
        this.fechaemision = value;
    }

    /**
     * Obtiene el valor de la propiedad fechafallecimiento.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFECHAFALLECIMIENTO() {
        return fechafallecimiento;
    }

    /**
     * Define el valor de la propiedad fechafallecimiento.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFECHAFALLECIMIENTO(String value) {
        this.fechafallecimiento = value;
    }

    /**
     * Obtiene el valor de la propiedad constanciavotacion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCONSTANCIAVOTACION() {
        return constanciavotacion;
    }

    /**
     * Define el valor de la propiedad constanciavotacion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCONSTANCIAVOTACION(String value) {
        this.constanciavotacion = value;
    }

    /**
     * Obtiene el valor de la propiedad restriccion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getRESTRICCION() {
        return restriccion;
    }

    /**
     * Define el valor de la propiedad restriccion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setRESTRICCION(String value) {
        this.restriccion = value;
    }

    /**
     * Obtiene el valor de la propiedad prefijodireccion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPREFIJODIRECCION() {
        return prefijodireccion;
    }

    /**
     * Define el valor de la propiedad prefijodireccion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPREFIJODIRECCION(String value) {
        this.prefijodireccion = value;
    }

    /**
     * Obtiene el valor de la propiedad direccion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDIRECCION() {
        return direccion;
    }

    /**
     * Define el valor de la propiedad direccion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDIRECCION(String value) {
        this.direccion = value;
    }

    /**
     * Obtiene el valor de la propiedad numerodireccion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNUMERODIRECCION() {
        return numerodireccion;
    }

    /**
     * Define el valor de la propiedad numerodireccion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNUMERODIRECCION(String value) {
        this.numerodireccion = value;
    }

    /**
     * Obtiene el valor de la propiedad blockchalet.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBLOCKCHALET() {
        return blockchalet;
    }

    /**
     * Define el valor de la propiedad blockchalet.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBLOCKCHALET(String value) {
        this.blockchalet = value;
    }

    /**
     * Obtiene el valor de la propiedad interior.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getINTERIOR() {
        return interior;
    }

    /**
     * Define el valor de la propiedad interior.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setINTERIOR(String value) {
        this.interior = value;
    }

    /**
     * Obtiene el valor de la propiedad urbanizacion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getURBANIZACION() {
        return urbanizacion;
    }

    /**
     * Define el valor de la propiedad urbanizacion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setURBANIZACION(String value) {
        this.urbanizacion = value;
    }

    /**
     * Obtiene el valor de la propiedad etapa.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getETAPA() {
        return etapa;
    }

    /**
     * Define el valor de la propiedad etapa.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setETAPA(String value) {
        this.etapa = value;
    }

    /**
     * Obtiene el valor de la propiedad manzana.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMANZANA() {
        return manzana;
    }

    /**
     * Define el valor de la propiedad manzana.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMANZANA(String value) {
        this.manzana = value;
    }

    /**
     * Obtiene el valor de la propiedad lote.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLOTE() {
        return lote;
    }

    /**
     * Define el valor de la propiedad lote.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLOTE(String value) {
        this.lote = value;
    }

    /**
     * Obtiene el valor de la propiedad prefijoblockchalet.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPREFIJOBLOCKCHALET() {
        return prefijoblockchalet;
    }

    /**
     * Define el valor de la propiedad prefijoblockchalet.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPREFIJOBLOCKCHALET(String value) {
        this.prefijoblockchalet = value;
    }

    /**
     * Obtiene el valor de la propiedad prefijodptpisointerior.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPREFIJODPTPISOINTERIOR() {
        return prefijodptpisointerior;
    }

    /**
     * Define el valor de la propiedad prefijodptpisointerior.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPREFIJODPTPISOINTERIOR(String value) {
        this.prefijodptpisointerior = value;
    }

    /**
     * Obtiene el valor de la propiedad prefijoubrcondresidencia.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPREFIJOUBRCONDRESIDENCIA() {
        return prefijoubrcondresidencia;
    }

    /**
     * Define el valor de la propiedad prefijoubrcondresidencia.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPREFIJOUBRCONDRESIDENCIA(String value) {
        this.prefijoubrcondresidencia = value;
    }

    /**
     * Obtiene el valor de la propiedad longitudfoto.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLONGITUDFOTO() {
        return longitudfoto;
    }

    /**
     * Define el valor de la propiedad longitudfoto.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLONGITUDFOTO(String value) {
        this.longitudfoto = value;
    }

    /**
     * Obtiene el valor de la propiedad longitudfirma.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLONGITUDFIRMA() {
        return longitudfirma;
    }

    /**
     * Define el valor de la propiedad longitudfirma.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLONGITUDFIRMA(String value) {
        this.longitudfirma = value;
    }

    /**
     * Obtiene el valor de la propiedad firma.
     * 
     * @return
     *     possible object is
     *     byte[]
     */
    public byte[] getFIRMA() {
        return firma;
    }

    /**
     * Define el valor de la propiedad firma.
     * 
     * @param value
     *     allowed object is
     *     byte[]
     */
    public void setFIRMA(byte[] value) {
        this.firma = value;
    }

    /**
     * Obtiene el valor de la propiedad foto.
     * 
     * @return
     *     possible object is
     *     byte[]
     */
    public byte[] getFOTO() {
        return foto;
    }

    /**
     * Define el valor de la propiedad foto.
     * 
     * @param value
     *     allowed object is
     *     byte[]
     */
    public void setFOTO(byte[] value) {
        this.foto = value;
    }

    /**
     * Obtiene el valor de la propiedad fechacreacion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFECHACREACION() {
        return fechacreacion;
    }

    /**
     * Define el valor de la propiedad fechacreacion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFECHACREACION(String value) {
        this.fechacreacion = value;
    }

    /**
     * Obtiene el valor de la propiedad tipoficharegistral.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTIPOFICHAREGISTRAL() {
        return tipoficharegistral;
    }

    /**
     * Define el valor de la propiedad tipoficharegistral.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTIPOFICHAREGISTRAL(String value) {
        this.tipoficharegistral = value;
    }

    /**
     * Obtiene el valor de la propiedad datos.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDATOS() {
        return datos;
    }

    /**
     * Define el valor de la propiedad datos.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDATOS(String value) {
        this.datos = value;
    }

    /**
     * Obtiene el valor de la propiedad imagen.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getIMAGEN() {
        return imagen;
    }

    /**
     * Define el valor de la propiedad imagen.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setIMAGEN(String value) {
        this.imagen = value;
    }

    /**
     * Obtiene el valor de la propiedad consulta.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCONSULTA() {
        return consulta;
    }

    /**
     * Define el valor de la propiedad consulta.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCONSULTA(String value) {
        this.consulta = value;
    }

    /**
     * Obtiene el valor de la propiedad fechaactualizacion.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFECHAACTUALIZACION() {
        return fechaactualizacion;
    }

    /**
     * Define el valor de la propiedad fechaactualizacion.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFECHAACTUALIZACION(String value) {
        this.fechaactualizacion = value;
    }

}
