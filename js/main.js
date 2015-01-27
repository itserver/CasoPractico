var userpassword=username+":"+password;

function inicializarElementos(){
	
	/**************************************************    BUSQUEDA EN TODO SNOMED CT   ***************************************************************************************/

	$("#busquedaEnTodoSNOMED").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/snomedcore/lang/es/searchInSnomed/termToSearch/" + request.term + "/numberOfElements/110",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								value: item.term
							};
						}));
					}
				});
		}
	});


	/**************************************************    BUSQUEDA EN SNOMED CT POR CONTEXTO - SUSTANCIA   ************************************************************/
	$("#busquedaEnTodoSNOMEDConContexto").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/snomedcore/lang/es/searchInSnomed/termToSearch/" + request.term + "/numberOfElements/110?context=105590001",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								value: item.term
							};
						}));
					}
				});
		}
	});


	/**************************************************    BUSQUEDA EN TERMINOLOGÍA LOCAL   ************************************************************************************/
	$("#busquedaEnTerminologiaLocal").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/catalogs/searchItemsInCatalog/catalog/terminologia_ejemplo/termToSearch/" + request.term + "/numberOfElements/110?",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								value: item.description
							};
						}));
					}
				});
		}
	});
	

	/**************************************************    BUSQUEDA EN UN SUBCONJUNTO   *****************************************************************************************/
	$("#busquedaEnSubconjunto").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/subsets/searchItemsInSubset/subset/224/termToSearch/" + request.term + "?numberOfElements=100",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								value: item.definition
							};
						}));
					}
				});
		}
	});


	/**************************************************    BUSQUEDA DE MAPEOS   ***************************************************************************************************/
	$("#busquedaDeMapeos").autocomplete({
		source: function(request, response) {
			$.ajax({
					url: "http://www.itserver.es/ITServer/rest/snomedcore/lang/es/searchInSnomed/termToSearch/" + request.term + "/numberOfElements/110",
					dataType: "json",
					beforeSend: function(req) {
						req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
					},
					data: {},
					success: function( data ) {
						response( $.map( data, function( item ) {
							return {
								conceptid: item.conceptid,
								value: item.term
							};
						}));
					}
					
					
				});
		},
		select: function( event, ui ) {
			var conceptid = ui.item.conceptid;
			
			fillMappingInformation(conceptid); 						
			
			$("#busquedaDeMapeos").val(ui.item.value);
			$("#busquedaDeMapeos").attr("value", ui.item.value);
			$("#busquedaDeMapeos").html(ui.item.value);
			
			return false;
		},
	});

	function fillMappingInformation(conceptIdToMap){

		$.ajax({
			url: "http://www.itserver.es/ITServer/rest/mapset/lang/es/getTerminologyMapping/sourceTerminologyName/SNOMED CT?targetTerminologies=ICD-9-CM|ICD-10&codes=" + conceptIdToMap,
			dataType: "json",
			beforeSend: function(req) {
				req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
			},
			success: function( data) {
				setMappingInfo(data, conceptIdToMap);
				return false;
			}

		});

	}

	function setMappingInfo(data, conceptIdToMap){
		
		if(data.length == 0){
			alert("No se encontró ningún mapeo para el término SNOMED CT seleccionado");
		}else{

			var cie9mappings = "";
			var cie10mappings = "";

			for (var i=0;i<data.length;i++){
				var ciemap=data[i];
				if(ciemap.targetTerminologyName == "CIE-9-MC"){
					cie9mappings = cie9mappings + ciemap.mapsetTargetTerminologyItem.codTerminologyItem + "; " ;
				}else{
					cie10mappings = cie10mappings + ciemap.mapsetTargetTerminologyItem.codTerminologyItem + "; ";
				}
			}

			cie9mappings = cie9mappings.substring(0, cie9mappings.length - 2);
			cie10mappings = cie10mappings.substring(0, cie10mappings.length - 2);

			$("#cie9map").attr("value", cie9mappings);
			$("#cie10map").attr("value", cie10mappings);

		}
	}
	
		/**************************************************    BUSQUEDA EN TERMINOLOGÍA LOCAL CON CONTEXTO  ************************************************************************/

	$.widget( "custom.catcomplete", $.ui.autocomplete, {
	    _create: function() {
	      this._super();
	      this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
	    },
	    _renderMenu: function( ul, items ) {
	      var that = this,
	        currentCategory = "";
	      $.each( items, function( index, item ) {
	        var li;
	        if ( item.category != currentCategory ) {
	          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
	          currentCategory = item.category;
	        }
	        li = that._renderItemData( ul, item );
	        if ( item.category ) {
	          li.attr( "aria-label", item.category + " : " + item.label );
	        }
	      });
	    }
	});

	$( "#busquedaAlergiasFrecuencias" ).catcomplete({
	    delay: 0,
	    source: function(request, response) {
						
			var urlToUse = buildURLToUseWithContext(request.term );
			
			
			$.ajax({
				
				url: urlToUse,
				
				type: "GET",
				async: false,
				headers: {
				    "Authorization": "Basic " + $.base64.encode(username + ":" + password)
				},
				dataType: "json",
				data: {},
				success: function( data ) {
					
					response( $.map( data, function( item ) {
						
						if(item.isFrequent){
							category = "Términos frecuentes";
						}else{
							category = "Lista de resultados";
						}
						if(item.term===undefined){
							return {
								value: item.terminologyItem.description,
								category: category
							};
						}else{
							return {
								value: item.term,
								category: category
							};
						}
					}));
				},
				error: function( jqXHR, textStatus, errorThrown ){
					var hola = errorThrown;
				}
			});
	}});
}

function buildURLToUseWithContext(termToSearch){
	
	var urlToUse;
	
	/*- componentToFilter: Campo en el que se quiere buscar
	- Lenguaje en el que se desea buscar. Opciones-"es":español o "en":inglés
	- textOrCodeToSearch: texto o código a buscar
	- terminologyVersion: versión de la termiología. Valor por defecto: "last"
	- age: Edad del paciente. Valores posibles("[0,1]", "[2,10]", "[11,20]", "[21,70]","[71,120]"). Valor por defecto:"unknown"
	- gender: Sexo del paciente. Valores posibles ("male","female"). Valor por defecto:"unknown"
	- pregnancy: Embarazo presente en el paciente. Valores posibles ("true","false"). Valor por defecto:"unknown"
	- antecedent: Buscando en antecedentes. Posibles valores ("true","false"). Valor por defecto:"unknown"
	- section: Sección del documento. Valor por defecto:"unknown"
	- specialty: Especialidad del documento. Valor por defecto:"unknown"
	- organization: Organización que ha realizado la búsqueda. Valor por defecto:"unknown"
	- externalUserName: Nombre del usuario que está guardando la información. Valor por defecto:"unknown"
	- externalUserEmail: mail del usuario que está guardando la información. Valor por defecto:"unknown"
	- selectedCode: Codigo seleccionado para guardar. Valor por defecto:"unknown"
	*/
	var catalogShortName = "redmiva";
	var language = "es";
	var componentToFilter = "description";
	var terminologyVersion = "last";
	var age = "unknown";
	var gender = "unknown";
	var pregnancy = "unknown";
	var antecedent = "unknown";
	var section = "unknown";
	var specialty = "unknown";
	var user = "unknown";
	var selectedCode = "unknown";
	var selectedDescription = $("#busquedaAlergiasFrecuenciasForSave").val();
	var organization = "Sanitas";
	
	var variables = "numberOfElementsFrequent=5&" + 
					"language=" + language + "&" +
					"age=" + age + "&" +
					"gender=" + gender + "&" +
					"pregnancy=" + pregnancy + "&" +
					"antecedent=" + antecedent + "&" +
					"section=" + section + "&" +
					"specialty=" + specialty + "&" +
					"externalUserName=" + user + "&" +
					"selectedDescription=" + selectedDescription + "&" +
					"organization=" + organization;
					
	
	urlToUse = "http://www.itserver.es/ITServer/rest/historicalSearchingData/searchWithContext/catalogShortName/redmiva/termToSearch/" + termToSearch + "/numberOfElements/50?" + variables;
		
	return urlToUse
}

function validateDiagnose() {
	var catalogShortName = "redmiva";
	var language = "es";
	var componentToFilter = "description";
	var terminologyVersion = "last";
	var age = "unknown";
	var gender = "unknown";
	var pregnancy = "unknown";
	var antecedent = "unknown";
	var section = "unknown";
	var specialty = "unknown";
	var user = "unknown";
	var selectedCode = "unknown";
	var selectedDescription = $("#busquedaAlergiasFrecuencias").val();
	var organization = "Sanitas";
	
	/*
	- NumberOfElementsFrequent: Maximo número de terminos frecuentes para mostrar. Valor por defecto:5
	- IncludeAllWords: true para que el resultado contenga todas las palabras buscadas o false para que no sea necesario que las contenga(fuzzy search).Valor por defecto:true
	- ColumnForSearch: columna en la que el servicio va a buscar el termToSearch. Por defecto, la column en la que se va a buscar es "description"
	- Lenguaje en el que se desea buscar. Opciones-"es":español o "en":inglés
	- age: Edad del paciente. Valores posibles("[0,1]", "[2,10]", "[11,20]", "[21,70]","[71,120]"). Valor por defecto:"unknown"
	- gender: Sexo del paciente. Valores posibles ("male","female"). Valor por defecto:"unknown"
	- pregnancy: Embarazo presente en el paciente. Valores posibles ("true","false"). Valor por defecto:"unknown"
	- antecedent: Buscando en antecedentes. Posibles valores ("true","false"). Valor por defecto:"unknown"
	- section: Sección del documento. Valor por defecto:"unknown"
	- specialty: Especialidad del documento. Valor por defecto:"unknown"
	- organization: Organización que ha realizado la búsqueda. Valor por defecto:"unknown"
	- externalUserName: Nombre del usuario que está guardando la información. Valor por defecto:"unknown"
	- externalUserEmail: mail del usuario que está guardando la información. Valor por defecto:"unknown"
	- Context:ConceptId de la jerarquia de segundo nivel donde se desea buscar (Ej: 404684003 (hallazgo clinico)).Valor por defecto:0 (todo SNOMED CT). Este campo se usará sólo en caso de buscar en "SNOMED CT"
	*/
	var jsonSend = {
		"catalogShortName" : catalogShortName,
		"language" : language,
		"componentToFilter" : componentToFilter,
		"terminologyVersion" : terminologyVersion,
		"age" : age,
		"gender" : gender,
		"pregnancy" : pregnancy,
		"antecedent" : antecedent,
		"section" : section,
		"specialty" : specialty,
		"organization" : organization,
		"selectedCode" : selectedCode,
		"selectedDescription" : selectedDescription,
		"externalUserName" : user,
		"externalUserEmail" : user
	};

			
	$.ajax({
		type : 'POST',
		url : 'http://www.itserver.es/ITServer/rest/historicalSearchingData/saveSearchingData',
		dataType : "json",
		contentType : "application/json",
		async: true,
		beforeSend : function(req) {
			req.setRequestHeader('Authorization', 'Basic ' + $.base64.encode(userpassword));
		},
		data : JSON.stringify(jsonSend),
		success : function(data) {
			alert("Datos historicos enviados correctamente");
		},
		error: function( jqXHR, textStatus, errorThrown ){
			alert("Se ha producido algún error en la llamada al servicio REST.\n"
					//+ "jqXHR: " + jqXHR + "\n"
					+ "textStatus: " + textStatus + "\n"
					+ "errorThrown: " + errorThrown);
		}

	});


}
