<?php
return array(
  'rootLogger' => array(
    'level' => 'INFO',
    'appenders' => array('dailyFile'),
  ),

  'loggers' => array(
    'wcmf\lib\config\impl\InifileConfiguration' => array('level' => 'INFO'),
    'wcmf\lib\model\mapper\RDBMapper' => array('level' => 'ERROR'),
    'wcmf\lib\presentation\Controller' => array('level' => 'ERROR'),
    'wcmf\lib\presentation\Request' => array('level' => 'DEBUG'),
    'wcmf\lib\presentation\impl\DefaultActionMapper' => array('level' => 'ERROR'),
    'wcmf\lib\presentation\Application' => array('level' => 'INFO'),
    'wcmf\lib\security\impl\AbstractPermissionManager' => array('level' => 'ERROR'),
    'wcmf\lib\service\SoapServer' => array('level' => 'DEBUG'),
    'wcmf\application\controller\LoggingController' => array('level' => 'INFO'),
  ),

  'appenders' => array(
    'dailyFile' => array(
      'class' => 'LoggerAppenderDailyFile',
      'layout' => array(
        'class' => 'LoggerLayoutPattern',
        'params' => array(
          'conversionPattern' => '%d %-5p: %c:%L: %m%n'
        )
      ),
      'params' => array(
        'file' => WCMF_BASE.'app/log/%s.log',
        'datePattern' => 'Y-m-d'
      )
    ),
    'echo' => array(
      'class' => 'LoggerAppenderEcho',
      'params' => array(
        'threshold' => 'FATAL'
      )
    )
  )
);
?>