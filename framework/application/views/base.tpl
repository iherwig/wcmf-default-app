{configvalue section="cms" key="libDir" varname="libDir"}
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="de" xml:lang="de" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>{$applicationTitle}</title>
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />

  <meta http-equiv="pragma" content="no-cache">
  <meta http-equiv="cache-control" content="no-cache">
  <meta http-equiv="expires" content="0">

  <meta name="abstract" content="" />
  <meta name="description" content="" />
  <meta name="keywords" content="" />
  <meta name="author" content="wemove digital solutions" />
  <meta name="copyright" content="wemove digital solutions GmbH" />
  <meta name="revisit-after" content="30 days" />
  <meta name="robots" content="INDEX,FOLLOW" />

  <script language="Javascript" src="script/common.js"></script>
  <link href="style/style.css" rel="stylesheet" type="text/css" />
  
  <!-- EXT JS -->
  <script type="text/javascript" src="{$libDir}3rdparty/extjs/adapter/ext/ext-base.js"></script>
  <script type="text/javascript" src="{$libDir}3rdparty/extjs/ext-all.js"></script>
  <link rel="stylesheet" type="text/css" href="{$libDir}3rdparty/extjs/resources/css/ext-all.css" />
  <link rel="stylesheet" type="text/css" href="{$libDir}3rdparty/extjs/resources/css/xtheme-gray.css" />
  <script type="text/javascript" src="js.php?controller={$_controller}&context={$_context}&file={$libDir}application/js/message.js.php&initApp=1"></script>
  <script type="text/javascript" src="js.php?controller={$_controller}&context={$_context}&file={$libDir}application/js/common.js.php"></script>
  <script type="text/javascript" src="js.php?controller={$_controller}&context={$_context}&file={$libDir}application/js/grid/dd.js.php"></script>
  <script type="text/javascript" src="js.php?controller={$_controller}&context={$_context}&file={$libDir}application/js/grid/actions.js.php"></script>
  <script type="text/javascript" src="js.php?controller={$_controller}&context={$_context}&file={$libDir}application/js/grid/grid.js.php"></script>
  <script type="text/javascript" src="js.php?controller={$_controller}&context={$_context}&file={$libDir}application/js/tree/tree.js.php"></script>
  <script type="text/javascript" src="js.php?controller={$_controller}&context={$_context}&file={$libDir}application/js/listbox.js.php"></script>
  <script type="text/javascript" src="js.php?controller={$_controller}&context={$_context}&file={$libDir}application/js/dialog.js.php"></script>
{block name=head}{/block}
</head>
<body>
<div id="page">
  <form name="{$formName|default:""}" action="main.php" enctype="multipart/form-data" method="post" target="{$target|default:""}" onsubmit="{$onsubmit|default:""}">
    <input type="hidden" name="controller" value="{$_controller}" />
    <input type="hidden" name="context" value="{$_context}" />
    <input type="hidden" name="usr_action" value="{$_action}" />
    <input type="hidden" name="sid" value="{$sid}" />
    <input type="hidden" name="oid" value="{$oid}" />
    <input type="hidden" name="poid" value="{$poid}" />
    <input type="hidden" name="newtype" value="" />
    <input type="hidden" name="newrole" value="" />
    <input type="hidden" name="deleteoids" value="" />
    
    <input type="hidden" name="old_controller" value="{$_controller}" />
    <input type="hidden" name="old_context" value="{$_context}" />
    <input type="hidden" name="old_usr_action" value="{$_action}" />
    <input type="hidden" name="old_response_format" value="{$_responseFormat}" />
    <input type="hidden" name="old_oid" value="{$oid}" />
    
    <input type="hidden" name="sortoid" value="" />
    <input type="hidden" name="prevoid" value="" />
    <input type="hidden" name="nextoid" value="" />
    
    <input type="hidden" name="targetoid" value="" />
    <input type="hidden" name="associateoids" value="" />
    <input type="hidden" name="rootType" value="{$rootType}" />

{block name=title}{/block}

    <div id="navmeta">
    <ul>
    {if $_controller != "LoginController"}
    	{if $_controller != "TreeViewController"}
    	  {if $authUser->hasRole('administrators')}
    		<li><a href="javascript:setContext('admin'); submitAction('administration');" target="_top" id="navadministration">{translate text="Administration"}</a></li>
        {/if}
    		<li><a href="javascript:submitAction('edituser');" id="navuserdata">{translate text="User data"}</a></li>
    		<li><a href="javascript:submitAction('logout');" target="_top" id="navlogout">{translate text="Logout"}</a></li>
    	{/if}
    {/if}
    </ul>
    </div>
    
    <div id="navcontent">
      <ul>
    {if $_controller != "LoginController"}
    	{if $_controller == "UserController"}
      	<li><a href="javascript:submitAction('ok');" id="navback">{translate text="Back"}</a></li>
      	<li><a href="javascript:doSave(); submitAction('save');" id="navsave">{translate text="Save"}</a></li>
    	{else}
      	<li><a href="javascript:doDisplay('{$oid}'); submitAction('');" id="navreload">{translate text="Reload"}</a></li>
    		{if $_controller != "TreeViewController"}
      	<li><a href="javascript:doSave(); submitAction('save');" id="navsave">{translate text="Save"}</a></li>
      	<li><a href="javascript:newWindowEx('DisplayController', '', 'treeview', 'treeviewWindow', 'width=800,height=700,resizable=no,scrollbars=no,locationbar=no', '&sid={$sid}')" id="navcontenttree">{translate text="Content Tree"}</a></li>
        <li><a href="javascript:newWindowEx('', '', 'browseresources', 'browseWindow', 'width=800,height=700,resizable=yes,scrollbars=yes,status=yes,locationbar=no', '&type=link&subtype=resource')">{translate text="Media Pool"}</a></li>
      		{if $authUser->hasRole('administrators')}
      	<li><a href="javascript:newWindowEx('', '', 'export', 'exportWindow', 'width=360,height=120,scrollbars=no,resizable=yes,locationbar=no', '&sid={$sid}')" id="navexport">{translate text="Export"}</a></li>
    	  	{/if}
        <li><a href="javascript:submitAction('search');">{translate text="Search"}</a> {$formUtil->getInputControl("searchterm", "text[class='small']", $searchterm, true)}</li>
        <li><a href="javascript:newWindowEx('{$_controller}', '', 'definesearch', 'definesearchWindow', 'width=600,height=600,scrollbars=yes,locationbar=no,resizable=yes', '&sid={$sid}');">{translate text="Advanced Search"}</a></li>
    	  {/if}
    	{/if}
    {/if}
      </ul>
    </div>
    
    <span class="separator"></span>

{if $errorMsg != ''}
    <div class="error">{translate text="Error"}: {$errorMsg}</div>
{/if}

{block name=content}{/block}

  </form>
  <span class="spacer"></span>
</div>
</body>
</html>