<?php
  /**
  /* Define WCMF_BASE based on the dist version in order to test it
   */
  $buildConfig = parse_ini_file('../build/build.properties');
  $distDir = $buildConfig['dist.dir'];
  
  define('WCMF_BASE', realpath(dirname(__FILE__).'/'.$distDir).'/');
?>
