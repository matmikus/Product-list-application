<?php
  $data = $_POST['products'];
  $myfile = fopen("data.json", "w");
  if(fwrite($myfile, $data)) http_response_code(200);
  else http_response_code(500);
?>
