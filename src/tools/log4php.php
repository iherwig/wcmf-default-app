<?php
return array(
  'rootLogger' => array(
    'level' => 'INFO',
    'appenders' => array('echo'),
  ),

  'appenders' => array(
    'echo' => array(
      'class' => 'LoggerAppenderEcho'
    )
  )
);
?>