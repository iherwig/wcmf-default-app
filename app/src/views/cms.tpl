<!--
  This file was generated by ChronosGenerator wcmf-1.0.25.0001 from model.uml.
  Manual modifications should be placed inside the protected regions.
-->
<!-- PROTECTED REGION ID(app/src/views/cms.tpl/Body) ENABLED START -->
<!DOCTYPE html>
<html lang="{$uiLanguage}">
  <head>
    <meta charset="utf-8">
    <title>{$appTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <base href="{$baseHref}">

    <link href="css/app.css" rel="stylesheet" media="screen">
    <link href="css/custom.css" rel="stylesheet" media="screen">

    <script>
      document.write('<style media="all">#no-js { display: none; }</style>');
    </script>
  </head>

  <body class="dbootstrap">
    {if isset($error)}
    <div id="error" class="alert alert-error">
      <strong>Error!</strong> {$error}
    </div>
    {/if}

    <script>
      var dojoConfig = {
          has: {
              "dijit": true
          },
          requestProvider: "app/js/Xhr",
          baseUrl: '',
          async: 1,
          isDebug: 0,
          packages: [
              { name: 'dojo', location: 'vendor/dojo/dojo' },
              { name: 'dijit', location: 'vendor/dojo/dijit' },
              { name: 'dojox', location: 'vendor/dojo/dojox' },
              { name: 'routed', location: 'vendor/sirprize/routed' },
              { name: 'dojomat', location: 'vendor/sirprize/dojomat' },
              { name: 'dstore', location: 'vendor/sitepen/dstore' },
              { name: 'dgrid', location: 'vendor/sitepen/dgrid' },
              { name: 'ckeditor', location: 'vendor/ckeditor/ckeditor' },
              { name: 'jquery', location: 'vendor/jquery', main: 'jquery.min' },
              { name: 'jquery-ui', location: 'vendor/jqueryui', main: 'jquery-ui.min' },
              { name: 'elfinder', location: 'vendor/studio-42/elfinder-js', main: 'js/elfinder.full' },
              { name: 'virtual-select', location: 'vendor/sa-si-dev/virtual-select', main: 'dist/virtual-select.min' },

              { name: 'app', location: '.' }
          ],
          app: {$clientConfig}
      };
      dojoConfig['locale'] = dojoConfig.app.uiLanguage;
      dojoConfig['routing-map'] = {
          pathPrefix: dojoConfig.app.pathPrefix
      };
    </script>

    <script src="vendor/dojo/dojo/dojo.js"></script>

    <script>
      require(["app/js/App"], function (App) { new App({}, 'push'); });
    </script>

    <div id="no-js" class="alert alert-error">
      <strong>Warning!</strong> Please enable JavaScript in your browser.
    </div>

    <div id="wrap">
      <div id="push"></div>
    </div>
    <div id="footer">
      <div class="container">
        <p class="pull-right muted">created with
          <a href="http://wcmf.wemove.com" target="_blank">wCMF</a></p>
        <p class="muted">{$appTitle} <small><em>{$version}</em></small></p>
      </div>
    </div>

  </body>
</html>
<!-- PROTECTED REGION END -->
