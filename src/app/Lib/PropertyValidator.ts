import {AlertController} from "ionic-angular";

/**
 * Property Criteria
 */
export class PropCri {

	public property: string;
	public check:    "exists" | "is_true" | "is_false" = "exists";

	constructor(property: string,
	            check: "exists" | "is_true" | "is_false" = "exists") {
		this.property = property;
		this.check = check;
	}
}

export interface StringTMap<T> { [key: string]: T; }
export interface StringCriteriaMap extends StringTMap<PropCri> {}
export interface StringAnyMap extends StringTMap<any> {}
export interface StringStringMap extends StringTMap<string> {}
export interface StringBooleanMap extends StringTMap<boolean> {}

export class PropertyValidator {

	static PopupError(criteria: StringCriteriaMap, data: any, alert: AlertController) {
		let missing = PropertyValidator.Validate(criteria, data);

		if (missing !== false) {
			alert.create({
				title: "Missing values in form!",
				subTitle: missing.join("<br>") + "<br><br>Are required values!",
				buttons: ['Ok']
			}).present();

			return true;
		}

		return false;
	}

	static Validate(criteria: StringCriteriaMap, data: any) {
		var checks = {};

		for (let key in criteria) {
			let chk = criteria[key];

			switch(chk.check) {
				case "exists":
					checks[key] = chk.property in data;
					break;
				case "is_true":
					checks[key] = chk.property in data ? (data[chk.property] === true) : false;
					break;
				case "is_false":
					checks[key] = chk.property in data ? (data[chk.property] === false) : false;
					break;
			}
		}

		// Optional check: if the user is not interested
		// uncomment if you want the specify to be required
		//      if (checks.intrested && !formValues['intrested'])
		//         checks['specify'] = "specify" in formValues;
		var missing = [];
		var missingValues = false;
		for (var key in checks) {
			if (checks.hasOwnProperty(key)) {
				var value = checks[key];

				if (!value) {
					missingValues = true;
					missing.push("- " + key);
				}
			}
		}

		if (missingValues)
			return missing;
		return false;
	}

}