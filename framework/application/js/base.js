dojo.provide("app.base");

dojo.ready(function() {
  
  // dojo
  dojo.require('dojo.parser');
  dojo.require("dojo.fx");

  dojo.require("dijit.form.Form");
  dojo.require("dijit.form.Button");
  dojo.require("dijit.form.ValidationTextBox");
  dojo.require("dijit.form.CheckBox");
  dojo.require("dijit.layout.BorderContainer");
  dojo.require("dijit.layout.ContentPane");
  dojo.require("dijit.MenuBar");
  dojo.require("dijit.MenuBarItem");
  dojo.require("dijit.MenuItem");

  dojo.require("dojox.uuid.generateRandomUuid");

  // ibm
  dojo.require("com.ibm.developerworks.EasyRestService");

  // wcmf
  dojo.require("wcmf.Error")
  dojo.require("wcmf.Action");
  dojo.require("wcmf.model.meta.Model");
  dojo.require("wcmf.model.meta.Node");

  dojo.require("wcmf.persistence.Request");
  dojo.require("wcmf.persistence.DionysosService");
  dojo.require("wcmf.persistence.Store");

  dojo.require("wcmf.ui.TypeTabContainer");
  dojo.require("wcmf.ui.NodeTabContainer");
  dojo.require("wcmf.ui.Grid");
  dojo.require("wcmf.ui.GridActionCell");
  dojo.require("wcmf.ui.DetailPane");
  dojo.require("wcmf.ui.RelationTabContainer");
  dojo.require("wcmf.ui.RelationPane");
  dojo.require("wcmf.ui.ObjectSelectDialog");
  
  // create declarative widgets after code is loaded
  dojo.parser.parse();
});