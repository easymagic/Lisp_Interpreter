<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script type="text/javascript" src="lisp.js"></script>
</head>
<body>
  
  <textarea id="code" style="width:300px;height: 300px;"></textarea><br />
  <button id="run" type="button">Run</button>


<script type="text/javascript">
	

 //addEventListener('click',function(){console.log('clicked')},false);
 document.getElementById('run').addEventListener('click',function(){

  var code = document.getElementById('code').value;
  var rr = code.split('(').join('_e_(_e_').split(')').join('_e_)_e_').split(' ').join('_e_').split("\r").join('_e_')
  .split("\n").join('_e_');
  rr = rr.split("\"").join("_e_");
  rr = rr.split('_e_');
  
  var p = [];

  for (var i in rr){

  	if (rr[i] != ''){
      p.push(rr[i]);    
  	}

  }

  // lisp.set_tokens();
  lisp.run(p.join(','));
  document.getElementById('output').innerHTML = lisp.output();
  //lisp.output();
  //console.log(p);

 },false);

</script>
<div id="output"></div>
</body>
</html>
