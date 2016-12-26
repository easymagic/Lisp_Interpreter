
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
					parse(tree,bcb);
				});
			}else if (tokens[pointer] == ')'){
				// ++pointer; //skip this token
				//parse(tree);
				bcb();
			}else if (isNaN(tokens[pointer])){
				tree.push(tokens[pointer]);
				//++pointer; 
				parse(tree,bcb);
			}else{
				//console.log('number not expected!');
				tree.push(tokens[pointer]);
				//++pointer;
				parse(tree,bcb);
			}
		};
	
		l.eval_ = function eval_(ast,i){
			if (typeof(ast[i]) == 'object'){
			 return eval_(ast[i],0);
			}else{
				//eval from library (libs)
				if (libs[ast[i]]){
					var args = ast.slice(i+1);
					return libs[ast[i]].apply($scope,[args]);
				}else{
					if (typeof($scope[ast[i]]) != 'undefined'){
                       return $scope[ast[i]];
					}else{
						return ast[i]; //integer constant.
  	                   //console.log('NS',libs[ast[i]],ast[i]);
					}
  					
				}
			}
		};
		
		var buff = [];

		l.run = function run(code){
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
			if (this[args[1]]){
			  this[args[0]] = this[args[1]];
			}else{
			  this[args[0]] = args[1];
			} 
			//console.log(this);
			//this.eval_(args[]);
		};

		libs['block'] = function(args){
			//console.log(args);
			for (var i in args){
			  this.eval_(args[i],0);
			}
		};

		libs['print'] = function(args){
		 var r = this.eval_(args,0);
		 buff.push(r);
		 console.log(r);
		};

		libs['echo'] = function(args){
		 var r = this.eval_(args,0);
		 buff.push(r);
		 console.log(r);

		};

		libs['.eq.'] = function(args){
          return (this.eval_(args,0) == this.eval_(args,1));
		};


		libs['if'] = function(args){
          if (this.eval_(args,0)){
            this.eval_(args,1)
          }else{
          	this.eval_(args,2);
          }
		};
		

})(lisp);
