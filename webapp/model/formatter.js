sap.ui.define([], function () {
	"use strict";

	return {
		status: function (sStatus) {
			if (sStatus === "Available") {
				return "Success";
			} else if (sStatus === "Out of Stock") {
				return "Warning";
			} else if (sStatus === "Unavailable") {
				return "Error";
			}
			return "None";
		},
	};
});
