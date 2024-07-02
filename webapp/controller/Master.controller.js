sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"com/example/masterdetail/model/formatter",
	],
	function (Controller, MessageBox, Filter, FilterOperator, formatter) {
		"use strict";

		return Controller.extend("com.example.masterdetail.controller.Main", {
			formatter: formatter,
			onInit: function () {
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getRoute("master");
			},

			onItemPress: function (oEvent) {
				var sId = oEvent
					.getParameter("listItem")
					.getBindingContext()
					.getObject().ID;

				this.oRouter.navTo("detail", {
					itemId: sId,
				});
			},

			onCreatePress: function () {
				var oView = this.getView();
				var oDialog = oView.byId("createDialog");

				if (!oDialog) {
					oDialog = sap.ui.xmlfragment(
						oView.getId(),
						"com.example.masterdetail.view.fragments.CreateDialog",
						this
					);
					oView.addDependent(oDialog);
				}

				oDialog.open();
			},

			onCreateSave: function () {
				var oView = this.getView();
				var oModel = oView.getModel();
				var aItems = oModel.getProperty("/items");

				var sName = oView.byId("createName").getValue();
				var sDescription = oView.byId("createDescription").getValue();
				var sStatus = oView.byId("createStatus").getValue();

				var sNewId = (aItems.length + 1).toString();

				var oNewItem = {
					ID: sNewId,
					Name: sName,
					Description: sDescription,
					Status: sStatus,
				};

				aItems.push(oNewItem);
				oModel.setProperty("/items", aItems);

				oView.byId("createDialog").close();
			},

			onCreateCancel: function () {
				this.getView().byId("createDialog").close();
			},

			onDeletePress: function () {
				var oList = this.byId("itemList");
				var oSelectedItem = oList.getSelectedItem();
				if (!oSelectedItem) {
					MessageBox.error("Please select an item to delete.");
					return;
				}

				var sPath = oSelectedItem.getBindingContext().getPath();
				var oModel = this.getView().getModel();

				MessageBox.confirm("Are you sure you want to delete this item?", {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					onClose: function (sAction) {
						if (sAction === MessageBox.Action.OK) {
							oModel
								.getProperty("/items")
								.splice(parseInt(sPath.split("/")[2]), 1);
							oModel.refresh();
						}
					},
				});
			},

			onSearch: function (oEvent) {
				var sQuery = oEvent.getSource().getValue();
				var oList = this.byId("itemList");
				var oBinding = oList.getBinding("items");
				var aFilters = [];
				if (sQuery) {
					aFilters.push(new Filter("Name", FilterOperator.Contains, sQuery));
				}
				oBinding.filter(aFilters);
			},
		});
	}
);
