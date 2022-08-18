var n={
	bind:{},
	bindOld:{},
	load:()=>{}
};
(function(n) {
var nInit = true
//n-bind

var 
nbs, //element bind default input asscess value
inputs = ['text','checkbox'],
getInput = (e) =>{
	//console.log(i.indexOf(e.type))
	//if(i.indexOf(e.type)!=-1)
	if(e.type=='text')
		return e.value
	//'checkbox'
	if(e.type=='checkbox')
		return e.checked
},
setInput =(e, k)=>{
	var value = n.bind[k]

	if(e.type=='text'){
		e.value = value
		e.dataset.nOldValue = value
		//n.bindOld[k] = value
		//console.log(n.bind)
	}

	if(e.type=='checkbox'){
		n.bind[k] = getInput(e) //e.checked
		e.dataset.nOldValue = getInput(e) //e.checked
		console.log(n.bind)
		//showBind()
	}
},
assignText = (e, k)=>{
	var value = n.bind[k]
	if(e.dataset.nOldValue===undefined){
		e.value = value
		e.dataset.nOldValue = value
	}else if(e.dataset.nOldValue != getInput(e)){
		n.bind[k] = getInput(e)
		e.dataset.nOldValue = getInput(e)
		// n.bind[k] = value
		// e.dataset.nOldValue = value
		//console.log('bindText ',n.bind)
	}
	
},
assignCheckbox = (e, k)=>{
	var value = n.bind[k]
	if(e.dataset.nOldValue===undefined){
		e.checked = value
		e.dataset.nOldValue = value
		n.bind[k] = e.checked
	}else if(e.dataset.nOldValue != e.checked){
		// n.bind[k] = e.checked
		// e.dataset.nOldValue = e.checked
		if(n.bind[k]!=e.checked){
			console.log('nOldValue %s bind %s e.checked %s', e.dataset.nOldValue,n.bind[k],e.checked)
			n.bind[k] = e.checked
			
			//e.dataset.nOldValue =  n.bind[k]
			//e.checked = value

			//e.checked = n.bind[k]
		}

		//e.dataset.nOldValue = getInput(e) //value
		//n.bind[k] = getInput(e) //value

		// e.dataset.nOldValue = value
		n.bind[k] = e.checked
	}
},
//objCahe =  {},
bind = () =>{
	nbs = d.qAll('input[n-bind]')
	nbs.forEach(e=>{

		//EFFECT WITH INIT
		var k = e.getAttribute('n-bind')
		n.bind[k] = (n.bind[k])? n.bind[k]:(getInput(e))? getInput(e):''
		
		if(e.type=='text')
			assignText(e, k)
		if(e.type=='checkbox'){
			assignCheckbox(e, k)

		}
	})

	//when value change
	for(var k in n.bind)
		if(n.bind[k]!=n.bindOld[k])
		{
			nbs.forEach(e=>{
				if(inputs.indexOf(e.type)>-1 && e.getAttribute('n-bind') == k){
					console.log('bind')
					setInput(e, k)
				}
			})
			//n.bindOld[k] = n.bind[k]
		}
	//objCahe
	// var all = d.qAll('[n-bind]')
	// all.forEach(e=>{
	// 	var k = e.getAttribute('n-bind')
	// 	objCahe[k].push(e)
	// }
	 
},
showHTML = () => {
	var all = d.qAll('[n-bind]')
	for(var k in n.bind)
		if(n.bind[k]!=n.bindOld[k])
		{
			
			all.forEach(e=>{
				if(e.getAttribute('n-bind') == k && inputs.indexOf(e.type)==-1){
					console.log('showHTML %s',k)
					e.innerHTML = n.bind[k]
					n.bindOld[k] = n.bind[k]
				}
			})
			
		}
	bindRepeat()
},
bindRepeat = ()=>{
	var all = d.qAll('[n-repeat]')
	//init
	// all.forEach(e=>{
	// 	var k = e.getAttribute('n-repeat')
	// 	if(!n.bind[k]){

	// 	}
	// })
	//console.log('bindRepeat')
	//show
	for(var k in n.bind)
	if(JSON.stringify(n.bind[k]) != JSON.stringify(n.bindOld[k])){
		all.forEach(e=>{

			//var k = e.getAttribute('n-repeat')
			if(e.getAttribute('n-repeat')==k){
				//console.log('bindRepeat %s',k)
                var t = e.dataset.nTemplate
                e.innerHTML = ''
                n.bind[k].map((l,i) => {

                    var el = t;//.replace('{{id}}', l.id).replace('{{name}}', l.name)
                    for(var ii in l){
                    	el =  el.replace(new RegExp('{{'+ii+'}}','g'), l[ii])
                    }
                    el = el.replace('{{$index}}', i)
                    el = el.replace('{{$value}}', l)
                    e.innerHTML +=el

                })
                console.log('bindRepeat %s',k)
                var ccc = n.bind[k].map(e=> {return e})
                n.bindOld[k] = ccc
			}
		})
	}else{
		// n.bind[k] = []
		// n.bindOld[k] = []
	}
},
bindHTML = () => {
	var all = d.qAll('[n-bind]')
	all.forEach(e=>{
		var k = e.getAttribute('n-bind')
		if(inputs.indexOf(e.type)==-1 && e.innerHTML != n.bind[k]+''){
			console.log('bindHTML')
			n.bind[k] = e.innerHTML
		}
	})
}, 
init = () => {
	bind()
	showHTML()
	bindHTML()
}


window.addEventListener('load',()=>{
	d.autoLoadId()
	
	var all = d.qAll('input[n-bind]')
	var body = d.q('body')
	all.forEach(e=>{
		var k = e.getAttribute('n-bind')
		d.create('div',{'n-bind':k,'class':'hide'},body)
	})

	init()
	
	setInterval(()=>{
		init()
	}, 100);

	n.load();
})
})(window.n);