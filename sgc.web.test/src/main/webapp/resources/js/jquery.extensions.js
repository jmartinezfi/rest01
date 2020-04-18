jQuery.fn.lettersOnly = function() {

	$(this).keypress(function(e) {
		var regex = new RegExp(/^[a-zñA-ZÑ\s]+$/);
		var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (regex.test(str)) {
			return true;
		} else {
			return false;
		}
	});

	keyupRestrict($(this), /^[a-zñA-ZÑ\s]+$/);

}

jQuery.fn.numberLettersOnly = function() {

	$(this).keypress(function(e) {
		var regex = new RegExp(/^[a-zñA-ZÑ0-9]+$/);
		var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
		if (regex.test(str)) {
			return true;
		} else {
			return false;
		}
	});

	keyupRestrict($(this), /^[a-zñA-ZÑ0-9]+$/);
}

jQuery.fn.positive_integer = function() {
	$(this).numeric({
		decimal : false,
		negative : false
	}, function() {
		this.value = '';
		this.focus();
	});
};

function keyupRestrict(that, exp) {
	that.keyup(function(e) {
		var val = $(this).val();
		if (val && val.length > 0) {
			// de jquery.numeric (si no hay, copiar)
			var carat = $.fn.getSelectionStart(this);
			var selectionEnd = $.fn.getSelectionEnd(this);

			var length = val.length;
			for (var i = length - 1; i >= 0; i--) {
				var ch = val.charAt(i);
				if (!ch.match(exp)) {
					val = val.substring(0, i) + val.substring(i + 1);
				}
			}
		}
		this.value = val;
		// de jquery.numeric (si no hay, copiar)
		$.fn.setSelection(this, [ carat, selectionEnd ]);
	});
}

function getterPath(path) {
	var getter = new Function("return " + path + ";");
	return getter();
}

function getterObjectPath(obj, path) {
	var getter = new Function("obj", "return obj." + path + ";");
	return getter(obj);
}

function setterPath(path, value) {
	var setter = new Function("newval", "" + path + " = newval;");
	return setter(value);
}

function setterObjectPath(obj, path, value) {
	var setter = new Function("obj", "newval", "obj." + path + " = newval;");
	return setter(obj, value);
}

String.prototype.includes = function(str) {
	var returnValue = false;

	if (this.indexOf(str) !== -1) {
		returnValue = true;
	}

	return returnValue;
}