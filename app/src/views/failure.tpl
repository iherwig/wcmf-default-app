<!--
  This file was generated by ChronosGenerator wcmf-1.0.6.0001 from model.uml.
  Manual modifications should be placed inside the protected regions.
-->
<!-- PROTECTED REGION ID(app/src/views/failure.tpl/Body) ENABLED START -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Error</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <link href="css/app.css" rel="stylesheet" media="screen">
  </head>

  <body class="dbootstrap">
    {if isset($errorMessage)}
    <div id="error" class="alert alert-error">
      <strong>Error!</strong> {$errorMessage}
    </div>
    {/if}

    <div id="wrap">
      <div id="push"></div>
    </div>
    <div id="footer">
      <div class="container">
        <p class="pull-right muted">created with
          <a href="http://wcmf.wemove.com" target="_blank">wCMF</a></p>
        <p class="muted">&copy; 2015</p>
      </div>
    </div>

  </body>
</html>
<!-- PROTECTED REGION END -->
