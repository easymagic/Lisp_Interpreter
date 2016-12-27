
var lisp = {};

(function(l){
		var pointer = -1;
		//var tree = [];
		var tokens = [];
		var libs = {};
		var $scope = {};
		
		l.set_tokens = function set_tokens(tks){
		 tokens = tks.split(',');
		};
		
		l.add_lib = function(name,cb){
		 libs[name] = cb;
		};
		
		l.reset = function reset(){
		  pointer = -1;
		};

		l.parse = function parse(tree,bcb){
			++pointer;
			if (pointer >= tokens.length){
			 return;
			}
			if (tokens[pointer] == '('){
				var sub_tree = [];
				tree.push(sub_tree);
					//++pointer; 
					parse(sub_tree,function(){
					parse(tree,bcb); //This is GOD at work.
				});
			}else if (tokens[pointer] == ')'){
				// ++pointer; //skip this token
				//parse(tree);
				bcb();
			}else{
				//console.log('number not expected!');
				tree.push(tokens[pointer]);
				//++pointer;
				parse(tree,bcb);
			}
		};
	
		l.eval_ = function eval_(ast,i){
			
			var $s = this; //$scope;
			console.log(this);

			if (typeof(ast[i]) == 'object'){
			 return eval_.apply($s,[ast[i],0]);
			}else{
				//eval from library (libs)
				if (libs[ast[i]]){
					var args = ast.slice(i+1);

					if (typeof(libs[ast[i]]) == 'object'){ //user defined or synthesized function
                      

                      //console.log(libs[ast[i]]);
                      var arg_names = libs[ast[i]].arguments;
                      var $scp_ = {};
                      for (var ii in arg_names){
                      	if (args[ii]){
                         $scp_[arg_names[ii]] = args[ii];
                      	}else{
                      	 $scp_[arg_names[ii]] = null;	
                      	}
                      }

                      //console.log($scp_);
                      //$scp_.eval_ = eval_;
                      for (var ky in l){
                       $scp_[ky] = l[ky];
                      }

                      //console.log($scp_,this);


                      return eval_.apply($scp_,[libs[ast[i]].body,0]);

					}else{
					  
					  return libs[ast[i]].apply($s,[args]); //call native function

					}
				}else{
					if (typeof($s[ast[i]]) != 'undefined'){
                       return $s[ast[i]];
					}else{
						return ast[i]; //integer constant.
  	                   //console.log('NS',libs[ast[i]],ast[i]);
					}
  					
				}
			}
		};
		
		var buff = [];

		l.run = function run(code){
			console.log(this);
			buff = [];
			this.reset();
			this.set_tokens(code);
			var r = [];
			this.parse(r);
			return this.eval_(r,0);
		};

		

		l.output = function(){
          return ':>' + buff.join("<br />:>");
		};

		$scope.eval_ = l.eval_;
		
		libs['+'] = function(args){
			var sum = 0;
			for (var i in args){
				if (typeof(args[i]) == 'object'){
				 sum+=this.eval_(args[i],0);
				}else{
				 sum+=(this.eval_(args,i) * 1);
				}
			}
		 return sum;
		};


		libs['-'] = function(args){
			

			var sum = 1;
			if (!isNaN(args[0])){
			 sum = +args[0] + (+args[0]); 
			}

			console.log(args,sum);
			for (var i in args){
				if (typeof(args[i]) == 'object'){
				 sum-=this.eval_(args[i],0);
				}else{
				//console.log(this[args[i]]);
				 sum-=(this.eval_(args,i) * 1);
				}
			}
		 return sum;
		};

		
		libs['*'] = function(args){
			var sum = 1;
			//console.log(args);
			for (var i in args){
				if (typeof(args[i]) == 'object'){
				 sum*=this.eval_(args[i],0);
				}else{
                 sum*=(this.eval_(args,i) * 1);					
				}
			}
		 return sum;
		};
		
		libs['/'] = function(args){

			var sum = 1;
			if (!isNaN(args[0])){
			 sum = args[0] * 1 * args[0]; 
			}
			//console.log(sum,args);
			for (var i in args){
				if (typeof(args[i]) == 'object'){
				 sum = sum / this.eval_(args[i],0) * 1;
				}else{
                 sum = sum / (this.eval_(args,i) * 1);					
				}
			}
		 
		 return sum;

		};
		
		libs['var'] = function(args){
			for (var i in args){
				if (typeof(args[i]) != 'object'){
				 this[args[i]] = null;
				}
			}
		}
		
		libs['int'] = function(args){
			for (var i in args){
				if (typeof(args[i]) != 'object'){
				 this[args[i]] = 0;
				}
			}
		};

		libs['char'] = function(args){
			for (var i in args){
				if (typeof(args[i]) != 'object'){
				this[args[i]] = '';
				}
			}
		};
		
		libs[':='] = function(args){
			this[args[0]] = this.eval_(args,1);
			return this[args[0]];
			//console.log(this);
			//this.eval_(args[]);
		};

		libs['block'] = function(args){
			//console.log(this);
			var r = null;
			for (var i in args){
			  r = this.eval_(args[i],0);
			}
			return r;
		};

		libs['print'] = function(args){
		 var r = this.eval_(args,0);
		 buff.push(r);
		 return r;
		 //console.log(r);
		};

		libs['echo'] = function(args){
		 var r = this.eval_(args,0);
		 buff.push(r);
		 return r;
		 //console.log(r);

		};

		libs['.eq.'] = function(args){
          return (this.eval_(args,0) == this.eval_(args,1));
		};


		libs['if'] = function(args){
          if (this.eval_(args,0)){
            return this.eval_(args,1)
          }else{
          	return this.eval_(args,2);
          }
		};

		libs['defn'] = function(args){
          
          //0 -> function name
          //1 -> function arguments
          //2 -> function body

          //console.log(args,this.eval_(args,0));

          libs[args[0]] = {
          	arguments:args[1],
          	body:args[2]
          };

          //console.log(libs,this);

		};





})(lisp);
