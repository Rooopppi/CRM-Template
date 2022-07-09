export class Rules {
	static maxNumberOfSymbols(value, message, number = 100) {
		return (value || '').length <= number || message;
	}

	static minNumberOfSymbols(value, message, number = 4) {
		return (value || '').length >= number || message;
	}

	static validEmail(value, message) {
		return /.+@.+\..+/.test(value) || message;
	}

	static isRequiredField(value, message) {
		return !!value || message;
	}

	static isUrl(value, message) {
		//eslint-disable-next-line
		return (/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm).test(value) || message;
	}

	static isOnlyNumbers(value, message) {
		return (/^[0-9]*$/gm).test(value) || message;
	}
}
