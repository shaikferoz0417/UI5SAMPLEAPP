sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"com/example/masterdetail/model/formatter",
	],
	function (Controller, History, formatter) {
		"use strict";

		return Controller.extend("com.example.masterdetail.controller.Detail", {
			formatter: formatter,
			onInit: function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter
					.getRoute("detail")
					.attachPatternMatched(this._onObjectMatched, this);
			},

			_onObjectMatched: function (oEvent) {
				var sItemId = oEvent.getParameter("arguments").itemId;
				var oItem;
				this._sItemId = sItemId;
				var oModel = this.getOwnerComponent().getModel();
				try {
					oItem = oModel.getProperty("/items").find(function (item) {
						return item.ID === sItemId;
					});
					this.getView().setModel(
						new sap.ui.model.json.JSONModel({
							selectedItem: Object.assign({}, oItem),
						})
					);
				} catch {
					oModel.attachRequestCompleted(() => {
						oItem = oModel.getProperty("/items").find(function (item) {
							return item.ID === sItemId;
						});
						this.getView().setModel(
							new sap.ui.model.json.JSONModel({
								selectedItem: Object.assign({}, oItem),
							})
						);
					});
				}
			},

			onNavBack: function () {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.oRouter.navTo("master", {}, true);
				}
			},

			onSavePress: function () {
				var oModel = this.getOwnerComponent().getModel();
				var oDetailModel = this.getView().getModel();
				var oData = Object.assign(
					{},
					oDetailModel.getProperty("/selectedItem")
				);

				var aItems = oModel.getProperty("/items");
				var iIndex = aItems.findIndex(function (item) {
					return item.ID === oData.ID;
				});

				if (iIndex >= 0) {
					aItems[iIndex] = oData;
					oModel.refresh();
				}
			},

			onDiscardPress: function () {
				var oModel = this.getOwnerComponent().getModel();
				var oItem = oModel.getProperty("/items").find((item) => {
					return item.ID === this._sItemId;
				});

				this.getView().setModel(
					new sap.ui.model.json.JSONModel({
						selectedItem: Object.assign({}, oItem),
					})
				);
			},
		});
	}
);
